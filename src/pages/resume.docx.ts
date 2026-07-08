/**
 * Resume — Word (.docx) export
 *
 * Renders the same resume data shown on /resume as a downloadable Word
 * document. Pulls from the `pages` (resume) and `resume-positions` content
 * collections so the .docx never drifts from the HTML page.
 *
 * `output: 'static'` means this runs at build time and Astro writes the
 * Response body to dist-astro/resume.docx. The body is raw ZIP bytes — return
 * the Buffer from Packer.toBuffer() directly and never stringify it, or the
 * archive corrupts and Word refuses to open the file.
 */

import type { APIRoute } from 'astro';
import { getEntry, getCollection, type CollectionEntry } from 'astro:content';
import { marked, type Token, type Tokens } from 'marked';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ExternalHyperlink,
  HeadingLevel,
  TabStopType,
  BorderStyle,
} from 'docx';
import { formatResumeDate } from '../utils/post-urls';
import { siteConfig } from '../config';

// Brand accent (matches --color-primary on the HTML resume).
const ACCENT = '337AB7';
const ACCENT_DARK = '204D6F';
const HYPERLINK = '0563C1';
const MUTED = '555555';

// ---------------------------------------------------------------------------
// Markdown → docx
//
// Position bodies are markdown: `#####` subheadings plus `-` bullet lists with
// inline `[text](url)` links and the occasional bold/italic. marked nests
// inline content (list → item → text token → .tokens), so we walk it
// recursively. Any token type we don't explicitly handle falls back to its
// plain text — a missing link is acceptable, a crash is not.
// ---------------------------------------------------------------------------

interface RunStyle {
  bold?: boolean;
  italics?: boolean;
  hyperlink?: boolean;
}

/** Turn an accumulated style into the TextRun options docx expects. */
function runOpts(style: RunStyle): { bold?: boolean; italics?: boolean; color?: string; underline?: object } {
  return {
    ...(style.bold ? { bold: true } : {}),
    ...(style.italics ? { italics: true } : {}),
    ...(style.hyperlink ? { color: HYPERLINK, underline: {} } : {}),
  };
}

/** Render inline tokens to docx runs (TextRun / ExternalHyperlink). */
function renderInline(tokens: Token[], style: RunStyle = {}): (TextRun | ExternalHyperlink)[] {
  const runs: (TextRun | ExternalHyperlink)[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'text': {
        const t = token as Tokens.Text;
        if (t.tokens && t.tokens.length > 0) {
          runs.push(...renderInline(t.tokens, style));
        } else {
          runs.push(new TextRun({ text: t.text, ...runOpts(style) }));
        }
        break;
      }
      case 'strong':
        runs.push(...renderInline((token as Tokens.Strong).tokens, { ...style, bold: true }));
        break;
      case 'em':
        runs.push(...renderInline((token as Tokens.Em).tokens, { ...style, italics: true }));
        break;
      case 'codespan':
        runs.push(new TextRun({ text: (token as Tokens.Codespan).text, font: 'Consolas', ...runOpts(style) }));
        break;
      case 'link': {
        const link = token as Tokens.Link;
        runs.push(
          new ExternalHyperlink({
            link: link.href,
            children: renderInline(link.tokens, { ...style, hyperlink: true }),
          })
        );
        break;
      }
      case 'br':
        runs.push(new TextRun({ break: 1 }));
        break;
      case 'escape':
        runs.push(new TextRun({ text: (token as Tokens.Escape).text, ...runOpts(style) }));
        break;
      case 'html':
        // Strip stray HTML (e.g. markdownlint comments) — emit nothing.
        break;
      default:
        if ('text' in token && typeof token.text === 'string') {
          runs.push(new TextRun({ text: token.text, ...runOpts(style) }));
        }
    }
  }

  return runs;
}

/** Collect the inline tokens out of a list item (handles loose + tight items). */
function listItemInline(item: Tokens.ListItem): Token[] {
  const inline: Token[] = [];
  for (const token of item.tokens) {
    if (token.type === 'list') continue; // nested lists handled separately
    if ('tokens' in token && Array.isArray(token.tokens)) {
      inline.push(...token.tokens);
    } else {
      inline.push(token);
    }
  }
  return inline;
}

/** Strip HTML comments (markdownlint directives) and trailing whitespace. */
function cleanHeading(text: string): string {
  let current = text;
  let previous: string;
  do {
    previous = current;
    current = current.replace(/<!--[\s\S]*?-->/g, '');
  } while (current !== previous);
  return current.trim();
}

/** Render a position's markdown body to a flat list of docx Paragraphs. */
function renderMarkdownBody(body: string): Paragraph[] {
  const tokens = marked.lexer(body);
  const paragraphs: Paragraph[] = [];

  const walk = (toks: Token[], bulletLevel = 0) => {
    for (const token of toks) {
      switch (token.type) {
        case 'heading': {
          const text = cleanHeading((token as Tokens.Heading).text);
          if (text) {
            paragraphs.push(
              new Paragraph({
                spacing: { before: 120, after: 40 },
                children: [new TextRun({ text, bold: true, color: ACCENT_DARK, size: 21 })],
              })
            );
          }
          break;
        }
        case 'list': {
          for (const item of (token as Tokens.List).items) {
            paragraphs.push(
              new Paragraph({
                bullet: { level: bulletLevel },
                spacing: { after: 40 },
                children: renderInline(listItemInline(item)),
              })
            );
            // Nested lists, if any.
            const nested = item.tokens.find((t) => t.type === 'list');
            if (nested) walk([nested], bulletLevel + 1);
          }
          break;
        }
        case 'paragraph':
          paragraphs.push(
            new Paragraph({
              spacing: { after: 80 },
              children: renderInline((token as Tokens.Paragraph).tokens),
            })
          );
          break;
        // 'space' and anything else: ignore.
      }
    }
  };

  walk(tokens);
  return paragraphs;
}

// ---------------------------------------------------------------------------
// Document scaffold helpers
// ---------------------------------------------------------------------------

/** Uppercase section heading with an accent rule underneath (mirrors h2). */
function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: ACCENT, space: 2 } },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, color: ACCENT_DARK, size: 24, characterSpacing: 30 }),
    ],
  });
}

/** A title line with a right-aligned date badge (uses a right tab stop). */
function titleWithDate(title: string, dateText: string, opts: { titleSize?: number; titleColor?: string } = {}): Paragraph {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
    spacing: { after: 40 },
    children: [
      new TextRun({ text: title, bold: true, size: opts.titleSize ?? 22, ...(opts.titleColor ? { color: opts.titleColor } : {}) }),
      new TextRun({ text: `\t${dateText}`, italics: true, color: MUTED, size: 18 }),
    ],
  });
}

// ---------------------------------------------------------------------------
// Endpoint
// ---------------------------------------------------------------------------

export const GET: APIRoute = async () => {
  const resumePage = await getEntry('pages', 'resume');
  if (!resumePage) {
    throw new Error('Resume page data not found');
  }
  const { degrees, certifications, skills, summary } = resumePage.data;

  // Positions, newest first, grouped by employer (same logic as resume.astro).
  const sortedPositions = (await getCollection('resume-positions')).sort(
    (a: CollectionEntry<'resume-positions'>, b: CollectionEntry<'resume-positions'>) =>
      new Date(b.data.start_date).getTime() - new Date(a.data.start_date).getTime()
  );

  const employerGroups = new Map<string, CollectionEntry<'resume-positions'>[]>();
  for (const position of sortedPositions) {
    if (!employerGroups.has(position.data.employer)) {
      employerGroups.set(position.data.employer, []);
    }
    employerGroups.get(position.data.employer)!.push(position);
  }

  const children: Paragraph[] = [];

  // --- Header: name + contact strip ---------------------------------------
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: siteConfig.author, bold: true, size: 44, color: ACCENT_DARK })],
    })
  );
  children.push(
    new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 18, color: ACCENT, space: 4 } },
      spacing: { after: 160 },
      children: [
        new TextRun({ text: 'Washington, DC  ·  ', color: MUTED, size: 18 }),
        new ExternalHyperlink({ link: `mailto:${siteConfig.email}`, children: [new TextRun({ text: siteConfig.email, color: HYPERLINK, size: 18 })] }),
        new TextRun({ text: '  ·  ', color: MUTED, size: 18 }),
        new ExternalHyperlink({ link: siteConfig.url, children: [new TextRun({ text: 'ben.balter.com', color: HYPERLINK, size: 18 })] }),
        new TextRun({ text: '  ·  ', color: MUTED, size: 18 }),
        new ExternalHyperlink({ link: siteConfig.linkedinUrl, children: [new TextRun({ text: 'linkedin.com/in/benbalter', color: HYPERLINK, size: 18 })] }),
      ],
    })
  );

  // --- Summary -------------------------------------------------------------
  if (summary) {
    children.push(
      new Paragraph({
        spacing: { after: 80 },
        children: [new TextRun({ text: summary, italics: true, size: 21 })],
      })
    );
  }

  // --- Skills (areas of focus) --------------------------------------------
  // Heading is the literal "Skills" — resume parsers (Workday, Greenhouse,
  // Lever) key on that exact token to populate the skills section on import.
  // The HTML resume keeps its "Areas of Focus" label; only the .docx changes.
  if (skills && skills.length > 0) {
    children.push(sectionHeading('Skills'));
    for (const group of skills as Array<{ group: string; items: string[] }>) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [new TextRun({ text: group.group, bold: true, color: ACCENT_DARK, size: 19, allCaps: true, characterSpacing: 20 })],
        })
      );
      children.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: group.items.join('  ·  '), size: 19 })],
        })
      );
    }
  }

  // --- Experience ----------------------------------------------------------
  children.push(sectionHeading('Experience'));
  for (const [employer, positions] of employerGroups) {
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 40 },
        children: [new TextRun({ text: employer, bold: true, size: 26, color: ACCENT })],
      })
    );
    for (const position of positions) {
      const start = formatResumeDate(position.data.start_date) ?? 'Unknown';
      const end = position.data.end_date ? formatResumeDate(position.data.end_date) ?? 'Unknown' : 'Present';
      children.push(titleWithDate(position.data.title, `${start}–${end}`));
      children.push(...renderMarkdownBody(position.body ?? ''));
    }
  }

  // --- Education -----------------------------------------------------------
  if (degrees && degrees.length > 0) {
    children.push(sectionHeading('Education'));
    for (const degree of degrees as Array<{ school: string; degree: string; date: string }>) {
      children.push(titleWithDate(degree.school, formatResumeDate(degree.date) ?? '', { titleSize: 22 }));
      children.push(new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: degree.degree, size: 20 })] }));
    }
  }

  // --- Certifications ------------------------------------------------------
  if (certifications && certifications.length > 0) {
    type Cert = { authority: string; name: string; url?: string; expired?: boolean; category?: string };
    const certs = certifications as Cert[];
    const professional = certs.filter((c) => (c.category ?? 'professional') === 'professional');
    const personal = certs.filter((c) => c.category === 'personal');

    const renderCert = (cert: Cert) => {
      const nameRuns: (TextRun | ExternalHyperlink)[] = [
        cert.url
          ? new ExternalHyperlink({ link: cert.url, children: [new TextRun({ text: cert.name, color: HYPERLINK, underline: {}, size: 20 })] })
          : new TextRun({ text: cert.name, size: 20 }),
      ];
      if (cert.expired) {
        nameRuns.push(new TextRun({ text: '  (Expired)', size: 16, color: MUTED, italics: true }));
      }
      return [
        new Paragraph({
          spacing: { before: 80, after: 0 },
          children: [new TextRun({ text: cert.authority.toUpperCase(), bold: true, size: 15, color: MUTED, characterSpacing: 15 })],
        }),
        new Paragraph({ spacing: { after: 40 }, children: nameRuns }),
      ];
    };

    children.push(sectionHeading('Certifications'));
    if (professional.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [new TextRun({ text: 'Professional', bold: true, color: ACCENT_DARK, size: 19, allCaps: true, characterSpacing: 20 })],
        })
      );
      for (const cert of professional) children.push(...renderCert(cert));
    }
    if (personal.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 20 },
          children: [new TextRun({ text: 'Personal interests', bold: true, color: ACCENT_DARK, size: 19, allCaps: true, characterSpacing: 20 })],
        })
      );
      for (const cert of personal) children.push(...renderCert(cert));
    }
  }

  const doc = new Document({
    creator: siteConfig.author,
    title: 'Ben Balter — Resume',
    description: resumePage.data.description,
    styles: {
      default: {
        document: { run: { font: 'Calibri', size: 20 } },
      },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } },
        },
        children,
      },
    ],
  });

  // Buffer is a Uint8Array → valid binary BodyInit. Do NOT stringify, or the
  // ZIP bytes get UTF-8 re-encoded and Word refuses to open the file.
  const buffer = await Packer.toBuffer(doc);

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename="ben-balter-resume.docx"',
    },
  });
};
