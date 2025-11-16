#!/usr/bin/env node

/**
 * Generate static RSS feeds and sitemap for Next.js static export
 * 
 * This script generates:
 * - RSS feed for blog posts (feed.xml)
 * - RSS feed for press clips (press/feed/index.xml)
 * - Sitemap (sitemap.xml)
 * - Sitemap index (sitemap_index.xml)
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
  const { generatePostsFeed, generatePressFeed } = await import('../lib/rss.ts');
  const { generateSitemap, generateSitemapIndex } = await import('../lib/sitemap.ts');
  
  const outDir = path.join(process.cwd(), 'out');
  
  // Check if out directory exists
  if (!fs.existsSync(outDir)) {
    console.error('❌ Error: Output directory not found. Please run `next build` first.');
    process.exit(1);
  }
  
  console.log('🔧 Generating RSS feeds and sitemap...\n');
  
  // Generate blog posts RSS feed
  try {
    const postsFeed = generatePostsFeed();
    const feedPath = path.join(outDir, 'feed.xml');
    fs.writeFileSync(feedPath, postsFeed, 'utf-8');
    console.log('✅ Generated feed.xml');
  } catch (error) {
    console.error('❌ Error generating posts feed:', error);
  }
  
  // Generate press clips RSS feed
  try {
    const pressFeed = generatePressFeed();
    const pressFeedDir = path.join(outDir, 'press', 'feed');
    fs.mkdirSync(pressFeedDir, { recursive: true });
    const pressFeedPath = path.join(pressFeedDir, 'index.xml');
    fs.writeFileSync(pressFeedPath, pressFeed, 'utf-8');
    console.log('✅ Generated press/feed/index.xml');
  } catch (error) {
    console.error('❌ Error generating press feed:', error);
  }
  
  // Generate sitemap
  try {
    const sitemap = await generateSitemap();
    const sitemapPath = path.join(outDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf-8');
    console.log('✅ Generated sitemap.xml');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
  
  // Generate sitemap index (for compatibility)
  try {
    const sitemapIndex = await generateSitemapIndex();
    const sitemapIndexPath = path.join(outDir, 'sitemap_index.xml');
    fs.writeFileSync(sitemapIndexPath, sitemapIndex, 'utf-8');
    console.log('✅ Generated sitemap_index.xml');
  } catch (error) {
    console.error('❌ Error generating sitemap index:', error);
  }
  
  console.log('\n🎉 Done! All feeds and sitemaps generated successfully.');
}

// Run the generator
generateFeeds().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
