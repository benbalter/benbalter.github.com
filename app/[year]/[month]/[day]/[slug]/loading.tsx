import Skeleton from '@/app/components/Skeleton';

/**
 * Loading state for blog post pages.
 * Displays a skeleton/placeholder while the post content is being loaded.
 */
export default function PostLoading() {
  return (
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <article className="post">
          <header className="mb-4">
            <Skeleton height="3rem" width="70%" />
          </header>
          
          <div>
            <Skeleton width="100%" className="mb-3" />
            <Skeleton width="90%" className="mb-3" />
            <Skeleton width="95%" className="mb-3" />
          </div>
          
          <div className="text-center py-3">
            <div className="spinner-border spinner-border-sm text-muted" role="status">
              <span className="visually-hidden">Loading post...</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
