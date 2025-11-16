import { getAllPosts, getPostUrlParts, type Post } from './posts';
import { getSiteConfig } from './config';
import { getClips, type Clip } from './data';

/**
 * Generate RSS feed XML for blog posts
 * Replaces jekyll-feed plugin functionality
 */
export function generatePostsFeed(): string {
  const config = getSiteConfig();
  const posts = getAllPosts().slice(0, 20); // Latest 20 posts
  const buildDate = new Date().toUTCString();
  
  const items = posts.map(post => {
    const { url } = getPostUrlParts(post);
    const fullUrl = `${config.url}${url}`;
    const pubDate = new Date(post.date).toUTCString();
    
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${fullUrl}</link>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${fullUrl}</guid>
      ${post.description ? `<description>${escapeXml(post.description)}</description>` : ''}
    </item>`;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(config.title)}</title>
    <description>${escapeXml(config.description)}</description>
    <link>${config.url}</link>
    <atom:link href="${config.url}/feed.xml" rel="self" type="application/rss+xml" />
    <pubDate>${buildDate}</pubDate>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <language>en-US</language>
${items}
  </channel>
</rss>`;
}

/**
 * Generate RSS feed XML for press clips
 * Replaces custom press-feed.xml functionality
 */
export function generatePressFeed(): string {
  const config = getSiteConfig();
  const clips = getClips();
  const buildDate = new Date().toUTCString();
  
  const items = clips.map(clip => {
    const pubDate = new Date(clip.date).toUTCString();
    
    return `    <item>
      <title>${escapeXml(clip.title)}</title>
      <link>${escapeXml(clip.url)}</link>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${escapeXml(clip.publication)}</dc:creator>
      <guid isPermaLink="false">${escapeXml(clip.url)}</guid>
    </item>`;
  }).join('\n');
  
  return `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:sy="http://purl.org/rss/1.0/modules/syndication/"
  xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
>
  <channel>
    <title xml:lang="en">${escapeXml(config.title)} - Press</title>
    <atom:link type="application/atom+xml" href="${config.url}/press/feed/" rel="self"/>
    <link>${config.url}/press</link>
    <pubDate>${buildDate}</pubDate>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <language>en-US</language>
    <description>Press clips for ${escapeXml(config.title)}</description>
${items}
  </channel>
</rss>`;
}

/**
 * Escape special XML characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
