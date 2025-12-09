/**
 * Astro integration to generate redirect files after build
 * Replicates Jekyll's jekyll-redirect-from plugin
 */

import type { AstroIntegration } from 'astro';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { filenameToUrl } from './post-url-utils';

/**
 * Generate HTML redirect page
 */
function generateRedirectHTML(targetUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <title>Redirecting…</title>
  <link rel="canonical" href="${targetUrl}">
  <meta http-equiv="refresh" content="0; url=${targetUrl}">
  <meta name="robots" content="noindex">
</head>
<body>
  <h1>Redirecting…</h1>
  <p>This page has moved to <a href="${targetUrl}">${targetUrl}</a>.</p>
  <script>location="${targetUrl}"</script>
</body>
</html>`;
}

/**
 * Astro integration for redirect generation
 */
export function redirects(): AstroIntegration {
  let srcDir: string;
  
  return {
    name: 'astro-redirects',
    hooks: {
      'astro:config:setup': ({ config }) => {
        srcDir = config.srcDir.pathname;
      },
      'astro:build:done': async ({ dir, logger }) => {
        logger.info('Generating redirects from frontmatter...');
        
        try {
          // Read posts from the content directory
          const postsDir = path.join(srcDir, 'content', 'posts');
          const files = await fs.readdir(postsDir);
          let redirectCount = 0;

          for (const file of files) {
            if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;

            const filePath = path.join(postsDir, file);
            const content = await fs.readFile(filePath, 'utf-8');
            const { data } = matter(content);

            const redirectFrom = data.redirect_from;
            if (!redirectFrom) continue;

            // Handle both string and array formats
            const redirectPaths = Array.isArray(redirectFrom) ? redirectFrom : [redirectFrom];

            // Generate target URL from filename
            const targetUrl = filenameToUrl(file);
            if (!targetUrl) {
              logger.warn(`Skipping ${file}: Invalid filename format`);
              continue;
            }

            for (const oldPath of redirectPaths) {
              // Normalize path (remove leading/trailing slashes)
              const normalizedPath = oldPath.replace(/^\/|\/$/g, '');
              
              // Create the redirect file path
              const redirectFilePath = path.join(dir.pathname, normalizedPath, 'index.html');
              const redirectDir = path.dirname(redirectFilePath);

              // Create directory if it doesn't exist
              await fs.mkdir(redirectDir, { recursive: true });

              // Generate and write redirect HTML
              const html = generateRedirectHTML(targetUrl);
              await fs.writeFile(redirectFilePath, html, 'utf-8');

              logger.info(`  ✓ ${oldPath} → ${targetUrl}`);
              redirectCount++;
            }
          }

          logger.info(`Generated ${redirectCount} redirect(s)`);
        } catch (error) {
          logger.error('Error generating redirects:');
          logger.error(String(error));
        }
      },
    },
  };
}
