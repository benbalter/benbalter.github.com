'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for blog post pages.
 * Provides specific error handling for post-related errors.
 */
export default function PostError({ error, reset }: ErrorProps) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Post error:', error);
    }
  }, [error]);

  return (
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <div className="alert alert-warning" role="alert">
          <h2 className="alert-heading">404: Post Not Found</h2>
          <p>
            Looks like this post has been <code>git rm</code>'d, force-pushed to <code>/dev/null</code>, 
            or never committed in the first place. Even version control can't help us recover this one.
          </p>
          <hr />
          <div className="d-flex gap-2">
            <a href="/" className="btn btn-primary">
              Return to main
            </a>
            <button
              className="btn btn-outline-secondary"
              onClick={reset}
              type="button"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
