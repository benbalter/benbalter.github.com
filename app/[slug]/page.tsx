import { getPageBySlug, getAllPageSlugs } from '@/lib/pages';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import MarkdownContent from '@/app/components/MarkdownContent';
import PageLayout from '@/app/components/PageLayout';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Disable dynamic params - only allow statically generated paths
// This ensures 404 for any unknown slugs at build time (SSG best practice)
export const dynamicParams = false;

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
  
  // Use centralized SEO metadata from lib/seo.ts
  return getPageMetadata(page, `/${slug}/`);
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  
  if (!page) {
    notFound();
  }
  
  const path = `/${slug}/`;
  
  return (
    <PageLayout page={page} path={path}>
      <MarkdownContent markdown={page.content} />
    </PageLayout>
  );
}
