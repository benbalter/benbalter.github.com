#!/usr/bin/env tsx

/**
 * Generates _data/related_posts.yml using TF-IDF similarity analysis
 * Replaces the Ruby-based LSI implementation with modern TypeScript
 * Uses the 'natural' library for robust NLP processing
 * Uses 'remark' for proper markdown-to-text conversion
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import natural from 'natural';
import {remark} from 'remark';
import stripMarkdown from 'strip-markdown';

type Post = {
  path: string;
  content: string;
  title: string;
  archived?: boolean;
};

type RelatedPosts = Record<string, string[]>;

const postsDirectory = '_posts';
const outputFile = '_data/related_posts.yml';
const relatedPostsCount = 11;

// Posts to ignore (from original Ruby script)
const ignoreList = new Set([
  '_posts/2011-11-29-towards-a-more-agile-government.md',
  '_posts/2012-12-26-securing-the-status-quo.md',
]);

/**
 * Extract plain text from markdown content using remark
 */
export async function extractPlainText(markdown: string): Promise<string> {
  // Use remark to properly convert markdown to plain text
  const file = await remark()
    .use(stripMarkdown)
    .process(markdown);

  const text = String(file)
    .replaceAll(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .toLowerCase();

  return text;
}

/**
 * Read all markdown files from the posts directory
 */
export async function readPosts(): Promise<Post[]> {
  const postsPath = path.resolve(postsDirectory);
  const files = fs.readdirSync(postsPath);
  const postPromises: Array<Promise<Post | null>> = [];

  for (const file of files) {
    if (!file.endsWith('.md')) {
      continue;
    }

    const postPath = `${postsDirectory}/${file}`;

    // Skip ignored posts
    if (ignoreList.has(postPath)) {
      continue;
    }

    const filePath = path.join(postsPath, file);

    // Create a promise for each post
    const postPromise = (async () => {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const {data, content} = matter(fileContent);

      // Skip archived posts
      if (data.archived) {
        return null;
      }

      // Extract plain text from markdown using remark
      const plainText = await extractPlainText(content);

      return {
        path: postPath,
        content: plainText,
        title: (data.title as string | undefined) ?? '',
        archived: data.archived as boolean | undefined,
      };
    })();

    postPromises.push(postPromise);
  }

  // Wait for all posts to be processed
  const results = await Promise.all(postPromises);
  const posts = results.filter((post): post is Post => post !== null);

  console.log(`Read ${posts.length} posts from ${postsDirectory}`);
  return posts;
}

/**
 * Find related posts for each post using TF-IDF similarity from natural library
 */
export function findRelatedPosts(posts: Post[]): RelatedPosts {
  console.log('Calculating TF-IDF vectors using natural library...');

  // Create TF-IDF instance
  const tfidf = new natural.TfIdf();

  // Add all documents to TF-IDF
  for (const post of posts) {
    tfidf.addDocument(post.content);
  }

  console.log('Finding related posts...');
  const relations: RelatedPosts = {};

  // For each post, find the most similar posts
  for (let i = 0; i < posts.length; i++) {
    // Add progress logging for large datasets
    if (i % 10 === 0 && i > 0) {
      console.log(`Processed ${i}/${posts.length} posts...`);
    }

    const currentPost = posts[i];
    if (!currentPost) continue; // Skip if post is undefined
    
    const similarities: Array<{path: string; similarity: number}> = [];

    // Calculate similarity with all other posts
    for (const [index, post] of posts.entries()) {
      if (i === index) {
        continue; // Skip self
      }

      // Calculate cosine similarity between documents
      const similarity = calculateCosineSimilarity(tfidf, i, index);
      similarities.push({
        path: post.path,
        similarity,
      });
    }

    // Sort by similarity (highest first) and take top N
    // Note: If there are fewer posts than relatedPostsCount + 1,
    // this will return fewer related posts (which is acceptable)
    similarities.sort((a, b) => b.similarity - a.similarity);
    relations[currentPost.path] = similarities
      .slice(0, relatedPostsCount)
      .map(s => s.path);
  }

  return relations;
}

/**
 * Calculate cosine similarity between two documents in TF-IDF
 */
function calculateCosineSimilarity(
  tfidf: natural.TfIdf,
  document1Index: number,
  document2Index: number,
): number {
  // Get TF-IDF vectors for both documents
  const vector1 = new Map<string, number>();
  const vector2 = new Map<string, number>();

  for (const item of tfidf.listTerms(document1Index)) {
    vector1.set(item.term, item.tfidf);
  }

  for (const item of tfidf.listTerms(document2Index)) {
    vector2.set(item.term, item.tfidf);
  }

  // Calculate cosine similarity
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  const allTerms = new Set([...vector1.keys(), ...vector2.keys()]);

  for (const term of allTerms) {
    const value1 = vector1.get(term) ?? 0;
    const value2 = vector2.get(term) ?? 0;

    dotProduct += value1 * value2;
    mag1 += value1 * value1;
    mag2 += value2 * value2;
  }

  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

/**
 * Write related posts to YAML file
 */
export function writeYaml(relations: RelatedPosts): void {
  // Sort keys alphabetically for consistent output
  const sortedRelations: RelatedPosts = {};
  const sortedKeys = Object.keys(relations).sort();

  for (const key of sortedKeys) {
    const value = relations[key];
    if (value) {
      sortedRelations[key] = value;
    }
  }

  // Generate YAML with proper indentation
  const yamlContent = yaml.dump(sortedRelations, {
    indent: 2,
    lineWidth: -1,
  });

  // Ensure the _data directory exists
  const dataDirectory = path.dirname(outputFile);
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, {recursive: true});
  }

  fs.writeFileSync(outputFile, yamlContent, 'utf8');
  console.log(`Wrote related posts to ${outputFile}`);
}

// Only run main if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Building related posts using natural library TF-IDF...');

  try {
    const posts = await readPosts();

    if (posts.length === 0) {
      console.error('No posts found!');
      process.exit(1);
    }

    const relations = findRelatedPosts(posts);
    writeYaml(relations);

    console.log('Done!');
  } catch (error) {
    console.error('Error building related posts:', error);
    process.exit(1);
  }
}
