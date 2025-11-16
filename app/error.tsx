'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for the root layout.
 * Displays a user-friendly error message and provides a way to retry.
 * @see https://nextjs.org/docs/app/building-your-application/routing/error-handling
 */
export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error boundary caught:', error);
    }
  }, [error]);

  return (
    <div className="row">
      <div className="col-md-8 offset-md-2">
        <div className="alert alert-danger" role="alert">
          <h2 className="alert-heading">Something went wrong!</h2>
          <p className="mb-0">
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          {error.digest && (
            <p className="small text-muted mt-2">
              Error ID: {error.digest}
            </p>
          )}
          <hr />
          <button
            className="btn btn-primary"
            onClick={reset}
            type="button"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
