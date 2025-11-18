import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getSiteConfig } from '@/lib/config';
import { processEmoji } from '@/lib/emoji';

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
  
  // Process emoji before markdown conversion
  const markdownWithEmoji = processEmoji(markdown);
  
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkGithub, { repository: config.repository, mentionStrong: false }],
        ]}
        rehypePlugins={[
          rehypeRaw, // Allow HTML in markdown
          rehypeSlug, // Add IDs to headings
          // Add anchor links to headings with GitHub-style behavior
          [rehypeAutolinkHeadings, {
            behavior: 'append',
            properties: {
              className: ['anchor-link'],
              ariaLabel: 'Link to this section',
            },
            content: {
              type: 'element',
              tagName: 'span',
              properties: { className: ['anchor-icon'] },
              children: [{ type: 'text', value: ' #' }],
            },
          }],
          rehypeSanitize, // Sanitize HTML for security (should be last)
        ]}
      >
        {markdownWithEmoji}
      </ReactMarkdown>
    </div>
  );
}
