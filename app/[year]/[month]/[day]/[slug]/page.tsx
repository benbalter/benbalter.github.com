import { getPostByDate, getAllPostParams } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Params {
  year: string;
  month: string;
  day: string;
  slug: string;
}

export async function generateStaticParams() {
  return getAllPostParams();
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { year, month, day, slug } = params;
  const post = getPostByDate(year, month, day, slug);
  
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

export default async function Post({ params }: { params: Params }) {
  const { year, month, day, slug } = params;
  const post = getPostByDate(year, month, day, slug);
  
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
