#!/usr/bin/env node
/**
 * Generate redirect files from frontmatter redirect_from fields
 * Replicates Jekyll's jekyll-redirect-from plugin functionality
 * 
 * Creates HTML redirect files for old URLs that point to new locations.
 * This ensures backward compatibility when URLs change.
 */

import { getCollection } from 'astro:content';
import fs from 'fs/promises';
import path from 'path';

/**
 * Generate HTML redirect page
 */
function generateRedirectHTML(targetUrl: string, oldPath: string): string {
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
 * Generate redirects for all posts with redirect_from frontmatter
 */
export async function generateRedirects(outDir: string = './dist-astro') {
  console.log('🔄 Generating redirects from frontmatter...');
  
  try {
    const posts = await getCollection('posts');
    let redirectCount = 0;

    for (const post of posts) {
      const redirectFrom = post.data.redirect_from;
      
      if (!redirectFrom) continue;

      // Handle both string and array formats
      const redirectPaths = Array.isArray(redirectFrom) ? redirectFrom : [redirectFrom];

      // Get the target URL (current post URL)
      const date = new Date(post.data.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const slug = post.slug;
      const targetUrl = `/${year}/${month}/${day}/${slug}/`;

      for (const oldPath of redirectPaths) {
        // Normalize path (remove leading/trailing slashes)
        let normalizedPath = oldPath.replace(/^\/|\/$/g, '');
        
        // Create the redirect file path
        const redirectFilePath = path.join(outDir, normalizedPath, 'index.html');
        const redirectDir = path.dirname(redirectFilePath);

        // Create directory if it doesn't exist
        await fs.mkdir(redirectDir, { recursive: true });

        // Generate and write redirect HTML
        const html = generateRedirectHTML(targetUrl, oldPath);
        await fs.writeFile(redirectFilePath, html, 'utf-8');

        console.log(`  ✓ ${oldPath} → ${targetUrl}`);
        redirectCount++;
      }
    }

    console.log(`\n✅ Generated ${redirectCount} redirect(s)`);
    return redirectCount;
  } catch (error) {
    console.error('❌ Error generating redirects:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const outDir = process.argv[2] || './dist-astro';
  generateRedirects(outDir).catch(error => {
    console.error(error);
    process.exit(1);
  });
}
