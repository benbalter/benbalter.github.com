/**
 * Astro integration to generate redirect pages for redirect_to frontmatter
 * 
 * This integration handles posts/pages with redirect_to in their frontmatter,
 * creating HTML redirect pages that redirect to external URLs.
 * 
 * Note: redirect_from is handled by the astro-redirect-from package.
 */

import type { AstroIntegration } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, '../../dist-astro');
const POSTS_DIR = path.join(__dirname, '../../src/content/posts');
const PAGES_DIR = path.join(__dirname, '../../src/content/pages');

/**
 * Generate HTML redirect page content
 * Matches Jekyll redirect-from plugin behavior for redirect_to
 */
function generateRedirectHTML(toUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <title>Redirecting&hellip;</title>
  <link rel="canonical" href="${toUrl}">
  <script>location="${toUrl}"</script>
  <meta http-equiv="refresh" content="0; url=${toUrl}">
  <meta name="robots" content="noindex">
</head>
<body>
  <h1>Redirecting&hellip;</h1>
  <a href="${toUrl}">Click here if you are not redirected.</a>
</body>
</html>`;
}

/**
 * Normalize URL path to ensure it starts with / and ends with /
 */
function normalizeUrlPath(urlPath: string): string {
  let normalized = urlPath;
  
  // Add leading slash if missing
  if (!normalized.startsWith('/')) {
    normalized = '/' + normalized;
  }
  
  // Add trailing slash if missing
  if (!normalized.endsWith('/')) {
    normalized = normalized + '/';
  }
  
  return normalized;
}

/**
 * Extract date components from filename
 */
function extractDateFromFilename(filename: string): { year: string; month: string; day: string; postSlug: string } | null {
  const dateMatch = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|mdx)$/);
  if (dateMatch) {
    const [, year, month, day, postSlug] = dateMatch;
    return { year, month, day, postSlug };
  }
  return null;
}

/**
 * Get the canonical URL for a post based on filename
 */
function getPostUrl(filename: string): string {
  const dateInfo = extractDateFromFilename(filename);
  if (dateInfo) {
    return `/${dateInfo.year}/${dateInfo.month}/${dateInfo.day}/${dateInfo.postSlug}/`;
  }
  // Fallback if no date match
  const slug = filename.replace(/\.(md|mdx)$/, '');
  return `/posts/${slug}/`;
}

/**
 * Write redirect HTML file to disk
 */
async function writeRedirectFile(fromPath: string, html: string): Promise<void> {
  // Ensure fromPath starts with / and ends with /
  const normalizedPath = normalizeUrlPath(fromPath);
  
  // Convert URL path to file system path
  const filePath = path.join(OUTPUT_DIR, normalizedPath, 'index.html');
  
  // Create directory structure
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  
  // Write file
  await fs.writeFile(filePath, html, 'utf-8');
  
  console.log(`  ✓ Created redirect_to: ${normalizedPath} -> ${html.match(/url=([^"]+)/)?.[1]}`);
}

/**
 * Process files and collect redirect_to mappings
 */
async function collectRedirectTo(dirPath: string, isPost: boolean): Promise<Array<{ from: string; to: string }>> {
  const redirects: Array<{ from: string; to: string }> = [];
  
  try {
    const files = await fs.readdir(dirPath);
    const mdFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    for (const filename of mdFiles) {
      const filePath = path.join(dirPath, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      const { data } = matter(content);
      
      // Only process files with redirect_to
      if (data.redirect_to && typeof data.redirect_to === 'string') {
        const fromUrl = isPost
          ? getPostUrl(filename)
          : (data.permalink
            ? normalizeUrlPath(data.permalink)
            : normalizeUrlPath(`/${path.basename(filename, path.extname(filename))}/`));
        
        redirects.push({
          from: fromUrl,
          to: data.redirect_to,
        });
      }
    }
  } catch (error) {
    // Directory doesn't exist or is unreadable
  }
  
  return redirects;
}

/**
 * Generate redirect pages for all redirect_to frontmatter
 */
async function generateRedirectToPages(): Promise<void> {
  console.log('\n🔄 Generating redirect_to pages...\n');
  
  try {
    // Collect redirects from posts and pages
    const [postRedirects, pageRedirects] = await Promise.all([
      collectRedirectTo(POSTS_DIR, true),
      collectRedirectTo(PAGES_DIR, false),
    ]);
    
    const redirects = [...postRedirects, ...pageRedirects];
    
    if (redirects.length === 0) {
      console.log('  ℹ No redirect_to found\n');
      return;
    }
    
    console.log(`  Found ${redirects.length} redirect_to to generate\n`);
    
    // Generate redirect HTML files
    await Promise.all(
      redirects.map(redirect => {
        const html = generateRedirectHTML(redirect.to);
        return writeRedirectFile(redirect.from, html);
      })
    );
    
    console.log(`\n✅ Generated ${redirects.length} redirect_to pages\n`);
  } catch (error) {
    console.error('❌ Error generating redirect_to pages:', error);
    throw error;
  }
}

export default function redirectToIntegration(): AstroIntegration {
  return {
    name: 'astro-redirect-to',
    hooks: {
      'astro:build:done': async () => {
        // Generate redirect_to pages after the build is complete
        await generateRedirectToPages();
      },
    },
  };
}
