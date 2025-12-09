/**
 * Related posts calculation using TF-IDF (Term Frequency-Inverse Document Frequency)
 * 
 * This algorithm finds posts that are most similar to a given post based on their content.
 * Uses the 'natural' library for robust TF-IDF implementation with Porter Stemmer.
 */

import type { CollectionEntry } from 'astro:content';
import natural from 'natural';

const { TfIdf, PorterStemmer } = natural;

/**
 * Configuration constants for related posts calculation
 */
const SIGNIFICANT_TERMS_COUNT = 20; // Number of top TF-IDF terms to consider for similarity

/**
 * Type definition for natural library's term object
 */
interface TermScore {
  term: string;
  tfidf: number;
}

/**
 * Normalize and prepare text for TF-IDF analysis
 * Removes HTML tags, URLs, code blocks, and normalizes whitespace
 */
function normalizeText(text: string): string {
  if (!text) {
    return '';
  }
  
  return text
    .toLowerCase()
    // Remove HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Remove URLs
    .replace(/https?:\/\/[^\s]+/g, ' ')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // Remove inline code
    .replace(/`[^`]*`/g, ' ')
    // Normalize whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Find related posts for a given post using TF-IDF similarity
 * 
 * The natural library's TfIdf class uses Porter Stemmer by default for tokenization,
 * which improves matching by reducing words to their root form (e.g., "running" -> "run").
 * 
 * @param currentPost - The post to find related posts for
 * @param allPosts - All available posts
 * @param maxResults - Maximum number of related posts to return (default: 10)
 * @returns Array of related posts sorted by relevance
 */
export async function findRelatedPosts(
  currentPost: CollectionEntry<'posts'>,
  allPosts: CollectionEntry<'posts'>[],
  maxResults = 10
): Promise<CollectionEntry<'posts'>[]> {
  // Initialize TF-IDF (uses Porter Stemmer by default for tokenization)
  const tfidf = new TfIdf();
  
  // Create a map to store post slugs with their document indices
  const postIndices = new Map<string, number>();
  let currentPostIndex = -1;
  
  // Add all posts to the TF-IDF corpus
  let index = 0;
  for (const post of allPosts) {
    const content = normalizeText(`${post.data.title} ${post.data.description || ''}`);
    tfidf.addDocument(content);
    postIndices.set(post.slug, index);
    
    if (post.slug === currentPost.slug) {
      currentPostIndex = index;
    }
    
    index++;
  }
  
  if (currentPostIndex === -1) {
    // Current post not found in allPosts
    return [];
  }
  
  // Calculate similarity scores for all other posts
  const similarities: Array<{ post: CollectionEntry<'posts'>; score: number }> = [];
  
  for (const post of allPosts) {
    // Skip current post and archived posts
    if (post.slug === currentPost.slug || post.data.archived === true) {
      continue;
    }
    
    const postIndex = postIndices.get(post.slug)!;
    
    // Calculate similarity using shared significant terms
    // Get the most significant terms (highest TF-IDF scores) from current post
    const terms = new Set<string>();
    const currentTerms = tfidf.listTerms(currentPostIndex).slice(0, SIGNIFICANT_TERMS_COUNT) as TermScore[];
    currentTerms.forEach((item) => {
      terms.add(item.term);
    });
    
    // Calculate how many of these terms appear in the candidate post and their weights
    let sharedTermScore = 0;
    const candidateTerms = tfidf.listTerms(postIndex) as TermScore[];
    candidateTerms.forEach((item) => {
      if (terms.has(item.term)) {
        sharedTermScore += item.tfidf;
      }
    });
    
    if (sharedTermScore > 0) {
      similarities.push({ post, score: sharedTermScore });
    }
  }
  
  // Sort by similarity score (descending) and return top N
  return similarities
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.post);
}
