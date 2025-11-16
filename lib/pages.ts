import path from 'path';
import { readContentFile, findFileWithExtensions, readDirectory, createContentItem } from './content-loader';

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
  
  const filePath = findFileWithExtensions(pagesDirectory, slug, extensions);
  
  if (!filePath) {
    return null;
  }
  
  const { data, content } = readContentFile(filePath);
  
  return createContentItem(slug, data, content, {
    title: data.title,
    description: data.description,
  }) as Page;
}

export function getAllPages(): Page[] {
  const pagesDirectory = path.join(process.cwd(), 'content/pages');
  const fileNames = readDirectory(pagesDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.html'))
    .map(fileName => {
      const slug = fileName.replace(/\.(md|html)$/, '');
      const fullPath = path.join(pagesDirectory, fileName);
      const { data, content } = readContentFile(fullPath);
      
      return createContentItem(slug, data, content, {
        title: data.title,
        description: data.description,
      }) as Page;
    });
}

export function getAllPageSlugs(): string[] {
  const pages = getAllPages();
  return pages.map(page => page.slug).filter(slug => slug !== 'index' && slug !== '404');
}
