/**
 * Strip MDX-only syntax from a raw post body.
 *
 * MDX bodies may contain two constructs that are meaningful only to the MDX
 * compiler:
 *
 *   1. ESM `import` / `export` statements (e.g. `import BookCta from '...'`)
 *   2. JSX component tags (Capitalized, e.g. `<BookCta variant="featured" />`)
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
export function stripMdxSyntax(body: string): string {
  if (!body || typeof body !== 'string') return body ?? '';

  const lines = body.split('\n');
  const out: string[] = [];
  let fenceChar: string | null = null; // '`' or '~' while inside a fenced block
  let inEsm = false; // inside a multi-line import/export statement

  // An ESM statement opener: `import ...` or `export default|const|...`.
  const isEsmStart = (l: string) =>
    /^import\b/.test(l) ||
    /^export\s+(?:default|const|let|var|function|class|async|\*|\{)/.test(l);
  // An ESM statement terminates on a trailing `;` or a `from '…'` specifier.
  const isEsmEnd = (l: string) =>
    /;\s*$/.test(l) || /\bfrom\s+['"][^'"]+['"]\s*;?\s*$/.test(l);
  // A JSX component tag: opening/closing/self-closing, Capitalized name only,
  // so it never matches lowercase HTML elements (<a>, <figure>, <img>).
  const jsxTag = /<\/?[A-Z][A-Za-z0-9.]*(?:\s[^>]*?)?\/?>/g;

  for (const line of lines) {
    const trimmed = line.trimStart();

    // Toggle fenced-code state; never touch a fence's contents.
    const fence = trimmed.match(/^(```+|~~~+)/);
    if (fence) {
      const char = fence[1][0];
      if (fenceChar === null) fenceChar = char;
      else if (char === fenceChar) fenceChar = null;
      out.push(line);
      continue;
    }
    if (fenceChar !== null) {
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

    // Drop a line that is nothing but JSX component tag(s). Inline JSX inside a
    // paragraph is left alone (rendered consumers drop it; no post does this).
    if (trimmed !== '' && trimmed.replace(jsxTag, '').trim() === '') {
      continue;
    }

    out.push(line);
  }

  // Trim blank lines left where a leading statement was removed.
  return out.join('\n').replace(/^\n+/, '');
}
