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
 * - width/height: 1200x600 (standard OG image size)
 * - logo.size: 140 (slightly smaller for better balance)
 * - padding: 60 (tighter for modern look)
 */
export const defaultOGConfig: OGImageConfig = {
  // Standard OG image dimensions
  width: 1200,
  height: 600,
  
  // Subtle gradient background (light gray to white)
  background: {
    color: '#FFFFFF',
    gradientFrom: '#f8f9fa',  // Light gray (Bootstrap gray-100)
    gradientTo: '#FFFFFF',
  },
  
  // Title styling - larger and bolder for impact
  title: {
    fontFamily: 'Inter',
    fontSize: 52,
    color: '#212529',  // Dark gray (Bootstrap gray-900)
    lineHeight: 1.2,
  },
  
  // Description styling
  description: {
    fontFamily: 'Inter',
    fontSize: 24,
    color: '#6c757d',  // Medium gray (Bootstrap gray-600)
    lineHeight: 1.5,
  },
  
  // Left accent bar with primary brand color
  accent: {
    width: 8,
    color: '#337ab7',  // Primary blue
    gradientFrom: '#337ab7',
    gradientTo: '#2a6493',  // Primary-600
  },
  
  // Logo/headshot with modern rounded style
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
    fontSize: 20,
    color: '#337ab7',  // Primary blue for brand recognition
  },
  
  // Comfortable padding
  padding: 60,
};


