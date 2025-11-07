import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');

export interface PostMetadata {
  title: string;
  description?: string;
  date: string;
  slug: string;
  [key: string]: any;
}

export interface Post extends PostMetadata {
  content: string;
}

/**
 * Extract date and slug from Jekyll post filename
 * Format: YYYY-MM-DD-slug.md
 */
function parseFilename(filename: string): { date: string; slug: string } {
  const match = filename.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
  if (!match) {
    throw new Error(`Invalid post filename format: ${filename}. Expected format: YYYY-MM-DD-slug.md`);
  }
  return {
    date: match[1],
    slug: match[2],
  };
}

/**
 * Get all post filenames sorted by date (newest first)
 */
export function getAllPostSlugs(): Array<{ params: { year: string; month: string; day: string; slug: string } }> {
  const filenames = fs.readdirSync(postsDirectory);
  
  return filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const { date, slug } = parseFilename(filename);
      const [year, month, day] = date.split('-');
      return {
        params: {
          year,
          month,
          day,
          slug,
        },
      };
    });
}

/**
 * Get post data by date and slug
 */
export function getPostBySlug(year: string, month: string, day: string, slug: string): Post {
  const filename = `${year}-${month}-${day}-${slug}.md`;
  const fullPath = path.join(postsDirectory, filename);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Post not found: ${fullPath}`);
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    ...data,
    title: data.title || '',
    date: `${year}-${month}-${day}`,
    slug,
    content,
  } as Post;
}

/**
 * Get all posts sorted by date (newest first)
 */
export function getAllPosts(): Post[] {
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const { date, slug } = parseFilename(filename);
      const [year, month, day] = date.split('-');
      return getPostBySlug(year, month, day, slug);
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
  
  return posts;
}
