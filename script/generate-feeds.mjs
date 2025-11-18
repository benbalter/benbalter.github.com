#!/usr/bin/env node

/**
 * Generate static RSS feeds for Next.js static export
 * 
 * This script generates:
 * - RSS feed for blog posts (feed.xml)
 * - Sitemap (sitemap.xml)
 * - Sitemap index (sitemap_index.xml)
 * 
 * Note: Press feed (press/feed/index.xml) is excluded from Next.js build
 * and remains available only in the Jekyll build.
 * 
 * Run this after `next build` to add these files to the output directory.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the generator functions
async function generateFeeds() {
  // Dynamic imports to use the TypeScript modules
  const { generatePostsFeed } = await import('../lib/rss.ts');
  const { generateSitemap, generateSitemapIndex } = await import('../lib/sitemap.ts');
  
  const outDir = path.join(process.cwd(), 'out');
  
  // Check if out directory exists
  if (!fs.existsSync(outDir)) {
    console.error('❌ Error: Output directory not found. Please run `next build` first.');
    process.exit(1);
  }
  
  console.log('🔧 Generating RSS feeds...\n');
  
  let hasErrors = false;
  
  // Generate blog posts RSS feed
  try {
    const postsFeed = generatePostsFeed();
    const feedPath = path.join(outDir, 'feed.xml');
    fs.writeFileSync(feedPath, postsFeed, 'utf-8');
    console.log('✅ Generated feed.xml');
  } catch (error) {
    console.error('❌ Error generating posts feed:', error);
    hasErrors = true;
  }
  
  // Press feed is excluded from Next.js build
  // It remains available in the Jekyll build
  
  if (hasErrors) {
    console.log('\n⚠️  Some feeds failed to generate. Check errors above.');
    process.exit(1);
  }
  
  console.log('\n🎉 Done! All feeds generated successfully.');
}

// Run the generator
generateFeeds().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
