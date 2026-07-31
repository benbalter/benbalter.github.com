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
import { readFileSync } from 'node:fs';
import { resolve, sep, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { defaultOGConfig, validateDimensions, type OGImageConfig } from './og-config';
import { commitGraphPaths } from './book-cta';

// Reuse the site's commit-graph motif (also on the book CTAs) as an ownable OG
// signature. Recolored to the card's blue plus one pink branch — a non-blue pop
// and a distinctive mark that reads as "Balter" without reading the text. Its
// CSS custom properties don't resolve in a standalone SVG, so bake in hexes.
const MOTIF_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 60" fill="none">${
  commitGraphPaths
    .replace(/var\(--color-accent-400\)/g, '#4A9EE0')
    .replace(/var\(--color-pink-400\)/g, '#EC6A9C')
}</svg>`;
const MOTIF_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(MOTIF_SVG)}`;

// Auto-invalidating cache version: a hash of the source files that determine a
// card's pixels (this generator, the config, and the shared motif). Any design
// or logic change reproduces a new key, so cached cards regenerate without a
// manual bump. Falls back to a fixed salt if the source isn't readable in this
// runtime (build-time only reads source; keep the salt as an escape hatch).
function computeDesignVersion(): string {
  try {
    const dir = dirname(fileURLToPath(import.meta.url));
    const hash = createHash('sha256');
    for (const file of ['og-image-generator.ts', 'og-config.ts', 'book-cta.ts']) {
      hash.update(readFileSync(join(dir, file)));
    }
    return hash.digest('hex').slice(0, 16);
  } catch {
    return 'salt-1';
  }
}
const OG_CACHE_VERSION = computeDesignVersion();

// Persistent cache outside node_modules so `npm ci` (and CI's dependency
// install) doesn't wipe it — the CI workflow restores/saves .cache/og-cache,
// so only new or changed cards regenerate across deploys.
const OG_CACHE_DIR = join(process.cwd(), '.cache', 'og-cache');

interface OGImageOptions {
  title: string;
  description: string;
  config?: Partial<OGImageConfig>;
}

// Cache for loaded assets (persists across image generations)
let fontBoldCache: ArrayBuffer | null = null;
let fontRegularCache: ArrayBuffer | null = null;
let fontSerifCache: ArrayBuffer | null = null;
// Cache headshot by path to support config overrides
const headshotCache: Map<string, string> = new Map();

// Allowed asset directories for security
const ALLOWED_ASSET_DIRS = ['assets'];

/**
 * Load the Inter fonts for text rendering
 * Fonts are cached after first load for performance
 * Returns both regular (400) and bold (700) weights
 */
async function loadFonts(): Promise<{ regular: ArrayBuffer; bold: ArrayBuffer; serif: ArrayBuffer }> {
  // Read vendored TTFs from disk (assets/fonts/) — no network fetch at build,
  // so the build can't stall or fail on a slow/unreachable font CDN.
  const readFont = async (file: string): Promise<ArrayBuffer> => {
    const fontPath = validateAssetPath(join('assets', 'fonts', file));
    const buf = await readFile(fontPath);
    // Slice to a standalone ArrayBuffer (Node may return a pooled/shared buffer).
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  };

  try {
    // Cache after first load. Inter for body/UI text; Lora (an editorial serif,
    // already a site brand face) for headlines — a distinctive display face that
    // de-templates the card from the sea of geometric-sans OG cards.
    if (!fontRegularCache) {
      fontRegularCache = await readFont('inter-400.ttf');
    }
    if (!fontBoldCache) {
      fontBoldCache = await readFont('inter-700.ttf');
    }
    if (!fontSerifCache) {
      fontSerifCache = await readFont('lora-700.ttf');
    }

    return { regular: fontRegularCache, bold: fontBoldCache, serif: fontSerifCache };
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
 * Pick a title font size that fills the frame for short headlines and scales
 * down for long ones so they still fit two-to-three lines on the 1200×630 card.
 * At feed-thumbnail size the headline is the only element doing engagement work,
 * so short titles get hero-sized type.
 */
export function titleFontSize(length: number): number {
  if (length <= 25) return 76;
  if (length <= 45) return 64;
  if (length <= 70) return 56;
  if (length <= 100) return 48;
  return 42;
}

/**
 * Generate an OG image SVG using Satori.
 * Dark, engagement-first card: a vertically centered headline hero over a deep
 * navy field, the description directly beneath, and an author lockup (headshot +
 * name + domain) anchored in the footer.
 */
export async function generateOGImageSVG(options: OGImageOptions): Promise<string> {
  const config = { ...defaultOGConfig, ...options.config };
  validateDimensions(config.width, config.height);
  
  const [fonts, headshotDataUri] = await Promise.all([
    loadFonts(),
    loadHeadshot(config),
  ]);
  
  // Full content width — the headline now owns the frame (headshot moved to the
  // footer), so it's no longer competing with the avatar for the top-right.
  const contentPaddingLeft = config.padding + config.accent.width + 24;
  const contentWidth = config.width - contentPaddingLeft - config.padding;
  const fontSize = titleFontSize(options.title.length);

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
          // Inset border so the dark card keeps its edges in a dark-mode feed
          // (LinkedIn/X dark) instead of melting into the chrome. Bright enough
          // to actually register at thumbnail size.
          border: '1px solid rgba(148, 163, 184, 0.4)',
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
          // Commit-graph signature — faint, upper-right, filling the dead space.
          {
            type: 'img',
            props: {
              src: MOTIF_DATA_URI,
              width: 660,
              height: 33,
              style: {
                position: 'absolute',
                top: 104,
                right: 64,
                opacity: 0.75,
              },
            },
          },
          // Main content: centered headline hero + footer author lockup
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                paddingTop: config.padding,
                paddingRight: config.padding,
                // Extra bottom room keeps the author lockup clear of aggressive
                // feed crops (e.g. X's smaller card).
                paddingBottom: config.padding + 24,
                paddingLeft: contentPaddingLeft,
              },
              children: [
                // Hero: title + description, vertically centered in the frame
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
                      // Title — editorial serif (Lora), dynamically sized to
                      // fill the frame, with numerals in the accent color.
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontFamily: 'Lora',
                            fontSize,
                            fontWeight: 700,
                            color: config.title.color,
                            lineHeight: config.title.lineHeight,
                            maxWidth: contentWidth,
                            wordBreak: 'break-word',
                            letterSpacing: '-0.01em',
                          },
                          children: options.title,
                        },
                      },
                      // Description directly beneath the title (numerals accented)
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: config.description.fontSize,
                            fontWeight: 400,
                            color: config.description.color,
                            lineHeight: config.description.lineHeight,
                            maxWidth: contentWidth,
                            marginTop: 24,
                          },
                          children: cleanDescription,
                        },
                      },
                    ],
                  },
                },
                // Footer: headshot + name + domain lockup (the signature)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 18,
                    },
                    children: [
                      // Headshot with brand-accent ring
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexShrink: 0,
                            borderRadius: 32,
                            border: `3px solid ${config.accent.color}`,
                            overflow: 'hidden',
                          },
                          children: [
                            {
                              type: 'img',
                              props: {
                                src: headshotDataUri,
                                width: 60,
                                height: 60,
                                style: { borderRadius: 29, objectFit: 'cover' },
                              },
                            },
                          ],
                        },
                      },
                      // Name over domain
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
                                children: 'Ben Balter',
                              },
                            },
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
          name: 'Inter',
          data: fonts.regular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Inter',
          data: fonts.bold,
          weight: 700,
          style: 'normal',
        },
        {
          name: 'Lora',
          data: fonts.serif,
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
const QUOTE_OG_CACHE_VERSION = '2';

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
