import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export default function Home() {
  const posts = getAllPosts();
  
  return (
    <main>
      <h1>Ben Balter</h1>
      <p>Technology leadership, collaboration, and open source</p>
      
      <h2>Recent Posts</h2>
      <ul>
        {posts.map(post => {
          const [year, month, day, ...rest] = post.slug.split('-');
          const slug = rest.join('-');
          const url = `/${encodeURIComponent(year)}/${encodeURIComponent(month)}/${encodeURIComponent(day)}/${encodeURIComponent(slug)}/`;
          
          return (
            <li key={post.slug}>
              <Link href={url}>
                {post.title}
              </Link>
              {post.description && <p>{post.description}</p>}
              <time dateTime={post.date}>{post.date}</time>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
