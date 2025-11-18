import PostsListWithDescription from './PostsListWithDescription';
import TopPostsList from './TopPostsList';

interface EnhancedPostContentProps {
  contentHtml: string;
  postData: {
    posts?: string[] | Record<string, string>;
    roles?: string[];
    [key: string]: any;
  };
}

export default function EnhancedPostContent({ contentHtml, postData }: EnhancedPostContentProps) {
  // Check if we need to inject components
  const hasPostsList = postData.posts && Array.isArray(postData.posts) && contentHtml.includes('<!-- POSTS_LIST_PLACEHOLDER -->');
  const hasRolesList = postData.roles && Array.isArray(postData.roles) && contentHtml.includes('<!-- ROLES_LIST_PLACEHOLDER -->');
  const hasTopPostsList = postData.posts && typeof postData.posts === 'object' && !Array.isArray(postData.posts) && contentHtml.includes('<!-- TOP_POSTS_LIST_PLACEHOLDER -->');
  
  if (!hasPostsList && !hasRolesList && !hasTopPostsList) {
    // No special processing needed, render as-is
    return (
      <div className="entrybody" dangerouslySetInnerHTML={{ __html: contentHtml }} />
    );
  }
  
  // Split content by placeholders and reconstruct with components
  if (hasPostsList && hasRolesList) {
    const parts = contentHtml.split('<!-- POSTS_LIST_PLACEHOLDER -->');
    const beforePosts = parts[0] || '';
    const afterPostsPart = parts[1] || '';
    const afterPosts = afterPostsPart.split('<!-- ROLES_LIST_PLACEHOLDER -->');
    const betweenLists = afterPosts[0] || '';
    const afterRoles = afterPosts[1] || '';
    
    return (
      <div className="entrybody">
        <div dangerouslySetInnerHTML={{ __html: beforePosts }} />
        <PostsListWithDescription postUrls={postData.posts as string[]} />
        <div dangerouslySetInnerHTML={{ __html: betweenLists }} />
        <PostsListWithDescription postUrls={postData.roles as string[]} />
        <div dangerouslySetInnerHTML={{ __html: afterRoles }} />
      </div>
    );
  }
  
  if (hasTopPostsList) {
    const parts = contentHtml.split('<!-- TOP_POSTS_LIST_PLACEHOLDER -->');
    const beforeList = parts[0] || '';
    const afterList = parts[1] || '';
    return (
      <div className="entrybody">
        <div dangerouslySetInnerHTML={{ __html: beforeList }} />
        <TopPostsList posts={postData.posts as Record<string, string>} />
        <div dangerouslySetInnerHTML={{ __html: afterList }} />
      </div>
    );
  }
  
  // Fallback
  return (
    <div className="entrybody" dangerouslySetInnerHTML={{ __html: contentHtml }} />
  );
}
