import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { getSiteConfig } from '@/lib/config';

interface MarkdownContentProps {
  markdown: string;
  className?: string;
}

/**
 * Markdown content renderer using react-markdown
 * Server component for static site generation (SSG)
 * Replaces dangerouslySetInnerHTML with safer React component rendering
 * 
 * Benefits:
 * - Type-safe React components instead of HTML strings
 * - Better integration with React ecosystem
 * - Automatic sanitization with rehype-sanitize
 * - No dangerouslySetInnerHTML
 * - Works with SSG (no client-side JavaScript needed)
 */
export default function MarkdownContent({ markdown, className = '' }: MarkdownContentProps) {
  const config = getSiteConfig();
  
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkGithub, { repository: config.repository, mentionStrong: false }],
        ]}
        rehypePlugins={[
          rehypeRaw, // Allow HTML in markdown
          rehypeSanitize, // Sanitize HTML for security
        ]}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
