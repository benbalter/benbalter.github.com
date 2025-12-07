import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import type { Post } from './posts';

// Directory for MDX posts (posts with Liquid syntax converted to MDX)
const mdxPostsDirectory = path.join(process.cwd(), 'app', '_posts');

/**
 * Check if a post has an MDX version in app/_posts
 * This is used to determine whether to render as MDX or regular Markdown
 */
export function hasMdxVersion(slug: string): boolean {
  const mdxPath = path.join(mdxPostsDirectory, `${slug}.mdx`);
  return fs.existsSync(mdxPath);
}

/**
 * Get the path to an MDX post file
 */
export function getMdxPostPath(slug: string): string {
  return path.join(mdxPostsDirectory, `${slug}.mdx`);
}

/**
 * Parse an MDX post file and return post metadata
 * The actual MDX rendering is handled by Next.js dynamic imports
 */
function parseMdxPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.mdx$/, '');
  const fullPath = path.join(mdxPostsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Extract date from filename if not in frontmatter
  let date = data.date;
  if (!date) {
    const match = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-/);
    if (match) {
      date = `${match[1]}-${match[2]}-${match[3]}`;
    }
  }
  
  // Generate title from filename if not in frontmatter
  let title = data.title;
  if (!title) {
    title = fileName
      .replace(/^\d{4}-\d{2}-\d{2}-/, '')
      .replace(/\.mdx$/, '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
  
  return {
    slug,
    content,
    ...data,
    date,
    title,
    description: data.description,
    image: data.image,
    // Flag to indicate this is an MDX post
    isMdx: true,
  };
}

/**
 * Get all MDX posts from app/_posts directory
 * These are posts that were converted from Liquid to MDX
 */
export const getAllMdxPosts = cache((): Post[] => {
  if (!fs.existsSync(mdxPostsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(mdxPostsDirectory);
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.mdx'))
    .map(fileName => parseMdxPostFile(fileName));
  
  return posts;
});

/**
 * Get a single MDX post by slug
 */
export function getMdxPostBySlug(slug: string): Post | null {
  const fileName = `${slug}.mdx`;
  const fullPath = path.join(mdxPostsDirectory, fileName);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  try {
    return parseMdxPostFile(fileName);
  } catch (error) {
    console.warn(`Failed to parse MDX post file ${fileName}:`, error);
    return null;
  }
}

/**
 * Get all MDX post slugs (for determining which posts to exclude from regular MD processing)
 */
export function getMdxPostSlugs(): Set<string> {
  if (!fs.existsSync(mdxPostsDirectory)) {
    return new Set();
  }
  
  const fileNames = fs.readdirSync(mdxPostsDirectory);
  return new Set(
    fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map(fileName => fileName.replace(/\.mdx$/, ''))
  );
}
