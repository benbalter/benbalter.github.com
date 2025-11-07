import { getAllPosts } from '@/lib/posts';
import Link from 'next/link';

export default async function Home() {
  const posts = await getAllPosts();
  
  // Filter out archived posts
  const activePosts = posts.filter(post => !post.archived);

  return (
    <>
      {activePosts.map(post => (
        <div key={`${post.year}-${post.month}-${post.day}-${post.slug}`} className="row mb-2">
          <div className="col-sm-9">
            <Link href={`/${post.year}/${post.month}/${post.day}/${post.slug}/`}>
              {post.title}
            </Link>
          </div>
          <div className="col-sm-3 text-muted text-md-end">
            <small>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </small>
          </div>
        </div>
      ))}
    </>
  );
}
