import { getAllPosts, getPostUrlParts } from '@/lib/posts';
import PostListItem from './PostListItem';

interface PostListProps {
  showArchived?: boolean;
}

/**
 * PostList component (Server Component)
 * Displays a list of blog posts
 * Works with SSG - no client-side JavaScript needed
 */
export default function PostList({ showArchived = false }: PostListProps) {
  const posts = getAllPosts().filter(post => showArchived || !post.archived);
  
  return (
    <>
      {posts.map(post => {
        const { url } = getPostUrlParts(post);
        
        return (
          <PostListItem
            key={post.slug}
            title={post.title}
            url={url}
            date={post.date}
          />
        );
      })}
    </>
  );
}
