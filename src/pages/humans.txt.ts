/**
 * humans.txt - Site Credits and Team Information
 * 
 * Generates humans.txt with site metadata, standards, and team information.
 * This replaces the Jekyll template version at the root.
 * 
 * Note: In the original Jekyll version, this used site.github.versions and
 * site.github.contributors which were provided by jekyll-github-metadata plugin.
 * For Astro, we use hardcoded values or could fetch from GitHub API if needed.
 */

import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  // Current date for "Last Updated" field
  // Format: YYYY/MM/DD (with slashes) to match Jekyll's original format
  const now = new Date();
  const lastUpdated = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
  
  // Site components and technologies
  const components = [
    'Astro',
    'Bootstrap',
    'TypeScript',
    'Node.js',
  ].join(', ');
  
  const content = `/* SITE */
Last Updated: ${lastUpdated}
Standards: HTML5, CSS3
Components: ${components}

/* TEAM */
Name: benbalter
Site: https://github.com/benbalter
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
