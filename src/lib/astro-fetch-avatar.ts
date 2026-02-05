/**
 * Astro Integration: Fetch GitHub Avatar
 * 
 * This integration fetches the GitHub avatar at build time and saves it to the assets directory.
 * It runs during the astro:build:start hook to ensure the image is available before Astro
 * processes assets and generates optimized image formats.
 * 
 * Benefits:
 * - Eliminates runtime dependency on GitHub's CDN
 * - Enables Astro's image optimization (WebP, AVIF)
 * - Improves performance with optimized formats
 * - Reduces external requests at runtime
 */

import type { AstroIntegration } from 'astro';
import { writeFile, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteConfig } from '../config.js';

// Avatar size in pixels (400x400 for high-quality source before Astro optimization)
// This size provides good quality while still being reasonable to download at build time
const AVATAR_SIZE = 400;

// Output path relative to project root (must match the import path in components)
// This file is generated at build time and should be in .gitignore
const AVATAR_OUTPUT_PATH = join('assets', 'img', 'avatar.png');

export default function fetchAvatar(): AstroIntegration {
  return {
    name: 'fetch-avatar',
    hooks: {
      'astro:build:start': async ({ logger }) => {
        const avatarUrl = `https://avatars.githubusercontent.com/${siteConfig.githubUsername}?s=${AVATAR_SIZE}`;
        const projectRoot = fileURLToPath(new URL('../../', import.meta.url));
        const avatarPath = join(projectRoot, AVATAR_OUTPUT_PATH);
        
        try {
          logger.info(`Fetching GitHub avatar from: ${avatarUrl}`);
          
          const response = await fetch(avatarUrl);
          
          if (!response.ok) {
            logger.warn(`Failed to fetch avatar: ${response.status} ${response.statusText}`);
            logger.warn('Build will continue, but avatar may not be available');
            return;
          }
          
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          // Ensure the directory exists
          await mkdir(dirname(avatarPath), { recursive: true });
          
          // Write the avatar image
          await writeFile(avatarPath, buffer);
          
          logger.info(`Successfully saved avatar to: ${avatarPath}`);
        } catch (error) {
          logger.warn(`Error fetching avatar: ${error instanceof Error ? error.message : String(error)}`);
          logger.warn('Build will continue, but avatar may not be available');
        }
      },
    },
  };
}
