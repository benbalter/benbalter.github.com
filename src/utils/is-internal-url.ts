/**
 * Utility function to determine if a URL is internal to the site
 * 
 * An internal URL is one that:
 * - Is a relative URL (starts with / but not //)
 * - Is an absolute URL with the same origin as the site
 * 
 * @param url - The URL to check (can be relative or absolute)
 * @param siteUrl - The base URL of the site (e.g., 'https://ben.balter.com')
 * @returns true if the URL is internal, false otherwise
 */
export function isInternalUrl(url: string, siteUrl: string): boolean {
  // Handle empty or invalid URLs
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Trim whitespace
  url = url.trim();

  // Ignore non-http protocols (mailto:, tel:, javascript:, etc.)
  if (url.match(/^[a-z]+:/i) && !url.match(/^https?:/i)) {
    return false;
  }

  // Relative URLs (start with / but not //) are internal
  if (url.startsWith('/') && !url.startsWith('//')) {
    return true;
  }

  // Protocol-relative URLs (start with //) need special handling
  if (url.startsWith('//')) {
    try {
      const siteOrigin = new URL(siteUrl).origin;
      const testUrl = new URL(url, siteUrl);
      return testUrl.origin === siteOrigin;
    } catch {
      return false;
    }
  }

  // For absolute URLs, check if they have the same origin
  try {
    const urlObj = new URL(url);
    const siteUrlObj = new URL(siteUrl);
    
    // Compare origins (protocol + hostname + port)
    return urlObj.origin === siteUrlObj.origin;
  } catch {
    // If URL parsing fails, treat as external
    return false;
  }
}
