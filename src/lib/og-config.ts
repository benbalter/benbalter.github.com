/**
 * Open Graph Image Configuration
 * 
 * Configuration for dynamically generating OG images for blog posts using astro-og-canvas.
 * Matches the styling from jekyll-og-image with enhancements for best practices.
 */

export interface OGImageConfig {
  // Canvas settings
  width: number;
  height: number;
  backgroundColor: string;
  
  // Text styling
  title: {
    fontFamily: string;
    fontSize: number;
    color: string;
    lineHeight: number;
    maxLines: number;
  };
  
  description: {
    fontFamily: string;
    fontSize: number;
    color: string;
    lineHeight: number;
  };
  
  domain: {
    text: string;
    fontSize: number;
    color: string;
  };
  
  // Border styling (matches Jekyll config)
  border: {
    height: number;
    colors: string[];
  };
  
  // Logo/avatar - displayed at top of card for brand recognition
  logo?: {
    path: string;
    size: number;
  };
}

/**
 * Default OG image configuration
 * Matches the Jekyll og_image config from _config.yml with best practices enhancements
 */
export const defaultOGConfig: OGImageConfig = {
  // Standard OG image dimensions
  width: 1200,
  height: 630,
  backgroundColor: '#FFFFFF',
  
  // Title styling
  title: {
    fontFamily: 'Inter',
    fontSize: 64,
    color: '#2f313d',
    lineHeight: 1.1, // Tighter for better appearance
    maxLines: 3,
  },
  
  // Description styling
  description: {
    fontFamily: 'Inter',
    fontSize: 32,
    color: '#535358',
    lineHeight: 1.4, // Better readability
  },
  
  // Domain text
  domain: {
    text: 'ben.balter.com',
    fontSize: 24,
    color: '#535358',
  },
  
  // Bottom border with Google blue (#4285F4)
  border: {
    height: 20,
    colors: ['#4285F4'],
  },
  
  // Logo/headshot for brand recognition (Jekyll og_image feature)
  logo: {
    path: './assets/img/headshot.jpg',
    size: 100, // Display width in pixels
  },
};

