/**
 * robots.txt - Robots Exclusion Standard File
 * 
 * Generates robots.txt with disallowed paths for search engine crawlers.
 * This replaces the Jekyll template version at the root.
 */

import type { APIRoute } from 'astro';

// Paths to disallow from crawling. Only list URLs that 404 or are crawl traps.
// Don't list pages that redirect or carry a noindex meta tag (e.g. /fine-print/,
// /resume/linkedin/): a blocked crawler never fetches them, so it can't follow
// the 301 or see the noindex, and may index the bare URL anyway.
const disallowedPaths = [
  '/404.html',
  '/open-source-demystified/',
  '/tag*',
  '/tags*',
];

export const GET: APIRoute = ({ site }) => {
  // Generate robots.txt content
  const disallowLines = disallowedPaths
    .map(path => `Disallow: ${path}`)
    .join('\n');
  
  // Use the site URL from Astro config for portability
  const siteUrl = site?.origin ?? 'https://ben.balter.com';
  
  // Content Signals (contentsignals.org, draft-romm-aipref-contentsignals)
  // Declares AI content usage preferences: search indexing, AI training, and
  // AI input (retrieval for generative answers) are all welcomed for this
  // public personal blog, consistent with the site's openly-published llms.txt.
  const contentSignal = 'Content-Signal: search=yes, ai-train=yes, ai-input=yes';

  const content = `User-agent: *
${contentSignal}
${disallowLines}
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/sitemap-index.xml
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
