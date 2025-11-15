import { getAllPosts, findPostByDate } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';
import ReadingTime from '@/app/components/ReadingTime';
import MiniBio from '@/app/components/MiniBio';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
}

// Use React's cache() for proper request-level memoization during SSG
const getCachedPosts = cache(() => getAllPosts());

export async function generateStaticParams() {
  const posts = getCachedPosts();

  return posts.map(post => {
    const [year, month, day, ...rest] = post.slug.split('-');

    return {
      year,
      month,
      day,
      slug: rest.join('-'),
    };
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const posts = getCachedPosts();
  const post = findPostByDate(posts, year, month, day, slug);
  
  if (!post) {
    return {};
  }
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function Post({ params }: PageProps) {
  const { year, month, day, slug } = await params;
  const posts = getCachedPosts();
  const post = findPostByDate(posts, year, month, day, slug);
  
  if (!post) {
    notFound();
  }
  
  const contentHtml = await markdownToHtml(post.content);
  const publishDate = new Date(post.date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return (
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <article id={`post-${post.slug}`} className={`post post-${post.slug}`}>
          <h1 className="display-4 text-primary">{post.title}</h1>
          
          {post.description && (
            <div className="alert alert-info" role="alert">
              <strong>TL;DR:</strong> {post.description}
            </div>
          )}
          
          {post.archived && (
            <div className="alert alert-warning" role="alert">
              <strong>❗ Heads up!</strong> This post is archived and here for historical purposes. 
              It may no longer be accurate or reflect my views. Proceed at your own risk.
            </div>
          )}
          
          <ReadingTime content={post.content} />
          
          <div className="entrybody" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          
          <div className="mb-2 text-muted small">
            Originally published {publishDate} | {' '}
            <Link 
              href={`https://github.com/benbalter/benbalter.github.com/commits/main/_posts/${post.slug}.md`}
              className="link-secondary"
              target="_blank"
              rel="noopener"
            >
              View revision history
            </Link>
          </div>
          
          <div className="row border-top pt-3">
            <div className="col">
              <MiniBio />
            </div>
            <div className="col-lg-2 text-center pb-3">
              <p>
                <small>This page is open source. Please help improve it.</small>
              </p>
              <Link 
                className="btn btn-outline-primary btn-lg btn-sm"
                href={`https://github.com/benbalter/benbalter.github.com/edit/main/_posts/${post.slug}.md`}
                title={`Help improve article ${post.slug}.md`}
              >
                Edit
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
