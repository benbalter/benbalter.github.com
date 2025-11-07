import { notFound } from 'next/navigation';
import { getPageData, getAllPageSlugs } from '@/lib/content';

export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({
    page: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  try {
    const pageData = await getPageData(page);
    return {
      title: `${pageData.title} - Ben Balter`,
      description: pageData.description,
    };
  } catch (error) {
    return {
      title: 'Page Not Found',
    };
  }
}

export default async function Page({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  let pageData;
  
  try {
    pageData = await getPageData(page);
  } catch (error) {
    notFound();
  }

  return (
    <article>
      <header style={{ marginBottom: '30px' }}>
        <h1>{pageData.title}</h1>
        {pageData.description && (
          <p style={{ fontSize: '18px', color: '#666', marginTop: '10px' }}>
            {pageData.description}
          </p>
        )}
      </header>
      <div 
        className="page-content"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />
    </article>
  );
}
