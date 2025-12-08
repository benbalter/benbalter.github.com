#!/usr/bin/env tsx

/**
 * Migrate Jekyll blog posts to Astro content collection
 * 
 * This script:
 * 1. Copies all posts from _posts/ to src/content/posts/
 * 2. Preserves Jekyll filename format (YYYY-MM-DD-slug.md)
 * 3. Validates frontmatter against Astro schema
 * 4. Reports any posts with missing required fields or issues
 * 5. Identifies posts with Liquid tags that need manual review
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const JEKYLL_POSTS_DIR = path.join(ROOT_DIR, '_posts');
const ASTRO_POSTS_DIR = path.join(ROOT_DIR, 'src', 'content', 'posts');

interface ValidationResult {
  filename: string;
  success: boolean;
  warnings: string[];
  errors: string[];
}

interface MigrationStats {
  total: number;
  successful: number;
  withWarnings: number;
  withErrors: number;
  hasLiquidTags: number;
  missingTitle: number;
  missingDescription: number;
}

/**
 * Extract frontmatter from a markdown file
 */
function extractFrontmatter(content: string): { frontmatter: Record<string, any>, body: string } | null {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return null;
  }
  
  const [, frontmatterStr, body] = match;
  
  // Simple YAML parser for our purposes
  const frontmatter: Record<string, any> = {};
  let currentKey: string | null = null;
  let arrayValues: string[] = [];
  
  for (const line of frontmatterStr.split('\n')) {
    // Handle array items
    if (line.trim().startsWith('-') && currentKey) {
      const value = line.trim().substring(1).trim().replace(/^["']|["']$/g, '');
      arrayValues.push(value);
      continue;
    }
    
    // Flush previous array
    if (currentKey && arrayValues.length > 0) {
      frontmatter[currentKey] = arrayValues;
      arrayValues = [];
      currentKey = null;
    }
    
    // Handle key-value pairs
    const keyValueMatch = line.match(/^([a-z_]+):\s*(.*)$/);
    if (keyValueMatch) {
      const [, key, value] = keyValueMatch;
      currentKey = key;
      
      // Empty value might indicate array follows
      if (!value.trim()) {
        arrayValues = [];
        continue;
      }
      
      // Parse the value
      const trimmedValue = value.trim();
      if (trimmedValue === 'true') {
        frontmatter[key] = true;
      } else if (trimmedValue === 'false') {
        frontmatter[key] = false;
      } else if (/^\d+$/.test(trimmedValue)) {
        frontmatter[key] = parseInt(trimmedValue, 10);
      } else {
        // Remove surrounding quotes
        frontmatter[key] = trimmedValue.replace(/^["']|["']$/g, '');
      }
      currentKey = null;
    }
  }
  
  // Flush any remaining array
  if (currentKey && arrayValues.length > 0) {
    frontmatter[currentKey] = arrayValues;
  }
  
  return { frontmatter, body: body.trim() };
}

/**
 * Validate a post's frontmatter
 */
function validatePost(filename: string, content: string): ValidationResult {
  const result: ValidationResult = {
    filename,
    success: true,
    warnings: [],
    errors: [],
  };
  
  const parsed = extractFrontmatter(content);
  
  if (!parsed) {
    result.success = false;
    result.errors.push('Failed to parse frontmatter');
    return result;
  }
  
  const { frontmatter, body } = parsed;
  
  // Check required fields
  if (!frontmatter.title) {
    result.errors.push('Missing required field: title');
    result.success = false;
  }
  
  if (!frontmatter.description) {
    result.errors.push('Missing required field: description');
    result.success = false;
  }
  
  // Check for Liquid tags
  if (body.includes('{% ') || body.includes('{{')) {
    result.warnings.push('Contains Liquid template tags - may need manual conversion to MDX');
  }
  
  // Check for archived posts
  if (frontmatter.archived) {
    result.warnings.push('Post is marked as archived');
  }
  
  // Check for redirects
  if (frontmatter.redirect_from) {
    result.warnings.push(`Has redirect_from: ${Array.isArray(frontmatter.redirect_from) ? frontmatter.redirect_from.join(', ') : frontmatter.redirect_from}`);
  }
  
  return result;
}

/**
 * Migrate a single post
 */
function migratePost(filename: string): ValidationResult {
  const sourcePath = path.join(JEKYLL_POSTS_DIR, filename);
  const destPath = path.join(ASTRO_POSTS_DIR, filename);
  
  const content = fs.readFileSync(sourcePath, 'utf-8');
  const validation = validatePost(filename, content);
  
  if (validation.success) {
    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
  }
  
  return validation;
}

/**
 * Main migration function
 */
function main() {
  console.log('🚀 Starting Jekyll to Astro post migration...\n');
  
  // Ensure destination directory exists
  if (!fs.existsSync(ASTRO_POSTS_DIR)) {
    fs.mkdirSync(ASTRO_POSTS_DIR, { recursive: true });
  }
  
  // Get all markdown files from _posts
  const postFiles = fs.readdirSync(JEKYLL_POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .sort();
  
  console.log(`📁 Found ${postFiles.length} posts in _posts/\n`);
  
  const stats: MigrationStats = {
    total: postFiles.length,
    successful: 0,
    withWarnings: 0,
    withErrors: 0,
    hasLiquidTags: 0,
    missingTitle: 0,
    missingDescription: 0,
  };
  
  const results: ValidationResult[] = [];
  
  // Migrate each post
  for (const filename of postFiles) {
    const result = migratePost(filename);
    results.push(result);
    
    if (result.success) {
      stats.successful++;
      if (result.warnings.length > 0) {
        stats.withWarnings++;
      }
      
      // Track specific issues
      if (result.warnings.some(w => w.includes('Liquid'))) {
        stats.hasLiquidTags++;
      }
    } else {
      stats.withErrors++;
      
      if (result.errors.some(e => e.includes('title'))) {
        stats.missingTitle++;
      }
      if (result.errors.some(e => e.includes('description'))) {
        stats.missingDescription++;
      }
    }
  }
  
  // Print summary
  console.log('📊 Migration Summary');
  console.log('='.repeat(50));
  console.log(`Total posts:           ${stats.total}`);
  console.log(`✅ Successfully copied: ${stats.successful}`);
  console.log(`⚠️  With warnings:      ${stats.withWarnings}`);
  console.log(`❌ With errors:         ${stats.withErrors}`);
  console.log(`🔧 Has Liquid tags:     ${stats.hasLiquidTags}`);
  console.log(`📝 Missing title:       ${stats.missingTitle}`);
  console.log(`📝 Missing description: ${stats.missingDescription}`);
  console.log('='.repeat(50));
  console.log();
  
  // Print posts with errors
  const errored = results.filter(r => !r.success);
  if (errored.length > 0) {
    console.log('❌ Posts with errors:');
    for (const result of errored) {
      console.log(`\n  ${result.filename}`);
      for (const error of result.errors) {
        console.log(`    ❌ ${error}`);
      }
    }
    console.log();
  }
  
  // Print posts with warnings
  const warned = results.filter(r => r.success && r.warnings.length > 0);
  if (warned.length > 0) {
    console.log('⚠️  Posts with warnings (still migrated):');
    let count = 0;
    for (const result of warned) {
      if (count >= 10) {
        console.log(`\n  ... and ${warned.length - 10} more posts with warnings`);
        break;
      }
      console.log(`\n  ${result.filename}`);
      for (const warning of result.warnings) {
        console.log(`    ⚠️  ${warning}`);
      }
      count++;
    }
    console.log();
  }
  
  // Print Liquid tag posts
  const liquidPosts = results.filter(r => 
    r.warnings.some(w => w.includes('Liquid'))
  );
  if (liquidPosts.length > 0) {
    console.log('🔧 Posts with Liquid tags (may need manual review):');
    for (const result of liquidPosts) {
      console.log(`  - ${result.filename}`);
    }
    console.log();
  }
  
  console.log('✨ Migration complete!\n');
  
  if (stats.withErrors > 0) {
    console.log('⚠️  Some posts had errors and were not copied.');
    console.log('   Please fix the errors and run the migration again.');
    process.exit(1);
  }
  
  if (stats.hasLiquidTags > 0) {
    console.log('ℹ️  Some posts contain Liquid template tags.');
    console.log('   These posts have been copied but may need manual conversion');
    console.log('   to MDX components. Review the list above.');
  }
  
  console.log('\n📋 Next steps:');
  console.log('   1. Run: npm run astro:check');
  console.log('   2. Run: npm run astro:build');
  console.log('   3. Review posts with Liquid tags for manual conversion');
  console.log('   4. Test in development: npm run astro:dev');
}

main();
