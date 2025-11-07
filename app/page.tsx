import Link from 'next/link';
import { getAllPosts } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1 style={{ marginBottom: '30px' }}>Recent Posts</h1>
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug}>
            <div className="post-date">{formatDate(post.date)}</div>
            <h2 className="post-title">
              <Link href={`/posts/${post.slug}`}>
                {post.title}
              </Link>
            </h2>
            {post.description && (
              <p className="post-description">{post.description}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
