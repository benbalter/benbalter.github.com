import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { cache } from 'react';

export function loadData<T = any>(filename: string): T {
  const dataDirectory = path.join(process.cwd(), 'content/data');
  const fullPath = path.join(dataDirectory, filename);
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    return yaml.load(fileContents) as T;
  } catch (err: any) {
    throw new Error(
      `Failed to load YAML data from "${fullPath}": ${err.message}`
    );
  }
}

export interface Book {
  title: string;
  asin: string;
  tldr: string;
}

/**
 * Get books data with React cache for request-level memoization
 */
export const getBooks = cache((): Record<string, Book[]> => {
  return loadData('books.yml');
});

export interface Clip {
  title: string;
  publication: string;
  url: string;
  date: string;
}

/**
 * Get clips data with React cache for request-level memoization
 */
export const getClips = cache((): Clip[] => {
  return loadData('clips.yml');
});

/**
 * Get related posts mapping with React cache for request-level memoization
 */
export const getRelatedPosts = cache((): Record<string, string[]> => {
  return loadData('related_posts.yml');
});
