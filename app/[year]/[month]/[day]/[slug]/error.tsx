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
          <h2 className="alert-heading">Oops! Post not found</h2>
          <p>
            The blog post you're looking for might have been moved or doesn't exist.
          </p>
          <hr />
          <div className="d-flex gap-2">
            <a href="/" className="btn btn-primary">
              Go to homepage
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
