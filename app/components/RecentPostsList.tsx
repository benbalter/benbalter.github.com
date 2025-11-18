import { getAllPosts, getPostUrlParts } from '@/lib/posts';
import Link from 'next/link';

export default function RecentPostsList({ limit = 10 }: { limit?: number }) {
  const posts = getAllPosts()
    .filter(post => !post.archived)
    .slice(0, limit);

  return (
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
  );
}
