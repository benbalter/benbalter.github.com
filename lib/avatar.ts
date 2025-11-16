/**
 * GitHub avatar utilities
 * Replaces jekyll-avatar plugin functionality
 * 
 * Provides GitHub avatar URLs and components
 */

/**
 * Get GitHub avatar URL for a username
 * @param username GitHub username
 * @param size Avatar size in pixels (default: 40)
 * @returns Avatar image URL
 */
export function getGitHubAvatarUrl(username: string, size: number = 40): string {
  // GitHub's avatar API
  return `https://avatars.githubusercontent.com/${username}?s=${size}`;
}

/**
 * Get avatar image tag HTML
 * @param username GitHub username
 * @param size Avatar size in pixels (default: 40)
 * @param className Optional CSS class name
 * @returns HTML img tag string
 */
export function getAvatarImageTag(username: string, size: number = 40, className?: string): string {
  const url = getGitHubAvatarUrl(username, size);
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
