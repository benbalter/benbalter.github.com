import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

export interface Page {
  slug: string;
  title?: string;
  description?: string;
  content: string;
  [key: string]: any;
}

/**
 * List of page files at the root level (Jekyll-style)
 * These are the actual page files to include, filtering out non-page files
 * like README.md, CONTRIBUTING.md, TODO.md, etc.
 * 
 * When adding new pages, add the filename here.
 */
const PAGE_FILES = [
  'about.md',
  'contact.md',
  'fine-print.md',
  'talks.md',
  'press.md',
  'resume.md',
  'other-recommended-reading.md',
  'index.md',
  '404.md',
];

/**
 * Internal function to parse a page file
 * Extracted for reuse in both getAllPages and getPageBySlug
 */
function parsePageFile(fileName: string, pagesDirectory: string): Page {
  const slug = fileName.replace(/\.(md|html)$/, '');
  const fullPath = path.join(pagesDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    content,
    ...data,
    // Ensure these take precedence over any conflicting keys in ...data
    title: data.title,
    description: data.description,
  };
}

/**
 * Get a single page by slug, optimized with direct file checks
 * Reads from root-level files (Jekyll-style directory structure)
 */
export function getPageBySlug(slug: string): Page | null {
  const pagesDirectory = process.cwd();
  const extensions = ['.md', '.html'];
  
  // Security: Validate slug doesn't contain path traversal characters
  if (slug.includes('/') || slug.includes('\\') || slug.includes('..')) {
    return null;
  }
  
  for (const ext of extensions) {
    const fileName = `${slug}${ext}`;
    // Only allow known page files (allowlist for security)
    if (!PAGE_FILES.includes(fileName)) {
      continue;
    }
    const fullPath = path.join(pagesDirectory, fileName);
    
    // Security: Verify resolved path stays within pagesDirectory
    const resolvedPath = path.resolve(fullPath);
    const resolvedPageDir = path.resolve(pagesDirectory);
    if (!resolvedPath.startsWith(resolvedPageDir)) {
      continue;
    }
    
    if (fs.existsSync(fullPath)) {
      try {
        return parsePageFile(fileName, pagesDirectory);
      } catch (error) {
        console.warn(`Failed to parse page file ${fileName}:`, error);
      }
    }
  }
  
  return null;
}

/**
 * Get all pages with React cache for request-level memoization
 * This ensures getAllPages() is only executed once per request during SSG.
 * The fs.existsSync calls only happen once per build due to React's cache().
 * Reads from root-level files (Jekyll-style directory structure)
 */
export const getAllPages = cache((): Page[] => {
  const pagesDirectory = process.cwd();
  
  return PAGE_FILES
    .filter(fileName => fs.existsSync(path.join(pagesDirectory, fileName)))
    .map(fileName => parsePageFile(fileName, pagesDirectory));
});

/**
 * Page slugs to exclude from static site generation via the generic [slug] route.
 * These pages are excluded because:
 * - 'index', '404': System pages handled at root level
 * - 'press': Intentionally not replicated in Next.js (per issue requirements)
 * - 'resume', 'about', 'other-recommended-reading': Have dedicated routes with custom layouts
 * 
 * Note: 'contact' and 'talks' use the generic [slug] route since they have no custom layout
 */
const EXCLUDED_PAGE_SLUGS = [
  // System pages
  'index',
  '404',
  // Intentionally not replicated
  'press',
  // Pages with dedicated routes and custom layouts
  'resume',
  'about',
  'other-recommended-reading',
];

export function getAllPageSlugs(): string[] {
  const pages = getAllPages();
  return pages.map(page => page.slug).filter(slug => !EXCLUDED_PAGE_SLUGS.includes(slug));
}
