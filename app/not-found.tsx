import { getAllPosts } from '@/lib/posts';
import RecentPostsList from './components/RecentPostsList';

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
        
        <RecentPostsList posts={posts} />
      </div>
    </div>
  );
}
