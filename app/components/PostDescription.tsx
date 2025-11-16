import { markdownToHtml } from '@/lib/markdown';

interface PostDescriptionProps {
  description: string;
}

export default async function PostDescription({ description }: PostDescriptionProps) {
  // Convert markdown to HTML and strip paragraph tags to keep it inline
  // This matches Jekyll's behavior: markdownify | replace: "<p>", "" | replace: "</p>", ""
  const descriptionHtml = await markdownToHtml(description);
  const inlineHtml = descriptionHtml.replace(/<\/?p>/g, '');
  
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
      <span dangerouslySetInnerHTML={{ __html: inlineHtml }} />
    </div>
  );
}
