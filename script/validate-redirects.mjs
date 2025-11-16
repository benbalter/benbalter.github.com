#!/usr/bin/env node

/**
 * Validate all redirect pages in the build output
 * 
 * This script verifies that:
 * - All expected redirect pages exist in the out/ directory
 * - Each redirect page has the correct destination URL
 * - The redirect HTML is properly formatted
 * - No redirect chains exist
 * - All destination pages exist in the build
 * 
 * Run this after `next build` to verify redirect integrity.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * ANSI color codes for output
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

/**
 * Extract date and slug from filename
 */
function parsePostFilename(filename) {
  const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
  if (!match) return null;
  
  return {
    year: match[1],
    month: match[2],
    day: match[3],
    slug: match[4],
    permalink: `/${match[1]}/${match[2]}/${match[3]}/${match[4]}/`
  };
}

/**
 * Scan content directories for redirect directives
 */
function findExpectedRedirects() {
  const redirects = [];
  
  // Helper to process a file and extract redirects
  function processFile(filepath, destination) {
    try {
      const content = fs.readFileSync(filepath, 'utf-8');
      const { data: frontmatter } = matter(content);
      
      if (!frontmatter) return;
      
      // Handle redirect_from (both regular and legacy)
      const redirectFromField = frontmatter.redirect_from || frontmatter._legacy_redirect_from;
      if (redirectFromField) {
        const sources = Array.isArray(redirectFromField) 
          ? redirectFromField 
          : [redirectFromField];
        
        sources.forEach(source => {
          if (source && source.trim()) {
            redirects.push({ 
              source: source.trim(), 
              destination, 
              type: 'redirect_from',
              file: filepath 
            });
          }
        });
      }
      
      // Handle redirect_to
      if (frontmatter.redirect_to) {
        redirects.push({ 
          source: destination, 
          destination: frontmatter.redirect_to.trim(), 
          type: 'redirect_to',
          file: filepath
        });
      }
    } catch (error) {
      console.warn(`${colors.yellow}Warning: Failed to process ${filepath}:${colors.reset}`, error.message);
    }
  }
  
  // Scan _posts directory (legacy Jekyll location)
  const postsDir = path.join(process.cwd(), '_posts');
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir);
    
    files.forEach(filename => {
      if (!filename.endsWith('.md')) return;
      
      const parsed = parsePostFilename(filename);
      if (!parsed) return;
      
      const filepath = path.join(postsDir, filename);
      processFile(filepath, parsed.permalink);
    });
  }
  
  // Scan content/posts directory (Next.js migration location)
  const contentPostsDir = path.join(process.cwd(), 'content', 'posts');
  if (fs.existsSync(contentPostsDir)) {
    const files = fs.readdirSync(contentPostsDir);
    
    files.forEach(filename => {
      if (!filename.endsWith('.md')) return;
      
      const parsed = parsePostFilename(filename);
      if (!parsed) return;
      
      const filepath = path.join(contentPostsDir, filename);
      processFile(filepath, parsed.permalink);
    });
  }
  
  // Scan root directory for pages
  const rootFiles = fs.readdirSync(process.cwd());
  rootFiles.forEach(filename => {
    if (!filename.endsWith('.md') && !filename.endsWith('.html')) return;
    if (filename.startsWith('_')) return;
    
    const filepath = path.join(process.cwd(), filename);
    const content = fs.readFileSync(filepath, 'utf-8');
    const { data: frontmatter } = matter(content);
    
    if (!frontmatter) return;
    
    // Get destination from permalink or filename
    const destination = frontmatter.permalink || `/${filename.replace(/\.(md|html)$/, '')}/`;
    processFile(filepath, destination);
  });
  
  // Scan content/pages directory
  const contentPagesDir = path.join(process.cwd(), 'content', 'pages');
  if (fs.existsSync(contentPagesDir)) {
    const files = fs.readdirSync(contentPagesDir);
    
    files.forEach(filename => {
      if (!filename.endsWith('.md') && !filename.endsWith('.html')) return;
      
      const filepath = path.join(contentPagesDir, filename);
      const content = fs.readFileSync(filepath, 'utf-8');
      const { data: frontmatter } = matter(content);
      
      if (!frontmatter) return;
      
      // Get destination from permalink or filename
      const destination = frontmatter.permalink || frontmatter._legacy_permalink || `/${filename.replace(/\.(md|html)$/, '')}/`;
      processFile(filepath, destination);
    });
  }
  
  return redirects;
}

/**
 * Check if a redirect HTML file exists and is valid
 */
function validateRedirectFile(source, expectedDestination) {
  const outDir = path.join(process.cwd(), 'out');
  
  // Normalize source path
  const sourcePath = source.endsWith('/') ? source.slice(0, -1) : source;
  const filePath = path.join(outDir, sourcePath, 'index.html');
  
  if (!fs.existsSync(filePath)) {
    return {
      valid: false,
      error: 'Redirect file does not exist'
    };
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for meta refresh
    const metaRefreshMatch = content.match(/meta http-equiv="refresh" content="0; url=([^"]+)"/);
    if (!metaRefreshMatch) {
      return {
        valid: false,
        error: 'Missing meta refresh tag'
      };
    }
    
    const metaDestination = metaRefreshMatch[1];
    
    // Check for JavaScript redirect
    const jsRedirectMatch = content.match(/window\.location\.replace\("([^"]+)"\)/);
    if (!jsRedirectMatch) {
      return {
        valid: false,
        error: 'Missing JavaScript redirect'
      };
    }
    
    const jsDestination = jsRedirectMatch[1];
    
    // Check destinations match
    if (metaDestination !== expectedDestination || jsDestination !== expectedDestination) {
      return {
        valid: false,
        error: `Destination mismatch. Expected: ${expectedDestination}, Meta: ${metaDestination}, JS: ${jsDestination}`
      };
    }
    
    // Check for canonical link
    if (!content.includes('<link rel="canonical"')) {
      return {
        valid: false,
        error: 'Missing canonical link'
      };
    }
    
    // Check for noindex
    if (!content.includes('<meta name="robots" content="noindex">')) {
      return {
        valid: false,
        error: 'Missing noindex meta tag'
      };
    }
    
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: `Failed to read/parse redirect file: ${error.message}`
    };
  }
}

/**
 * Check if destination page exists in build
 */
function checkDestinationExists(destination) {
  // External URLs always "exist"
  if (destination.startsWith('http://') || destination.startsWith('https://')) {
    return true;
  }
  
  const outDir = path.join(process.cwd(), 'out');
  const destPath = destination.endsWith('/') ? destination.slice(0, -1) : destination;
  const filePath = path.join(outDir, destPath, 'index.html');
  
  return fs.existsSync(filePath);
}

/**
 * Check for redirect chains
 */
function findRedirectChains(redirects) {
  const chains = [];
  const redirectMap = new Map();
  
  // Build redirect map
  redirects.forEach(r => {
    redirectMap.set(r.source, r.destination);
  });
  
  // Check each redirect
  redirects.forEach(redirect => {
    const { source, destination } = redirect;
    const chain = [source];
    const visited = new Set([source]);
    let current = destination;
    
    // Follow the chain
    while (redirectMap.has(current) && !visited.has(current)) {
      chain.push(current);
      visited.add(current);
      current = redirectMap.get(current);
    }
    
    // If we found a chain (more than just source -> destination)
    if (chain.length > 1) {
      chain.push(current);
      chains.push(chain);
    }
  });
  
  return chains;
}

/**
 * Main validation function
 */
function validateRedirects() {
  console.log(`${colors.blue}🔍 Validating redirect pages...${colors.reset}\n`);
  
  const outDir = path.join(process.cwd(), 'out');
  
  // Check if out directory exists
  if (!fs.existsSync(outDir)) {
    console.error(`${colors.red}Error: Output directory not found. Please run 'next build' first.${colors.reset}`);
    process.exit(1);
  }
  
  const expectedRedirects = findExpectedRedirects();
  
  if (expectedRedirects.length === 0) {
    console.log(`${colors.yellow}⚠️  No redirects found in content files.${colors.reset}`);
    return;
  }
  
  console.log(`Found ${expectedRedirects.length} expected redirects\n`);
  
  let validCount = 0;
  let errorCount = 0;
  const errors = [];
  
  // Validate each redirect
  expectedRedirects.forEach(({ source, destination, type, file }) => {
    const result = validateRedirectFile(source, destination);
    
    if (result.valid) {
      // Check if destination exists (for internal redirects)
      const destExists = checkDestinationExists(destination);
      
      if (!destExists) {
        errorCount++;
        errors.push({
          source,
          destination,
          error: 'Destination page does not exist in build'
        });
        console.log(`${colors.red}✗${colors.reset} ${source} → ${destination}`);
        console.log(`  ${colors.red}Error: Destination page does not exist${colors.reset}`);
      } else {
        validCount++;
        const icon = type === 'redirect_to' ? '🔗' : '↪️';
        console.log(`${colors.green}✓${colors.reset} ${icon} ${source} → ${destination}`);
      }
    } else {
      errorCount++;
      errors.push({
        source,
        destination,
        error: result.error
      });
      console.log(`${colors.red}✗${colors.reset} ${source} → ${destination}`);
      console.log(`  ${colors.red}Error: ${result.error}${colors.reset}`);
    }
  });
  
  // Check for redirect chains
  console.log(`\n${colors.blue}🔗 Checking for redirect chains...${colors.reset}\n`);
  const chains = findRedirectChains(expectedRedirects);
  
  if (chains.length === 0) {
    console.log(`${colors.green}✓ No redirect chains found${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠️  Found ${chains.length} redirect chain(s):${colors.reset}`);
    chains.forEach(chain => {
      console.log(`  ${chain.join(' → ')}`);
    });
  }
  
  // Summary
  console.log(`\n${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.blue}Summary${colors.reset}`);
  console.log(`${colors.blue}═══════════════════════════════════════${colors.reset}`);
  console.log(`Total redirects: ${expectedRedirects.length}`);
  console.log(`${colors.green}Valid: ${validCount}${colors.reset}`);
  console.log(`${colors.red}Errors: ${errorCount}${colors.reset}`);
  console.log(`Redirect chains: ${chains.length}`);
  
  if (errorCount > 0) {
    console.log(`\n${colors.red}❌ Validation failed with ${errorCount} error(s)${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}✅ All redirects are valid!${colors.reset}`);
  }
}

// Run the validation
validateRedirects();
