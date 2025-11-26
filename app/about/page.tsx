import { getPageBySlug } from '@/lib/pages';
import { getContactLinks, getPgpKey, getSiteConfig } from '@/lib/config';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPageMetadata, getPersonJsonLd } from '@/lib/seo';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownContent from '@/app/components/MarkdownContent';
import ContactLinks from '@/app/components/ContactLinks';
import PageLayout from '@/app/components/PageLayout';

const PAGE_PATH = '/about/';

export async function generateMetadata(): Promise<Metadata> {
  const page = getPageBySlug('about');
  
  if (!page) {
    return {};
  }
  
  return getPageMetadata(page, PAGE_PATH);
}

export default async function AboutPage() {
  const page = getPageBySlug('about');
  
  if (!page) {
    notFound();
  }
  
  const config = getSiteConfig();
  const contactLinks = getContactLinks();
  const pgpKey = getPgpKey();
  
  // Link to raw headshot image - use branch from config
  const headshotUrl = `https://github.com/${config.repository}/raw/${config.branch}/assets/img/headshot.jpg`;
  
  // Person JSON-LD for about page
  const personJsonLd = getPersonJsonLd();
  
  return (
    <PageLayout 
      page={page} 
      path={PAGE_PATH}
      additionalJsonLd={[{ data: personJsonLd, scriptKey: 'person-schema' }]}
    >
      {/* Headshot image floated to the right */}
      <div className="float-end ms-3 mb-2 w-25">
        <Link href={headshotUrl}>
          <Image
            src={`https://github.com/${config.handle}.png?size=250`}
            alt={config.author.name}
            className="avatar img-fluid rounded"
            width={250}
            height={250}
          />
        </Link>
      </div>
      
      <MarkdownContent markdown={page.content} />
      
      <ContactLinks contactLinks={contactLinks} pgpKey={pgpKey} />
    </PageLayout>
  );
}
