/**
 * humans.txt - Site Credits and Team Information
 * 
 * Generates humans.txt with site metadata, standards, and team information.
 * This replaces the Jekyll template version at the root.
 * 
 * Fetches contributors from GitHub API to match jekyll-github-metadata behavior.
 */

import type { APIRoute } from 'astro';

interface GitHubContributor {
  login: string;
  html_url: string;
  contributions: number;
}

export const GET: APIRoute = async () => {
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
  
  // Fetch contributors from GitHub API
  let contributorsList = '';
  try {
    const response = await fetch(
      'https://api.github.com/repos/benbalter/benbalter.github.com/contributors',
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'benbalter.github.com',
        },
      }
    );
    
    if (response.ok) {
      const contributors: GitHubContributor[] = await response.json();
      contributorsList = contributors
        .map(contributor => `Name: ${contributor.login}\nSite: ${contributor.html_url}`)
        .join('\n\n');
    } else {
      // Fallback if API fails
      contributorsList = 'Name: benbalter\nSite: https://github.com/benbalter';
    }
  } catch (error) {
    // Fallback if API fails
    contributorsList = 'Name: benbalter\nSite: https://github.com/benbalter';
  }
  
  const content = `/* SITE */
Last Updated: ${lastUpdated}
Standards: HTML5, CSS3
Components: ${components}

/* TEAM */
${contributorsList}
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
