#!/usr/bin/env node

/**
 * Generate static HTML redirect pages for GitHub Pages
 * 
 * Since Next.js with output: 'export' doesn't support server-side redirects,
 * we create static HTML files that use meta refresh and JavaScript redirects.
 * 
 * This script reads redirect_from and redirect_to directives from YAML frontmatter
 * in content files and generates appropriate redirect pages.
 * 
 * This script should be run after `next build` to add redirect pages to the output.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
 * Optimized to read each directory only once
 */
function findRedirects() {
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
            redirects.push({ source: source.trim(), destination, type: 'redirect_from' });
          }
        });
      }
      
      // Handle redirect_to
      if (frontmatter.redirect_to) {
        redirects.push({ 
          source: destination, 
          destination: frontmatter.redirect_to.trim(), 
          type: 'redirect_to' 
        });
      }
    } catch (error) {
      console.warn(`Warning: Failed to process ${filepath}:`, error.message);
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
 * Create an HTML redirect page
 */
function createRedirectHTML(destination, source) {
  const isExternal = destination.startsWith('http://') || destination.startsWith('https://');
  const destinationURL = isExternal ? destination : `https://ben.balter.com${destination}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Redirecting...</title>
  <meta http-equiv="refresh" content="0; url=${destination}">
  <link rel="canonical" href="${destinationURL}">
  <meta name="robots" content="noindex">
  <script>
    // Immediate redirect
    window.location.replace("${destination}");
  </script>
</head>
<body>
  <h1>Redirecting...</h1>
  <p>This page has moved to <a href="${destination}">${destination}</a>.</p>
  <p>If you are not redirected automatically, please click the link above.</p>
</body>
</html>`;
}

/**
 * Generate redirect pages in the output directory
 */
function generateRedirectPages() {
  const outDir = path.join(process.cwd(), 'out');
  
  // Check if out directory exists
  if (!fs.existsSync(outDir)) {
    console.error('Error: Output directory not found. Please run `next build` first.');
    process.exit(1);
  }
  
  console.log('🔍 Scanning for redirects in content files...\n');
  const redirects = findRedirects();
  
  if (redirects.length === 0) {
    console.log('⚠️  No redirects found in content files.');
    return;
  }
  
  console.log(`Found ${redirects.length} redirects\n`);
  
  let count = 0;
  
  redirects.forEach(({ source, destination, type }) => {
    // Normalize source path - remove trailing slash for directory creation
    const sourcePath = source.endsWith('/') ? source.slice(0, -1) : source;
    const fullPath = path.join(outDir, sourcePath);
    
    // Create directory structure
    fs.mkdirSync(fullPath, { recursive: true });
    
    // Write redirect HTML
    const htmlPath = path.join(fullPath, 'index.html');
    fs.writeFileSync(htmlPath, createRedirectHTML(destination, source));
    
    const icon = type === 'redirect_to' ? '🔗' : '↪️';
    console.log(`${icon} ${source} → ${destination}`);
    count++;
  });
  
  console.log(`\n✅ Generated ${count} redirect pages`);
}

// Run the script
generateRedirectPages();
