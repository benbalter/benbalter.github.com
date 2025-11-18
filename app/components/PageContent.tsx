interface PageContentProps {
  slug: string;
  title?: string;
  contentHtml: string;
}

/**
 * PageContent component (Server Component)
 * Displays a generic page with title and content
 * Works with SSG - no client-side JavaScript needed
 */
export default function PageContent({ slug, title, contentHtml }: PageContentProps) {
  return (
    <div className={`page page-${slug}`}>
      <div className="row">
        <div className="col-md-10 offset-md-1">
          {title && <h1 className="display-4 text-primary">{title}</h1>}
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </div>
    </div>
  );
}
