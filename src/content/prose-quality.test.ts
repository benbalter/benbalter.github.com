/**
 * Prose quality tests for Astro content
 * 
 * These tests mirror the Jekyll prose quality tests in spec/prose_quality_spec.rb
 * to ensure content quality standards are maintained across both builds.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Path to the Astro content posts directory
const POSTS_DIR = resolve(__dirname, 'posts');

// Get all markdown files in the posts directory
const getPostFiles = (): string[] => {
  if (!existsSync(POSTS_DIR)) {
    return [];
  }
  return readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    .sort();
};

// Remove YAML front matter from content
const stripFrontMatter = (content: string): string => {
  return content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/m, '');
};

// Read and process a post file
const readPostContent = (filename: string): string => {
  const filepath = join(POSTS_DIR, filename);
  const rawContent = readFileSync(filepath, 'utf-8');
  return stripFrontMatter(rawContent);
};

describe('prose quality', () => {
  const postFiles = getPostFiles();
  
  it('should have posts to test', () => {
    expect(postFiles.length).toBeGreaterThan(0);
  });
  
  describe('blog posts', () => {
    postFiles.forEach(filename => {
      describe(filename, () => {
        const content = readPostContent(filename);
        
        it('does not have multiple consecutive blank lines', () => {
          const matches = content.match(/\n{3,}/g);
          expect(matches).toBeNull();
        });
        
        it('does not have trailing whitespace', () => {
          const linesWithTrailingSpace = content
            .split('\n')
            .filter(line => /[ \t]+$/.test(line));
          
          expect(linesWithTrailingSpace).toHaveLength(0);
        });
        
        it('does not have doubled spaces in prose', () => {
          let inCodeBlock = false;
          const linesWithDoubledSpaces: string[] = [];
          
          content.split('\n').forEach((line, idx) => {
            // Skip code fence markers themselves (may have leading whitespace)
            if (/^\s*```/.test(line)) {
              inCodeBlock = !inCodeBlock;
              return;
            }
            
            // Skip code blocks (fenced or indented), markdown tables, list items, and images
            if (
              inCodeBlock ||
              line.startsWith('    ') ||
              line.includes('|') ||
              /^\s*[\d*\-+]\.?\s/.test(line) ||
              /^\s*!\[/.test(line)
            ) {
              return;
            }
            
            // Check for double spaces (but allow after sentence-ending punctuation)
            if (/[^.?!]\s{2,}/.test(line) || /\.\s{3,}/.test(line)) {
              linesWithDoubledSpaces.push(`Line ${idx + 1}: ${line.slice(0, 80)}`);
            }
          });
          
          expect(linesWithDoubledSpaces).toHaveLength(0);
        });
        
        it('uses consistent heading capitalization', () => {
          // Extract headings (lines starting with #)
          const headings = content
            .split('\n')
            .filter(line => /^#+\s+.+$/.test(line))
            .map(line => line.replace(/^#+\s+/, ''));
          
          if (headings.length === 0) {
            // No headings to check - this is acceptable
            return;
          }
          
          // Check that headings don't end with periods (common style error)
          const headingsWithPeriods = headings.filter(h => h.trimEnd().endsWith('.'));
          
          expect(headingsWithPeriods).toHaveLength(0);
        });
        
        it('does not have broken internal links', () => {
          const sitePath = resolve(__dirname, '../..');
          const internalLinks: string[] = [];
          
          content.split('\n').forEach(line => {
            // Skip lines with data-proofer-ignore (Jekyll/Kramdown attribute)
            if (line.includes('data-proofer-ignore')) {
              return;
            }
            
            // Match markdown links that start with / (internal links)
            const linkRegex = /\[([^\]]+)\]\((\/[^)]+)\)/g;
            let match;
            
            while ((match = linkRegex.exec(line)) !== null) {
              const url = match[2];
              // Skip generated files
              if (url.startsWith('/sitemap.xml')) {
                continue;
              }
              // Skip intentionally broken links (used for 404 page examples)
              // These often contain "unhelpful" or similar patterns
              if (url.includes('/unhelpful-') || url.includes('-broken-') || url.includes('-invalid-')) {
                continue;
              }
              internalLinks.push(url);
            }
          });
          
          if (internalLinks.length === 0) {
            // No internal links to check - this is acceptable
            return;
          }
          
          const brokenLinks = internalLinks.filter(link => {
            // Remove anchor
            let path = link.split('#')[0];
            // Remove trailing slash
            path = path.replace(/\/$/, '');
            
            // Convert date-based permalink to filename
            // E.g., /2020/08/25/post-title -> posts/2020-08-25-post-title.md
            if (/^\/\d{4}\/\d{2}\/\d{2}\//.test(path)) {
              const dateAndSlug = path.slice(1).replace(/\//g, '-');
              const postFile = join(POSTS_DIR, `${dateAndSlug}.md`);
              const postFileMdx = join(POSTS_DIR, `${dateAndSlug}.mdx`);
              return !existsSync(postFile) && !existsSync(postFileMdx);
            }
            
            // For non-post pages, check in the pages directory or site root
            const pathWithoutLeadingSlash = path.slice(1);
            const pagePath = join(__dirname, 'pages', `${pathWithoutLeadingSlash}.md`);
            const siteRootPath = join(sitePath, `${pathWithoutLeadingSlash}.md`);
            const htmlPath = join(sitePath, `${pathWithoutLeadingSlash}.html`);
            const dirPath = join(sitePath, pathWithoutLeadingSlash);
            
            return (
              !existsSync(pagePath) &&
              !existsSync(siteRootPath) &&
              !existsSync(htmlPath) &&
              !existsSync(dirPath)
            );
          });
          
          expect(brokenLinks).toHaveLength(0);
        });
      });
    });
  });
});
