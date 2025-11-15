import { getPageBySlug, getAllPageSlugs } from '@/lib/pages';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  
  if (!page) {
    return {};
  }
  
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  
  if (!page) {
    notFound();
  }
  
  const contentHtml = await markdownToHtml(page.content);
  
  return (
    <div>
      {page.title && <h1>{page.title}</h1>}
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
