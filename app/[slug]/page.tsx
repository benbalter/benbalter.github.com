import { getPageBySlug, getAllPageSlugs } from '@/lib/pages';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo';
import ClipsList from '@/app/components/ClipsList';
import ResumePositions from '@/app/components/ResumePositions';
import { EducationSection, CertificationsSection } from '@/app/components/ResumeEducation';
import BooksList from '@/app/components/BooksList';

interface Degree {
  school: string;
  degree: string;
  date: string;
}

interface Certification {
  authority: string;
  name: string;
  url?: string;
}

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
  
  // Handle special pages with custom layouts
  if (slug === 'press') {
    const introContent = page.content.split('<ul class="list-unstyled">')[0] || page.content.split('<!-- CLIPS_LIST_PLACEHOLDER -->')[0] || page.content;
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
  
  if (slug === 'resume') {
    const degrees = page.degrees as Degree[] || [];
    const certifications = page.certifications as Certification[] || [];
    
    return (
      <div className="page page-resume">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <h1 className="display-4 text-primary">{page.title}</h1>
            
            <h2>Experience</h2>
            <ResumePositions />
            
            <h2>Education</h2>
            <EducationSection degrees={degrees} />
            
            <h2>Certifications</h2>
            <CertificationsSection certifications={certifications} />
          </div>
        </div>
      </div>
    );
  }
  
  if (slug === 'other-recommended-reading') {
    const booksPerRow = page.books_per_row || 3;
    const descriptionHtml = await markdownToHtml(page.description || '');
    const styledDescription = descriptionHtml.replace(
      /a href=/g,
      'a class="link-secondary" href='
    );
    
    return (
      <div className="page page-other-recommended-reading">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <h1 className="display-4 text-primary">{page.title}</h1>
            
            <div className="lead mb-2" dangerouslySetInnerHTML={{ __html: styledDescription }} />
            
            <BooksList booksPerRow={booksPerRow} />
          </div>
        </div>
      </div>
    );
  }
  
  // Default page rendering
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
