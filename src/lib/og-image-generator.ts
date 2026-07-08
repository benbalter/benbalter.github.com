/**
 * Satori-based Open Graph Image Generator
 * 
 * Generates OG images with a modern, professional design:
 * - Subtle gradient background for depth
 * - Left accent bar for visual interest
 * - Circular avatar with border
 * - Clean typography with Inter font
 * - Domain branding at bottom
 */

import satori from 'satori';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { resolve, sep, join } from 'node:path';
import { createHash } from 'node:crypto';
import { defaultOGConfig, validateDimensions, type OGImageConfig } from './og-config';

// Cache version — bump this to invalidate all cached OG images
const OG_CACHE_VERSION = '2';
const OG_CACHE_DIR = join(process.cwd(), 'node_modules', '.astro', 'og-cache');

interface OGImageOptions {
  title: string;
  description: string;
  config?: Partial<OGImageConfig>;
}

// Cache for loaded assets (persists across image generations)
let fontBoldCache: ArrayBuffer | null = null;
let fontRegularCache: ArrayBuffer | null = null;
// Cache headshot by path to support config overrides
const headshotCache: Map<string, string> = new Map();

// Allowed asset directories for security
const ALLOWED_ASSET_DIRS = ['assets'];

// Layout constants for spacing calculations
const LOGO_TITLE_GAP = 40; // Gap between title text and logo

/**
 * Load the Inter fonts for text rendering
 * Fonts are cached after first load for performance
 * Returns both regular (400) and bold (700) weights
 */
async function loadFonts(): Promise<{ regular: ArrayBuffer; bold: ArrayBuffer }> {
  const fetchFont = async (weight: string): Promise<ArrayBuffer> => {
    const response = await fetch(
      `https://api.fontsource.org/v1/fonts/inter/latin-${weight}-normal.ttf`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch font (weight ${weight}): ${response.status}`);
    }
    
    return response.arrayBuffer();
  };
  
  try {
    // Use cached fonts if available, otherwise fetch
    if (!fontRegularCache) {
      fontRegularCache = await fetchFont('400');
    }
    if (!fontBoldCache) {
      fontBoldCache = await fetchFont('700');
    }
    
    return { regular: fontRegularCache, bold: fontBoldCache };
  } catch (error) {
    throw new Error(`Failed to load fonts: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate that a path is within allowed directories
 * Prevents path traversal attacks
 */
function validateAssetPath(assetPath: string): string {
  const projectRoot = process.cwd();
  
  // Resolve the full path first (handles ../ traversal)
  const fullPath = resolve(projectRoot, assetPath);
  
  // Ensure resolved path is within project root (prevents traversal)
  // Use platform-specific path separator for cross-platform compatibility
  if (!fullPath.startsWith(projectRoot + sep)) {
    throw new Error('Asset path traversal detected');
  }
  
  // Get the path relative to project root for allowed directory check
  const relativePath = fullPath.slice(projectRoot.length + 1);
  
  // Ensure the resolved path starts with an allowed directory
  // Use platform-specific path separator for cross-platform compatibility
  const isAllowed = ALLOWED_ASSET_DIRS.some(dir => 
    relativePath.startsWith(dir + sep) || relativePath === dir
  );
  
  if (!isAllowed) {
    throw new Error(`Asset path must be within allowed directories: ${ALLOWED_ASSET_DIRS.join(', ')}`);
  }
  
  return fullPath;
}

/**
 * Load and encode the headshot image as base64 data URI
 * Image is cached by path to support config overrides
 */
async function loadHeadshot(config: OGImageConfig): Promise<string> {
  const imagePath = validateAssetPath(config.logo.path);
  
  // Check cache by resolved path
  const cached = headshotCache.get(imagePath);
  if (cached) return cached;
  
  const imageBuffer = await readFile(imagePath);
  const base64 = imageBuffer.toString('base64');
  const dataUri = `data:image/jpeg;base64,${base64}`;
  
  headshotCache.set(imagePath, dataUri);
  return dataUri;
}

/**
 * Truncate text to a maximum number of characters
 * Adds ellipsis if truncated
 * Also strips markdown links and formatting
 */
export function truncateDescription(text: string, maxLength: number = 300): string {
  // Remove markdown links and formatting
  const cleanText = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // [text](url) -> text
    .replace(/~~([^~]+)~~/g, '$1')  // ~~strikethrough~~ -> strikethrough
    .replace(/[*_`]/g, '')  // Remove remaining markdown formatting (* _ `)
    .trim();
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Find the last space before maxLength to avoid cutting words
  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '…';
}

/**
 * Generate an OG image SVG using Satori
 * Modern design with gradient background, accent bar, and clean typography
 */
export async function generateOGImageSVG(options: OGImageOptions): Promise<string> {
  const config = { ...defaultOGConfig, ...options.config };
  validateDimensions(config.width, config.height);
  
  const [fonts, headshotDataUri] = await Promise.all([
    loadFonts(),
    loadHeadshot(config),
  ]);
  
  // Calculate available width for title (excluding logo area and accent)
  const contentPaddingLeft = config.padding + config.accent.width + 20; // Extra space after accent
  const titleMaxWidth = config.width - contentPaddingLeft - config.padding - config.logo.size - LOGO_TITLE_GAP;
  
  // Truncate and clean description
  const cleanDescription = truncateDescription(options.description);
  
  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '100%',
          height: '100%',
          fontFamily: config.title.fontFamily,
          position: 'relative',
          // Gradient background
          background: config.background.gradientFrom 
            ? `linear-gradient(135deg, ${config.background.gradientFrom} 0%, ${config.background.gradientTo || config.background.color} 100%)`
            : config.background.color,
        },
        children: [
          // Left accent bar
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: config.accent.width,
                background: config.accent.gradientFrom
                  ? `linear-gradient(180deg, ${config.accent.gradientFrom} 0%, ${config.accent.gradientTo || config.accent.color} 100%)`
                  : config.accent.color,
              },
            },
          },
          // Main content area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                paddingTop: config.padding,
                paddingRight: config.padding,
                paddingBottom: config.padding,
                paddingLeft: contentPaddingLeft,
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
                            letterSpacing: '-0.02em',
                          },
                          children: options.title,
                        },
                      },
                      // Logo/headshot with circular border
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexShrink: 0,
                            borderRadius: config.logo.borderRadius,
                            border: `${config.logo.borderWidth}px solid ${config.logo.borderColor}`,
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                          },
                          children: [
                            {
                              type: 'img',
                              props: {
                                src: headshotDataUri,
                                width: config.logo.size,
                                height: config.logo.size,
                                style: {
                                  borderRadius: Math.max(0, config.logo.borderRadius - config.logo.borderWidth),
                                  objectFit: 'cover',
                                },
                              },
                            },
                          ],
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
                      flexDirection: 'column',
                      gap: 16,
                    },
                    children: [
                      // Description
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: config.description.fontSize,
                            fontWeight: 400,
                            color: config.description.color,
                            lineHeight: config.description.lineHeight,
                            maxWidth: config.width - contentPaddingLeft - config.padding - 40,
                          },
                          children: cleanDescription,
                        },
                      },
                      // Domain
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: config.domain.fontSize,
                            fontWeight: 600,
                            color: config.domain.color,
                            letterSpacing: '0.01em',
                          },
                          children: config.domain.text,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    {
      width: config.width,
      height: config.height,
      fonts: [
        {
          name: config.title.fontFamily,
          data: fonts.regular,
          weight: 400,
          style: 'normal',
        },
        {
          name: config.title.fontFamily,
          data: fonts.bold,
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
async function renderPNG(options: OGImageOptions): Promise<Buffer> {
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

/**
 * Generate a cache key from OG image inputs.
 * Hash includes title, description, config, and cache version
 * so any change to inputs or layout invalidates the cache.
 */
function getCacheKey(options: OGImageOptions): string {
  const config = { ...defaultOGConfig, ...options.config };
  const payload = JSON.stringify({
    v: OG_CACHE_VERSION,
    title: options.title,
    description: options.description,
    config,
  });
  return createHash('sha256').update(payload).digest('hex');
}

/**
 * Check if a cached OG image exists on disk.
 */
async function readCache(key: string): Promise<Buffer | null> {
  try {
    const cachePath = join(OG_CACHE_DIR, `${key}.png`);
    await access(cachePath);
    return await readFile(cachePath);
  } catch {
    return null;
  }
}

/**
 * Write a generated OG image to the disk cache.
 */
async function writeCache(key: string, png: Buffer): Promise<void> {
  try {
    await mkdir(OG_CACHE_DIR, { recursive: true });
    await writeFile(join(OG_CACHE_DIR, `${key}.png`), png);
  } catch {
    // Cache write failure is non-fatal; image was already generated
  }
}

/**
 * Generate an OG image PNG with content-hash disk caching.
 * Only regenerates when title, description, or config changes.
 * Cache persists in node_modules/.astro/og-cache/ across builds.
 */
export async function generateOGImagePNG(options: OGImageOptions): Promise<Buffer> {
  const key = getCacheKey(options);
  const cached = await readCache(key);
  if (cached) return cached;

  const png = await renderPNG(options);
  await writeCache(key, png);
  return png;
}

/* -------------------------------------------------------------------------- */
/* Quote OG images                                                            */
/* -------------------------------------------------------------------------- */

// Bump to invalidate cached quote images independently of post images.
const QUOTE_OG_CACHE_VERSION = '1';

export interface QuoteOGOptions {
  /** The quote text (verbatim, no surrounding quotation marks). */
  text: string;
  /** Attribution line, e.g. "Ben Balter". */
  attribution: string;
}

/**
 * Pick a font size that keeps a pull-quote readable and balanced across the
 * wide length variance of quotes — short lines get hero-sized type, long ones
 * scale down so they don't overflow the 1200×630 canvas.
 */
export function quoteFontSize(length: number): number {
  if (length <= 50) return 66;
  if (length <= 90) return 54;
  if (length <= 140) return 44;
  if (length <= 200) return 36;
  return 30;
}

/**
 * Generate a quote-focused OG image SVG using Satori.
 * The quote text is the hero element; a large decorative quotation mark in the
 * brand color anchors it, with attribution and domain along the bottom.
 */
export async function generateQuoteOGImageSVG(options: QuoteOGOptions): Promise<string> {
  const config = defaultOGConfig;
  validateDimensions(config.width, config.height);

  const [fonts, headshotDataUri] = await Promise.all([
    loadFonts(),
    loadHeadshot(config),
  ]);

  const text = options.text.trim();
  const fontSize = quoteFontSize(text.length);
  const contentPaddingLeft = config.padding + config.accent.width + 20;
  const contentWidth = config.width - contentPaddingLeft - config.padding;

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          height: '100%',
          fontFamily: config.title.fontFamily,
          position: 'relative',
          paddingTop: config.padding,
          paddingRight: config.padding,
          paddingBottom: config.padding,
          paddingLeft: contentPaddingLeft,
          background: `linear-gradient(135deg, ${config.background.gradientFrom} 0%, ${config.background.gradientTo} 100%)`,
        },
        children: [
          // Left accent bar
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: config.accent.width,
                background: `linear-gradient(180deg, ${config.accent.gradientFrom} 0%, ${config.accent.gradientTo} 100%)`,
              },
            },
          },
          // Quote block: oversized opening mark + the text
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: 140,
                      fontWeight: 700,
                      lineHeight: 0.9,
                      height: 80,
                      color: config.accent.color,
                    },
                    children: '“',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize,
                      fontWeight: 700,
                      color: config.title.color,
                      lineHeight: 1.25,
                      letterSpacing: '-0.02em',
                      maxWidth: contentWidth,
                      wordBreak: 'break-word',
                    },
                    children: text,
                  },
                },
              ],
            },
          },
          // Footer: headshot + attribution + domain
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexShrink: 0,
                      borderRadius: 28,
                      border: `3px solid ${config.accent.color}`,
                      overflow: 'hidden',
                    },
                    children: [
                      {
                        type: 'img',
                        props: {
                          src: headshotDataUri,
                          width: 56,
                          height: 56,
                          style: { borderRadius: 25, objectFit: 'cover' },
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: 26,
                            fontWeight: 700,
                            color: config.title.color,
                          },
                          children: options.attribution,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: 20,
                            fontWeight: 600,
                            color: config.domain.color,
                          },
                          children: config.domain.text,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    {
      width: config.width,
      height: config.height,
      fonts: [
        { name: config.title.fontFamily, data: fonts.regular, weight: 400, style: 'normal' },
        { name: config.title.fontFamily, data: fonts.bold, weight: 700, style: 'normal' },
      ],
    }
  );

  return svg;
}

async function renderQuotePNG(options: QuoteOGOptions): Promise<Buffer> {
  const svg = await generateQuoteOGImageSVG(options);
  const { Resvg } = await import('@resvg/resvg-js');
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: defaultOGConfig.width },
  });
  return resvg.render().asPng();
}

/**
 * Generate a quote OG image PNG with content-hash disk caching.
 * Mirrors generateOGImagePNG but keyed on the quote-specific payload.
 */
export async function generateQuoteOGImagePNG(options: QuoteOGOptions): Promise<Buffer> {
  const key = createHash('sha256')
    .update(JSON.stringify({ v: QUOTE_OG_CACHE_VERSION, ...options }))
    .digest('hex');

  const cached = await readCache(key);
  if (cached) return cached;

  const png = await renderQuotePNG(options);
  await writeCache(key, png);
  return png;
}
