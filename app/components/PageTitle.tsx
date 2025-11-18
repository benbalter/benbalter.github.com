interface PageTitleProps {
  title: string;
  className?: string;
}

/**
 * Page title component
 * Server component for static site generation
 * Displays a large, styled page title
 */
export default function PageTitle({ title, className = '' }: PageTitleProps) {
  return (
    <h1 className={`display-4 text-primary ${className}`}>
      {title}
    </h1>
  );
}
