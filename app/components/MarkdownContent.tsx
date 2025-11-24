import { markdownToHtml } from '@/lib/markdown';

interface MarkdownContentProps {
  markdown: string;
  className?: string;
  context?: Record<string, any>;
}

/**
 * Optimized markdown content renderer for SSG (Static Site Generation)
 * 
 * This component processes markdown to HTML at build time, not runtime.
 * 
 * Benefits over react-markdown:
 * - Smaller JavaScript bundle (eliminates react-markdown dependency ~88KB)
 * - Faster page loads (no runtime markdown processing)
 * - Better SSG performance (processing happens once at build time)
 * - Maintains security with rehype-sanitize
 * - Still a server component (no client-side JS)
 * 
 * The markdownToHtml function handles:
 * - Liquid template syntax (Jekyll compatibility)
 * - GitHub Flavored Markdown (GFM)
 * - Emoji processing
 * - GitHub references (@mentions, #issues)
 * - Heading IDs and anchor links
 * - HTML sanitization
 */
export default async function MarkdownContent({ markdown, className = '', context }: MarkdownContentProps) {
  // Convert markdown to HTML at build time, including liquid template processing
  const html = await markdownToHtml(markdown, context);
  
  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
