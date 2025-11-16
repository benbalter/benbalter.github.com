import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  date: string;
  title: string;
  description?: string;
  image?: string;
  content: string;
  [key: string]: unknown;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
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
          .replace(/\.md$/, '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
      }
      
      return {
        slug,
        content,
        ...data,
        // Ensure these take precedence over any conflicting keys in ...data
        date,
        title,
        description: data.description,
        image: data.image,
      };
    });
  
  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Validates that the given year, month, and day form a valid date.
 * This ensures URLs match the expected Jekyll format.
 */
export function isValidDate(year: string, month: string, day: string): boolean {
  const yearNum = parseInt(year, 10);
  const monthNum = parseInt(month, 10);
  const dayNum = parseInt(day, 10);
  
  // Basic range checks
  if (yearNum < 1000 || yearNum > 9999) return false;
  if (monthNum < 1 || monthNum > 12) return false;
  if (dayNum < 1 || dayNum > 31) return false;
  
  // Create a date and verify it matches the input (handles invalid dates like Feb 30)
  const date = new Date(yearNum, monthNum - 1, dayNum);
  return (
    date.getFullYear() === yearNum &&
    date.getMonth() === monthNum - 1 &&
    date.getDate() === dayNum
  );
}

export function findPostByDate(posts: Post[], year: string, month: string, day: string, slug: string): Post | null {
  // Validate the date components before attempting to find the post
  if (!isValidDate(year, month, day)) {
    return null;
  }
  
  const fullSlug = `${year}-${month}-${day}-${slug}`;
  return posts.find(post => post.slug === fullSlug) || null;
}

/**
 * Extract URL parts from a post slug.
 * Handles the date/slug splitting logic consistently across the app.
 */
export function getPostUrlParts(post: Post): { year: string; month: string; day: string; slug: string; url: string } {
  const [year, month, day, ...rest] = post.slug.split('-');
  const slug = rest.join('-');
  const url = `/${encodeURIComponent(year)}/${encodeURIComponent(month)}/${encodeURIComponent(day)}/${encodeURIComponent(slug)}/`;
  
  return { year, month, day, slug, url };
}
