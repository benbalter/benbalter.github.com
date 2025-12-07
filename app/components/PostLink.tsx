import Link from 'next/link';
import { getAllPosts, getPostUrlParts } from '@/lib/posts';
import { remark } from 'remark';
import strip from 'strip-markdown';
import { processEmoji } from '@/lib/emoji';

interface PostLinkProps {
  url: string;
}

/**
 * Render markdown description as plain text, stripping all formatting and links.
 */
async function renderDescription(description: string): Promise<string> {
  const processedMarkdown = processEmoji(description);
  
  const result = await remark()
    .use(strip)
    .process(processedMarkdown);
  
  return result.toString().trim();
}

/**
 * PostLink component for MDX
 * Displays a post's title and description as a list item, given its URL.
 * Server component for static site generation.
 * 
 * Usage in MDX:
 * <PostLink url="/2023/03/02/github-for-non-technical-roles/" />
 */
export default async function PostLink({ url }: PostLinkProps) {
  const posts = getAllPosts();
  
  // Find the post by matching its URL
  const post = posts.find(p => {
    const { url: postUrl } = getPostUrlParts(p);
    return postUrl === url || postUrl === `${url}/` || `${postUrl}/` === url;
  });
  
  if (!post) {
    // Fallback: render just the URL as a link if post not found
    return (
      <li>
        <strong><Link href={url}>{url}</Link></strong>
      </li>
    );
  }
  
  const { url: postUrl } = getPostUrlParts(post);
  
  // Render markdown in description as plain text
  const descriptionText = post.description 
    ? await renderDescription(post.description) 
    : null;
  
  return (
    <li>
      <strong><Link href={postUrl}>{post.title}</Link></strong>
      {descriptionText && <> — {descriptionText}</>}
    </li>
  );
}
