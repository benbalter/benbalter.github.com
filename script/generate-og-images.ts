#!/usr/bin/env npx tsx

/**
 * Generate Open Graph (OG) images for blog posts
 * 
 * This script replaces the jekyll-og-image plugin functionality.
 * It generates 1200x600 PNG images for each post that doesn't have
 * a pre-generated OG image.
 * 
 * Usage:
 *   npm run build:og-images           # Generate missing OG images
 *   npm run build:og-images -- --force  # Regenerate all OG images
 * 
 * The generated images match the Jekyll plugin's visual style:
 * - White background
 * - Post title at top left (bold, dark text)
 * - Author headshot at top right (rounded)
 * - Description at bottom left
 * - Domain at bottom right
 * - Blue border at bottom
 */

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import React from 'react';
import { getSiteConfig, type SiteConfig } from '../lib/config';

// Configuration
const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const OUTPUT_DIR = path.join(process.cwd(), 'assets/images/og/posts');
const HEADSHOT_PATH = path.join(process.cwd(), 'assets/img/headshot.jpg');

// Image dimensions (matches Jekyll plugin)
const WIDTH = 1200;
const HEIGHT = 600;

// Colors (from _config.yml og_image settings)
const BORDER_COLOR = '#4285F4';
const BORDER_HEIGHT = 20;
const BACKGROUND_COLOR = '#FFFFFF';
const TITLE_COLOR = '#2f313d';
const DESCRIPTION_COLOR = '#535358';

interface Post {
  slug: string;
  title: string;
  description?: string;
}

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
type FontStyle = 'normal' | 'italic';

interface FontConfig {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: FontStyle;
}

// Font URLs from Google Fonts CDN
const FONT_URLS = {
  regular: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff',
  bold: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjp-Ek-_EeA.woff',
};

// Date prefix pattern for post filenames (YYYY-MM-DD-)
const DATE_PREFIX_PATTERN = /^\d{4}-\d{2}-\d{2}-/;

/**
 * Load font for Satori rendering
 * Fetches Inter font from Google Fonts CDN with error handling
 */
async function loadFonts(): Promise<FontConfig[]> {
  try {
    const [regularResponse, boldResponse] = await Promise.all([
      fetch(FONT_URLS.regular),
      fetch(FONT_URLS.bold),
    ]);
    
    if (!regularResponse.ok || !boldResponse.ok) {
      throw new Error(`Font fetch failed: regular=${regularResponse.status}, bold=${boldResponse.status}`);
    }
    
    const [regularFont, boldFont] = await Promise.all([
      regularResponse.arrayBuffer(),
      boldResponse.arrayBuffer(),
    ]);
    
    return [
      { name: 'Inter', data: regularFont, weight: 400 as FontWeight, style: 'normal' as FontStyle },
      { name: 'Inter', data: boldFont, weight: 700 as FontWeight, style: 'normal' as FontStyle },
    ];
  } catch (error) {
    console.error('❌ Failed to load fonts from Google Fonts CDN.');
    console.error('   Please check your network connection and try again.');
    throw error;
  }
}

// Cache for headshot base64 data
let cachedHeadshotBase64: string | null = null;

/**
 * Read headshot image and convert to base64 data URI
 * Uses caching to avoid repeated file reads during batch generation
 */
function loadHeadshotBase64(): string {
  if (cachedHeadshotBase64 !== null) {
    return cachedHeadshotBase64;
  }
  
  if (!fs.existsSync(HEADSHOT_PATH)) {
    console.warn(`⚠️ Headshot not found at ${HEADSHOT_PATH}`);
    cachedHeadshotBase64 = '';
    return '';
  }
  const imageBuffer = fs.readFileSync(HEADSHOT_PATH);
  cachedHeadshotBase64 = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
  return cachedHeadshotBase64;
}

/**
 * Get all posts from the content/posts directory
 */
function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`❌ Posts directory not found: ${POSTS_DIR}`);
    return [];
  }
  
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  
  return files.map(fileName => {
    const fullPath = path.join(POSTS_DIR, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    
    // Extract slug from filename (remove date prefix and .md extension)
    const slug = fileName.replace(DATE_PREFIX_PATTERN, '').replace(/\.md$/, '');
    
    return {
      slug,
      title: data.title || slug.replace(/-/g, ' '),
      description: data.description,
    };
  });
}

/**
 * OG Image component using React elements
 */
function OgImage({ 
  title, 
  description, 
  domain, 
  headshotBase64 
}: { 
  title: string; 
  description?: string; 
  domain: string; 
  headshotBase64: string;
}): React.ReactElement {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      backgroundColor: BACKGROUND_COLOR,
      fontFamily: 'Inter',
    }
  }, [
    // Main content area
    React.createElement('div', {
      key: 'content',
      style: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        padding: '80px',
        paddingBottom: '60px',
      }
    }, [
      // Top section: Title and Headshot
      React.createElement('div', {
        key: 'top',
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }
      }, [
        // Title
        React.createElement('div', {
          key: 'title',
          style: {
            display: 'flex',
            fontSize: 52,
            fontWeight: 700,
            color: TITLE_COLOR,
            lineHeight: 1.2,
            maxWidth: headshotBase64 ? '870px' : '1040px',
          }
        }, title),
        // Headshot (only if available)
        ...(headshotBase64 ? [
          React.createElement('img', {
            key: 'headshot',
            src: headshotBase64,
            width: 150,
            height: 150,
            style: {
              borderRadius: '10px',
              objectFit: 'cover' as const,
            }
          })
        ] : []),
      ]),
      // Spacer
      React.createElement('div', {
        key: 'spacer',
        style: { flex: 1 }
      }),
      // Bottom section: Description and Domain
      React.createElement('div', {
        key: 'bottom',
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }
      }, [
        // Description
        ...(description ? [
          React.createElement('div', {
            key: 'description',
            style: {
              display: 'flex',
              fontSize: 28,
              fontWeight: 400,
              color: DESCRIPTION_COLOR,
              lineHeight: 1.4,
              maxWidth: '850px',
            }
          }, description)
        ] : []),
        // Domain
        React.createElement('div', {
          key: 'domain',
          style: {
            display: 'flex',
            fontSize: 24,
            fontWeight: 400,
            color: DESCRIPTION_COLOR,
          }
        }, domain),
      ]),
    ]),
    // Bottom border
    React.createElement('div', {
      key: 'border',
      style: {
        display: 'flex',
        height: `${BORDER_HEIGHT}px`,
        backgroundColor: BORDER_COLOR,
        width: '100%',
      }
    }),
  ]);
}

/**
 * Generate OG image for a post using Satori + Resvg
 */
async function generateOgImage(
  post: Post, 
  config: SiteConfig,
  fonts: FontConfig[],
  headshotBase64: string
): Promise<Buffer> {
  const domain = config.og_image?.domain || 'ben.balter.com';
  
  // Create the React element for the OG image
  const element = OgImage({
    title: post.title,
    description: post.description,
    domain,
    headshotBase64,
  });
  
  // Convert to SVG using Satori
  const svg = await satori(element, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });
  
  // Convert SVG to PNG using Resvg
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: WIDTH,
    },
  });
  
  return Buffer.from(resvg.render().asPng());
}

/**
 * Main function to generate OG images
 */
async function main(): Promise<void> {
  const forceRegenerate = process.argv.includes('--force');
  
  console.log('🖼️  OG Image Generator\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created output directory: ${OUTPUT_DIR}`);
  }
  
  // Load resources
  console.log('📥 Loading fonts...');
  const fonts = await loadFonts();
  
  console.log('📥 Loading headshot...');
  const headshotBase64 = loadHeadshotBase64();
  
  console.log('📥 Loading site config...');
  const config = getSiteConfig();
  
  console.log('📥 Loading posts...\n');
  const posts = getAllPosts();
  
  if (posts.length === 0) {
    console.log('⚠️ No posts found.');
    return;
  }
  
  let generated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const post of posts) {
    const outputPath = path.join(OUTPUT_DIR, `${post.slug}.png`);
    
    // Skip if image exists and not forcing regeneration
    if (fs.existsSync(outputPath) && !forceRegenerate) {
      skipped++;
      continue;
    }
    
    try {
      const pngBuffer = await generateOgImage(post, config, fonts, headshotBase64);
      fs.writeFileSync(outputPath, pngBuffer);
      generated++;
      console.log(`✅ Generated: ${post.slug}.png`);
    } catch (error) {
      errors++;
      console.error(`❌ Error generating ${post.slug}.png:`, error);
    }
  }
  
  console.log('\n📊 Summary:');
  console.log(`   Generated: ${generated}`);
  console.log(`   Skipped:   ${skipped}`);
  console.log(`   Errors:    ${errors}`);
  console.log(`   Total:     ${posts.length}`);
  
  if (errors > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
