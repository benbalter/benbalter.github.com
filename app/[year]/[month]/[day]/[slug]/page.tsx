import { getAllPosts, findPostByDate } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cache } from 'react';
import ReadingTime from '@/app/components/ReadingTime';
import MiniBio from '@/app/components/MiniBio';
import PostHeader from '@/app/components/PostHeader';
import PostDescription from '@/app/components/PostDescription';
import ArchivedWarning from '@/app/components/ArchivedWarning';
import PostContent from '@/app/components/PostContent';
import PostMetadata from '@/app/components/PostMetadata';
import EditButton from '@/app/components/EditButton';
import { getSiteConfig, getAuthorBio } from '@/lib/config';
import { getPostMetadata } from '@/lib/metadata';

// Load site configuration
const config = getSiteConfig();
const authorBio = getAuthorBio();

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
  
  // Use the centralized metadata configuration for consistency
  return getPostMetadata(post);
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
  
  const revisionHistoryUrl = `${config.url.replace(/\/$/, '')}/${config.repository}/commits/${config.branch}/_posts/${post.slug}.md`;
  const editUrl = `${config.url.replace(/\/$/, '')}/${config.repository}/edit/${config.branch}/_posts/${post.slug}.md`;
  
  return (
    <div className="row">
      <div className="col-md-10 offset-md-1">
        <article id={`post-${post.slug}`} className={`post post-${post.slug}`}>
          <PostHeader title={post.title} />
          
          {post.description && (
            <PostDescription description={post.description} />
          )}
          
          {post.archived && (
            <ArchivedWarning />
          )}
          
          <ReadingTime content={post.content} />
          
          <PostContent contentHtml={contentHtml} />
          
          <PostMetadata 
            publishDate={publishDate}
            revisionHistoryUrl={revisionHistoryUrl}
          />
          
          <div className="row border-top pt-3">
            <div className="col">
              <MiniBio 
                authorName={config.author.name}
                githubHandle={config.handle}
                bioText={authorBio}
              />
            </div>
            <EditButton editUrl={editUrl} postSlug={post.slug} />
          </div>
        </article>
      </div>
    </div>
  );
}
