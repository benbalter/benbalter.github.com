import { memo, useMemo } from 'react';
import Image from 'next/image';
import { getGitHubAvatarUrlSync } from '@/lib/avatar';

interface GitHubAvatarProps {
  username: string;
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * GitHub Avatar component (optimized for React)
 * Displays a user's GitHub avatar image
 * Replaces jekyll-avatar plugin functionality
 * Uses Next.js Image component for optimization
 * Uses Octokit-compatible avatar URL generation
 * Memoized for performance
 */
function GitHubAvatar({ 
  username, 
  size = 40, 
  className = '',
  alt 
}: GitHubAvatarProps) {
  // Memoize avatar URL computation
  const avatarUrl = useMemo(
    () => getGitHubAvatarUrlSync(username, size),
    [username, size]
  );
  
  const altText = alt || `${username}'s avatar`;
  
  return (
    <Image 
      src={avatarUrl}
      alt={altText}
      width={size}
      height={size}
      className={className}
    />
  );
}

// Export memoized component for React optimization
export default memo(GitHubAvatar);
