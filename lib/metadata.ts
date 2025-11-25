import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import stripMarkdown from 'strip-markdown';
import { getSiteConfig, getAuthorBio } from './config';
import { getAllPosts, type Post } from './posts';
import { stripHtml } from './markdown';

/**
 * Get pages metadata for llms.txt
 */
function getPages(): Array<{ title: string; description: string; permalink: string }> {
  const rootFiles = ['about.md', 'contact.md', 'resume.md'];
  return rootFiles.map(f => {
    const fullPath = path.join(process.cwd(), f);
    if (!fs.existsSync(fullPath)) return null;
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Parse front matter using gray-matter for consistency with posts
    const { data } = matter(fileContents);
    
    return {
      title: data.title || f.replace('.md', ''),
      description: data.description || '',
      permalink: data.permalink || `/${f.replace('.md', '')}/`,
    };
  }).filter((p): p is { title: string; description: string; permalink: string } => p !== null);
}

/**
 * Strip markdown and HTML from text using open source libraries
 * Uses remark + strip-markdown for markdown, and stripHtml for HTML
 * (stripHtml uses the html-to-text library under the hood)
 */
async function stripFormatting(text: string): Promise<string> {
  // First strip markdown using remark + strip-markdown
  const file = await remark()
    .use(stripMarkdown)
    .process(text);
  
  const markdownStripped = String(file);
  
  // Then strip any remaining HTML using stripHtml (which uses html-to-text)
  return stripHtml(markdownStripped).trim();
}

/**
 * Generate llms.txt content
 */
export async function generateLlmsTxt(): Promise<string> {
  const config = getSiteConfig();
  const posts = getAllPosts();
  const pages = getPages();
  const bio = await stripFormatting(getAuthorBio());
  
  const recentPosts = posts.slice(0, 10);
  
  // Get GitHub culture related posts
  const cultureRelatedPosts = posts.filter(p => 
    p.slug.includes('rules-of-communicating') ||
    p.slug.includes('seven-habits') ||
    p.slug.includes('eight-things-i-wish') ||
    p.slug.includes('why-urls') ||
    p.slug.includes('why-async') ||
    p.slug.includes('leaders-show-their-work') ||
    p.slug.includes('meetings-are-a-point-of-escalation') ||
    p.slug.includes('seven-ways-to-consistently-ship') ||
    p.slug.includes('tools-to-empower-open-collaboration')
  ).slice(0, 10);
  
  // Helper to format post URL from slug
  const getPostUrl = (post: Post): string => {
    const match = post.slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
    if (!match) return `/${post.slug}/`;
    const [, year, month, day, slug] = match;
    return `/${year}/${month}/${day}/${slug}/`;
  };
  
  let content = `# ${config.title}

> ${config.description}

${bio}

## About and Professional Information

`;

  // Add about, resume, contact pages
  pages.forEach(page => {
    if (page.permalink === '/about/' || page.permalink === '/resume/' || page.permalink === '/contact/') {
      content += `* [${page.title}](${config.url}${page.permalink}): ${page.description || ''}\n`;
    }
  });

  content += `
## Recent Blog Posts

`;

  recentPosts.forEach(post => {
    const desc = post.description ? post.description.slice(0, 100) + (post.description.length > 100 ? '...' : '') : '';
    content += `* [${post.title}](${config.url}${getPostUrl(post)}): ${desc}\n`;
  });

  content += `
## GitHub Culture

Understanding GitHub's unique culture and communication patterns:

`;

  cultureRelatedPosts.forEach(post => {
    content += `* [${post.title}](${config.url}${getPostUrl(post)}): ${post.description || ''}\n`;
  });

  content += `

## Site Information

* [RSS Feed](${config.url}/feed.xml): Subscribe to all posts
* [Site Source Code](https://github.com/${config.repository}): This site's source code on GitHub
* [Fine Print](${config.url}/fine-print/): Legal information and site policies
`;

  return content;
}

/**
 * Generate humans.txt content
 */
export function generateHumansTxt(): string {
  const config = getSiteConfig();
  const now = new Date();
  const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
  
  // Get package versions from package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  const components = Object.entries(dependencies)
    .filter(([name]) => ['next', 'react', 'react-dom', 'bootstrap', 'liquidjs', 'gray-matter'].includes(name))
    .map(([name, version]) => `${name} ${(version as string).replace('^', '')}`)
    .join(', ');

  return `/* SITE */
Last Updated: ${formattedDate}
Standards: HTML5, CSS3
Components: ${components}

/* TEAM */
Name: ${config.author?.name || 'Ben Balter'}
Site: https://github.com/${config.handle || 'benbalter'}

/* THANKS */
This site is built with Next.js and deployed on GitHub Pages.
`;
}

/**
 * Generate security.txt content
 */
export function generateSecurityTxt(): string {
  const config = getSiteConfig();
  
  // Calculate expiration date (180 days from now)
  const now = new Date();
  const expirationDate = new Date(now.getTime() + (180 * 24 * 60 * 60 * 1000));
  const isoDate = expirationDate.toISOString();
  
  const email = config.email || 'ben@balter.com';
  const repository = config.repository || 'benbalter/benbalter.github.com';
  
  return `Contact: mailto:${email}
Expires: ${isoDate}
Encryption: ${config.url}/key.asc
Canonical: ${config.url}/.well-known/security.txt
Policy: https://github.com/${repository}/security/policy
`;
}

/**
 * Generate browserconfig.xml content
 */
export function generateBrowserconfigXml(): string {
  // Use a revision string from environment variable, or fallback to build timestamp
  const buildRevision = process.env.BUILD_REVISION || new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
  
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png?v=${buildRevision}"/>
            <TileColor>#2d89ef</TileColor>
        </tile>
    </msapplication>
</browserconfig>
`;
}

/**
 * Content types for static metadata files
 */
type MetadataContentType = 'text/plain' | 'application/xml';

/**
 * Creates a static route handler for metadata files
 * 
 * This factory function generates a standardized route handler for static metadata
 * files (e.g., humans.txt, llms.txt, security.txt, browserconfig.xml). Each handler:
 * - Sets `dynamic = 'force-static'` for static site generation
 * - Returns the generated content with the appropriate Content-Type header
 * 
 * @param generator - Function that generates the file content
 * @param contentType - MIME type for the Content-Type header (default: 'text/plain')
 * @returns An object with `dynamic` export and `GET` handler for Next.js route
 * 
 * @example
 * // In app/humans.txt/route.ts:
 * import { generateHumansTxt, createMetadataRouteHandler } from '@/lib/metadata';
 * export const { dynamic, GET } = createMetadataRouteHandler(generateHumansTxt);
 */
export function createMetadataRouteHandler(
  generator: () => string,
  contentType: MetadataContentType = 'text/plain'
) {
  return {
    dynamic: 'force-static' as const,
    GET: async () => {
      const content = generator();
      return new Response(content, {
        headers: {
          'Content-Type': `${contentType}; charset=utf-8`,
        },
      });
    },
  };
}
