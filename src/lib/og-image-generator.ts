/**
 * Satori-based Open Graph Image Generator
 * 
 * Generates OG images matching the Jekyll og_image layout:
 * - Logo/headshot in top-right corner
 * - Title at top-left
 * - Description at bottom-left
 * - Domain at bottom-right
 * - Blue border at bottom
 */

import satori from 'satori';
import { readFile } from 'node:fs/promises';
import { join, resolve, normalize } from 'node:path';
import { defaultOGConfig, type OGImageConfig } from './og-config';

interface OGImageOptions {
  title: string;
  description: string;
  config?: Partial<OGImageConfig>;
}

// Cache for loaded assets (persists across image generations)
let fontDataCache: ArrayBuffer | null = null;
let headshot: string | null = null;

// Allowed asset directories for security
const ALLOWED_ASSET_DIRS = ['assets'];

/**
 * Load the Inter font for text rendering
 * Font is cached after first load for performance
 */
async function loadFont(): Promise<ArrayBuffer> {
  if (fontDataCache) return fontDataCache;
  
  try {
    // Load Inter font from fontsource CDN
    const response = await fetch(
      'https://api.fontsource.org/v1/fonts/inter/latin-700-normal.ttf'
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch font: ${response.status}`);
    }
    
    fontDataCache = await response.arrayBuffer();
    return fontDataCache;
  } catch (error) {
    throw new Error(`Failed to load font: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate that a path is within allowed directories
 * Prevents path traversal attacks
 */
function validateAssetPath(assetPath: string): string {
  const projectRoot = process.cwd();
  
  // Normalize and resolve the path
  const normalizedPath = normalize(assetPath);
  const fullPath = resolve(projectRoot, normalizedPath);
  
  // Ensure the path starts with an allowed directory
  const isAllowed = ALLOWED_ASSET_DIRS.some(dir => 
    normalizedPath.startsWith(dir) || normalizedPath.startsWith(`./${dir}`)
  );
  
  if (!isAllowed) {
    throw new Error(`Asset path must be within allowed directories: ${ALLOWED_ASSET_DIRS.join(', ')}`);
  }
  
  // Ensure resolved path is within project root (prevents traversal)
  if (!fullPath.startsWith(projectRoot)) {
    throw new Error('Asset path traversal detected');
  }
  
  return fullPath;
}

/**
 * Load and encode the headshot image as base64 data URI
 * Image is cached after first load for performance
 */
async function loadHeadshot(config: OGImageConfig): Promise<string> {
  if (headshot) return headshot;
  
  const imagePath = validateAssetPath(config.logo.path);
  const imageBuffer = await readFile(imagePath);
  const base64 = imageBuffer.toString('base64');
  headshot = `data:image/jpeg;base64,${base64}`;
  return headshot;
}

/**
 * Generate an OG image SVG using Satori
 * Layout matches Jekyll's jekyll-og-image plugin exactly
 */
export async function generateOGImageSVG(options: OGImageOptions): Promise<string> {
  const config = { ...defaultOGConfig, ...options.config };
  
  const [fontData, headshotDataUri] = await Promise.all([
    loadFont(),
    loadHeadshot(config),
  ]);
  
  // Calculate available width for title (excluding logo area)
  const titleMaxWidth = config.width - config.padding * 2 - config.logo.size - 40;
  
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: config.backgroundColor,
          fontFamily: config.title.fontFamily,
          position: 'relative',
        },
        children: [
          // Main content area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                padding: config.padding,
                paddingBottom: config.padding - 20, // Account for border
              },
              children: [
                // Top section: Title and Logo
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    },
                    children: [
                      // Title on the left
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: config.title.fontSize,
                            fontWeight: 700,
                            color: config.title.color,
                            lineHeight: config.title.lineHeight,
                            maxWidth: titleMaxWidth,
                            wordBreak: 'break-word',
                          },
                          children: options.title,
                        },
                      },
                      // Logo/headshot on the right
                      {
                        type: 'img',
                        props: {
                          src: headshotDataUri,
                          width: config.logo.size,
                          height: config.logo.size,
                          style: {
                            borderRadius: 10,
                            objectFit: 'cover',
                          },
                        },
                      },
                    ],
                  },
                },
                // Bottom section: Description and Domain
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                    },
                    children: [
                      // Description on the left
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: config.description.fontSize,
                            color: config.description.color,
                            lineHeight: config.description.lineHeight,
                            maxWidth: config.width - config.padding * 2 - 200, // Leave room for domain
                            wordBreak: 'break-word',
                          },
                          children: options.description,
                        },
                      },
                      // Domain on the right
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: config.description.fontSize,
                            color: config.description.color,
                          },
                          children: config.domain,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Bottom border
          {
            type: 'div',
            props: {
              style: {
                width: '100%',
                height: config.border.height,
                backgroundColor: config.border.color,
              },
            },
          },
        ],
      },
    },
    {
      width: config.width,
      height: config.height,
      fonts: [
        {
          name: config.title.fontFamily,
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );
  
  return svg;
}

/**
 * Convert SVG to PNG using resvg-js
 * Requires @resvg/resvg-js to be installed
 */
export async function generateOGImagePNG(options: OGImageOptions): Promise<Buffer> {
  const svg = await generateOGImageSVG(options);
  
  // Dynamic import for resvg
  const { Resvg } = await import('@resvg/resvg-js');
  
  const config = { ...defaultOGConfig, ...options.config };
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: config.width,
    },
  });
  
  const pngData = resvg.render();
  return pngData.asPng();
}
