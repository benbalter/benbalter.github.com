import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Page {
  slug: string;
  title?: string;
  description?: string;
  content: string;
  [key: string]: any;
}

export function getPageBySlug(slug: string): Page | null {
  const pagesDirectory = path.join(process.cwd(), 'content/pages');
  const extensions = ['.md', '.html'];
  
  for (const ext of extensions) {
    const fullPath = path.join(pagesDirectory, `${slug}${ext}`);
    
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        title: data.title,
        description: data.description,
        content,
        ...data,
      };
    }
  }
  
  return null;
}

export function getAllPages(): Page[] {
  const pagesDirectory = path.join(process.cwd(), 'content/pages');
  const fileNames = fs.readdirSync(pagesDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.html'))
    .map(fileName => {
      const slug = fileName.replace(/\.(md|html)$/, '');
      const fullPath = path.join(pagesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        title: data.title,
        description: data.description,
        content,
        ...data,
      };
    });
}

export function getAllPageSlugs(): string[] {
  const pages = getAllPages();
  return pages.map(page => page.slug).filter(slug => slug !== 'index' && slug !== '404');
}
