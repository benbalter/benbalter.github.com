#!/usr/bin/env node

import Sitemapper from 'sitemapper';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateSitemapUrls() {
  try {
    console.log('🔍 Fetching sitemap URLs using sitemapper...');
    
    // Use the production URL after sitemap is generated
    const baseUrl = 'https://ben.balter.com';
    
    const sitemapper = new Sitemapper({
      url: `${baseUrl}/sitemap.xml`,
      timeout: 15000,
      requestHeaders: {
        'User-Agent': 'Mozilla/5.0 (compatible; Sitemapper/1.0)',
      },
    });
    
    const { sites } = await sitemapper.fetch();
    
    console.log(`✅ Found ${sites.length} URLs in sitemap`);
    
    // Write to public directory so it's included in the static export
    const outputPath = join(__dirname, '..', 'public', 'sitemap-urls.json');
    writeFileSync(outputPath, JSON.stringify({ urls: sites }, null, 2));
    
    console.log(`📝 Wrote sitemap URLs to ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating sitemap URLs:', error);
    // Write an empty file so the build doesn't fail
    const outputPath = join(__dirname, '..', 'public', 'sitemap-urls.json');
    writeFileSync(outputPath, JSON.stringify({ urls: [] }, null, 2));
    console.log('⚠️  Wrote empty sitemap URLs file as fallback');
  }
}

generateSitemapUrls();
