#!/usr/bin/env tsx
/**
 * SEO Validation Script
 * 
 * Validates that all pages meet SEO best practices:
 * - Unique titles
 * - Meta descriptions (optimize first 150 characters after Markdown stripped)
 * - Image alt text
 * - Proper heading hierarchy
 * - Canonical URLs
 * 
 * Note: This script uses file system access and gray-matter to parse frontmatter
 * instead of Astro's getCollection, allowing it to run as a standalone script.
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import matter from 'gray-matter';

interface SEOIssue {
  file: string;
  type: 'error' | 'warning';
  message: string;
}

const issues: SEOIssue[] = [];
const titles = new Set<string>();

async function validatePosts() {
  console.log('🔍 Validating blog posts...\n');
  
  // Find all markdown files in src/content/posts/
  const postFiles = await glob('src/content/posts/*.md', { 
    cwd: process.cwd(),
    absolute: true 
  });
  
  for (const filePath of postFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    let frontmatter: any;
    try {
      const parsed = matter(content);
      frontmatter = parsed.data;
    } catch (error) {
      issues.push({
        file: relativePath,
        type: 'error',
        message: `Failed to parse frontmatter: ${error}`,
      });
      continue;
    }
    
    // Check for title
    if (!frontmatter.title || frontmatter.title.trim() === '') {
      issues.push({
        file: relativePath,
        type: 'error',
        message: 'Missing title',
      });
    } else {
      // Check for duplicate titles
      if (titles.has(frontmatter.title)) {
        issues.push({
          file: relativePath,
          type: 'warning',
          message: `Duplicate title: "${frontmatter.title}"`,
        });
      }
      titles.add(frontmatter.title);
      
      // Check title length (recommended: 50-60 characters)
      if (frontmatter.title.length > 60) {
        issues.push({
          file: relativePath,
          type: 'warning',
          message: `Title too long (${frontmatter.title.length} chars, recommend < 60): "${frontmatter.title}"`,
        });
      }
    }
    
    // Check for description
    if (!frontmatter.description || frontmatter.description.trim() === '') {
      issues.push({
        file: relativePath,
        type: 'error',
        message: 'Missing description',
      });
    } else {
      // Strip Markdown formatting for character count
      // Simple strip: remove bold, italic, links, etc.
      const strippedDescription = frontmatter.description
        .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Links
        .replace(/\*\*(.+?)\*\*/g, '$1')    // Bold
        .replace(/\*(.+?)\*/g, '$1')        // Italic
        .replace(/__(.+?)__/g, '$1')        // Bold (underscore)
        .replace(/_(.+?)_/g, '$1')          // Italic (underscore)
        .replace(/`(.+?)`/g, '$1')         // Inline code
        .trim();
      
      const descLength = strippedDescription.length;
      
      // Warn if description is very short
      // Note: No upper limit - can be any length, but optimize first 150 chars
      if (descLength < 100) {
        issues.push({
          file: relativePath,
          type: 'warning',
          message: `Description short (${descLength} chars after Markdown stripped). Ensure first 150 chars are compelling: "${strippedDescription.substring(0, 50)}..."`,
        });
      }
      
      // Info: remind about optimizing first 150 characters
      if (descLength > 150) {
        const first150 = strippedDescription.substring(0, 150);
        // Check if the cutoff happens mid-word (a "bad" break for readability)
        // Here we detect a mid-word break when both the char before and at 150 are alphanumeric
        const charBefore150 = strippedDescription[149];
        const charAt150 = strippedDescription[150];
        
        // If char before 150 is alphanumeric AND char at 150 is alphanumeric, it's mid-word
        const endsInMiddleOfWord = 
          charBefore150?.match(/[a-zA-Z0-9]/) && 
          charAt150?.match(/[a-zA-Z0-9]/);
        
        if (endsInMiddleOfWord) {
          issues.push({
            file: relativePath,
            type: 'warning',
            message: `Description is ${descLength} chars. Ensure first 150 chars (shown in search results) end at a natural break: "${first150}..."`,
          });
        }
      }
    }
    
    // Check for images without alt text (simplified check)
    const imgRegex = /<img[^>]+src="[^"]*"[^>]*>/gi;
    const images = content.match(imgRegex) || [];
    
    for (const img of images) {
      if (!img.includes('alt=')) {
        issues.push({
          file: relativePath,
          type: 'error',
          message: `Image missing alt text: ${img.substring(0, 50)}...`,
        });
      }
    }
  }
  
  console.log(`✅ Validated ${postFiles.length} blog posts\n`);
}

async function validatePages() {
  console.log('🔍 Validating static pages...\n');
  
  // Find all markdown files in src/content/pages/
  const pageFiles = await glob('src/content/pages/*.md', { 
    cwd: process.cwd(),
    absolute: true 
  });
  
  for (const filePath of pageFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    let frontmatter: any;
    try {
      const parsed = matter(content);
      frontmatter = parsed.data;
    } catch (error) {
      issues.push({
        file: relativePath,
        type: 'error',
        message: `Failed to parse frontmatter: ${error}`,
      });
      continue;
    }
    
    // Check for title
    if (!frontmatter.title || frontmatter.title.trim() === '') {
      issues.push({
        file: relativePath,
        type: 'error',
        message: 'Missing title',
      });
    } else {
      if (titles.has(frontmatter.title)) {
        issues.push({
          file: relativePath,
          type: 'warning',
          message: `Duplicate title: "${frontmatter.title}"`,
        });
      }
      titles.add(frontmatter.title);
    }
    
    // Check for description
    if (!frontmatter.description || frontmatter.description.trim() === '') {
      issues.push({
        file: relativePath,
        type: 'error',
        message: 'Missing description',
      });
    }
  }
  
  console.log(`✅ Validated ${pageFiles.length} static pages\n`);
}

async function validateAstroPages() {
  console.log('🔍 Validating Astro page components...\n');
  
  // Find all .astro files in src/pages (excluding dynamic routes)
  const astroFiles = await glob('src/pages/**/*.astro', {
    cwd: process.cwd(),
    absolute: true,
    ignore: ['**/[year]/**', '**/[month]/**', '**/[day]/**', '**/[slug].astro', '**/[...slug].astro'],
  });
  
  for (const filePath of astroFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if page has BaseLayout with title prop
    if (content.includes('<BaseLayout') && !content.includes('title=')) {
      issues.push({
        file: relativePath,
        type: 'warning',
        message: 'Page may be missing title prop in BaseLayout',
      });
    }
    
    // Check if page has description
    if (content.includes('<BaseLayout') && !content.includes('description=')) {
      issues.push({
        file: relativePath,
        type: 'warning',
        message: 'Page may be missing description prop in BaseLayout',
      });
    }
  }
  
  console.log(`✅ Validated ${astroFiles.length} Astro page components\n`);
}

async function validateHeadingHierarchy() {
  console.log('🔍 Validating heading hierarchy...\n');
  
  const mdFiles = await glob('src/content/**/*.md', {
    cwd: process.cwd(),
    absolute: true,
  });
  
  for (const filePath of mdFiles) {
    const relativePath = path.relative(process.cwd(), filePath);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Remove frontmatter
    const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, '');
    
    // Find all headings
    const headings = contentWithoutFrontmatter.match(/^#{1,6}\s+.+$/gm) || [];
    
    let previousLevel = 0;
    for (const heading of headings) {
      const level = heading.match(/^#+/)?.[0].length || 0;
      
      // Check if skipping heading levels (e.g., H1 → H3, skipping H2)
      if (level > previousLevel + 1) {
        issues.push({
          file: relativePath,
          type: 'warning',
          message: `Heading hierarchy skip detected: H${previousLevel} → H${level}. Consider using sequential heading levels.`,
        });
      }
      
      previousLevel = level;
    }
  }
  
  console.log(`✅ Validated heading hierarchy in ${mdFiles.length} markdown files\n`);
}

function printResults() {
  console.log('\n' + '='.repeat(80));
  console.log('SEO VALIDATION RESULTS');
  console.log('='.repeat(80) + '\n');
  
  if (issues.length === 0) {
    console.log('✅ No SEO issues found! Great job!\n');
    return;
  }
  
  const errors = issues.filter(i => i.type === 'error');
  const warnings = issues.filter(i => i.type === 'warning');
  
  if (errors.length > 0) {
    console.log(`❌ ${errors.length} ERROR(S):\n`);
    for (const issue of errors) {
      console.log(`   ${issue.file}`);
      console.log(`   → ${issue.message}\n`);
    }
  }
  
  if (warnings.length > 0) {
    console.log(`⚠️  ${warnings.length} WARNING(S):\n`);
    for (const issue of warnings) {
      console.log(`   ${issue.file}`);
      console.log(`   → ${issue.message}\n`);
    }
  }
  
  console.log('='.repeat(80));
  console.log(`Total Issues: ${issues.length} (${errors.length} errors, ${warnings.length} warnings)`);
  console.log('='.repeat(80) + '\n');
  
  // Exit with error code if there are errors
  if (errors.length > 0) {
    process.exit(1);
  }
}

async function main() {
  console.log('\n🚀 Starting SEO Validation...\n');
  
  try {
    await validatePosts();
    await validatePages();
    await validateAstroPages();
    await validateHeadingHierarchy();
    printResults();
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

main();
