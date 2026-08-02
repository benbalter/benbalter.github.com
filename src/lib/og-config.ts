/**
 * Open Graph Image Configuration
 * 
 * Configuration for dynamically generating OG images for blog posts.
 * Enhanced design with modern styling inspired by Tailwind CSS.
 */

export interface OGImageConfig {
  // Canvas settings (matching Jekyll's 1200x600)
  width: number;
  height: number;
  // Background styling - supports gradient
  background: {
    // Primary background color
    color: string;
    // Optional gradient colors for a modern look
    gradientFrom?: string;
    gradientTo?: string;
  };
  
  // Text styling
  title: {
    fontFamily: string;
    fontSize: number;
    color: string;
    lineHeight: number;
  };
  
  description: {
    fontFamily: string;
    fontSize: number;
    color: string;
    lineHeight: number;
  };
  
  // Accent bar styling (left side accent bar)
  accent: {
    width: number;
    color: string;
    // Optional gradient for the accent
    gradientFrom?: string;
    gradientTo?: string;
  };
  
  // Logo/avatar - displayed at top-right
  logo: {
    path: string;
    size: number;
    // Border radius for the logo
    borderRadius: number;
    // Optional border around logo
    borderWidth: number;
    borderColor: string;
  };
  
  // Domain displayed at bottom-right
  domain: {
    text: string;
    fontSize: number;
    color: string;
  };
  
  // Padding/margins
  padding: number;
}

/**
 * Default OG image configuration
 * 
 * Enhanced design using Tailwind-inspired styling:
 * - Subtle gradient background for depth
 * - Primary brand color (blue #337ab7) as accent
 * - Left accent bar for visual interest
 * - Clean typography with Inter font
 * - Professional card-like appearance
 * 
 * Maintains dimensions from original design:
 * - width/height: 1200x630 (standard OG image size, 1.91:1 aspect ratio)
 * - logo.size: 140 (slightly smaller for better balance)
 * - padding: 60 (tighter for modern look)
 */
// Dimension constraints for OG images
export const OG_MIN_DIMENSION = 200;
export const OG_MAX_DIMENSION = 2400;

/**
 * Validate that OG image dimensions are within the allowed range.
 * Throws a RangeError if width or height is outside [200, 2400].
 */
export function validateDimensions(
  width: number,
  height: number,
): void {
  if (
    !Number.isFinite(width) ||
    width < OG_MIN_DIMENSION ||
    width > OG_MAX_DIMENSION
  ) {
    throw new RangeError(
      `OG image width must be between ${OG_MIN_DIMENSION} and ${OG_MAX_DIMENSION}, got ${width}`,
    );
  }

  if (
    !Number.isFinite(height) ||
    height < OG_MIN_DIMENSION ||
    height > OG_MAX_DIMENSION
  ) {
    throw new RangeError(
      `OG image height must be between ${OG_MIN_DIMENSION} and ${OG_MAX_DIMENSION}, got ${height}`,
    );
  }
}

export const defaultOGConfig: OGImageConfig = {
  // Standard OG image dimensions (1.91:1 aspect ratio, matches meta declarations)
  width: 1200,
  height: 630,
  
  // Dark navy gradient — reads premium in both light and dark feeds, defines
  // its own edges against the platform chrome, and makes the accent/headline pop.
  background: {
    color: '#0b1220',
    gradientFrom: '#13233b',  // Deep navy
    gradientTo: '#0a121f',    // Near-black navy
  },

  // Title styling - white hero text (generator scales the size to title length)
  title: {
    fontFamily: 'Inter',
    fontSize: 56,
    color: '#F8FAFC',  // slate-50
    lineHeight: 1.15,
  },

  // Description styling
  description: {
    fontFamily: 'Inter',
    fontSize: 26,
    color: '#CBD5E1',  // slate-300 — bright enough to stay legible at thumbnail size
    lineHeight: 1.5,
  },

  // Left accent bar — thickened so it's visible at thumbnail size, brightened
  // so it pops on the dark field.
  accent: {
    width: 14,
    color: '#4A9EE0',  // Brighter brand blue
    gradientFrom: '#4A9EE0',
    gradientTo: '#337ab7',  // Primary blue
  },

  // Logo/headshot with modern rounded style (footer lockup shrinks this)
  logo: {
    path: './assets/img/headshot.jpg',
    size: 140,
    borderRadius: 70,  // Full circle
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },

  // Domain attribution
  domain: {
    text: 'ben.balter.com',
    fontSize: 22,
    color: '#5AA8E8',  // Bright blue for contrast on dark
  },
  
  // Comfortable padding
  padding: 60,
};


