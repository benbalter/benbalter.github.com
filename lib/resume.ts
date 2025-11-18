import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';

export interface ResumePosition {
  slug: string;
  employer: string;
  title: string;
  start_date: string;
  end_date?: string;
  content: string;
  [key: string]: any;
}

const positionsDirectory = path.join(process.cwd(), 'content/resume');

function parsePositionFile(fileName: string): ResumePosition {
  const slug = fileName.replace(/\.md$/, '');
  const fullPath = path.join(positionsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    content,
    employer: data.employer,
    title: data.title,
    start_date: data.start_date,
    end_date: data.end_date,
    ...data,
  };
}

/**
 * Get all resume positions with React cache for request-level memoization
 */
export const getResumePositions = cache((): ResumePosition[] => {
  if (!fs.existsSync(positionsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(positionsDirectory);
  
  const positions = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => parsePositionFile(fileName));
  
  // Sort by start_date (newest first)
  return positions.sort((a, b) => {
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });
});
