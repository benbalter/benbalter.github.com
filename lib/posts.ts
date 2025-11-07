import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

const postsDirectory = path.join(process.cwd(), '_posts');
const pagesDirectory = process.cwd();

export interface PostData {
  slug: string;
  title: string;
  date: string;
  description?: string;
  image?: string;
  content: string;
  [key: string]: any;
}

export function getAllPostSlugs() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove .md extension
      const slug = fileName.replace(/\.md$/, '');
      return slug;
    });
}

export async function getPostData(slug: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Parse frontmatter
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  // Extract date from filename (format: YYYY-MM-DD-title.md)
  const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})-/);
  const date = dateMatch ? dateMatch[1] : '';
  
  // Extract title from slug (remove date prefix)
  const titleFromSlug = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');

  return {
    slug,
    date,
    title: data.title || titleFromSlug,
    description: data.description || '',
    image: data.image || '',
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

export async function getPageData(fileName: string): Promise<any> {
  const fullPath = path.join(pagesDirectory, fileName);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Convert markdown to HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(content);
  const contentHtml = processedContent.toString();

  return {
    ...data,
    content: contentHtml,
  };
}
