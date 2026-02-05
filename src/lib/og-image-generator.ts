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
import { readFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { defaultOGConfig, type OGImageConfig } from './og-config';

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
const DOMAIN_HEIGHT_RESERVED = 50; // Space reserved for domain at bottom

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
export function truncateDescription(text: string, maxLength: number = 150): string {
  // Remove markdown links and formatting
  const cleanText = text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // [text](url) -> text
    .replace(/[*_~`]/g, '')  // Remove markdown formatting
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
    },
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
