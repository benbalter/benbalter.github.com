import { getPageBySlug, getAllPageSlugs } from '@/lib/pages';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';

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
  
  // Use centralized SEO metadata from lib/seo.ts
  return getPageMetadata(page, `/${slug}/`);
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  
  if (!page) {
    notFound();
  }
  
  const contentHtml = await markdownToHtml(page.content);
  
  return (
    <div className={`page page-${slug}`}>
      <div className="row">
        <div className="col-md-10 offset-md-1">
          {page.title && <h1 className="display-4 text-primary">{page.title}</h1>}
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>
      </div>
    </div>
  );
}
