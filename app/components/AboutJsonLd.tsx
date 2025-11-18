import { getSiteConfig } from '@/lib/config';

/**
 * AboutJsonLd component
 * Generates JSON-LD structured data for Person schema
 * Replaces {% include about-json-ld.html %}
 */
export default function AboutJsonLd() {
  const config = getSiteConfig();

  const jsonLd = {
    '@context': 'http://schema.org',
    '@type': 'Person',
    name: config.title,
    email: config.email,
    image: config.url + '/assets/img/headshot.jpg',
    url: config.url + '/',
    jobTitle: config.job_title,
    worksFor: {
      '@type': 'Organization',
      name: config.employer.name,
      url: config.employer.url,
    },
    sameAs: config.social.links,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
