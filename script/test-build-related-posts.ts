#!/usr/bin/env tsx

/**
 * Simple test script to verify build-related-posts.ts works correctly
 */

import fs from 'node:fs';
import process from 'node:process';
import yaml from 'js-yaml';

type RelatedPosts = Record<string, string[]>;

console.log('Testing build-related-posts script...\n');

// Test 1: Check if the output file exists
console.log('✓ Test 1: Checking if output file exists...');
if (!fs.existsSync('_data/related_posts.yml')) {
  console.error('✗ FAIL: _data/related_posts.yml does not exist');
  process.exit(1);
}

console.log('  ✓ Pass: Output file exists\n');

// Test 2: Check if the YAML is valid
console.log('✓ Test 2: Validating YAML syntax...');
let data: RelatedPosts;
try {
  const fileContent = fs.readFileSync('_data/related_posts.yml', 'utf8');
  data = yaml.load(fileContent) as RelatedPosts;
  console.log('  ✓ Pass: YAML is valid\n');
} catch (error) {
  console.error('✗ FAIL: Invalid YAML:', error);
  process.exit(1);
}

// Test 3: Check structure
console.log('✓ Test 3: Checking data structure...');
if (typeof data !== 'object' || data === null) {
  console.error('✗ FAIL: Data is not an object');
  process.exit(1);
}

console.log(`  ✓ Pass: Found ${Object.keys(data).length} posts\n`);

// Test 4: Check that each post has related posts
console.log('✓ Test 4: Verifying related posts structure...');
let minRelated = Number.POSITIVE_INFINITY;
let maxRelated = 0;
for (const [postPath, relatedPosts] of Object.entries(data)) {
  if (!Array.isArray(relatedPosts)) {
    console.error(`✗ FAIL: Related posts for ${postPath} is not an array`);
    process.exit(1);
  }

  minRelated = Math.min(minRelated, relatedPosts.length);
  maxRelated = Math.max(maxRelated, relatedPosts.length);

  // Verify no post is related to itself
  if (relatedPosts.includes(postPath)) {
    console.error(`✗ FAIL: Post ${postPath} is related to itself`);
    process.exit(1);
  }
}

console.log(`  ✓ Pass: Each post has ${minRelated}-${maxRelated} related posts\n`);

// Test 5: Verify ignored posts are not included
console.log('✓ Test 5: Checking ignored posts...');
const ignoredPosts = [
  '_posts/2011-11-29-towards-a-more-agile-government.md',
  '_posts/2012-12-26-securing-the-status-quo.md',
];
for (const ignoredPost of ignoredPosts) {
  if (ignoredPost in data) {
    console.error(`✗ FAIL: Ignored post ${ignoredPost} is in the output`);
    process.exit(1);
  }
}

console.log('  ✓ Pass: Ignored posts are excluded\n');

// Test 6: Verify all post paths are valid
console.log('✓ Test 6: Verifying post paths...');
for (const postPath of Object.keys(data)) {
  if (!postPath.startsWith('_posts/')) {
    console.error(`✗ FAIL: Invalid post path: ${postPath}`);
    process.exit(1);
  }

  if (!postPath.endsWith('.md')) {
    console.error(`✗ FAIL: Post path doesn't end with .md: ${postPath}`);
    process.exit(1);
  }
}

console.log('  ✓ Pass: All post paths are valid\n');

console.log('✅ All tests passed!');
console.log('\nSummary:');
console.log(`- Total posts: ${Object.keys(data).length}`);
console.log(`- Related posts per post: ${minRelated}-${maxRelated}`);
