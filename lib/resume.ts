import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { cache } from 'react';
import { readDirectory } from './content-loader';

export interface ResumePosition {
  employer: string;
  title: string;
  start_date: string;
  end_date?: string;
  content: string;
  [key: string]: any;
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

export interface ResumeData {
  title?: string;
  description?: string;
  degrees: Degree[];
  certifications: Certification[];
  positions: ResumePosition[];
  [key: string]: any;
}

/**
 * Parse a resume position file
 */
function parsePositionFile(fileName: string, positionsDirectory: string): ResumePosition {
  const fullPath = path.join(positionsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    content,
    ...data,
    employer: data.employer || '',
    title: data.title || '',
    start_date: data.start_date || '',
    end_date: data.end_date,
  };
}

/**
 * Get all resume positions with React cache for request-level memoization
 */
export const getAllResumePositions = cache((): ResumePosition[] => {
  const positionsDirectory = path.join(process.cwd(), '_resume_positions');
  const fileNames = readDirectory(positionsDirectory);
  
  const positions = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => parsePositionFile(fileName, positionsDirectory))
    // Filter out positions with invalid or missing start_date
    .filter(position => {
      if (!position.start_date) return false;
      const date = new Date(position.start_date);
      return !isNaN(date.getTime());
    });
  
  // Sort by start_date, most recent first
  return positions.sort((a, b) => {
    const dateA = new Date(a.start_date).getTime();
    const dateB = new Date(b.start_date).getTime();
    return dateB - dateA;
  });
});

/**
 * Get complete resume data including positions, degrees, and certifications
 */
export const getResumeData = cache((): ResumeData => {
  // Get resume page front matter from resume.md in root
  const resumePagePath = path.join(process.cwd(), 'resume.md');
  const fileContents = fs.readFileSync(resumePagePath, 'utf8');
  const { data } = matter(fileContents);
  
  // Get all positions
  const positions = getAllResumePositions();
  
  return {
    ...data,
    title: data.title,
    description: data.description,
    degrees: data.degrees || [],
    certifications: data.certifications || [],
    positions,
  };
});
