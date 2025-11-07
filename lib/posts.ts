import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), '_posts');

export interface PostData {
  slug: string;
  year: string;
  month: string;
  day: string;
  title: string;
  description?: string;
  date: string;
  content: string;
  [key: string]: any;
}

/**
 * Get all post file names from _posts directory
 */
function getPostFileNames(): string[] {
  return fs.readdirSync(postsDirectory);
}

/**
 * Parse a post filename to extract date parts and slug
 * Format: YYYY-MM-DD-slug.md
 */
function parseFileName(fileName: string): {
  year: string;
  month: string;
  day: string;
  slug: string;
} | null {
  const match = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) return null;
  
  const [, year, month, day, slug] = match;
  return { year, month, day, slug };
}

/**
 * Get all post slugs with their date components
 */
export function getAllPostSlugs(): Array<{
  year: string;
  month: string;
  day: string;
  slug: string;
}> {
  const fileNames = getPostFileNames();
  
  return fileNames
    .map(fileName => parseFileName(fileName))
    .filter((parsed): parsed is NonNullable<typeof parsed> => parsed !== null);
}

/**
 * Get post data by year, month, day, and slug
 */
export async function getPostData(
  year: string,
  month: string,
  day: string,
  slug: string
): Promise<PostData> {
  const fileName = `${year}-${month}-${day}-${slug}.md`;
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Parse frontmatter
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);
  
  const contentHtml = processedContent.toString();

  return {
    slug,
    year,
    month,
    day,
    date: `${year}-${month}-${day}`,
    title: data.title || slug,
    description: data.description,
    content: contentHtml,
    ...data,
  };
}

/**
 * Get all posts sorted by date (newest first)
 */
export async function getAllPosts(): Promise<PostData[]> {
  const allPostSlugs = getAllPostSlugs();
  
  const allPosts = await Promise.all(
    allPostSlugs.map(({ year, month, day, slug }) =>
      getPostData(year, month, day, slug)
    )
  );

  // Sort posts by date descending
  return allPosts.sort((a, b) => {
    if (a.date > b.date) {
      return -1;
    } else if (a.date < b.date) {
      return 1;
    } else {
      return 0;
    }
  });
}
