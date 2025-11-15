import { getAllPosts, getPostUrlParts } from '@/lib/posts';
import Link from 'next/link';

export default function NotFound() {
  const posts = getAllPosts().slice(0, 10);
  
  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <h1>Not Found 😢</h1>
        <p>The page you are trying to view does not exist.</p>
      </div>
      
      <h4>Recent posts</h4>
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
    </div>
  );
}
