/**
 * Turn remark container directives into plain Markdown blockquotes.
 *
 * Posts use container directives for callouts and objections:
 *
 *   :::info[Edit — Feb 2014]
 *   Some text.
 *   :::
 *
 * The site renders those through remark-directive, but the raw-source `.md`
 * siblings served to agents would otherwise ship the `:::` fences verbatim,
 * which no other Markdown reader understands. This rewrites each block as
 *
 *   > **Edit — Feb 2014:** Some text.
 *
 * falling back to the directive name ("Info", "Note") when there's no label.
 * Fenced code blocks are left untouched so code samples that show `:::`
 * survive. Posts only use flat (non-nested) three-colon blocks.
 */

const OPEN = /^:::([a-z][\w-]*)(?:\[([^\]]*)\])?(?:\{[^}]*\})?\s*$/i;
const CLOSE = /^:::\s*$/;
const FENCE = /^(`{3,}|~{3,})/;

function defaultLabel(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/** Bold label plus a colon, unless the label already ends in punctuation. */
function lead(label: string): string {
  return /[?!.:]$/.test(label) ? `**${label}**` : `**${label}:**`;
}

export function directivesToBlockquotes(markdown: string): string {
  const out: string[] = [];
  let fence: string | null = null;
  let inDirective = false;
  let pendingLabel: string | null = null;

  for (const line of markdown.split('\n')) {
    const fenceMatch = line.trimStart().match(FENCE);
    if (fence) {
      if (fenceMatch && fenceMatch[1][0] === fence[0] && fenceMatch[1].length >= fence.length) fence = null;
      out.push(inDirective ? `> ${line}` : line);
      continue;
    }

    if (!inDirective) {
      const open = line.match(OPEN);
      if (open) {
        inDirective = true;
        pendingLabel = (open[2] ?? '').trim() || defaultLabel(open[1]);
        continue;
      }
      if (fenceMatch) fence = fenceMatch[1];
      out.push(line);
      continue;
    }

    if (CLOSE.test(line)) {
      // A directive with no body still gets its label.
      if (pendingLabel) out.push(`> **${pendingLabel}**`);
      inDirective = false;
      pendingLabel = null;
      continue;
    }

    if (fenceMatch) fence = fenceMatch[1];

    if (pendingLabel && line.trim() !== '') {
      // Inline the label into a prose line; give block-level content (code,
      // lists, headings, quotes, tables) its own line so it still parses.
      const block = fence || /^\s*([-*+]\s|\d+[.)]\s|#{1,6}\s|>|\|)/.test(line);
      out.push(block ? `> ${lead(pendingLabel)}` : `> ${lead(pendingLabel)} ${line}`);
      if (block) out.push('>', `> ${line}`);
      pendingLabel = null;
      continue;
    }
    if (pendingLabel) continue; // skip blank lines before the first content line

    out.push(line.trim() === '' ? '>' : `> ${line}`);
  }

  return out.join('\n');
}
