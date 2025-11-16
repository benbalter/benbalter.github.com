import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { readDirectory } from './content-loader';

export interface Page {
  slug: string;
  title?: string;
  description?: string;
  content: string;
  [key: string]: any;
}

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
 */
export function getPageBySlug(slug: string): Page | null {
  const pagesDirectory = path.join(process.cwd(), 'content/pages');
  const extensions = ['.md', '.html'];
  
  for (const ext of extensions) {
    const fileName = `${slug}${ext}`;
    const fullPath = path.join(pagesDirectory, fileName);
    
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
 * This ensures getAllPages() is only executed once per request during SSG
 */
export const getAllPages = cache((): Page[] => {
  const pagesDirectory = path.join(process.cwd(), 'content/pages');
  const fileNames = readDirectory(pagesDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.html'))
    .map(fileName => parsePageFile(fileName, pagesDirectory));
});

export function getAllPageSlugs(): string[] {
  const pages = getAllPages();
  return pages.map(page => page.slug).filter(slug => slug !== 'index' && slug !== '404');
}
