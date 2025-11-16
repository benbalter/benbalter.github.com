import Link from 'next/link';
import { getPostUrlParts, type Post } from '@/lib/posts';

interface RelatedPostsProps {
  relatedPosts: Post[];
}

export default function RelatedPosts({ relatedPosts }: RelatedPostsProps) {
  if (!relatedPosts || relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="border-top pt-3">
      <h2 className="h6">If you enjoyed this post, you might also enjoy:</h2>
      <ul>
        {relatedPosts.map((post) => {
          const { url } = getPostUrlParts(post);
          return (
            <li key={post.slug}>
              <Link href={url}>{post.title}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
