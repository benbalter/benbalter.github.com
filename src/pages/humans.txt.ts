/**
 * humans.txt - Site Credits and Team Information
 * 
 * Generates humans.txt with site metadata, standards, and team information.
 * This replaces the Jekyll template version at the root.
 * 
 * Replicates Jekyll's jekyll-github-metadata plugin by fetching contributors
 * from the GitHub API at build time.
 */

import type { APIRoute } from 'astro';
import { siteConfig } from '../config';

// Cache contributors to avoid rate limiting during dev
let cachedContributors: any[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Fetch contributors from GitHub API
 */
async function getContributors(): Promise<any[]> {
  // Return cached data if available and fresh
  if (cachedContributors && Date.now() - cacheTime < CACHE_TTL) {
    return cachedContributors;
  }

  try {
    // Get repository from config
    const repo = siteConfig.githubRepo || 'benbalter/benbalter.github.com';
    const url = `https://api.github.com/repos/${repo}/contributors`;

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Astro-Site',
      },
    });

    if (!response.ok) {
      console.warn(`Failed to fetch contributors: ${response.status}`);
      return [];
    }

    const contributors = await response.json();
    
    // Cache the results
    cachedContributors = contributors;
    cacheTime = Date.now();
    
    return contributors;
  } catch (error) {
    console.error('Error fetching contributors:', error);
    return [];
  }
}

export const GET: APIRoute = async () => {
  // Current date for "Last Updated" field
  // Format: YYYY/MM/DD (with slashes) to match Jekyll's original format
  const now = new Date();
  const lastUpdated = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
  
  // Site components and technologies (similar to Jekyll's site.github.versions)
  const components = [
    'Astro',
    'Bootstrap',
    'TypeScript',
    'Node.js',
    'remark',
    'rehype',
  ].join(', ');
  
  // Fetch contributors from GitHub API
  const contributors = await getContributors();
  
  // Build team section
  let teamSection = '';
  if (contributors.length > 0) {
    teamSection = contributors
      .map(contributor => `Name: ${contributor.login}\nSite: ${contributor.html_url}`)
      .join('\n\n');
  } else {
    // Fallback if API call fails
    teamSection = `Name: benbalter\nSite: https://github.com/benbalter`;
  }
  
  const content = `/* SITE */
Last Updated: ${lastUpdated}
Standards: HTML5, CSS3
Components: ${components}

/* TEAM */
${teamSection}
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
