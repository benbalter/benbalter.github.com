import { getAllPosts, getPostUrlParts } from './posts';
import { getAllPages } from './pages';
import { getSiteConfig } from './config';

/**
 * Generate sitemap XML for all site content
 * Replaces jekyll-sitemap plugin functionality
 */
export function generateSitemap(): string {
  const config = getSiteConfig();
  const posts = getAllPosts();
  const pages = getAllPages();
  const now = new Date().toISOString();
  
  // Generate post URLs
  const postUrls = posts.map(post => {
    const { url } = getPostUrlParts(post);
    const lastmod = post.date ? new Date(post.date).toISOString() : now;
    
    return `  <url>
    <loc>${config.url}${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');
  
  // Generate page URLs
  const pageUrls = pages
    .filter(page => page.slug !== 'index' && page.slug !== '404')
    .map(page => {
      const url = page.permalink || `/${page.slug}/`;
      
      return `  <url>
    <loc>${config.url}${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    }).join('\n');
  
  // Add homepage
  const homepageUrl = `  <url>
    <loc>${config.url}/</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${homepageUrl}
${pageUrls}
${postUrls}
</urlset>`;
}

/**
 * Generate sitemap index that references the main sitemap
 * This maintains compatibility with the existing sitemap_index.xml
 */
export function generateSitemapIndex(): string {
  const config = getSiteConfig();
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${config.url}/sitemap.xml</loc>
  </sitemap>
</sitemapindex>`;
}
