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
            <div 
              className="placeholder-glow"
              style={{ 
                backgroundColor: '#e9ecef', 
                height: '3rem', 
                width: '70%',
                borderRadius: '0.25rem' 
              }}
            />
          </header>
          
          <div className="placeholder-glow">
            <div 
              className="mb-3"
              style={{ 
                backgroundColor: '#e9ecef', 
                height: '1rem', 
                width: '100%',
                borderRadius: '0.25rem' 
              }}
            />
            <div 
              className="mb-3"
              style={{ 
                backgroundColor: '#e9ecef', 
                height: '1rem', 
                width: '90%',
                borderRadius: '0.25rem' 
              }}
            />
            <div 
              className="mb-3"
              style={{ 
                backgroundColor: '#e9ecef', 
                height: '1rem', 
                width: '95%',
                borderRadius: '0.25rem' 
              }}
            />
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
