import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getSiteConfig, getAuthorBio } from '@/lib/config';
import { getAllPosts, type Post } from '@/lib/posts';

export const dynamic = 'force-static';

/**
 * Get pages metadata for llms.txt
 */
function getPages(): Array<{ title: string; description: string; permalink: string }> {
  const rootFiles = ['about.md', 'contact.md', 'resume.md'];
  return rootFiles
    .map((f) => {
      const fullPath = path.join(process.cwd(), f);
      if (!fs.existsSync(fullPath)) return null;
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      return {
        title: data.title || f.replace('.md', ''),
        description: data.description || '',
        permalink: data.permalink || `/${f.replace('.md', '')}/`,
      };
    })
    .filter((p): p is { title: string; description: string; permalink: string } => p !== null);
}

/**
 * Strip markdown and HTML from text
 */
function stripFormatting(text: string): string {
  let stripped = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');

  // Repeatedly remove HTML tags until no more are found
  let previous = '';
  while (stripped !== previous) {
    previous = stripped;
    stripped = stripped.replace(/<[^>]+>/g, '');
  }

  return stripped;
}

/**
 * Format post URL from slug
 */
function getPostUrl(post: Post): string {
  const match = post.slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (!match) return `/${post.slug}/`;
  const [, year, month, day, slug] = match;
  return `/${year}/${month}/${day}/${slug}/`;
}

export async function GET() {
  const config = getSiteConfig();
  const posts = getAllPosts();
  const pages = getPages();
  const bio = stripFormatting(getAuthorBio());

  const recentPosts = posts.slice(0, 10);

  // Get GitHub culture related posts
  const cultureRelatedPosts = posts
    .filter(
      (p) =>
        p.slug.includes('rules-of-communicating') ||
        p.slug.includes('seven-habits') ||
        p.slug.includes('eight-things-i-wish') ||
        p.slug.includes('why-urls') ||
        p.slug.includes('why-async') ||
        p.slug.includes('leaders-show-their-work') ||
        p.slug.includes('meetings-are-a-point-of-escalation') ||
        p.slug.includes('seven-ways-to-consistently-ship') ||
        p.slug.includes('tools-to-empower-open-collaboration'),
    )
    .slice(0, 10);

  let content = `# ${config.title}

> ${config.description}

${bio}

## About and Professional Information

`;

  // Add about, resume, contact pages
  pages.forEach((page) => {
    if (page.permalink === '/about/' || page.permalink === '/resume/' || page.permalink === '/contact/') {
      content += `* [${page.title}](${config.url}${page.permalink}): ${page.description || ''}\n`;
    }
  });

  content += `
## Recent Blog Posts

`;

  recentPosts.forEach((post) => {
    const desc = post.description
      ? post.description.slice(0, 100) + (post.description.length > 100 ? '...' : '')
      : '';
    content += `* [${post.title}](${config.url}${getPostUrl(post)}): ${desc}\n`;
  });

  content += `
## GitHub Culture

Understanding GitHub's unique culture and communication patterns:

`;

  cultureRelatedPosts.forEach((post) => {
    content += `* [${post.title}](${config.url}${getPostUrl(post)}): ${post.description || ''}\n`;
  });

  content += `

## Site Information

* [RSS Feed](${config.url}/feed.xml): Subscribe to all posts
* [Site Source Code](https://github.com/${config.repository}): This site's source code on GitHub
* [Fine Print](${config.url}/fine-print/): Legal information and site policies
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
