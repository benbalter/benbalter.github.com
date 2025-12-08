/**
 * Reading time calculation utilities
 * 
 * Calculates estimated reading time for blog posts based on word count.
 * Average reading speed is approximately 200-250 words per minute.
 */

/**
 * Calculate reading time for content
 * @param content - The HTML or markdown content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200)
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  if (!content || content.trim().length === 0) {
    return 0;
  }

  // Remove HTML tags
  const textWithoutHtml = content.replace(/<[^>]*>/g, ' ');
  
  // Remove code blocks (```...```)
  const textWithoutCodeBlocks = textWithoutHtml.replace(/```[\s\S]*?```/g, ' ');
  
  // Remove inline code (`...`)
  const textWithoutInlineCode = textWithoutCodeBlocks.replace(/`[^`]*`/g, ' ');
  
  // Remove URLs
  const textWithoutUrls = textWithoutInlineCode.replace(/https?:\/\/[^\s]+/g, ' ');
  
  // Split by whitespace and filter empty strings
  const words = textWithoutUrls
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  const wordCount = words.length;
  
  // Calculate reading time (minimum 1 minute)
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  
  return Math.max(1, minutes);
}

/**
 * Format reading time as a human-readable string
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 min read"
 */
export function formatReadingTime(minutes: number): string {
  if (minutes <= 0) {
    return '1 min read';
  }
  
  return `${minutes} min read`;
}
