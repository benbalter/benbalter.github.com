/**
 * Resume — Markdown (.md) export
 *
 * Renders the same resume data shown on /resume as a plain-Markdown document.
 * Pulls from the `pages` (resume) and `resume-positions` content collections
 * so the .md never drifts from the HTML page or the .docx export.
 *
 * `output: 'static'` means this runs at build time and Astro writes the
 * Response body to dist-astro/resume.md. Position bodies are already Markdown,
 * so we mostly stitch them together under generated section headings.
 */

import type { APIRoute } from 'astro';
import { getEntry, getCollection, type CollectionEntry } from 'astro:content';
import { formatResumeDate } from '../utils/post-urls';
import { getPublishedPosts } from '../utils/posts';
import { resolvePopularPosts } from '../utils/resume-writing';
import { siteConfig } from '../config';

/**
 * Position bodies are already valid Markdown (bullets, links, bold) — leave the
 * structure untouched so the outline stays intact. Only strip markdownlint HTML
 * directives, which would otherwise leak into the export as literal noise.
 */
function normalizePositionBody(body: string): string {
  return body.replace(/<!--[\s\S]*?-->/g, '').trim();
}

export const GET: APIRoute = async () => {
  const resumePage = await getEntry('pages', 'resume');
  if (!resumePage) {
    throw new Error('Resume page data not found');
  }
  const { degrees, certifications, skills, summary } = resumePage.data;

  // Selected writing mirrors the homepage's curated "Popular Posts" list.
  const writing = resolvePopularPosts(await getPublishedPosts());

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

  const lines: string[] = [];

  // --- Header: name + contact strip ---------------------------------------
  lines.push(`# ${siteConfig.author}`);
  lines.push('');
  lines.push(
    `Washington, DC · [${siteConfig.email}](mailto:${siteConfig.email}) · ` +
      `[ben.balter.com](${siteConfig.url}) · ` +
      `[github.com/benbalter](https://github.com/${siteConfig.githubUsername}) · ` +
      `[linkedin.com/in/benbalter](${siteConfig.linkedinUrl})`
  );
  lines.push('');

  // --- Summary -------------------------------------------------------------
  // Explicit "Summary" heading — a standard section token ATS and LLM-based
  // parsers key on to categorize the professional summary.
  if (summary) {
    lines.push('## Summary');
    lines.push('');
    lines.push(summary);
    lines.push('');
  }

  // --- Skills (areas of focus) --------------------------------------------
  // Heading is the literal "Skills" — resume parsers (Workday, Greenhouse,
  // Lever) key on that exact token. The HTML resume keeps its "Areas of Focus"
  // label; the export uses "Skills" to match the .docx.
  if (skills && skills.length > 0) {
    lines.push('## Skills');
    lines.push('');
    // One skill per bullet — several items contain internal commas
    // ("Privacy, security, and compliance"), so any inline delimiter would be
    // ambiguous to a keyword parser. One-per-line is the safest for extraction.
    for (const group of skills as Array<{ group: string; items: string[] }>) {
      lines.push(`**${group.group}**`);
      lines.push('');
      for (const item of group.items) lines.push(`- ${item}`);
      lines.push('');
    }
  }

  // --- Experience ----------------------------------------------------------
  lines.push('## Experience');
  lines.push('');
  for (const [employer, positions] of employerGroups) {
    lines.push(`### ${employer}`);
    lines.push('');
    for (const position of positions) {
      const start = formatResumeDate(position.data.start_date) ?? 'Unknown';
      const end = position.data.end_date ? formatResumeDate(position.data.end_date) ?? 'Unknown' : 'Present';
      lines.push(`#### ${position.data.title}`);
      lines.push('');
      lines.push(`_${start} – ${end}_`);
      lines.push('');
      const body = normalizePositionBody(position.body ?? '');
      if (body) {
        lines.push(body);
        lines.push('');
      }
    }
  }

  // --- Selected writing ----------------------------------------------------
  if (writing.length > 0) {
    lines.push('## Selected writing');
    lines.push('');
    for (const item of writing) {
      lines.push(`- [${item.title}](${siteConfig.url}${item.path}) (${item.year})`);
    }
    lines.push('');
  }

  // --- Education -----------------------------------------------------------
  if (degrees && degrees.length > 0) {
    lines.push('## Education');
    lines.push('');
    for (const degree of degrees as Array<{ school: string; degree: string; date: string }>) {
      lines.push(`### ${degree.school}`);
      lines.push('');
      lines.push(`${degree.degree} · _${formatResumeDate(degree.date) ?? ''}_`);
      lines.push('');
    }
  }

  // --- Certifications ------------------------------------------------------
  if (certifications && certifications.length > 0) {
    type Cert = { authority: string; name: string; url?: string; expired?: boolean; category?: string };
    const certs = certifications as Cert[];
    const professional = certs.filter((c) => (c.category ?? 'professional') === 'professional');
    const personal = certs.filter((c) => c.category === 'personal');

    const renderCert = (cert: Cert): string => {
      const name = cert.url ? `[${cert.name}](${cert.url})` : cert.name;
      const expired = cert.expired ? ' _(Expired)_' : '';
      return `- **${cert.authority}** — ${name}${expired}`;
    };

    lines.push('## Certifications');
    lines.push('');
    if (professional.length > 0) {
      lines.push('### Professional');
      lines.push('');
      for (const cert of professional) lines.push(renderCert(cert));
      lines.push('');
    }
    if (personal.length > 0) {
      lines.push('### Personal interests');
      lines.push('');
      for (const cert of personal) lines.push(renderCert(cert));
      lines.push('');
    }
  }

  const markdown = lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';

  return new Response(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="ben-balter-resume.md"',
    },
  });
};
