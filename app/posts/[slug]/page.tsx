import { notFound } from 'next/navigation';
import { getPostData, getAllPostSlugs } from '@/lib/content';
import { formatDate } from '@/lib/utils';

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await getPostData(slug);
    return {
      title: `${post.title} - Ben Balter`,
      description: post.description,
    };
  } catch (error) {
    return {
      title: 'Post Not Found',
    };
  }
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;
  
  try {
    post = await getPostData(slug);
  } catch (error) {
    notFound();
  }

  return (
    <article>
      <header style={{ marginBottom: '30px' }}>
        <div className="post-date">{formatDate(post.date)}</div>
        <h1>{post.title}</h1>
        {post.description && (
          <p style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
            {post.description}
          </p>
        )}
      </header>
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
