/**
 * Derive a stable, valid CSS `view-transition-name` from a post URL or path.
 *
 * Cross-document (MPA) View Transitions morph two elements that share the same
 * `view-transition-name` across a navigation. To pair a post card's title with
 * its article `<h1>`, both sides call this with the post's URL — the card with
 * its `url` prop, the article with `Astro.url.pathname` — so they resolve to the
 * identical name and the browser animates the "magic move" between them.
 *
 * The result is a valid CSS custom-ident: it always starts with the `vt-`
 * prefix (so it never begins with a digit), and every other run of non
 * alphanumeric characters collapses to a single hyphen. Names are unique per
 * post because the URL path is unique per post.
 */
export function viewTransitionName(urlOrPath: string): string {
  const path = urlOrPath
    // Drop protocol + host if a full URL was passed.
    .replace(/^[a-z]+:\/\/[^/]+/i, '')
    // Drop query string and hash.
    .replace(/[?#].*$/, '');

  const slug = path
    .toLowerCase()
    // Any run of characters that aren't a-z/0-9 becomes a single hyphen.
    .replace(/[^a-z0-9]+/g, '-')
    // Trim leading/trailing hyphens left by leading/trailing slashes.
    .replace(/^-+|-+$/g, '');

  return `vt-${slug || 'root'}`;
}
