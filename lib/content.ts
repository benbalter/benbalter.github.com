import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), 'content/posts');
const pagesDirectory = path.join(process.cwd(), 'content/pages');

export interface PostData {
  slug: string;
  title: string;
  description: string;
  date: string;
  content: string;
  [key: string]: any;
}

export interface PageData {
  slug: string;
  title: string;
  description: string;
  content: string;
  [key: string]: any;
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    // Extract slug from filename (YYYY-MM-DD-slug.md)
    const match = fileName.match(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/);
    return match ? match[1] : fileName.replace(/\.md$/, '');
  });
}

export function getAllPageSlugs() {
  const fileNames = fs.readdirSync(pagesDirectory);
  return fileNames.map((fileName) => {
    return fileName.replace(/\.md$/, '');
  });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fileNames = fs.readdirSync(postsDirectory);
  const fileName = fileNames.find((name) => name.includes(slug));
  
  if (!fileName) {
    throw new Error(`Post not found: ${slug}`);
  }

  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Parse markdown metadata and content
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  // Extract date from filename
  const dateMatch = fileName.match(/^(\d{4}-\d{2}-\d{2})/);
  const date = dateMatch ? dateMatch[1] : '';

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    date,
    content: contentHtml,
    ...data,
  };
}

export async function getPageData(slug: string): Promise<PageData> {
  const fullPath = path.join(pagesDirectory, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Page not found: ${slug}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Parse markdown metadata and content
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    content: contentHtml,
    ...data,
  };
}

export async function getAllPosts(): Promise<PostData[]> {
  const slugs = getAllPostSlugs();
  const posts = await Promise.all(
    slugs.map((slug) => getPostData(slug))
  );

  // Sort posts by date in descending order
  return posts.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export async function getAllPages(): Promise<PageData[]> {
  const slugs = getAllPageSlugs();
  const pages = await Promise.all(
    slugs.map((slug) => getPageData(slug))
  );

  return pages;
}
