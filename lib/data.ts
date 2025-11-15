import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const dataDirectory = path.join(process.cwd(), 'content/data');

export function loadData<T = any>(filename: string): T {
  const fullPath = path.join(dataDirectory, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return yaml.load(fileContents) as T;
}

export interface Book {
  title: string;
  asin: string;
  tldr: string;
}

export function getBooks(): Record<string, Book[]> {
  return loadData('books.yml');
}

export interface Clip {
  title: string;
  publication: string;
  url: string;
  date: string;
}

export function getClips(): Clip[] {
  return loadData('clips.yml');
}

export function getRelatedPosts(): Record<string, string[]> {
  return loadData('related_posts.yml');
}
