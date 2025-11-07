import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = process.cwd();

export interface Page {
  slug: string;
  title: string;
  description: string;
  content: string;
}

const pageFiles = ['about.md', 'contact.md', 'fine-print.md', 'press.md', 'talks.md'];

export async function getPages(): Promise<Page[]> {
  const allPagesData = pageFiles
    .filter((fileName) => {
      const fullPath = path.join(contentDirectory, fileName);
      return fs.existsSync(fullPath);
    })
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        content,
      };
    });

  return allPagesData;
}

export async function getPage(slug: string): Promise<Page | null> {
  const fileName = `${slug}.md`;
  const fullPath = path.join(contentDirectory, fileName);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    content,
  };
}
