/**
 * Resume Positions Loader
 * 
 * Loads and parses resume position data from _resume_positions directory.
 * Matches Jekyll's structure for resume data.
 */

import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

export interface ResumePosition {
  employer: string;
  title: string;
  start_date: string;
  end_date?: string;
  content: string;
}

/**
 * Load all resume positions from the _resume_positions directory
 * @returns Array of resume positions sorted by start_date (most recent first)
 */
export async function getResumePositions(): Promise<ResumePosition[]> {
  const resumePositionsDir = join(process.cwd(), '_resume_positions');
  
  try {
    // Read all files in the directory
    const files = await readdir(resumePositionsDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    // Load and parse each file
    const positions = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = join(resumePositionsDir, file);
        const fileContent = await readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        
        return {
          employer: data.employer,
          title: data.title,
          start_date: data.start_date,
          end_date: data.end_date,
          content: content.trim(),
        } as ResumePosition;
      })
    );
    
    // Sort by start_date (most recent first)
    return positions.sort((a, b) => {
      return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    });
  } catch (error) {
    console.error('Error loading resume positions:', error);
    return [];
  }
}
