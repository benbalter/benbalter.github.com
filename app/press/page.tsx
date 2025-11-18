import { getPageBySlug } from '@/lib/pages';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import ClipsList from '@/app/components/ClipsList';

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('press');
  
  if (!page) {
    return {};
  }
  
  return getPageMetadata(page, '/press/');
}

export default async function PressPage() {
  const page = getPageBySlug('press');
  
  if (!page) {
    notFound();
  }
  
  // Get the content before the list (the intro paragraph)
  const introContent = page.content.split('<ul class="list-unstyled">')[0] || page.content;
  const introHtml = await markdownToHtml(introContent);
  
  return (
    <div className="page page-press">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <h1 className="display-4 text-primary">{page.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: introHtml }} />
          <ClipsList />
        </div>
      </div>
    </div>
  );
}
