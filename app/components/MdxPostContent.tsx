import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { getSiteConfig } from '@/lib/config';
import { mdxComponents } from '@/lib/mdx-components';
import { processEmoji } from '@/lib/emoji';

interface MdxPostContentProps {
  content: string;
}

/**
 * Clean MDX content by removing Jekyll/kramdown-specific syntax.
 * MDX files may have been converted from Jekyll but still contain legacy syntax.
 */
function cleanMdxContent(content: string): string {
  // Remove kramdown-style attribute lists {: .class } which MDX interprets as JSX
  let result = content.replace(/\{:\s*[^}]+\s*\}/g, '');
  
  // Remove Jekyll-specific {:toc} markers
  result = result.replace(/\{:toc\s*\}/g, '');
  
  return result;
}

/**
 * Renders MDX content for posts.
 * Uses next-mdx-remote/rsc for server-side MDX compilation with shared components.
 * 
 * Features:
 * - GitHub Flavored Markdown (GFM)
 * - Emoji processing (:emoji: syntax)
 * - GitHub references (@mentions, #issues)
 * - Heading IDs and anchor links
 * - Custom React components (Callout, FossAtScale, etc.)
 * 
 * @see lib/mdx-components.tsx for shared component definitions
 */
export default async function MdxPostContent({ content }: MdxPostContentProps) {
  const config = getSiteConfig();
  
  // Pre-process: clean MDX content and process emoji
  const processedContent = cleanMdxContent(processEmoji(content));
  
  const { content: compiledContent } = await compileMDX({
    source: processedContent,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          [remarkGithub, { 
            repository: config.repository, 
            mentionStrong: false,
          }],
        ],
        rehypePlugins: [
          rehypeSlug,
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
        ],
      },
    },
  });

  return (
    <div className="entrybody">
      {compiledContent}
    </div>
  );
}
