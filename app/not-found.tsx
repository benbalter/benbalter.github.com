import { getAllPosts, getPostUrlParts } from '@/lib/posts';
import Link from 'next/link';
import NotFoundSuggestion from './components/NotFoundSuggestion';

export default function NotFound() {
  const posts = getAllPosts().slice(0, 10);
  
  return (
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <div className="alert alert-primary lead text-center" role="alert">
          The page you are trying to view does not exist. <br />
          <strong>Perhaps you&apos;re looking for <NotFoundSuggestion />?</strong>
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
