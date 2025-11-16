import Image from 'next/image';
import { getGitHubAvatarUrl } from '@/lib/avatar';

interface GitHubAvatarProps {
  username: string;
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * GitHub Avatar component
 * Displays a user's GitHub avatar image
 * Replaces jekyll-avatar plugin functionality
 * Uses Next.js Image component for optimization
 */
export default function GitHubAvatar({ 
  username, 
  size = 40, 
  className = '',
  alt 
}: GitHubAvatarProps) {
  const avatarUrl = getGitHubAvatarUrl(username, size);
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
