/**
 * Tests for content front matter validation
 * 
 * This test suite validates that all content entries (posts, pages, resume-positions)
 * have the required front matter fields as defined in the content schema.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

// Get the paths to content directories
const postsDir = join(process.cwd(), 'src', 'content', 'posts');
const pagesDir = join(process.cwd(), 'src', 'content', 'pages');
const resumePositionsDir = join(process.cwd(), 'src', 'content', 'resume-positions');

// Helper to read front matter from a markdown file
function readFrontMatter(filePath: string): Record<string, unknown> {
  const fileContent = readFileSync(filePath, 'utf-8');
  const { data } = matter(fileContent);
  return data;
}

// Helper to check that a field exists and is non-empty
function expectNonEmptyField(value: unknown, fieldName: string, fileName: string): void {
  expect(value, `${fileName} should have a ${fieldName}`).toBeDefined();
  
  // Convert to string if needed, handling different types appropriately
  const stringValue = typeof value === 'string' ? value : String(value);
  expect(stringValue.trim(), `${fileName} ${fieldName} should not be empty`).not.toBe('');
}

describe('front matter validation', () => {
  describe('posts', () => {
    it('should have required fields: title, description', () => {
      const postFiles = readdirSync(postsDir).filter(file => file.endsWith('.md'));
      
      expect(postFiles.length).toBeGreaterThan(0);
      
      postFiles.forEach(fileName => {
        const filePath = join(postsDir, fileName);
        const frontMatter = readFrontMatter(filePath);
        
        expectNonEmptyField(frontMatter.title, 'title', `Post ${fileName}`);
        expectNonEmptyField(frontMatter.description, 'description', `Post ${fileName}`);
      });
    });
  });

  describe('pages', () => {
    it('should have required fields: title, description', () => {
      const pageFiles = readdirSync(pagesDir).filter(file => file.endsWith('.md'));
      
      expect(pageFiles.length).toBeGreaterThan(0);
      
      pageFiles.forEach(fileName => {
        const filePath = join(pagesDir, fileName);
        const frontMatter = readFrontMatter(filePath);
        
        expectNonEmptyField(frontMatter.title, 'title', `Page ${fileName}`);
        expectNonEmptyField(frontMatter.description, 'description', `Page ${fileName}`);
      });
    });
  });

  describe('resume-positions', () => {
    it('should have required fields: employer, title, start_date', () => {
      const positionFiles = readdirSync(resumePositionsDir).filter(file => file.endsWith('.md'));
      
      expect(positionFiles.length).toBeGreaterThan(0);
      
      positionFiles.forEach(fileName => {
        const filePath = join(resumePositionsDir, fileName);
        const frontMatter = readFrontMatter(filePath);
        
        expectNonEmptyField(frontMatter.employer, 'employer', `Position ${fileName}`);
        expectNonEmptyField(frontMatter.title, 'title', `Position ${fileName}`);
        expectNonEmptyField(frontMatter.start_date, 'start_date', `Position ${fileName}`);
      });
    });
  });
});
