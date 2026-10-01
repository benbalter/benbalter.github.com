/**
 * Bookmarklets listed on /bookmarklets/.
 *
 * Each used to have its own GitHub Pages site at /<repo>/, which stopped
 * resolving when the site moved to Cloudflare; public/_redirects now points
 * those paths at this page's anchors. The built code is vendored in
 * bookmarklets.json (refresh it with script/update-bookmarklets).
 */

import code from './bookmarklets.json';

export interface Bookmarklet {
  /** Anchor on /bookmarklets/ and key in bookmarklets.json. */
  id: keyof typeof code;
  name: string;
  description: string;
  /** Public source repo. Omitted for private repos so the page never links to a 404. */
  repo?: string;
  /** Built, minified JavaScript, without the `javascript:` prefix. */
  code: string;
}

export const bookmarklets: Bookmarklet[] = [
  {
    id: 'copy-issue-link',
    name: 'Copy issue link',
    description:
      'Copies a Markdown link to the GitHub issue, pull request, or discussion you’re viewing, in the form [title](URL), ready to paste into another issue, a doc, or chat.',
    repo: 'https://github.com/benbalter/copy-issue-link-bookmarklet',
    code: code['copy-issue-link'],
  },
  {
    id: 'increment-url',
    name: 'Increment URL',
    description:
      'Goes to the next page by adding one to the number at the end of the URL. Handy for paging through issues, photos, or anything else with sequential IDs.',
    code: code['increment-url'],
  },
];

/**
 * The `href` for a bookmarklet's install link. Browsers percent-decode a
 * `javascript:` URL before running it, so encoding keeps characters like `%`
 * and `#` in the code from being misread.
 */
export function bookmarkletHref(source: string): string {
  return `javascript:${encodeURIComponent(source)}`;
}
