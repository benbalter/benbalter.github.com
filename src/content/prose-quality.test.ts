/**
 * Tests for prose quality validation
 * 
 * This test suite validates the quality of blog post prose by checking for:
 * - Multiple consecutive blank lines
 * - Trailing whitespace
 * - Doubled spaces in prose
 * - Headings ending with periods
 * - Broken internal links
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

// Get the path to the posts directory
const postsDir = join(process.cwd(), 'src', 'content', 'posts');

// Get all markdown files in the posts directory
const postFiles = readdirSync(postsDir).filter(file => file.endsWith('.md'));

// Helper to read post content and strip front matter
function readPostContent(filePath: string): string {
  const rawContent = readFileSync(filePath, 'utf-8');
  // Remove YAML front matter (between --- markers)
  return rawContent.replace(/^---\s*\n.*?\n---\s*\n/ms, '');
}

// Helper to check if a file exists with various extensions
function fileExists(basePath: string): boolean {
  return existsSync(basePath) || 
         existsSync(`${basePath}.md`) || 
         existsSync(`${basePath}.html`);
}

// Helper to convert Jekyll permalink to file path
function permalinkToFilePath(permalink: string): string | null {
  // Remove anchor
  let urlPath = permalink.split('#')[0];
  // Remove trailing slash
  urlPath = urlPath.replace(/\/$/, '');
  
  // Convert Jekyll date-based permalink to filename
  // E.g., /2020/08/25/post-title -> 2020-08-25-post-title.md
  const dateMatch = urlPath.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/(.+)$/);
  if (dateMatch) {
    const [, year, month, day, slug] = dateMatch;
    const fileName = `${year}-${month}-${day}-${slug}.md`;
    
    // Check in src/content/posts first (Astro)
    const astroPath = join(process.cwd(), 'src', 'content', 'posts', fileName);
    if (existsSync(astroPath)) {
      return astroPath;
    }
    
    // Fall back to _posts (Jekyll)
    return join(process.cwd(), '_posts', fileName);
  }
  
  // For non-post pages, check if file exists
  const fullPath = join(process.cwd(), urlPath.replace(/^\//, ''));
  return fullPath;
}

// Helper to check if a line has problematic double spaces
// Rules: Allow 2 spaces after sentence-ending punctuation (.?!) but not 3+
// Disallow 2+ spaces after any other character
// This matches the original Jekyll RSpec test behavior
function hasDoubleSpaceIssues(line: string): boolean {
  // Check for 2+ spaces after non-punctuation characters (.?!)
  if (/[^.?!]\s{2,}/.test(line)) {
    return true;
  }
  // Check for 3+ spaces after period (original Ruby only checked period)
  if (/\.\s{3,}/.test(line)) {
    return true;
  }
  return false;
}

describe('prose quality', () => {
  // Test each blog post
  postFiles.forEach(fileName => {
    describe(fileName, () => {
      const filePath = join(postsDir, fileName);
      const content = readPostContent(filePath);

      it('does not have multiple consecutive blank lines', () => {
        const matches = content.match(/\n{3,}/g);
        expect(matches, `Found ${matches?.length || 0} instances of multiple consecutive blank lines`).toBeNull();
      });

      it('does not have trailing whitespace', () => {
        const linesWithTrailingSpace = content.split('\n').filter(line => /[ \t]+$/.test(line));
        expect(
          linesWithTrailingSpace,
          `Found ${linesWithTrailingSpace.length} lines with trailing whitespace:\n${linesWithTrailingSpace.slice(0, 5).join('\n')}`
        ).toHaveLength(0);
      });

      it('does not have doubled spaces in prose', () => {
        // Track code block state
        let inCodeBlock = false;
        const linesWithDoubledSpaces: string[] = [];
        
        content.split('\n').forEach((line, idx) => {
          // Skip code fence markers themselves
          if (/^\s*```/.test(line)) {
            inCodeBlock = !inCodeBlock;
            return;
          }
          
          // Skip code blocks (fenced or indented), markdown tables (lines starting with |), list items, and images
          if (
            inCodeBlock || 
            line.startsWith('    ') || 
            /^\s*\|/.test(line) || 
            /^\s*[\d*\-+]\.?\s/.test(line) || 
            /^\s*!\[/.test(line)
          ) {
            return;
          }
          
          // Check for problematic double spaces
          if (hasDoubleSpaceIssues(line)) {
            linesWithDoubledSpaces.push(`Line ${idx + 1}: ${line.trim().substring(0, 80)}`);
          }
        });
        
        expect(
          linesWithDoubledSpaces,
          `Found doubled spaces:\n${linesWithDoubledSpaces.slice(0, 10).join('\n')}`
        ).toHaveLength(0);
      });

      it('uses consistent heading capitalization (no periods at end)', () => {
        const headings = content.match(/^#+\s+(.+)$/gm);
        
        if (!headings || headings.length === 0) {
          // Skip test if no headings
          return;
        }
        
        const headingsWithPeriods = headings
          .map(h => h.replace(/^#+\s+/, ''))
          .filter(h => h.endsWith('.'));
        
        expect(
          headingsWithPeriods,
          `Headings should not end with periods: ${headingsWithPeriods.join(', ')}`
        ).toHaveLength(0);
      });

      it('does not have broken internal links', () => {
        // Match markdown links that start with / (internal links)
        const internalLinks: string[] = [];
        const lines = content.split('\n');
        
        lines.forEach((line, idx) => {
          // Skip lines with data-proofer-ignore attribute
          if (line.includes('data-proofer-ignore')) {
            return;
          }
          
          // Skip if previous line has data-proofer-ignore comment
          if (idx > 0 && lines[idx - 1].includes('data-proofer-ignore')) {
            return;
          }
          
          // Extract internal links: [text](/path)
          const linkMatches = line.matchAll(/\[([^\]]+)\]\((\/[^)]+)\)/g);
          for (const match of linkMatches) {
            const url = match[2];
            
            // Skip generated files
            if (url.startsWith('/sitemap.xml')) {
              continue;
            }
            
            internalLinks.push(url);
          }
        });
        
        if (internalLinks.length === 0) {
          // Skip test if no internal links
          return;
        }
        
        const brokenLinks = internalLinks.filter(link => {
          const filePath = permalinkToFilePath(link);
          if (!filePath) {
            return false;
          }
          return !fileExists(filePath);
        });
        
        expect(
          brokenLinks,
          `Found broken internal links: ${brokenLinks.join(', ')}`
        ).toHaveLength(0);
      });
    });
  });
});
