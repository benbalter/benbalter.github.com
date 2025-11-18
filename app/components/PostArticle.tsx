import { ReactNode } from 'react';
import PostHeader from './PostHeader';
import PostDescription from './PostDescription';
import ArchivedWarning from './ArchivedWarning';
import ReadingTime from './ReadingTime';
import PostContent from './PostContent';
import PostMetadata from './PostMetadata';
import PostFooter from './PostFooter';

interface PostArticleProps {
  slug: string;
  title: string;
  description?: string;
  archived?: boolean;
  content: string;
  contentHtml: string;
  publishDate: string;
  revisionHistoryUrl: string;
  authorName: string;
  githubHandle: string;
  bioText: string;
  editUrl: string;
}

/**
 * PostArticle component (Server Component)
 * Displays the complete article structure with all sections
 * Works with SSG - no client-side JavaScript needed
 */
export default function PostArticle({
  slug,
  title,
  description,
  archived,
  content,
  contentHtml,
  publishDate,
  revisionHistoryUrl,
  authorName,
  githubHandle,
  bioText,
  editUrl,
}: PostArticleProps) {
  return (
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <article id={`post-${slug}`} className={`post post-${slug}`}>
          <PostHeader title={title} />
          
          {description && (
            <PostDescription description={description} />
          )}
          
          {archived && (
            <ArchivedWarning />
          )}
          
          <ReadingTime content={content} />
          
          <PostContent contentHtml={contentHtml} />
          
          <PostMetadata 
            publishDate={publishDate}
            revisionHistoryUrl={revisionHistoryUrl}
          />
          
          <PostFooter
            authorName={authorName}
            githubHandle={githubHandle}
            bioText={bioText}
            editUrl={editUrl}
            postSlug={slug}
          />
        </article>
      </div>
    </div>
  );
}
