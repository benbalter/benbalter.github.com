/**
 * GitHub avatar utilities
 * Replaces jekyll-avatar plugin functionality
 * 
 * Provides GitHub avatar URLs and components
 * Uses Octokit for fetching avatar URLs from GitHub API
 * 
 * Usage:
 * - For React components: Use app/components/GitHubAvatar.tsx (uses Next.js Image)
 * - For server-side HTML: Use getAvatarImageTag() functions (returns <img> tag)
 * - For direct URLs: Use getGitHubAvatarUrl() or getGitHubAvatarUrlSync()
 */

import { Octokit } from '@octokit/rest';

// Cache for avatar URLs to avoid repeated API calls
const avatarCache = new Map<string, string>();

/**
 * Get Octokit instance with optional authentication
 */
function getOctokit(): Octokit {
  return new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });
}

/**
 * Get GitHub avatar URL for a username using Octokit
 * @param username GitHub username
 * @param size Avatar size in pixels (default: 40)
 * @returns Avatar image URL
 */
export async function getGitHubAvatarUrl(username: string, size: number = 40): Promise<string> {
  const cacheKey = `${username}:${size}`;
  
  // Return cached value if available
  if (avatarCache.has(cacheKey)) {
    return avatarCache.get(cacheKey)!;
  }
  
  try {
    const octokit = getOctokit();
    const { data } = await octokit.users.getByUsername({ username });
    
    // GitHub avatar API supports size parameter
    const avatarUrl = `${data.avatar_url}&s=${size}`;
    avatarCache.set(cacheKey, avatarUrl);
    
    return avatarUrl;
  } catch (error) {
    console.warn(`Failed to fetch avatar for ${username}, falling back to direct URL:`, error);
    // Fallback to direct URL construction
    const fallbackUrl = `https://avatars.githubusercontent.com/${username}?s=${size}`;
    avatarCache.set(cacheKey, fallbackUrl);
    return fallbackUrl;
  }
}

/**
 * Get GitHub avatar URL synchronously (for backward compatibility)
 * Uses direct URL construction without API call
 * @param username GitHub username
 * @param size Avatar size in pixels (default: 40)
 * @returns Avatar image URL
 */
export function getGitHubAvatarUrlSync(username: string, size: number = 40): string {
  return `https://avatars.githubusercontent.com/${username}?s=${size}`;
}

/**
 * Get avatar image tag HTML (synchronous for SSG)
 * 
 * Note: For React components, use app/components/GitHubAvatar.tsx instead,
 * which uses Next.js Image component for better optimization.
 * This function is for server-side HTML generation (RSS feeds, etc.)
 * 
 * @param username GitHub username
 * @param size Avatar size in pixels (default: 40)
 * @param className Optional CSS class name
 * @returns HTML img tag string
 */
export function getAvatarImageTag(username: string, size: number = 40, className?: string): string {
  const url = getGitHubAvatarUrlSync(username, size);
  const classAttr = className ? ` class="${className}"` : '';
  
  return `<img src="${url}" alt="${username}'s avatar" width="${size}" height="${size}"${classAttr} />`;
}

/**
 * Get avatar image tag HTML (async version with API)
 * 
 * Note: For React components, use app/components/GitHubAvatar.tsx instead,
 * which uses Next.js Image component for better optimization.
 * This function is for server-side HTML generation with API calls.
 * 
 * @param username GitHub username
 * @param size Avatar size in pixels (default: 40)
 * @param className Optional CSS class name
 * @returns HTML img tag string
 */
export async function getAvatarImageTagAsync(username: string, size: number = 40, className?: string): Promise<string> {
  const url = await getGitHubAvatarUrl(username, size);
  const classAttr = className ? ` class="${className}"` : '';
  
  return `<img src="${url}" alt="${username}'s avatar" width="${size}" height="${size}"${classAttr} />`;
}

/**
 * Avatar component props for use in React components
 */
export interface AvatarProps {
  username: string;
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * Get avatar props for React Image component
 */
export function getAvatarProps(username: string, size: number = 40, className?: string): AvatarProps {
  return {
    username,
    size,
    className,
    alt: `${username}'s avatar`,
  };
}
