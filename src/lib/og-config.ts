/**
 * Open Graph Image Configuration
 * 
 * Configuration for dynamically generating OG images for blog posts using @vercel/og.
 * Matches the styling from jekyll-og-image with blue accent border.
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
  
  // Logo/avatar
  logo?: {
    path: string;
    size: number;
  };
}

/**
 * Default OG image configuration
 * Matches the Jekyll og_image config from _config.yml
 */
export const defaultOGConfig: OGImageConfig = {
  // Standard OG image dimensions
  width: 1200,
  height: 630,
  backgroundColor: '#FFFFFF',
  
  // Title styling
  title: {
    fontFamily: 'sans-serif',
    fontSize: 64,
    color: '#2f313d',
    lineHeight: 1.2,
    maxLines: 3,
  },
  
  // Description styling
  description: {
    fontFamily: 'sans-serif',
    fontSize: 32,
    color: '#535358',
    lineHeight: 1.4,
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
  
  // Logo config (optional - can be used if we want to include avatar)
  logo: {
    path: '/assets/img/headshot.jpg',
    size: 80,
  },
};

/**
 * Truncate text to fit within specified number of lines
 */
export function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) {
    return text;
  }
  return text.substring(0, maxChars - 3) + '...';
}
