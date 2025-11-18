import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { getPostUrlParts } from '@/lib/posts';

interface RecentPostsListProps {
  posts: Post[];
  title?: string;
}

/**
 * Recent posts list component
 * Server component for static site generation
 * Displays a list of recent blog posts
 */
export default function RecentPostsList({ posts, title = 'Recent posts' }: RecentPostsListProps) {
  return (
    <>
      <h4 className="border-top pt-3">{title}</h4>
      <ul>
        {posts.map(post => {
          const { url } = getPostUrlParts(post);
          
          return (
            <li key={post.slug}>
              <Link href={url}>{post.title}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
