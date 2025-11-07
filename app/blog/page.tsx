import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export const metadata = {
  title: 'Blog Posts - Ben Balter',
  description: 'All blog posts',
};

export default function BlogIndex() {
  const posts = getAllPosts();
  
  // Note: post.title and post.description are rendered as React text children,
  // which are automatically escaped by React to prevent XSS.
  // All content comes from _posts/ directory controlled by site owner.
  
  return (
    <main>
      <h1>Blog Posts</h1>
      <p>{posts.length} posts</p>
      <ul>
        {posts.map((post) => {
          const [year, month, day] = post.date.split('-');
          const url = `/${year}/${month}/${day}/${post.slug}/`;
          
          return (
            <li key={url}>
              <article>
                <h2>
                  <Link href={url}>{post.title}</Link>
                </h2>
                {post.description && <p>{post.description}</p>}
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </article>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
