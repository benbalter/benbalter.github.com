/**
 * Strip MDX-only syntax from a raw post body.
 *
 * MDX bodies may contain constructs that are meaningful only to the MDX
 * compiler or the site's remark plugins:
 *
 *   1. ESM `import` / `export` statements (e.g. `import BookCta from '...'`)
 *   2. JSX component tags (Capitalized, e.g. `<BookCta variant="featured" />`),
 *      on a line of their own or inline (`<InBook />` after a list item)
 *   3. `:quote[text]{#id}` shareable-quote directives, unwrapped to their text
 *
 * When an `.mdx` body is fed to a plain Markdown processor (email broadcasts,
 * the RSS feed) or emitted verbatim (the per-post `.md` agent siblings, the
 * standard.site AT Protocol records), these constructs leak through as literal
 * text — an ESM import once shipped as the first line of a post email.
 *
 * This strips both so the body degrades to clean Markdown. Fenced code blocks
 * are preserved verbatim, so a post that *shows* an import or a JSX tag as an
 * example keeps its sample intact.
 *
 * It is a lightweight, line-oriented transform — not a full MDX parse — because
 * the consumers that need it deliberately avoid the MDX compiler (email-safe
 * output, plain-text agent representations).
 *
 * @param body - Raw Markdown/MDX body (front matter already removed)
 * @returns The body with MDX-only syntax removed
 */
/** Apply `fn` to the parts of a line outside `inline code` spans. */
function outsideCodeSpans(line: string, fn: (text: string) => string): string {
  return line
    .split(/(`+[^`]*`+)/)
    .map((part, i) => (i % 2 === 1 ? part : fn(part)))
    .join('');
}

export function stripMdxSyntax(body: string): string {
  if (!body || typeof body !== 'string') return body ?? '';

  const lines = body.split('\n');
  const out: string[] = [];
  let fence: string | null = null; // the opening fence while inside a fenced block
  let inEsm = false; // inside a multi-line import/export statement

  // An ESM statement opener: `import ...` or `export default|const|...`.
  // `import` must be followed by a specifier, `{`, `*`, or a binding plus
  // `from`/`,`, so a prose line that happens to start with "import" survives.
  const isEsmStart = (l: string) =>
    /^import\s+(?:['"{*]|[\w$]+\s*(?:,|from\b))/.test(l) ||
    /^export\s+(?:default|const|let|var|function|class|async|\*|\{)/.test(l);
  // An ESM statement terminates on a trailing `;` or a `from '…'` specifier.
  const isEsmEnd = (l: string) =>
    /;\s*$/.test(l) || /\bfrom\s+['"][^'"]+['"]\s*;?\s*$/.test(l);
  // A JSX component tag: opening/closing/self-closing, Capitalized name only,
  // so it never matches lowercase HTML elements (<a>, <figure>, <img>).
  const jsxTag = /<\/?[A-Z][A-Za-z0-9.]*(?:\s[^>]*?)?\/?>/g;

  for (const line of lines) {
    const trimmed = line.trimStart();

    // Toggle fenced-code state; never touch a fence's contents. Per CommonMark,
    // a fence closes only on the same character, at least as long as the
    // opener, with no info string, so a ```` block can show a ``` sample.
    const marker = trimmed.match(/^(`{3,}|~{3,})(.*)$/);
    if (marker) {
      const [, run, rest] = marker;
      if (fence === null) fence = run;
      else if (run[0] === fence[0] && run.length >= fence.length && !rest.trim()) fence = null;
      out.push(line);
      continue;
    }
    if (fence !== null) {
      out.push(line);
      continue;
    }

    // Drop the continuation lines of a multi-line import/export.
    if (inEsm) {
      if (isEsmEnd(trimmed)) inEsm = false;
      continue;
    }

    // Drop ESM statements; keep consuming if the statement spans lines.
    if (isEsmStart(trimmed)) {
      if (!isEsmEnd(trimmed)) inEsm = true;
      continue;
    }

    // A standalone <YouTube id="…" /> embed becomes a plain link, so text
    // consumers (feed, email, .md) still point readers at the video instead of
    // silently dropping it.
    const youtube = trimmed.match(/^<YouTube\b[^>]*?\bid="([^"]+)"[^>]*?\/>\s*$/);
    if (youtube) {
      const title = trimmed.match(/\btitle="([^"]+)"/)?.[1];
      const url = `https://www.youtube.com/watch?v=${youtube[1]}`;
      out.push(title ? `[Watch "${title}" on YouTube](${url})` : `[Watch on YouTube](${url})`);
      continue;
    }

    // Drop a line that is nothing but JSX component tag(s).
    if (trimmed !== '' && trimmed.replace(jsxTag, '').trim() === '') {
      continue;
    }

    out.push(outsideCodeSpans(line, (text) =>
      text
        // :quote[text]{#id} shareable pull-quotes read as their plain text.
        .replace(/:quote\[([^\]]*)\](?:\{[^}]*\})?/g, '$1')
        // Inline self-closing components (<InBook />) in a sentence or list item.
        .replace(/\s*<[A-Z][A-Za-z0-9.]*(?:\s[^>]*?)?\/>/g, ''),
    ));
  }

  // Trim blank lines left where a leading statement was removed.
  return out.join('\n').replace(/^\n+/, '');
}
