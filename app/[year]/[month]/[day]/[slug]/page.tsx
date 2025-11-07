import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map(post => post.params);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const post = getPostBySlug(year, month, day, slug);
  
  return {
    title: post.title,
    description: post.description || post.title,
  };
}

export default async function PostPage({ params }: Props) {
  const { year, month, day, slug } = await params;
  const post = getPostBySlug(year, month, day, slug);
  const content = await markdownToHtml(post.content);
  
  // Security note: dangerouslySetInnerHTML is used here for markdown content.
  // All content comes from _posts/ directory which is controlled by the site owner.
  // post.title and post.description are rendered as React text children and are
  // automatically escaped by React to prevent XSS.
  
  return (
    <main>
      <article>
        <header>
          <h1>{post.title}</h1>
          {post.description && <p className="description">{post.description}</p>}
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </main>
  );
}
