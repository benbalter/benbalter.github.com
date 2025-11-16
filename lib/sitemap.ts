import { SitemapStream, streamToPromise, SitemapIndexStream } from 'sitemap';
import { Readable } from 'stream';
import { getAllPosts, getPostUrlParts } from './posts';
import { getAllPages } from './pages';
import { getSiteConfig } from './config';

/**
 * Generate sitemap XML for all site content
 * Replaces jekyll-sitemap plugin functionality
 * Uses the 'sitemap' library for standards-compliant sitemap generation
 */
export async function generateSitemap(): Promise<string> {
  const config = getSiteConfig();
  const posts = getAllPosts();
  const pages = getAllPages();
  
  const links: Array<{
    url: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
  }> = [];
  
  // Add homepage
  links.push({
    url: '/',
    lastmod: new Date().toISOString(),
    changefreq: 'weekly',
    priority: 1.0,
  });
  
  // Add pages
  pages
    .filter(page => page.slug !== 'index' && page.slug !== '404')
    .forEach(page => {
      const url = page.permalink || `/${page.slug}/`;
      links.push({
        url,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.6,
      });
    });
  
  // Add posts
  posts.forEach(post => {
    const { url } = getPostUrlParts(post);
    links.push({
      url,
      lastmod: post.date ? new Date(post.date).toISOString() : new Date().toISOString(),
      changefreq: 'monthly',
      priority: 0.8,
    });
  });
  
  const stream = new SitemapStream({ hostname: config.url });
  const xml = await streamToPromise(Readable.from(links).pipe(stream));
  
  return xml.toString();
}

/**
 * Generate sitemap index that references the main sitemap
 * This maintains compatibility with the existing sitemap_index.xml
 * Uses the 'sitemap' library for standards-compliant sitemap index generation
 */
export async function generateSitemapIndex(): Promise<string> {
  const config = getSiteConfig();
  
  const sitemapIndex = new SitemapIndexStream();
  
  const links = [
    { url: `${config.url}/sitemap.xml` },
  ];
  
  const xml = await streamToPromise(Readable.from(links).pipe(sitemapIndex));
  
  return xml.toString();
}
