/**
 * Legacy URL redirects from Jekyll
 * 
 * This file contains all redirects that were previously handled by jekyll-redirect-from
 * 
 * Types:
 * - redirect_from: Legacy URLs that should redirect to current pages
 * - redirect_to: Current URLs that should redirect to external sites
 */

export interface Redirect {
  source: string;
  destination: string;
  type: 'redirect_from' | 'redirect_to';
}

export const redirects: Redirect[] = [
  // Post redirects - date corrections and typo fixes
  {
    source: '/2014/12/08/types-of-pull-requests/',
    destination: '/2015/12/08/types-of-pull-requests/',
    type: 'redirect_from',
  },
  {
    source: '/2014/09/29/source-disclosed--open-source/',
    destination: '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/',
    type: 'redirect_from',
  },
  {
    source: '/2014/09/29/source-disclosed-≠-open-source/',
    destination: '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/',
    type: 'redirect_from',
  },
  {
    source: '/2014/09/29/source-disclosed-!=-open-source/',
    destination: '/2014/09/29/source-disclosed-is-not-the-same-as-open-source/',
    type: 'redirect_from',
  },
  {
    source: '/Balter-Towards-a-More-Agile-Government.pdf',
    destination: '/2011/11/29/towards-a-more-agile-government/',
    type: 'redirect_from',
  },
  {
    source: '/2011/08/29/document-management-version-control-for-wordpress/',
    destination: '/2011/08/29/wp-document-revisions-document-management-version-control-wordpress/',
    type: 'redirect_from',
  },
  {
    source: '/2016/10/31/eight-things-i-wish-i-knew-my-first-week/',
    destination: '/2016/10/31/eight-things-i-wish-i-knew-my-first-week-at-github/',
    type: 'redirect_from',
  },
  {
    source: '/2014/01/27/open-collabortion/',
    destination: '/2014/01/27/open-collaboration/',
    type: 'redirect_from',
  },
  {
    source: '/2014/09/29/your-code-deserves-better/',
    destination: '/2014/09/29/our-code-deserves-better/',
    type: 'redirect_from',
  },
  {
    source: '/2015/02/16/jekyll-collections/',
    destination: '/2015/02/20/jekyll-collections/',
    type: 'redirect_from',
  },
  {
    source: '/2020/08/31/trust-and-safety-before-someone-gets-hurt/',
    destination: '/2020/08/31/trust-and-safety-features-to-build-into-your-product-before-someone-gets-hurt/',
    type: 'redirect_from',
  },
  {
    source: '/2014/10/08/why-government-contractors-should-%3C3-open-source/',
    destination: '/2014/10/08/why-government-contractors-should-embrace-open-source/',
    type: 'redirect_from',
  },
  {
    source: '/2014/10/08/why-government-contractors-should-<3-open-source/',
    destination: '/2014/10/08/why-government-contractors-should-embrace-open-source/',
    type: 'redirect_from',
  },
  {
    source: '/2014/10/08/why-government-contractors-should-3-open-source/',
    destination: '/2014/10/08/why-government-contractors-should-embrace-open-source/',
    type: 'redirect_from',
  },
  {
    source: '/2014/11/03/rules-of-communicating-at-github/',
    destination: '/2014/11/06/rules-of-communicating-at-github/',
    type: 'redirect_from',
  },
  {
    source: '/2013/02/13/what-is-a-hacker/',
    destination: '/2013/02/04/what-is-a-hacker/',
    type: 'redirect_from',
  },
  {
    source: '/2013/02/16/what-is-a-hacker/',
    destination: '/2013/02/04/what-is-a-hacker/',
    type: 'redirect_from',
  },
  {
    source: '/2014/11/17/open-source-policy/',
    destination: '/2014/11/24/open-source-policy/',
    type: 'redirect_from',
  },
  {
    source: '/2021/03/26/n-things-a-technicalp-program-manager-does/',
    destination: '/2021/03/26/nine-things-a-technical-program-manager-does/',
    type: 'redirect_from',
  },
  {
    source: '/2023/12/07/cathedral-bazaar-management/',
    destination: '/2023/12/08/cathedral-bazaar-management/',
    type: 'redirect_from',
  },
  {
    source: '/2021/06/15/moderating-open-source-conversations-to-keep-them-productive/',
    destination: '/2021/06/15/how-to-moderate-open-source-conversations-to-keep-them-productive/',
    type: 'redirect_from',
  },
  
  // Page redirects
  {
    source: '/cv/',
    destination: '/resume/',
    type: 'redirect_from',
  },
  {
    source: '/books/',
    destination: '/other-recommended-reading/',
    type: 'redirect_from',
  },
  {
    source: '/books-for-geeks/',
    destination: '/other-recommended-reading/',
    type: 'redirect_from',
  },
  {
    source: '/recommended-reading/',
    destination: '/other-recommended-reading/',
    type: 'redirect_from',
  },

  // External redirects (redirect_to)
  {
    source: '/2023/10/04/how-to-communicate-like-a-github-engineer/',
    destination: 'https://github.blog/2023-10-04-how-to-communicate-like-a-github-engineer-our-principles-practices-and-tools/',
    type: 'redirect_to',
  },
  {
    source: '/2015/04/27/eight-lessons-learned-hacking-on-github-pages-for-six-months/',
    destination: 'https://github.com/blog/1992-eight-lessons-learned-hacking-on-github-pages-for-six-months',
    type: 'redirect_to',
  },
  {
    source: '/2012/04/23/enterprise-open-source-usage-is-up-but-challenges-remain/',
    destination: 'http://techcrunch.com/2012/04/22/enterprise-open-source-usage-is-up-but-challenges-remain/',
    type: 'redirect_to',
  },
];

/**
 * Find redirect destination for a given path
 * @param path The requested path (should include leading slash)
 * @returns The redirect destination or null if no redirect exists
 */
export function findRedirect(path: string): string | null {
  // Normalize path
  const normalizedPath = path.endsWith('/') ? path : `${path}/`;
  
  const redirect = redirects.find(r => {
    const normalizedSource = r.source.endsWith('/') ? r.source : `${r.source}/`;
    return normalizedSource === normalizedPath;
  });
  
  return redirect ? redirect.destination : null;
}

/**
 * Get all redirect sources (for generating static redirect pages)
 */
export function getRedirectSources(): string[] {
  return redirects.map(r => r.source);
}
