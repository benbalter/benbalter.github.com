import { getAllPosts, getPostUrlParts } from '@/lib/posts';
import Link from 'next/link';

export default function NotFound() {
  const posts = getAllPosts().slice(0, 10);
  
  return (
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <div className="text-center mb-4">
          <h1 className="display-1">404</h1>
          <h2>Not Found 😢</h2>
          <p className="lead">The page you are trying to view does not exist.</p>
        </div>
        
        <h4 className="border-top pt-3">Recent posts</h4>
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
    </div>
  );
}
