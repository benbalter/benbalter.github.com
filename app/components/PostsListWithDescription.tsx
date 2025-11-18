import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

interface PostsListWithDescriptionProps {
  postUrls: string[];
}

export default function PostsListWithDescription({ postUrls }: PostsListWithDescriptionProps) {
  const allPosts = getAllPosts();
  
  return (
    <ul>
      {postUrls.map(url => {
        // Find post by matching the URL path
        const post = allPosts.find(p => {
          // URL format: /YYYY/MM/DD/slug/
          const parts = url.split('/').filter(Boolean);
          if (parts.length >= 4) {
            const postSlug = `${parts[0]}-${parts[1]}-${parts[2]}-${parts[3]}`;
            return p.slug === postSlug;
          }
          return false;
        });
        
        if (!post) {
          return null;
        }
        
        // Strip HTML tags from description if needed
        const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');
        const description = post.description ? stripHtml(post.description) : '';
        
        return (
          <li key={url}>
            <strong>
              <Link href={url}>{post.title}</Link>
            </strong>
            {description && ` — ${description}`}
          </li>
        );
      })}
    </ul>
  );
}
