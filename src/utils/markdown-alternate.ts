/**
 * The `.md` sibling for a page path, or null when the page has none.
 *
 * Mirrors the pages that the zone's `Accept: text/markdown` rewrite targets
 * (and that script/validate-markdown-siblings checks): the homepage, About,
 * the résumé, and posts. Used to advertise the Markdown version with
 * `<link rel="alternate" type="text/markdown">`, so agents that don't send
 * an Accept header can still find it.
 */

const FIXED: Record<string, string> = {
  '/': '/index.md',
  '/about/': '/about.md',
  '/resume/': '/resume.md',
};

const POST_PATH = /^\/\d{4}\/\d{2}\/\d{2}\/[^/]+\/$/;

export function markdownAlternatePath(pathname: string): string | null {
  if (pathname in FIXED) return FIXED[pathname];
  if (POST_PATH.test(pathname)) return `${pathname.slice(0, -1)}.md`;
  return null;
}
