/**
 * Structured Data (JSON-LD) Utilities
 * 
 * Generate Schema.org structured data in JSON-LD format for improved SEO.
 * Uses the open source schema-dts library from Google for type-safe Schema.org types.
 * 
 * @see https://github.com/google/schema-dts
 */

import type {
  Person,
  PersonLeaf,
  Organization,
  WebSite,
  BlogPosting,
  BreadcrumbList,
  ListItemLeaf,
  WithContext,
  WithActionConstraints,
  Graph,
  Thing,
  Occupation,
  EducationalOrganization,
  EducationalOccupationalCredential,
  ImageObject,
  ProfilePage,
  CollectionPage,
  SearchActionLeaf,
} from 'schema-dts';
import { siteConfig } from '../config';

/** Ben's canonical social/profile URLs — shared by every schema that carries a
 * `sameAs` (top-level Person and each post's BlogPosting author). */
const SAME_AS: string[] = [
  siteConfig.githubUsername && `https://github.com/${siteConfig.githubUsername}`,
  siteConfig.socialUsername && `https://twitter.com/${siteConfig.socialUsername}`,
  siteConfig.linkedinUrl,
  siteConfig.mastodonUrl,
  siteConfig.blueskyUrl,
  'https://www.amazon.com/author/benbalter',
].filter(Boolean) as string[];

/** Every schema this module emits, for the serializers below. */
type SiteSchema = WithContext<Person | Organization | WebSite | BlogPosting | BreadcrumbList | ProfilePage | CollectionPage>;

/**
 * Base Person fields (shared between top-level and embedded schemas).
 *
 * Typed as PersonLeaf, not Person: schema-dts's `Person` is a union that
 * includes `string` (a bare URL reference), which can't be spread or have
 * properties deleted. PersonLeaf is the plain object form.
 */
function personFields(overrides?: Partial<PersonLeaf>): PersonLeaf {
  const person: PersonLeaf = {
    '@type': 'Person',
    name: siteConfig.author,
    url: siteConfig.url,
    email: siteConfig.email,
    // Currently between full-time roles: no worksFor/jobTitle is asserted.
    // GitHub is represented as a former affiliation. (On the resume page,
    // generateResumeSchema overrides worksFor/alumniOf from résumé data.)
    alumniOf: {
      '@type': 'Organization',
      name: siteConfig.formerEmployer,
      url: siteConfig.formerEmployerUrl,
    },
    sameAs: SAME_AS,
    image: `${siteConfig.url}/assets/img/headshot.jpg`,
  };

  if (!overrides) return person;

  const merged: PersonLeaf = { ...person, ...overrides };
  // Strip explicitly-passed `undefined` overrides so they don't serialize as
  // missing-but-present keys or violate exactOptionalPropertyTypes consumers.
  for (const key of Object.keys(merged) as Array<keyof PersonLeaf>) {
    if (merged[key] === undefined) {
      delete merged[key];
    }
  }
  return merged;
}

/**
 * Generate top-level Person schema (with @context) for standalone use
 */
export function generatePersonSchema(overrides?: Partial<PersonLeaf>): WithContext<PersonLeaf> {
  return { '@context': 'https://schema.org', '@id': `${siteConfig.url}/#person`, ...personFields(overrides) };
}

/**
 * Generate ProfilePage schema for the homepage.
 * Google supports ProfilePage as a rich result type for creator/personal pages.
 * @see https://developers.google.com/search/docs/appearance/structured-data/profile-page
 */
export function generateProfilePageSchema(): WithContext<ProfilePage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: siteConfig.url,
    // The @id lets consumers consolidate this Person with the #person
    // references in the sibling WebSite and BlogPosting schemas.
    mainEntity: { '@id': `${siteConfig.url}/#person`, ...personFields() },
  };
}

/**
 * Generate WebSite schema for the blog.
 *
 * Includes a SearchAction `potentialAction` describing the site's on-page
 * (Pagefind-powered) search so Google can understand the site has a search
 * surface even though there is no sitelinks searchbox rendered in SERPs.
 */
export function generateWebSiteSchema(): WithContext<WebSite> {
  // WithActionConstraints adds schema.org's `<property>-input` annotations,
  // which is how SearchAction declares its `query-input`.
  const searchAction: WithActionConstraints<SearchActionLeaf> = {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.url}/?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: siteConfig.author,
      url: siteConfig.url,
    },
    description: siteConfig.description,
    inLanguage: 'en',
    potentialAction: searchAction,
  };
}

/**
 * Generate BlogPosting schema for blog posts
 */
export function generateBlogPostingSchema(props: {
  title: string;
  description?: string | undefined;
  url: string;
  publishedTime: Date;
  modifiedTime?: Date | undefined;
  image?: string | undefined;
  author?: string | undefined;
  wordCount?: number | undefined;
}): WithContext<BlogPosting> {
  const { title, description, url, publishedTime, modifiedTime, image, author, wordCount } = props;

  const absoluteImage = image
    ? (image.startsWith('http') ? image : `${siteConfig.url}${image}`)
    : `${siteConfig.url}/assets/img/headshot.jpg`;

  // Our generated OG cards (/og/…png) are always 1200x630, so expose them as an
  // ImageObject with dimensions. Frontmatter/legacy images are arbitrary sizes —
  // leave those as a bare URL and let scrapers measure them.
  const imageValue: BlogPosting['image'] = image?.startsWith('/og/')
    // The one cast schema-dts needs here: it types width/height as Distance (a
    // string) or QuantitativeValue, but Google accepts (and prefers) plain
    // pixel numbers for image dimensions.
    ? ({ '@type': 'ImageObject', url: absoluteImage, width: 1200, height: 630 } as unknown as ImageObject)
    : absoluteImage;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    ...(description !== undefined ? { description } : {}),
    image: imageValue,
    datePublished: publishedTime.toISOString(),
    dateModified: modifiedTime?.toISOString() || publishedTime.toISOString(),
    author: {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: author || siteConfig.author,
      url: siteConfig.url,
      image: `${siteConfig.url}/assets/img/headshot.jpg`,
      // Match the site-wide Person's social profiles so the byline carries the
      // same authorship/credibility signals.
      sameAs: SAME_AS,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/assets/img/headshot.jpg`,
      },
    },
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
    },
    ...(wordCount ? { wordCount } : {}),
    inLanguage: 'en',
    isAccessibleForFree: true,
  };
}

/**
 * Generate BreadcrumbList schema for navigation.
 *
 * Each breadcrumb item should have a `name` and may optionally have a `url`.
 * If `url` is omitted or an empty string, the item is treated as the current page
 * (i.e., the last breadcrumb item without a link), which is required for Schema.org compliance.
 *
 * @param items - Array of breadcrumb items, each with a `name` and optional `url`.
 * @returns BreadcrumbList schema in JSON-LD format.
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string | undefined }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      // Only add item URL and @id if it's not empty (last item in breadcrumb)
      const element: ListItemLeaf = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        ...(item.url ? { item: item.url, '@id': item.url } : {}),
      };
      return element;
    }),
  };
}

interface ResumeSchemaProps {
  positions: Array<{
    employer: string;
    title: string;
    startDate: string;
    endDate?: string;
  }>;
  degrees?: Array<{
    school: string;
    degree: string;
    date: string;
  }>;
  certifications?: Array<{
    authority: string;
    name: string;
    url?: string;
  }>;
}

/**
 * Generate Person schema enriched with resume data
 */
export function generateResumeSchema(props: ResumeSchemaProps): WithContext<PersonLeaf> {
  const { positions, degrees, certifications } = props;

  // Positions become work history (hasOccupation).
  //
  // Occupation has no typed field for employer or dates, so the title carries
  // `name` and the employer + year range ride along in `description` (inherited
  // from Thing) — the only schema.org-valid place to surface them here.
  const hasOccupation: Occupation[] = positions.map(position => {
    const startYear = position.startDate.slice(0, 4);
    const endYear = position.endDate ? position.endDate.slice(0, 4) : 'present';
    return {
      '@type': 'Occupation',
      name: position.title,
      description: `${position.title} at ${position.employer} (${startYear}–${endYear})`,
    };
  });

  // Unlike the sitewide Person (which stays employer-neutral during transitions),
  // the résumé asserts the current role — the page already renders it as the
  // present position. The current role is the one with no end date.
  const currentRole = positions.find(position => !position.endDate);

  const alumniOf: EducationalOrganization[] | undefined = degrees?.map(degree => ({
    '@type': 'EducationalOrganization',
    name: degree.school,
  }));

  const hasCredential: EducationalOccupationalCredential[] | undefined = certifications?.map(cert => ({
    '@type': 'EducationalOccupationalCredential',
    name: cert.name,
    credentialCategory: 'Professional Certification',
    recognizedBy: {
      '@type': 'Organization',
      name: cert.authority,
    },
    ...(cert.url && { url: cert.url }),
  }));

  const schema = generatePersonSchema({
    hasOccupation,
    ...(currentRole
      ? {
          jobTitle: currentRole.title,
          worksFor: {
            '@type': 'Organization',
            name: currentRole.employer,
            url: 'https://open-and-async.com',
          },
        }
      : {}),
    ...(alumniOf !== undefined ? { alumniOf } : {}),
    ...(hasCredential !== undefined ? { hasCredential } : {}),
  });

  // personFields() injects a default alumniOf (the former employer). The résumé
  // supplies its own alumniOf from degrees; when there are none, drop the
  // inherited default so it doesn't shadow the résumé's work history.
  if (alumniOf === undefined) {
    delete schema.alumniOf;
  }

  return schema;
}

/**
 * Convert schema object to JSON-LD script tag content
 * Handles both single schemas and arrays of schemas
 */
export function schemaToJsonLd(schema: SiteSchema | SiteSchema[]): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Wrap multiple schemas in a single @graph envelope for JSON-LD.
 * Strips individual @context from each schema and adds a single top-level @context.
 */
export function schemaToGraphJsonLd(schemas: SiteSchema[]): string {
  const graph: Graph = {
    '@context': 'https://schema.org',
    // Exclude the bare-string member of schema-dts's unions so the object can
    // be destructured; everything this module builds is an object.
    '@graph': schemas.map((s) => {
      const { '@context': _, ...rest } = s as Exclude<SiteSchema, string>;
      return rest as Thing;
    }),
  };
  return JSON.stringify(graph, null, 2);
}

/**
 * Generate CollectionPage schema for listing pages (e.g., /posts/)
 */
export function generateCollectionPageSchema(props: {
  name: string;
  description: string;
  url: string;
  posts: Array<{ url: string; title: string }>;
}): WithContext<CollectionPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': props.url,
    name: props.name,
    description: props.description,
    url: props.url,
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}/#website`,
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: props.posts.length,
      itemListOrder: 'https://schema.org/ItemListOrderDescending',
      itemListElement: props.posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: post.url,
        name: post.title,
      })),
    },
  };
}
