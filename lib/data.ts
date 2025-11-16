import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export function loadData<T = unknown>(filename: string): T {
  const dataDirectory = path.join(process.cwd(), 'content/data');
  const fullPath = path.join(dataDirectory, filename);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return yaml.load(fileContents) as T;
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to load YAML data from "${fullPath}": ${errorMessage}`
    );
  }
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
