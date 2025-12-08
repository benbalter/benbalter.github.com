#!/usr/bin/env tsx

/**
 * Build related posts using Jekyll's LSI (Latent Semantic Indexing)
 * 
 * This script is a wrapper around the Ruby implementation which uses
 * Jekyll's built-in LSI feature to generate related posts data.
 * 
 * The generated data is stored in _data/related_posts.yml and used
 * by the related_posts.html include to display related content.
 * 
 * Note: This requires the classifier-reborn gem with LSI support and
 * a BLAS/LAPACK backend (libopenblas, liblapack, etc.) to be installed.
 * If you get errors about missing numo-linalg backend, install these
 * system dependencies first.
 */

import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

console.log('Building related posts using Jekyll LSI...');
console.log('This may take a few minutes as it analyzes all blog posts.\n');

try {
  // Call the Ruby script which implements the actual LSI logic
  execSync('bundle exec ruby script/build-related-posts.rb', {
    cwd: ROOT_DIR,
    stdio: 'inherit',
    env: {
      ...process.env,
      DISABLE_WHITELIST: 'true'
    }
  });
  
  console.log('\n✓ Related posts data generated successfully!');
  console.log('  Output: _data/related_posts.yml');
} catch (error) {
  console.error('\n✗ Failed to build related posts');
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}
