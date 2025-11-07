import { notFound } from 'next/navigation';
import { getAllPostSlugs, getPostData } from '@/lib/posts';
import type { Metadata } from 'next';

interface PostPageProps {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
}

// Generate static paths for all posts
export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  
  return posts.map(post => ({
    year: post.year,
    month: post.month,
    day: post.day,
    slug: post.slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  
  try {
    const post = await getPostData(year, month, day, slug);
    
    return {
      title: `${post.title} | Ben Balter`,
      description: post.description || post.title,
    };
  } catch {
    return {
      title: 'Post Not Found',
    };
  }
}

// Post page component
export default async function PostPage({ params }: PostPageProps) {
  const { year, month, day, slug } = await params;
  
  let post;
  try {
    post = await getPostData(year, month, day, slug);
  } catch {
    notFound();
  }

  const dateString = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <article className={`post post-${slug}`}>
            <h1 className="display-4 text-primary">{post.title}</h1>
            
            {post.archived && (
              <div className="alert alert-warning" role="alert">
                <strong>❗ Heads up!</strong> This post is archived and here for historical purposes. 
                It may no longer be accurate or reflect my views. Proceed at your own risk.
              </div>
            )}

            <div className="mb-2 text-muted small">
              Published {dateString}
            </div>

            <div 
              className="entrybody"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mb-2 text-muted small">
              Originally published {dateString} | 
              <a 
                className="link-secondary" 
                href={`https://github.com/benbalter/benbalter.github.com/commits/main/_posts/${year}-${month}-${day}-${slug}.md`}
                target="_blank" 
                rel="noopener"
              >
                {' '}View revision history
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
