import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { readDirectory } from './content-loader';
import { markdownToHtml } from './markdown';

export interface ResumePosition {
  slug: string;
  employer: string;
  title: string;
  start_date: string;
  end_date?: string;
  content: string;
  contentHtml?: string;
}

export interface Degree {
  school: string;
  degree: string;
  date: string;
}

export interface Certification {
  authority: string;
  name: string;
  url?: string;
}

/**
 * Internal function to parse a resume position file
 */
function parsePositionFile(fileName: string, positionsDirectory: string): ResumePosition {
  const slug = fileName.replace(/\.md$/, '');
  const fullPath = path.join(positionsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    employer: data.employer || '',
    title: data.title || '',
    start_date: data.start_date || '',
    end_date: data.end_date,
    content,
  };
}

/**
 * Get all resume positions with React cache for request-level memoization
 * Returns positions sorted by start_date (most recent first)
 */
export const getAllResumePositions = cache(async (): Promise<ResumePosition[]> => {
  const positionsDirectory = path.join(process.cwd(), '_resume_positions');
  const fileNames = readDirectory(positionsDirectory);
  
  const positions = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => parsePositionFile(fileName, positionsDirectory));
  
  // Sort by start_date in descending order (most recent first)
  positions.sort((a, b) => {
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    return dateB - dateA;
  });
  
  // Convert markdown content to HTML for each position
  const positionsWithHtml = await Promise.all(
    positions.map(async (position) => ({
      ...position,
      contentHtml: await markdownToHtml(position.content),
    }))
  );
  
  return positionsWithHtml;
});
