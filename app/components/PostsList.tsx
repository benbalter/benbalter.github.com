import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { getPostUrlParts } from '@/lib/posts';

interface PostsListProps {
  posts: Post[];
}

/**
 * Posts list component
 * Server component for static site generation
 * Displays a list of blog posts with dates
 */
export default function PostsList({ posts }: PostsListProps) {
  return (
    <>
      {posts.map(post => {
        const { url } = getPostUrlParts(post);
        
        return (
          <div className="row mb-2" key={post.slug}>
            <div className="col-sm-9">
              <Link href={url}>{post.title}</Link>
            </div>
            <div className="col-sm-3 text-muted text-md-end">
              <small>
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </small>
            </div>
          </div>
        );
      })}
    </>
  );
}
