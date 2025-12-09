#!/usr/bin/env tsx
/**
 * Comprehensive parity checker for Jekyll to Astro migration
 * Compares URLs and content between Jekyll (_site) and Astro (dist-astro) builds
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const jekyllDir = path.join(rootDir, '_site');
const astroDir = path.join(rootDir, 'dist-astro');

interface ParityReport {
  jekyllUrls: string[];
  astroUrls: string[];
  matchingUrls: string[];
  jekyllOnly: string[];
  astroOnly: string[];
  totalJekyll: number;
  totalAstro: number;
  totalMatching: number;
  parityPercentage: number;
}

interface FileInfo {
  url: string;
  path: string;
  size: number;
}

/**
 * Recursively get all HTML files in a directory
 */
function getHtmlFiles(dir: string, baseDir: string = dir, urls: FileInfo[] = []): FileInfo[] {
  if (!fs.existsSync(dir)) {
    console.error(`Directory does not exist: ${dir}`);
    return urls;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      // Skip certain directories
      if (['node_modules', '.git', 'assets', '_sass', 'js', 'css'].includes(entry.name)) {
        continue;
      }
      getHtmlFiles(fullPath, baseDir, urls);
    } else if (entry.isFile() && entry.name === 'index.html') {
      // Convert file path to URL
      const relativePath = path.relative(baseDir, fullPath);
      const urlPath = '/' + path.dirname(relativePath).replace(/\\/g, '/') + '/';
      const normalizedUrl = urlPath === '//' ? '/' : urlPath;
      
      const stats = fs.statSync(fullPath);
      urls.push({
        url: normalizedUrl,
        path: fullPath,
        size: stats.size,
      });
    }
  }

  return urls;
}

/**
 * Get all special files (XML, TXT, etc.)
 */
function getSpecialFiles(dir: string): Map<string, FileInfo> {
  const files = new Map<string, FileInfo>();
  
  if (!fs.existsSync(dir)) {
    return files;
  }

  const checkFiles = [
    'feed.xml',
    'sitemap.xml',
    'sitemap-index.xml',
    'robots.txt',
    'humans.txt',
    '.well-known/security.txt',
    'press/feed/index.xml',
    'feed/index.xml',
  ];

  for (const file of checkFiles) {
    const fullPath = path.join(dir, file);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      files.set(file, {
        url: '/' + file,
        path: fullPath,
        size: stats.size,
      });
    }
  }

  return files;
}

/**
 * Compare two sets of URLs
 */
function compareUrls(jekyllFiles: FileInfo[], astroFiles: FileInfo[]): ParityReport {
  const jekyllUrls = jekyllFiles.map(f => f.url).sort();
  const astroUrls = astroFiles.map(f => f.url).sort();
  
  const jekyllSet = new Set(jekyllUrls);
  const astroSet = new Set(astroUrls);
  
  const matchingUrls = jekyllUrls.filter(url => astroSet.has(url));
  const jekyllOnly = jekyllUrls.filter(url => !astroSet.has(url));
  const astroOnly = astroUrls.filter(url => !jekyllSet.has(url));

  const parityPercentage = jekyllUrls.length > 0 
    ? (matchingUrls.length / jekyllUrls.length) * 100 
    : 0;

  return {
    jekyllUrls,
    astroUrls,
    matchingUrls,
    jekyllOnly,
    astroOnly,
    totalJekyll: jekyllUrls.length,
    totalAstro: astroUrls.length,
    totalMatching: matchingUrls.length,
    parityPercentage,
  };
}

/**
 * Categorize URLs
 */
function categorizeUrls(urls: string[]): Record<string, string[]> {
  const categories: Record<string, string[]> = {
    blogPosts: [],
    pages: [],
    feeds: [],
    other: [],
  };

  for (const url of urls) {
    if (/^\/\d{4}\/\d{2}\/\d{2}\//.test(url)) {
      categories.blogPosts.push(url);
    } else if (url.includes('feed') || url.endsWith('.xml')) {
      categories.feeds.push(url);
    } else if (url.match(/^\/(about|contact|resume|press|fine-print|other-recommended-reading)\//)) {
      categories.pages.push(url);
    } else {
      categories.other.push(url);
    }
  }

  return categories;
}

/**
 * Main function
 */
function main() {
  console.log('🔍 Jekyll to Astro Parity Checker\n');
  console.log('=' .repeat(80) + '\n');

  // Check if both directories exist
  if (!fs.existsSync(jekyllDir)) {
    console.error(`❌ Jekyll build directory not found: ${jekyllDir}`);
    console.error('   Run "bundle exec jekyll build" first\n');
    process.exit(1);
  }

  if (!fs.existsSync(astroDir)) {
    console.error(`❌ Astro build directory not found: ${astroDir}`);
    console.error('   Run "npm run astro:build" first\n');
    process.exit(1);
  }

  console.log('📂 Scanning directories...\n');
  
  // Get HTML files
  const jekyllFiles = getHtmlFiles(jekyllDir);
  const astroFiles = getHtmlFiles(astroDir);
  
  console.log(`   Jekyll: ${jekyllFiles.length} HTML pages`);
  console.log(`   Astro:  ${astroFiles.length} HTML pages\n`);

  // Compare URLs
  const htmlReport = compareUrls(jekyllFiles, astroFiles);
  
  console.log('📊 HTML Pages Parity Report\n');
  console.log('=' .repeat(80) + '\n');
  console.log(`Total URLs:`);
  console.log(`   Jekyll: ${htmlReport.totalJekyll}`);
  console.log(`   Astro:  ${htmlReport.totalAstro}`);
  console.log(`   Matching: ${htmlReport.totalMatching} (${htmlReport.parityPercentage.toFixed(1)}%)\n`);

  // Categorize matching URLs
  const matchingCategories = categorizeUrls(htmlReport.matchingUrls);
  console.log('✅ Matching URLs by Category:\n');
  console.log(`   Blog Posts: ${matchingCategories.blogPosts.length}`);
  console.log(`   Pages: ${matchingCategories.pages.length}`);
  console.log(`   Feeds: ${matchingCategories.feeds.length}`);
  console.log(`   Other: ${matchingCategories.other.length}\n`);

  // Jekyll-only URLs
  if (htmlReport.jekyllOnly.length > 0) {
    console.log(`⚠️  URLs only in Jekyll (${htmlReport.jekyllOnly.length}):\n`);
    const jekyllCategories = categorizeUrls(htmlReport.jekyllOnly);
    
    if (jekyllCategories.blogPosts.length > 0) {
      console.log(`   Blog Posts (${jekyllCategories.blogPosts.length}):`);
      for (const url of jekyllCategories.blogPosts.slice(0, 10)) {
        console.log(`      ${url}`);
      }
      if (jekyllCategories.blogPosts.length > 10) {
        console.log(`      ... and ${jekyllCategories.blogPosts.length - 10} more`);
      }
      console.log();
    }
    
    if (jekyllCategories.pages.length > 0) {
      console.log(`   Pages (${jekyllCategories.pages.length}):`);
      for (const url of jekyllCategories.pages) {
        console.log(`      ${url}`);
      }
      console.log();
    }
    
    if (jekyllCategories.other.length > 0) {
      console.log(`   Other (${jekyllCategories.other.length}):`);
      for (const url of jekyllCategories.other.slice(0, 20)) {
        console.log(`      ${url}`);
      }
      if (jekyllCategories.other.length > 20) {
        console.log(`      ... and ${jekyllCategories.other.length - 20} more`);
      }
      console.log();
    }
  }

  // Astro-only URLs
  if (htmlReport.astroOnly.length > 0) {
    console.log(`ℹ️  URLs only in Astro (${htmlReport.astroOnly.length}):\n`);
    const astroCategories = categorizeUrls(htmlReport.astroOnly);
    
    if (astroCategories.blogPosts.length > 0) {
      console.log(`   Blog Posts (${astroCategories.blogPosts.length}):`);
      for (const url of astroCategories.blogPosts.slice(0, 10)) {
        console.log(`      ${url}`);
      }
      if (astroCategories.blogPosts.length > 10) {
        console.log(`      ... and ${astroCategories.blogPosts.length - 10} more`);
      }
      console.log();
    }
    
    if (astroCategories.other.length > 0) {
      console.log(`   Other (${astroCategories.other.length}):`);
      for (const url of astroCategories.other.slice(0, 20)) {
        console.log(`      ${url}`);
      }
      if (astroCategories.other.length > 20) {
        console.log(`      ... and ${astroCategories.other.length - 20} more`);
      }
      console.log();
    }
  }

  // Check special files
  console.log('=' .repeat(80) + '\n');
  console.log('🔍 Special Files Check\n');
  console.log('=' .repeat(80) + '\n');
  
  const jekyllSpecial = getSpecialFiles(jekyllDir);
  const astroSpecial = getSpecialFiles(astroDir);
  
  const specialFiles = new Set([...jekyllSpecial.keys(), ...astroSpecial.keys()]);
  
  for (const file of Array.from(specialFiles).sort()) {
    const inJekyll = jekyllSpecial.has(file);
    const inAstro = astroSpecial.has(file);
    
    if (inJekyll && inAstro) {
      const jekyllSize = jekyllSpecial.get(file)!.size;
      const astroSize = astroSpecial.get(file)!.size;
      const sizeDiff = Math.abs(jekyllSize - astroSize);
      const sizePercent = jekyllSize > 0 ? (sizeDiff / jekyllSize) * 100 : 0;
      
      if (sizePercent > 50) {
        console.log(`⚠️  ${file}`);
        console.log(`    Jekyll: ${jekyllSize} bytes, Astro: ${astroSize} bytes (${sizePercent.toFixed(1)}% diff)`);
      } else {
        console.log(`✅ ${file} (Jekyll: ${jekyllSize}b, Astro: ${astroSize}b)`);
      }
    } else if (inJekyll) {
      console.log(`⚠️  ${file} - Only in Jekyll`);
    } else {
      console.log(`ℹ️  ${file} - Only in Astro (new)`);
    }
  }
  
  console.log('\n' + '=' .repeat(80) + '\n');
  console.log('📝 Summary\n');
  console.log('=' .repeat(80) + '\n');
  
  if (htmlReport.parityPercentage >= 99) {
    console.log('✅ Excellent parity! URLs match between Jekyll and Astro.\n');
  } else if (htmlReport.parityPercentage >= 95) {
    console.log('✅ Good parity with minor differences.\n');
  } else {
    console.log('⚠️  Significant differences found. Review the reports above.\n');
  }
  
  // Final recommendations
  console.log('📋 Next Steps:\n');
  if (htmlReport.jekyllOnly.length > 0) {
    console.log('   1. Review Jekyll-only URLs to determine if they should be in Astro');
  }
  if (htmlReport.astroOnly.length > 0) {
    console.log('   2. Review Astro-only URLs (redirects, new pages)');
  }
  console.log('   3. Validate special files (feeds, sitemap, robots.txt)');
  console.log('   4. Test key URLs manually in both builds');
  console.log('   5. Run content comparison on matching URLs\n');
  
  // Save detailed report
  const reportPath = path.join(rootDir, 'parity-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    html: htmlReport,
    specialFiles: {
      jekyll: Array.from(jekyllSpecial.keys()),
      astro: Array.from(astroSpecial.keys()),
    },
  }, null, 2));
  
  console.log(`📄 Detailed report saved to: ${reportPath}\n`);
}

main();
