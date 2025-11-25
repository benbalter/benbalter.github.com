import { inlineMarkdownToHtml } from '@/lib/markdown';

interface PostDescriptionProps {
  description: string;
}

/**
 * Post description component (Server Component)
 * Displays the TL;DR summary of a blog post with markdown support.
 * Uses build-time HTML generation instead of runtime ReactMarkdown
 * for smaller bundle size and better SSG performance.
 */
export default async function PostDescription({ description }: PostDescriptionProps) {
  // Convert markdown to HTML at build time
  const descriptionHtml = await inlineMarkdownToHtml(description);
  
  return (
    <div className="lead">
      <strong>
        <abbr 
          title="&quot;Too Long; Didn't Read&quot; &mdash; Internet shorthand for &quot;a brief summary of longer writing&quot;" 
          className="initialism" 
          data-bs-toggle="tooltip" 
          data-bs-placement="right"
        >
          TL;DR
        </abbr>
        :{' '}
      </strong>
      <span dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
    </div>
  );
}
