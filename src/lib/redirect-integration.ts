/**
 * Astro integration to generate redirect pages after build
 * 
 * This integration hooks into the Astro build process and generates
 * redirect pages for posts/pages with redirect_from or redirect_to
 * in their frontmatter.
 */

import type { AstroIntegration } from 'astro';
import { generateRedirects } from '../scripts/generate-redirects';

export default function redirectIntegration(): AstroIntegration {
  return {
    name: 'astro-redirects',
    hooks: {
      'astro:build:done': async () => {
        // Generate redirects after the build is complete
        await generateRedirects();
      },
    },
  };
}
