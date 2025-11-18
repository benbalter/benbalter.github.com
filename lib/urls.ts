import {getAllPosts, getPostUrlParts} from './posts';
import {getAllPages} from './pages';

/**
 * Get all valid URLs in the site for 404 suggestion matching
 * Includes posts, pages, and common static paths
 */
export function getAllSiteUrls(): string[] {
  const urlSet = new Set<string>();

  // Add all post URLs
  const posts = getAllPosts();
  for (const post of posts) {
    const {url} = getPostUrlParts(post);
    urlSet.add(url);
  }

  // Add all page URLs
  const pages = getAllPages();
  for (const page of pages) {
    // Skip index and 404 pages
    if (page.slug !== 'index' && page.slug !== '404') {
      urlSet.add(`/${page.slug}/`);
    }
  }

  // Add home page
  urlSet.add('/');

  return Array.from(urlSet);
}
