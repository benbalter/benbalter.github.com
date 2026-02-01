/**
 * Generate redirect pages for Astro build
 * 
 * This script replicates Jekyll's redirect-from and redirect-to functionality.
 * It reads frontmatter from posts and pages, then generates HTML redirect pages
 * that match Jekyll's redirect behavior.
 * 
 * Redirect types:
 * 1. redirect_from: Create pages at old URLs that redirect to the current post
 * 2. redirect_to: Create a page that redirects to an external URL
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://ben.balter.com';
const OUTPUT_DIR = path.join(__dirname, '../../dist-astro');
const POSTS_DIR = path.join(__dirname, '../../src/content/posts');
const PAGES_DIR = path.join(__dirname, '../../src/content/pages');

interface RedirectMapping {
  from: string;
  to: string;
  type: 'internal' | 'external';
}

/**
 * Generate HTML redirect page content
 * Matches Jekyll redirect-from plugin behavior:
 * - Meta refresh tag
 * - JavaScript redirect
 * - Canonical link
 * - Robots noindex
 * - Fallback content for users without JavaScript
 */
function generateRedirectHTML(toUrl: string, isExternal: boolean): string {
  const fullUrl = isExternal ? toUrl : `${SITE_URL}${toUrl}`;
  
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <title>Redirecting&hellip;</title>
  <link rel="canonical" href="${fullUrl}">
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
 * Sanitize URL path to remove characters that are invalid for file systems
 * GitHub Actions artifact upload doesn't allow these characters in file paths:
 * Double quote ", Colon :, Less than <, Greater than >, Vertical bar |, 
 * Asterisk *, Question mark ?, Carriage return \r, Line feed \n
 */
function sanitizeUrlPath(urlPath: string): string {
  try {
    // URL decode first to handle %3C -> < conversions and other encoded characters
    urlPath = decodeURIComponent(urlPath);
  } catch (error) {
    // If decoding fails (malformed URI), continue with original string
  }
  
  // Replace invalid characters with hyphens in a single pass
  // Remove whitespace characters completely
  return urlPath
    .replace(/[<>":|\*?]/g, '-')
    .replace(/[\r\n]/g, '');
}

/**
 * Normalize URL path to ensure it starts with / and ends with /
 */
function normalizeUrlPath(urlPath: string): string {
  let normalized = urlPath;
  
  // First sanitize the path to remove invalid characters
  normalized = sanitizeUrlPath(normalized);
  
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
  // /2014/12/08/types-of-pull-requests/ -> dist-astro/2014/12/08/types-of-pull-requests/index.html
  const filePath = path.join(OUTPUT_DIR, normalizedPath, 'index.html');
  
  // Create directory structure
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  
  // Write file
  await fs.writeFile(filePath, html, 'utf-8');
  
  console.log(`  ✓ Created redirect: ${normalizedPath} -> ${html.match(/url=([^"]+)/)?.[1]}`);
}

/**
 * Read and parse a markdown/mdx file
 */
async function readMarkdownFile(filePath: string): Promise<{ data: any; filename: string } | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const { data } = matter(content);
    const filename = path.basename(filePath);
    return { data, filename };
  } catch (error) {
    console.warn(`  ⚠ Could not read file: ${filePath}`);
    return null;
  }
}

/**
 * Collect all redirect mappings from posts
 */
async function collectPostRedirects(): Promise<RedirectMapping[]> {
  const redirects: RedirectMapping[] = [];
  
  try {
    const files = await fs.readdir(POSTS_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    // Read all files in parallel for better performance
    const fileResults = await Promise.all(
      mdFiles.map(file => readMarkdownFile(path.join(POSTS_DIR, file)))
    );
    
    for (const result of fileResults) {
      if (!result) continue;
      
      const { data, filename } = result;
      const postUrl = getPostUrl(filename);
      
      // Handle redirect_from (old URLs that should redirect to this post)
      if (data.redirect_from) {
        const redirectFromUrls = Array.isArray(data.redirect_from)
          ? data.redirect_from
          : [data.redirect_from];
        
        for (const fromUrl of redirectFromUrls) {
          if (fromUrl && typeof fromUrl === 'string') {
            redirects.push({
              from: normalizeUrlPath(fromUrl),
              to: postUrl,
              type: 'internal',
            });
          }
        }
      }
      
      // Handle redirect_to (this post should redirect to external URL)
      if (data.redirect_to && typeof data.redirect_to === 'string') {
        redirects.push({
          from: postUrl,
          to: data.redirect_to,
          type: 'external',
        });
      }
    }
  } catch (error) {
    console.log('  ℹ No posts directory found or error reading posts');
  }
  
  return redirects;
}

/**
 * Collect all redirect mappings from pages
 */
async function collectPageRedirects(): Promise<RedirectMapping[]> {
  const redirects: RedirectMapping[] = [];
  
  try {
    const files = await fs.readdir(PAGES_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    // Read all files in parallel for better performance
    const fileResults = await Promise.all(
      mdFiles.map(file => readMarkdownFile(path.join(PAGES_DIR, file)))
    );
    
    for (const result of fileResults) {
      if (!result) continue;
      
      const { data, filename } = result;
      
      // Get page URL from permalink or filename
      const pageUrl = data.permalink
        ? normalizeUrlPath(data.permalink)
        : normalizeUrlPath(`/${path.basename(filename, path.extname(filename))}/`);
      
      // Handle redirect_from
      if (data.redirect_from) {
        const redirectFromUrls = Array.isArray(data.redirect_from)
          ? data.redirect_from
          : [data.redirect_from];
        
        for (const fromUrl of redirectFromUrls) {
          if (fromUrl && typeof fromUrl === 'string') {
            redirects.push({
              from: normalizeUrlPath(fromUrl),
              to: pageUrl,
              type: 'internal',
            });
          }
        }
      }
      
      // Handle redirect_to
      if (data.redirect_to && typeof data.redirect_to === 'string') {
        redirects.push({
          from: pageUrl,
          to: data.redirect_to,
          type: 'external',
        });
      }
    }
  } catch (error) {
    console.log('  ℹ No pages directory found or error reading pages');
  }
  
  return redirects;
}

/**
 * Main function to generate all redirects
 */
export async function generateRedirects(): Promise<void> {
  console.log('\n🔄 Generating redirect pages...\n');
  
  try {
    // Collect all redirects from posts and pages in parallel
    const [postRedirects, pageRedirects] = await Promise.all([
      collectPostRedirects(),
      collectPageRedirects(),
    ]);
    const redirects = [...postRedirects, ...pageRedirects];
    
    if (redirects.length === 0) {
      console.log('  ℹ No redirects found\n');
      return;
    }
    
    console.log(`  Found ${redirects.length} redirects to generate\n`);
    
    // Generate redirect HTML files in parallel for better performance
    await Promise.all(
      redirects.map(redirect => {
        const html = generateRedirectHTML(
          redirect.to,
          redirect.type === 'external'
        );
        return writeRedirectFile(redirect.from, html);
      })
    );
    
    console.log(`\n✅ Generated ${redirects.length} redirect pages\n`);
  } catch (error) {
    console.error('❌ Error generating redirects:', error);
    throw error;
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateRedirects().catch((error) => {
    console.error('Failed to generate redirects:', error);
    process.exit(1);
  });
}
