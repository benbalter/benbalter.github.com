import Link from 'next/link';
import { getAllPosts, getPostUrlParts } from '@/lib/posts';
import { getAllSiteUrls } from '@/lib/urls';
import RecentPostsList from './components/RecentPostsList';

/**
 * Custom 404 Not Found page
 * The URL suggestion is populated client-side by bundle.js
 * which uses Levenshtein distance to find the closest matching URL
 */
export default function NotFound() {
  const posts = getAllPosts().slice(0, 10);

  return (
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <div className="alert alert-primary lead text-center" role="alert">
          The page you are trying to view does not exist. <br />
          <strong>Perhaps you&apos;re looking for <span id="four-oh-four-suggestion">...</span>?</strong>
        </div>
        
        <RecentPostsList posts={posts} />
      </div>
    </div>
  );
}
