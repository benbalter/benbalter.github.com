/**
 * robots.txt - Robots Exclusion Standard File
 * 
 * Generates robots.txt with disallowed paths for search engine crawlers.
 * This replaces the Jekyll template version at the root.
 */

import type { APIRoute } from 'astro';

// Paths to disallow from crawling
const disallowedPaths = [
  '/2021-analysis-of-federal-dotgov-domains/',
  '/404.html',
  '/assets/',
  '/behind-github-geojson/',
  '/collaborative-policymaking/',
  '/digital-government-strategy/',
  '/digital-strategy-reporting/',
  '/dist-astro/',
  '/dont-build-an-api/',
  '/fine-print/',
  '/government-glossary/',
  '/make-government-better-together/',
  '/make-maps-better-together/',
  '/make-reporting-better-together/',
  '/open-source-alternatives/',
  '/open-source-demystified/',
  '/open-source-software-licensing/',
  '/open-sourcing-government/',
  '/resume/linkedin/',
  '/simple-api/',
  '/tag*',
  '/tags*',
  '/the-dynamic-site-is-dead/',
  '/the-next-cultural-commons/',
  '/uncle-sams-list/',
];

export const GET: APIRoute = () => {
  // Generate robots.txt content
  const disallowLines = disallowedPaths
    .map(path => `Disallow: ${path}`)
    .join('\n');
  
  const content = `User-agent: *
${disallowLines}
Allow: /
Sitemap: https://ben.balter.com/sitemap-index.xml
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
