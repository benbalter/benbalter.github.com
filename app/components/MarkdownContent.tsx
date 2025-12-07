import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { getSiteConfig } from '@/lib/config';
import { processEmoji } from '@/lib/emoji';
import remarkKramdownAttrs from '@/lib/remark-kramdown-attrs';
import type { Schema } from 'hast-util-sanitize';

interface MarkdownContentProps {
  markdown: string;
  className?: string;
}

/**
 * Remove Jekyll-specific Liquid template syntax from markdown.
 * Liquid templates like {% capture %}, {% include %}, {{ variables }}
 * are Jekyll-specific and won't work in Next.js.
 */
function removeLiquidSyntax(markdown: string): string {
  // Remove Liquid template tags
  let result = markdown.replace(/\{%[\s\S]*?%\}/g, '');
  
  // Remove Liquid output tags {{ ... }}
  result = result.replace(/\{\{[\s\S]*?\}\}/g, '');
  
  // Remove Jekyll-specific {:toc} markers
  result = result.replace(/\{:toc\}/g, '');
  
  return result;
}

/**
 * Markdown content renderer using remark/rehype pipeline.
 * 
 * This component processes markdown to HTML at build time using a traditional
 * remark/rehype pipeline. This approach is chosen over MDX compilation for
 * regular markdown because:
 * 
 * 1. MDX interprets { } as JSX expressions, breaking content with curly braces
 * 2. Legacy content may contain Liquid syntax that needs removal, not parsing
 * 3. Better compatibility with kramdown-style attribute lists {: .class }
 * 
 * For content that needs React components, use MDX files (.mdx) instead.
 * 
 * Features:
 * - GitHub Flavored Markdown (GFM)
 * - Emoji processing (:emoji: syntax)
 * - GitHub references (@mentions, #issues)
 * - Heading IDs and anchor links
 * - Kramdown-style attribute lists {: .class }
 * - Raw HTML support
 * - HTML sanitization for security
 * 
 * @see https://github.com/remarkjs/remark
 */
export default async function MarkdownContent({ markdown, className = '' }: MarkdownContentProps) {
  const config = getSiteConfig();
  
  // Pre-process: emoji and remove Liquid syntax
  const processedMarkdown = removeLiquidSyntax(processEmoji(markdown));
  
  // Create custom sanitization schema
  const sanitizeSchema: Schema = {
    ...defaultSchema,
    clobberPrefix: '',
    attributes: {
      ...defaultSchema.attributes,
      '*': [
        ...(defaultSchema.attributes?.['*'] || []),
        ['data*'],
        'style',
        'className',
      ],
      a: [
        ...(defaultSchema.attributes?.a || []).filter(
          attr => !(Array.isArray(attr) && attr[0] === 'className')
        ),
        'className',
      ],
      span: [
        ...(defaultSchema.attributes?.span || []),
        'className',
      ],
      img: [
        ...(defaultSchema.attributes?.img || []),
        'className',
      ],
      table: [
        ...(defaultSchema.attributes?.table || []),
        'className',
      ],
      p: [
        ...(defaultSchema.attributes?.p || []),
        'className',
      ],
    },
  };
  
  const result = await remark()
    .use(remarkGfm)
    .use(remarkGithub, {
      repository: config.repository,
      mentionStrong: false,
    })
    .use(remarkKramdownAttrs)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
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
    })
    .use(rehypeSanitize, sanitizeSchema)
    .use(rehypeStringify)
    .process(processedMarkdown);

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: result.toString() }}
    />
  );
}
