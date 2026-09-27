/**
 * Rewrite root-relative Markdown link and image targets to absolute URLs.
 *
 * The per-post `.md` agent siblings emit the source body verbatim, so a link
 * like `[post](/2014/01/01/slug/)` reaches an agent with no host to resolve it
 * against. This prefixes inline targets (`](/…)`) and reference definitions
 * (`[id]: /…`) with the site origin. Protocol-relative (`//host`) targets and
 * fenced code blocks are left alone.
 *
 * @param body - Markdown body
 * @param origin - Site origin, e.g. `https://ben.balter.com` (no trailing slash)
 * @returns The body with root-relative link targets made absolute
 */
export function absolutizeMarkdownLinks(body: string, origin: string): string {
  if (!body) return body ?? '';

  let fence: string | null = null; // the opening fence while inside a code block
  return body
    .split('\n')
    .map((line) => {
      const marker = line.trimStart().match(/^(`{3,}|~{3,})/)?.[1];
      if (marker) {
        if (fence === null) fence = marker;
        else if (marker[0] === fence[0] && marker.length >= fence.length) fence = null;
        return line;
      }
      if (fence !== null) return line;

      return line
        .replace(/\]\(\/(?!\/)/g, `](${origin}/`)
        .replace(/^(\s{0,3}\[[^\]]+\]:\s*)\/(?!\/)/, `$1${origin}/`);
    })
    .join('\n');
}
