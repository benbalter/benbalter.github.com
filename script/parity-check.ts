#!/usr/bin/env tsx

/**
 * Comprehensive parity check between Jekyll and Astro sites
 * Compares URLs, content, and functionality to ensure migration completeness
 */

import {readFileSync, existsSync, readdirSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';

interface ParityReport {
  timestamp: string;
  jekyllPageCount: number;
  astroPageCount: number;
  urlParity: {
    jekyllOnlyUrls: string[];
    astroOnlyUrls: string[];
    commonUrls: string[];
  };
  contentChecks: {
    url: string;
    jekyllPath: string;
    astroPath: string;
    titleMatch: boolean;
    descriptionPresent: boolean;
    headingsMatch: boolean;
    issues: string[];
  }[];
  feedChecks: {
    jekyllFeedExists: boolean;
    astroFeedExists: boolean;
    jekyllPressFeedExists: boolean;
    astroPressFeedExists: boolean;
  };
  sitemapChecks: {
    jekyllSitemapExists: boolean;
    astroSitemapExists: boolean;
  };
  staticFileChecks: {
    file: string;
    jekyllExists: boolean;
    astroExists: boolean;
  }[];
  summary: {
    totalIssues: number;
    criticalIssues: string[];
    warnings: string[];
    recommendations: string[];
  };
}

const JEKYLL_SITE = '_site';
const ASTRO_SITE = 'dist-astro';

// Files that should exist in both sites
const STATIC_FILES_TO_CHECK = [
  'robots.txt',
  'humans.txt',
  'security.txt',
  '.well-known/security.txt',
  'browserconfig.xml',
  'site.webmanifest',
  'feed.xml',
  'sitemap.xml',
];

function getAllHtmlFiles(dir: string, baseDir = dir): string[] {
  const files: string[] = [];
  
  try {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip certain directories
        if (entry === 'assets' || entry === 'wp-content' || entry === 'vendor' || entry === 'node_modules') {
          continue;
        }
        
        files.push(...getAllHtmlFiles(fullPath, baseDir));
      } else if (entry.endsWith('.html')) {
        // Get relative path from base directory
        const relativePath = relative(baseDir, fullPath);
        files.push(relativePath);
      }
    }
  } catch (error) {
    // Directory doesn't exist or can't be read
  }
  
  return files;
}

function htmlPathToUrl(htmlPath: string): string {
  // Convert "2024/01/30/post-slug/index.html" to "/2024/01/30/post-slug/"
  // Convert "about/index.html" to "/about/"
  // Convert "404.html" to "/404.html"
  
  let url = htmlPath;
  
  // Replace backslashes with forward slashes (Windows compatibility)
  url = url.replace(/\\/g, '/');
  
  // Remove index.html
  url = url.replace(/\/index\.html$/, '/');
  
  // For files not ending in index.html, keep as is (like 404.html)
  if (!url.endsWith('/') && !url.endsWith('.html')) {
    url += '/';
  }
  
  // Ensure leading slash
  if (!url.startsWith('/')) {
    url = '/' + url;
  }
  
  return url;
}

function extractTitleFromHtml(html: string): string | null {
  const titleMatch = /<title[^>]*>(.*?)<\/title>/i.exec(html);
  return titleMatch ? titleMatch[1].trim() : null;
}

function extractMetaDescription(html: string): string | null {
  const descMatch = /<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i.exec(html);
  return descMatch ? descMatch[1].trim() : null;
}

function extractHeadings(html: string): string[] {
  const headings: string[] = [];
  const h1Match = /<h1[^>]*>(.*?)<\/h1>/gi;
  let match;
  
  while ((match = h1Match.exec(html)) !== null) {
    headings.push(match[1].replace(/<[^>]*>/g, '').trim());
  }
  
  return headings;
}

function checkContentParity(jekyllPath: string, astroPath: string, url: string): ParityReport['contentChecks'][0] {
  const result = {
    url,
    jekyllPath,
    astroPath,
    titleMatch: false,
    descriptionPresent: false,
    headingsMatch: false,
    issues: [] as string[],
  };
  
  try {
    const jekyllHtml = readFileSync(join(JEKYLL_SITE, jekyllPath), 'utf8');
    const astroHtml = readFileSync(join(ASTRO_SITE, astroPath), 'utf8');
    
    // Check titles
    const jekyllTitle = extractTitleFromHtml(jekyllHtml);
    const astroTitle = extractTitleFromHtml(astroHtml);
    
    if (jekyllTitle && astroTitle) {
      // Normalize titles for comparison (remove site name suffix)
      const normalizeTitle = (t: string) => t.replace(/\s*[|–-]\s*Ben Balter\s*$/i, '').trim();
      result.titleMatch = normalizeTitle(jekyllTitle) === normalizeTitle(astroTitle);
      
      if (!result.titleMatch) {
        result.issues.push(`Title mismatch: Jekyll="${jekyllTitle}" vs Astro="${astroTitle}"`);
      }
    } else {
      result.issues.push('Missing title in one or both versions');
    }
    
    // Check meta description
    const astroDesc = extractMetaDescription(astroHtml);
    result.descriptionPresent = Boolean(astroDesc);
    
    if (!result.descriptionPresent) {
      result.issues.push('Missing meta description in Astro version');
    }
    
    // Check main headings
    const jekyllHeadings = extractHeadings(jekyllHtml);
    const astroHeadings = extractHeadings(astroHtml);
    
    result.headingsMatch = jekyllHeadings.length > 0 && 
                          astroHeadings.length > 0 &&
                          jekyllHeadings[0] === astroHeadings[0];
    
    if (!result.headingsMatch && jekyllHeadings.length > 0 && astroHeadings.length > 0) {
      result.issues.push(`Main heading mismatch: Jekyll="${jekyllHeadings[0]}" vs Astro="${astroHeadings[0]}"`);
    }
  } catch (error) {
    result.issues.push(`Error reading files: ${error}`);
  }
  
  return result;
}

function generateReport(): ParityReport {
  console.log('🔍 Starting comprehensive parity check...\n');
  
  // Get all HTML files from both sites
  console.log('📄 Scanning HTML files...');
  const jekyllHtmlFiles = getAllHtmlFiles(JEKYLL_SITE);
  const astroHtmlFiles = getAllHtmlFiles(ASTRO_SITE);
  
  console.log(`  Jekyll: ${jekyllHtmlFiles.length} HTML files`);
  console.log(`  Astro: ${astroHtmlFiles.length} HTML files\n`);
  
  // Convert to URLs
  const jekyllUrls = new Set(jekyllHtmlFiles.map(f => htmlPathToUrl(f)));
  const astroUrls = new Set(astroHtmlFiles.map(f => htmlPathToUrl(f)));
  
  // Find differences
  const jekyllOnlyUrls = [...jekyllUrls].filter(url => !astroUrls.has(url));
  const astroOnlyUrls = [...astroUrls].filter(url => !jekyllUrls.has(url));
  const commonUrls = [...jekyllUrls].filter(url => astroUrls.has(url));
  
  console.log('🔗 URL Comparison:');
  console.log(`  Common URLs: ${commonUrls.length}`);
  console.log(`  Jekyll-only URLs: ${jekyllOnlyUrls.length}`);
  console.log(`  Astro-only URLs: ${astroOnlyUrls.length}\n`);
  
  // Sample content checks on blog posts
  console.log('📝 Checking content parity (sampling 10 posts)...');
  const contentChecks: ParityReport['contentChecks'] = [];
  const blogPostUrls = commonUrls.filter(url => /\/\d{4}\/\d{2}\/\d{2}\//.test(url));
  const sampleUrls = blogPostUrls.slice(0, 10);
  
  for (const url of sampleUrls) {
    const jekyllPath = jekyllHtmlFiles.find(f => htmlPathToUrl(f) === url);
    const astroPath = astroHtmlFiles.find(f => htmlPathToUrl(f) === url);
    
    if (jekyllPath && astroPath) {
      const check = checkContentParity(jekyllPath, astroPath, url);
      contentChecks.push(check);
      
      const status = check.issues.length === 0 ? '✅' : '⚠️';
      console.log(`  ${status} ${url}`);
    }
  }
  
  console.log();
  
  // Check feeds
  console.log('📡 Checking feeds...');
  const feedChecks = {
    jekyllFeedExists: existsSync(join(JEKYLL_SITE, 'feed.xml')),
    astroFeedExists: existsSync(join(ASTRO_SITE, 'feed.xml')),
    jekyllPressFeedExists: existsSync(join(JEKYLL_SITE, 'press/feed/index.xml')),
    astroPressFeedExists: existsSync(join(ASTRO_SITE, 'press/feed/index.xml')),
  };
  
  console.log(`  Main feed - Jekyll: ${feedChecks.jekyllFeedExists ? '✅' : '❌'}, Astro: ${feedChecks.astroFeedExists ? '✅' : '❌'}`);
  console.log(`  Press feed - Jekyll: ${feedChecks.jekyllPressFeedExists ? '✅' : '❌'}, Astro: ${feedChecks.astroPressFeedExists ? '✅' : '❌'}\n`);
  
  // Check sitemaps
  console.log('🗺️  Checking sitemaps...');
  const sitemapChecks = {
    jekyllSitemapExists: existsSync(join(JEKYLL_SITE, 'sitemap.xml')),
    astroSitemapExists: existsSync(join(ASTRO_SITE, 'sitemap-0.xml')) || existsSync(join(ASTRO_SITE, 'sitemap.xml')),
  };
  
  console.log(`  Sitemap - Jekyll: ${sitemapChecks.jekyllSitemapExists ? '✅' : '❌'}, Astro: ${sitemapChecks.astroSitemapExists ? '✅' : '❌'}\n`);
  
  // Check static files
  console.log('📋 Checking static files...');
  const staticFileChecks = STATIC_FILES_TO_CHECK.map(file => ({
    file,
    jekyllExists: existsSync(join(JEKYLL_SITE, file)),
    astroExists: existsSync(join(ASTRO_SITE, file)),
  }));
  
  for (const check of staticFileChecks) {
    const status = check.jekyllExists && check.astroExists ? '✅' : 
                   check.astroExists ? '⚠️' : '❌';
    console.log(`  ${status} ${check.file} - Jekyll: ${check.jekyllExists ? '✅' : '❌'}, Astro: ${check.astroExists ? '✅' : '❌'}`);
  }
  
  console.log();
  
  // Generate summary
  const criticalIssues: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // Critical: Missing feeds or sitemap
  if (!feedChecks.astroFeedExists) {
    criticalIssues.push('Main RSS feed missing in Astro site');
  }
  
  if (!feedChecks.astroPressFeedExists) {
    criticalIssues.push('Press RSS feed missing in Astro site');
  }
  
  if (!sitemapChecks.astroSitemapExists) {
    criticalIssues.push('Sitemap missing in Astro site');
  }
  
  // Critical: Large URL differences
  if (jekyllOnlyUrls.length > 50) {
    criticalIssues.push(`${jekyllOnlyUrls.length} URLs only in Jekyll - possible missing pages in Astro`);
  }
  
  // Warnings: Content issues
  const contentIssueCount = contentChecks.filter(c => c.issues.length > 0).length;
  if (contentIssueCount > 0) {
    warnings.push(`${contentIssueCount} of ${contentChecks.length} sampled posts have content differences`);
  }
  
  // Warnings: Missing static files
  const missingStaticFiles = staticFileChecks.filter(c => c.jekyllExists && !c.astroExists);
  if (missingStaticFiles.length > 0) {
    warnings.push(`${missingStaticFiles.length} static files missing in Astro: ${missingStaticFiles.map(f => f.file).join(', ')}`);
  }
  
  // Recommendations
  if (astroOnlyUrls.length > 0) {
    recommendations.push(`Astro has ${astroOnlyUrls.length} additional URLs - verify these are intentional (e.g., redirect pages)`);
  }
  
  if (jekyllOnlyUrls.length > 0 && jekyllOnlyUrls.length < 50) {
    recommendations.push(`Review ${jekyllOnlyUrls.length} Jekyll-only URLs to determine if they should be in Astro`);
  }
  
  const report: ParityReport = {
    timestamp: new Date().toISOString(),
    jekyllPageCount: jekyllHtmlFiles.length,
    astroPageCount: astroHtmlFiles.length,
    urlParity: {
      jekyllOnlyUrls: jekyllOnlyUrls.sort(),
      astroOnlyUrls: astroOnlyUrls.sort(),
      commonUrls: commonUrls.sort(),
    },
    contentChecks,
    feedChecks,
    sitemapChecks,
    staticFileChecks,
    summary: {
      totalIssues: criticalIssues.length + warnings.length,
      criticalIssues,
      warnings,
      recommendations,
    },
  };
  
  return report;
}

function printSummary(report: ParityReport): void {
  console.log('\n' + '='.repeat(80));
  console.log('📊 PARITY CHECK SUMMARY');
  console.log('='.repeat(80) + '\n');
  
  console.log(`Timestamp: ${report.timestamp}\n`);
  
  console.log('📈 Page Counts:');
  console.log(`  Jekyll: ${report.jekyllPageCount} HTML files`);
  console.log(`  Astro: ${report.astroPageCount} HTML files`);
  console.log(`  Difference: ${report.jekyllPageCount - report.astroPageCount}\n`);
  
  console.log('🔗 URL Parity:');
  console.log(`  Common URLs: ${report.urlParity.commonUrls.length}`);
  console.log(`  Jekyll-only: ${report.urlParity.jekyllOnlyUrls.length}`);
  console.log(`  Astro-only: ${report.urlParity.astroOnlyUrls.length}\n`);
  
  if (report.summary.criticalIssues.length > 0) {
    console.log('🚨 CRITICAL ISSUES:');
    for (const issue of report.summary.criticalIssues) {
      console.log(`  ❌ ${issue}`);
    }
    console.log();
  }
  
  if (report.summary.warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    for (const warning of report.summary.warnings) {
      console.log(`  ⚠️  ${warning}`);
    }
    console.log();
  }
  
  if (report.summary.recommendations.length > 0) {
    console.log('💡 RECOMMENDATIONS:');
    for (const rec of report.summary.recommendations) {
      console.log(`  💡 ${rec}`);
    }
    console.log();
  }
  
  if (report.summary.totalIssues === 0) {
    console.log('✅ No critical issues or warnings found!\n');
    console.log('🎉 Sites are ready for cutover!\n');
  } else {
    console.log(`📝 Total issues found: ${report.summary.totalIssues}\n`);
    console.log('⚠️  Please address issues before cutover.\n');
  }
  
  console.log('='.repeat(80) + '\n');
}

function saveReport(report: ParityReport): void {
  const reportPath = join(process.cwd(), 'PARITY_REPORT.json');
  import('fs').then(fs => {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}\n`);
  });
}

// Main execution
try {
  const report = generateReport();
  printSummary(report);
  saveReport(report);
  
  // Exit with error code if there are critical issues
  if (report.summary.criticalIssues.length > 0) {
    process.exit(1);
  }
} catch (error) {
  console.error('❌ Error running parity check:', error);
  process.exit(1);
}
