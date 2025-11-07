import { getPosts } from '@/lib/posts';
import Link from 'next/link';

export default async function Home() {
  const posts = await getPosts();

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>Ben Balter</h1>
      <p>Technology leadership, collaboration, and open source</p>
      
      <h2 style={{ marginTop: '2rem' }}>Recent Posts</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {posts.map((post) => (
          <li key={post.slug} style={{ marginBottom: '1.5rem' }}>
            <Link href={`/posts/${post.slug}`}>
              <h3 style={{ marginBottom: '0.5rem' }}>{post.title}</h3>
            </Link>
            <time style={{ color: '#666', fontSize: '0.9rem' }}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <p style={{ marginTop: '0.5rem' }}>{post.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
