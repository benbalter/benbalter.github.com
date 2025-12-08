/**
 * Related posts calculation using TF-IDF (Term Frequency-Inverse Document Frequency)
 * 
 * This algorithm finds posts that are most similar to a given post based on their content.
 * It's more sophisticated than simple keyword matching and considers word importance.
 */

import type { CollectionEntry } from 'astro:content';

/**
 * Stop words to exclude from analysis (common English words)
 */
const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
  'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have', 'had',
  'what', 'when', 'where', 'who', 'which', 'why', 'how', 'i', 'you',
  'we', 'can', 'or', 'not', 'so', 'if', 'about', 'just', 'out', 'up',
]);

/**
 * Extract and normalize words from text
 */
function extractWords(text: string): string[] {
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
    // Remove punctuation except apostrophes
    .replace(/[^\w\s']/g, ' ')
    // Split on whitespace
    .split(/\s+/)
    // Filter out stop words and short words
    .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Calculate term frequency for a document
 */
function calculateTermFrequency(words: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  
  for (const word of words) {
    tf.set(word, (tf.get(word) || 0) + 1);
  }
  
  // Normalize by document length
  const totalWords = words.length;
  for (const [word, count] of tf.entries()) {
    tf.set(word, count / totalWords);
  }
  
  return tf;
}

/**
 * Calculate inverse document frequency
 */
function calculateInverseDocumentFrequency(
  documents: Map<string, string[]>
): Map<string, number> {
  const idf = new Map<string, number>();
  const numDocuments = documents.size;
  
  // Count documents containing each word
  const documentCounts = new Map<string, number>();
  for (const words of documents.values()) {
    const uniqueWords = new Set(words);
    for (const word of uniqueWords) {
      documentCounts.set(word, (documentCounts.get(word) || 0) + 1);
    }
  }
  
  // Calculate IDF
  for (const [word, count] of documentCounts.entries()) {
    idf.set(word, Math.log(numDocuments / count));
  }
  
  return idf;
}

/**
 * Calculate TF-IDF vector for a document
 */
function calculateTfIdf(
  tf: Map<string, number>,
  idf: Map<string, number>
): Map<string, number> {
  const tfidf = new Map<string, number>();
  
  for (const [word, tfScore] of tf.entries()) {
    const idfScore = idf.get(word) || 0;
    tfidf.set(word, tfScore * idfScore);
  }
  
  return tfidf;
}

/**
 * Calculate cosine similarity between two TF-IDF vectors
 */
function cosineSimilarity(
  vec1: Map<string, number>,
  vec2: Map<string, number>
): number {
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;
  
  // Get all unique words from both vectors
  const allWords = new Set([...vec1.keys(), ...vec2.keys()]);
  
  for (const word of allWords) {
    const val1 = vec1.get(word) || 0;
    const val2 = vec2.get(word) || 0;
    
    dotProduct += val1 * val2;
    magnitude1 += val1 * val1;
    magnitude2 += val2 * val2;
  }
  
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }
  
  return dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
}

/**
 * Find related posts for a given post
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
  // Use title and description for content comparison
  const currentContent = `${currentPost.data.title} ${currentPost.data.description || ''}`;
  
  // Extract words from all posts
  const documents = new Map<string, string[]>();
  documents.set(currentPost.slug, extractWords(currentContent));
  
  // Extract words from other posts
  for (const post of allPosts) {
    if (post.slug === currentPost.slug) continue;
    const postContent = `${post.data.title} ${post.data.description || ''}`;
    documents.set(post.slug, extractWords(postContent));
  }
  
  // Calculate IDF for all documents
  const idf = calculateInverseDocumentFrequency(documents);
  
  // Calculate TF-IDF for current post
  const currentWords = documents.get(currentPost.slug)!;
  const currentTf = calculateTermFrequency(currentWords);
  const currentTfIdf = calculateTfIdf(currentTf, idf);
  
  // Calculate similarity scores for all other posts
  const similarities: Array<{ post: CollectionEntry<'posts'>; score: number }> = [];
  
  for (const post of allPosts) {
    if (post.slug === currentPost.slug) continue;
    if (post.data.published === false || post.data.archived === true) continue;
    
    const postWords = documents.get(post.slug)!;
    const postTf = calculateTermFrequency(postWords);
    const postTfIdf = calculateTfIdf(postTf, idf);
    
    const similarity = cosineSimilarity(currentTfIdf, postTfIdf);
    
    if (similarity > 0) {
      similarities.push({ post, score: similarity });
    }
  }
  
  // Sort by similarity score (descending) and return top N
  return similarities
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults)
    .map(item => item.post);
}
