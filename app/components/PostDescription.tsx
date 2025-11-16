import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import { getSiteConfig } from '@/lib/config';

interface PostDescriptionProps {
  description: string;
}

export default function PostDescription({ description }: PostDescriptionProps) {
  const config = getSiteConfig();
  
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
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkGithub, { repository: config.repository, mentionStrong: false }],
        ]}
        components={{
          // Remove paragraph wrapper to keep content inline
          p: ({ children }) => <>{children}</>,
        }}
      >
        {description}
      </ReactMarkdown>
    </div>
  );
}
