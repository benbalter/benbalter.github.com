/**
 * Open Graph Image Configuration
 * 
 * Configuration for dynamically generating OG images for blog posts.
 * Matches the styling from jekyll-og-image for consistency.
 */

export interface OGImageConfig {
  // Canvas settings (matching Jekyll's 1200x600)
  width: number;
  height: number;
  // Background color
  backgroundColor: string;
  
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
  
  // Border styling (matches Jekyll config)
  border: {
    height: number;
    color: string;
  };
  
  // Logo/avatar - displayed at top-right (matching Jekyll's gravity: :ne)
  logo: {
    path: string;
    size: number;
  };
  
  // Domain displayed at bottom-right (Jekyll feature)
  domain: string;
  
  // Padding/margins
  padding: number;
}

/**
 * Default OG image configuration
 * 
 * Values sourced from Jekyll's _config.yml:
 * - border.height: 20 (from og_image.border_bottom.width)
 * - border.color: '#4285F4' (from og_image.border_bottom.fill)
 * - logo.path: 'public/assets/img/headshot.jpg' (from og_image.image)
 * - domain: 'ben.balter.com' (from og_image.domain)
 * 
 * Values chosen to approximate Jekyll's rendered output:
 * - width/height: 1200x600 (matches Jekyll's canvas)
 * - backgroundColor: '#FFFFFF' (matches Jekyll default)
 * - title/description fonts, sizes, colors, lineHeights (tuned to match visual appearance)
 * - logo.size: 150 (matches Jekyll's image dimensions)
 * - padding: 80 (approximates Jekyll's layout spacing)
 */
export const defaultOGConfig: OGImageConfig = {
  // Matches Jekyll's 1200x600 dimensions
  width: 1200,
  height: 600,
  
  // White background (matching Jekyll)
  backgroundColor: '#FFFFFF',
  
  // Title styling (matching Jekyll header config)
  title: {
    fontFamily: 'Inter',
    fontSize: 48, // Adjusted for better fit
    color: '#2f313d',
    lineHeight: 1.2,
  },
  
  // Description styling (matching Jekyll content config)
  description: {
    fontFamily: 'Inter',
    fontSize: 28,
    color: '#535358',
    lineHeight: 1.4,
  },
  
  // Bottom border with Google blue (#4285F4 from _config.yml)
  border: {
    height: 20,
    color: '#4285F4',
  },
  
  // Logo/headshot for brand recognition (top-right, matching Jekyll)
  logo: {
    path: 'public/assets/img/headshot.jpg',
    size: 150, // Matching Jekyll's 150x150
  },
  
  // Domain for attribution (from _config.yml og_image.domain)
  domain: 'ben.balter.com',
  
  // Standard padding
  padding: 80,
};

