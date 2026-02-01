/**
 * Get Slug Utility for Redirect Plugin
 * 
 * Custom slug function for astro-redirect-from plugin.
 * Reads permalink from frontmatter if available, otherwise constructs from file path.
 * 
 * Note: Uses synchronous file I/O as this function is called during build configuration,
 * once per markdown file. The plugin interface does not support async getSlug functions.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * Extract slug from file path based on frontmatter and filename
 * 
 * @param filePath - Relative path to markdown file from content directory
 * @returns Slug without leading/trailing slashes
 * 
 * @example
 * // Page with permalink in frontmatter
 * getSlug('pages/resume.md') // Returns: 'resume'
 * 
 * @example
 * // Blog post with date in filename
 * getSlug('posts/2014-01-27-post-slug.md') // Returns: '2014/01/27/post-slug'
 * 
 * @example
 * // Page without permalink
 * getSlug('pages/about.md') // Returns: 'pages/about'
 */
export function getSlug(filePath: string): string {
  try {
    // Read the file content
    const fullPath = path.join('src/content', filePath);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const { data } = matter(content);
    
    // Use permalink if available in frontmatter
    if (data.permalink) {
      return data.permalink.replace(/^\/|\/$/g, ''); // Remove leading/trailing slashes
    }
    
    // For posts, extract date and slug from filename
    const filename = path.basename(filePath);
    const dateMatch = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|mdx)$/);
    if (dateMatch) {
      const [, year, month, day, postSlug] = dateMatch;
      return `${year}/${month}/${day}/${postSlug}`;
    }
    
    // Default: use file path
    const parsedPath = path.parse(filePath);
    if (parsedPath.base === 'index.md' || parsedPath.base === 'index.mdx') {
      return parsedPath.dir;
    }
    return `${parsedPath.dir}/${parsedPath.name}`.replace(/^\//, '');
  } catch (error) {
    // Fallback to default slug generation
    // This is acceptable as redirects will still work, just with file-path-based URLs
    console.error(`[redirect-from] WARNING: Could not read frontmatter from ${filePath}: ${(error as Error).message}`);
    console.error('[redirect-from] Using fallback slug generation from file path');
    
    const parsedPath = path.parse(filePath);
    if (parsedPath.base === 'index.md' || parsedPath.base === 'index.mdx') {
      return parsedPath.dir;
    }
    return `${parsedPath.dir}/${parsedPath.name}`.replace(/^\//, '');
  }
}
