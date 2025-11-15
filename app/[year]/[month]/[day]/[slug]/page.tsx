import { getAllPosts, findPostByDate } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';

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
  
  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        {post.description && <p>{post.description}</p>}
        <time dateTime={post.date}>{post.date}</time>
      </header>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
}
