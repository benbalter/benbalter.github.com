import Image from 'next/image';
import { getGitHubAvatarUrlSync } from '@/lib/avatar';

interface GitHubAvatarProps {
  username: string;
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * GitHub Avatar component (Server Component)
 * Displays a user's GitHub avatar image using the open source Octokit-compatible approach
 * Uses Next.js Image component for optimization
 * Works with SSG - no client-side JavaScript needed
 */
export default function GitHubAvatar({ 
  username, 
  size = 40, 
  className = '',
  alt 
}: GitHubAvatarProps) {
  // Generate avatar URL directly (no need for useMemo in server components)
  const avatarUrl = getGitHubAvatarUrlSync(username, size);
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
