import MiniBio from './MiniBio';
import EditButton from './EditButton';

interface PostFooterProps {
  authorName: string;
  githubHandle: string;
  bioText: string;
  editUrl: string;
  postSlug: string;
}

/**
 * PostFooter component (Server Component)
 * Displays author bio and edit button at the end of a post
 * Works with SSG - no client-side JavaScript needed
 */
export default function PostFooter({ 
  authorName, 
  githubHandle, 
  bioText, 
  editUrl, 
  postSlug 
}: PostFooterProps) {
  return (
    <div className="row border-top pt-3">
      <div className="col">
        <MiniBio 
          authorName={authorName}
          githubHandle={githubHandle}
          bioText={bioText}
        />
      </div>
      <EditButton editUrl={editUrl} postSlug={postSlug} />
    </div>
  );
}
