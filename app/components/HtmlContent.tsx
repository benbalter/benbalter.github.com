interface HtmlContentProps {
  html: string;
  className?: string;
}

/**
 * HTML content component
 * Server component for static site generation
 * Safely renders pre-processed HTML content
 * 
 * This component is used for content that has already been processed
 * and sanitized by our markdown processor (remark/rehype pipeline).
 * It provides a cleaner API than using dangerouslySetInnerHTML directly.
 */
export default function HtmlContent({ html, className = '' }: HtmlContentProps) {
  return (
    <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
