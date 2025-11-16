#!/usr/bin/env tsx

/**
 * Generates _data/related_posts.yml using TF-IDF similarity analysis
 * Replaces the Ruby-based LSI implementation with modern TypeScript
 */

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';
import {convert} from 'html-to-text';
import yaml from 'js-yaml';

type Post = {
  path: string;
  content: string;
  title: string;
  archived?: boolean;
};

type TfIdf = Record<string, number>;

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
 * Read all markdown files from the posts directory
 */
function readPosts(): Post[] {
  const postsPath = path.resolve(postsDirectory);
  const files = fs.readdirSync(postsPath);
  const posts: Post[] = [];

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
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const {data, content} = matter(fileContent);

    // Skip archived posts
    if (data.archived) {
      continue;
    }

    // Extract plain text from markdown
    const plainText = extractPlainText(content);

    posts.push({
      path: postPath,
      content: plainText,
      title: (data.title as string | undefined) ?? '',
      archived: data.archived as boolean | undefined,
    });
  }

  console.log(`Read ${posts.length} posts from ${postsDirectory}`);
  return posts;
}

/**
 * Extract plain text from markdown content
 */
function extractPlainText(markdown: string): string {
  // Convert markdown to plain text
  // Remove HTML tags, code blocks, and other markdown syntax
  const text = markdown
    .replaceAll(/```[\s\S]*?```/g, '') // Remove code blocks
    .replaceAll(/`[^`]+`/g, '') // Remove inline code
    .replaceAll(/\[([^\]]+)]\([^)]+\)/g, '$1') // Convert links to text
    .replaceAll(/[#*_~`]/g, '') // Remove markdown symbols
    .replaceAll(/\n+/g, ' ') // Replace newlines with spaces
    .replaceAll(/\s+/g, ' ') // Normalize whitespace
    .trim();

  return text.toLowerCase();
}

/**
 * Tokenize text into words
 */
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replaceAll(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2); // Filter out very short words
}

/**
 * Calculate term frequency for a document
 */
function calculateTf(tokens: string[]): TfIdf {
  const tf: TfIdf = {};
  const totalTerms = tokens.length;

  for (const term of tokens) {
    tf[term] = (tf[term] ?? 0) + 1;
  }

  // Normalize by document length
  for (const term of Object.keys(tf)) {
    tf[term] /= totalTerms;
  }

  return tf;
}

/**
 * Calculate inverse document frequency
 */
function calculateIdf(posts: Post[]): Map<string, number> {
  const idf = new Map<string, number>();
  const documentCount = posts.length;
  const termDocumentCount = new Map<string, number>();

  // Count how many documents each term appears in
  for (const post of posts) {
    const tokens = tokenize(post.content);
    const uniqueTerms = new Set(tokens);

    for (const term of uniqueTerms) {
      termDocumentCount.set(term, (termDocumentCount.get(term) ?? 0) + 1);
    }
  }

  // Calculate IDF for each term
  for (const [term, count] of termDocumentCount.entries()) {
    idf.set(term, Math.log(documentCount / count));
  }

  return idf;
}

/**
 * Calculate TF-IDF vector for a document
 */
function calculateTfIdf(tokens: string[], idf: Map<string, number>): TfIdf {
  const tf = calculateTf(tokens);
  const tfidf: TfIdf = {};

  for (const term of Object.keys(tf)) {
    const idfValue = idf.get(term) ?? 0;
    tfidf[term] = tf[term] * idfValue;
  }

  return tfidf;
}

/**
 * Calculate cosine similarity between two TF-IDF vectors
 */
function cosineSimilarity(vec1: TfIdf, vec2: TfIdf): number {
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  const allTerms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

  for (const term of allTerms) {
    const value1 = vec1[term] || 0;
    const value2 = vec2[term] || 0;

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
 * Find related posts for each post using TF-IDF similarity
 */
function findRelatedPosts(posts: Post[]): RelatedPosts {
  console.log('Calculating TF-IDF vectors...');

  // Calculate IDF for all terms
  const idf = calculateIdf(posts);

  // Calculate TF-IDF vectors for all posts
  const tfidfVectors = posts.map(post => ({
    post,
    vector: calculateTfIdf(tokenize(post.content), idf),
  }));

  console.log('Finding related posts...');
  const relations: RelatedPosts = {};

  // For each post, find the most similar posts
  for (let i = 0; i < tfidfVectors.length; i++) {
    const {post, vector} = tfidfVectors[i];
    const similarities: Array<{path: string; similarity: number}> = [];

    for (const [index, tfidfVector] of tfidfVectors.entries()) {
      if (i === index) {
        continue; // Skip self
      }

      const similarity = cosineSimilarity(vector, tfidfVector.vector);
      similarities.push({
        path: tfidfVector.post.path,
        similarity,
      });
    }

    // Sort by similarity (highest first) and take top N
    similarities.sort((a, b) => b.similarity - a.similarity);
    relations[post.path] = similarities
      .slice(0, relatedPostsCount)
      .map(s => s.path);
  }

  return relations;
}

/**
 * Write related posts to YAML file
 */
function writeYaml(relations: RelatedPosts): void {
  // Sort keys alphabetically for consistent output
  const sortedRelations: RelatedPosts = {};
  const sortedKeys = Object.keys(relations).sort();

  for (const key of sortedKeys) {
    sortedRelations[key] = relations[key];
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

/**
 * Main execution
 */
function main(): void {
  console.log('Building related posts using TF-IDF similarity...');

  try {
    const posts = readPosts();

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

main();
