/**
 * Root loading component - displays while pages are being generated or loaded.
 * @see https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming
 */
export default function Loading() {
  return (
    <div className="row">
      <div className="col-md-8 offset-md-2 text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading content...</p>
      </div>
    </div>
  );
}
