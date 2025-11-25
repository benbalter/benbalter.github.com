import { getClips } from '@/lib/data';
import type { Metadata } from 'next';
import { getPageMetadata, getWebPageJsonLd, getPageBreadcrumbJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';

const PAGE_PATH = '/press/';
const PAGE_DATA = {
  slug: 'press',
  title: 'Press',
  description: 'Select media clips of Ben Balter in the press talking about open source, open data, and government innovation.',
  content: '',
};

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata(PAGE_DATA, PAGE_PATH);
}

/**
 * Format date to "Month DD, YYYY" format
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PressPage() {
  const clips = getClips();
  
  // Sort clips by date in reverse chronological order
  const sortedClips = [...clips].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const webPageJsonLd = getWebPageJsonLd(PAGE_DATA, PAGE_PATH);
  const breadcrumbJsonLd = getPageBreadcrumbJsonLd(PAGE_DATA, PAGE_PATH);

  return (
    <>
      {/* WebPage structured data */}
      <JsonLdScript data={webPageJsonLd} scriptKey="webpage-schema" />
      
      {/* Breadcrumb structured data for navigation */}
      <JsonLdScript data={breadcrumbJsonLd} scriptKey="breadcrumb-schema" />
      
      <div className="page page-press">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <h1 className="display-4 text-primary">Press</h1>
            
            <p className="lead mb-4">
              <em>I regularly speak with the press about open source, open data, and innovation within government. Below are some highlights:</em>
            </p>

            <ul className="list-unstyled">
              {sortedClips.map((clip) => (
                <li key={clip.url} className="mb-3">
                  <a 
                    href={clip.url} 
                    className="title"
                    {...(clip.ignore_check && { 'data-proofer-ignore': 'true' })}
                  >
                    {clip.title}
                  </a>
                  <br />
                  <span className="small">
                    {clip.publication} | <em>{formatDate(clip.date)}</em>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
