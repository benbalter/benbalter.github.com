/**
 * GitHub mentions processing
 * Replaces jekyll-mentions plugin functionality
 * 
 * Converts @username syntax to links to GitHub profiles
 */

/**
 * Convert @username mentions to GitHub profile links
 * Preserves the original @ syntax for display
 */
export function processMentions(text: string): string {
  // Match @username but not in code blocks, links, or email addresses
  // Username must start with alphanumeric and can contain hyphens
  return text.replace(
    /(?<![\w\/]|`)@([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)(?![@\w])/g,
    '<a href="https://github.com/$1" class="user-mention">@$1</a>'
  );
}

/**
 * Convert @username mentions to GitHub profile links in HTML
 * More careful to avoid replacing mentions in existing HTML attributes
 */
export function processMentionsInHtml(html: string): string {
  // Split by HTML tags to process only text nodes
  const parts = html.split(/(<[^>]+>)/);
  
  return parts.map((part, index) => {
    // Skip HTML tags (odd indices)
    if (index % 2 === 1) {
      return part;
    }
    
    // Process text nodes
    return processMentions(part);
  }).join('');
}

/**
 * Extract all @mentions from text
 */
export function extractMentions(text: string): string[] {
  const matches = text.matchAll(
    /(?<![\w\/]|`)@([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)(?![@\w])/g
  );
  
  return Array.from(matches, match => match[1] || '').filter(Boolean);
}

/**
 * Check if text contains @mentions
 */
export function hasMentions(text: string): boolean {
  return /(?<![\w\/]|`)@([a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)(?![@\w])/.test(text);
}
