/**
 * Bookmarklets listed on /bookmarklets/.
 *
 * Their source is https://github.com/benbalter/bookmarklets. The built code
 * is vendored in bookmarklets.json, which records the commit it came from;
 * Renovate bumps that commit and script/update-bookmarklets refreshes the
 * code. Each bookmarklet used to have its own repo and GitHub Pages site at
 * /<repo>/; public/_redirects points those paths at this page's anchors.
 */

import data from './bookmarklets.json';

const { code } = data;

/** Source of a bookmarklet in the bookmarklets repo. */
const source = (id: keyof typeof code) => `https://github.com/benbalter/bookmarklets/tree/main/bookmarklets/${id}`;

export interface Bookmarklet {
  /** Anchor on /bookmarklets/ and key in bookmarklets.json. */
  id: keyof typeof code;
  name: string;
  description: string;
  /** Public source on GitHub. Omitted for private code so the page never links to a 404. */
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
    repo: source('copy-issue-link'),
    code: code['copy-issue-link'],
  },
  {
    id: 'increment-url',
    name: 'Increment URL',
    description:
      'Goes to the next page by adding one to the number at the end of the URL. Handy for paging through issues, photos, or anything else with sequential IDs.',
    repo: source('increment-url'),
    code: code['increment-url'],
  },
  {
    id: 'view-without-cache',
    name: 'View without cache',
    description:
      'Reloads the page with a unique dontCache query parameter, so CDNs and other caches miss and the server sends a fresh copy. Handy when checking whether a change has really shipped.',
    repo: source('view-without-cache'),
    code: code['view-without-cache'],
  },
  {
    id: 'pages-toggle',
    name: 'Pages toggle',
    description:
      'Toggles between a GitHub Pages site and the repository that publishes it: from github.com/owner/repo to owner.github.io/repo/, and back.',
    repo: source('pages-toggle'),
    code: code['pages-toggle'],
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
