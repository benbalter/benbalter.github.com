/**
 * Front matter validation tests for Astro content
 * 
 * These tests validate that all content files have the required front matter
 * fields, mirroring the Jekyll front matter tests in spec/front_matter_spec.rb.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import matter from 'gray-matter';

// Paths to content directories
const POSTS_DIR = resolve(__dirname, 'posts');
const PAGES_DIR = resolve(__dirname, 'pages');
const RESUME_POSITIONS_DIR = resolve(__dirname, 'resume-positions');

// Required front matter fields (matches Jekyll _config_test.yml)
const REQUIRED_FRONT_MATTER = {
  posts: ['title', 'description'],
  pages: ['title', 'description'],
  'resume-positions': ['employer', 'title', 'start_date'],
};

// Get all markdown files in a directory
const getMarkdownFiles = (dir: string): string[] => {
  if (!existsSync(dir)) {
    return [];
  }
  return readdirSync(dir)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .sort();
};

// Parse front matter from a file
const parseFrontMatter = (dir: string, filename: string): Record<string, unknown> => {
  const filepath = join(dir, filename);
  const content = readFileSync(filepath, 'utf-8');
  const parsed = matter(content);
  return parsed.data;
};

describe('front matter validation', () => {
  describe('blog posts', () => {
    const postFiles = getMarkdownFiles(POSTS_DIR);
    
    it('should have posts to validate', () => {
      expect(postFiles.length).toBeGreaterThan(0);
    });
    
    postFiles.forEach(filename => {
      describe(filename, () => {
        const frontMatter = parseFrontMatter(POSTS_DIR, filename);
        
        REQUIRED_FRONT_MATTER.posts.forEach(field => {
          it(`has a ${field}`, () => {
            expect(frontMatter).toHaveProperty(field);
            expect(String(frontMatter[field])).not.toBe('');
          });
        });
      });
    });
  });
  
  describe('pages', () => {
    const pageFiles = getMarkdownFiles(PAGES_DIR);
    
    if (pageFiles.length > 0) {
      pageFiles.forEach(filename => {
        describe(filename, () => {
          const frontMatter = parseFrontMatter(PAGES_DIR, filename);
          
          REQUIRED_FRONT_MATTER.pages.forEach(field => {
            it(`has a ${field}`, () => {
              expect(frontMatter).toHaveProperty(field);
              expect(String(frontMatter[field])).not.toBe('');
            });
          });
        });
      });
    }
  });
  
  describe('resume positions', () => {
    const resumeFiles = getMarkdownFiles(RESUME_POSITIONS_DIR);
    
    if (resumeFiles.length > 0) {
      resumeFiles.forEach(filename => {
        describe(filename, () => {
          const frontMatter = parseFrontMatter(RESUME_POSITIONS_DIR, filename);
          
          REQUIRED_FRONT_MATTER['resume-positions'].forEach(field => {
            it(`has a ${field}`, () => {
              expect(frontMatter).toHaveProperty(field);
              expect(String(frontMatter[field])).not.toBe('');
            });
          });
        });
      });
    }
  });
});
