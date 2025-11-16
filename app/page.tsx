import { getAllPosts, getPostUrlParts } from '@/lib/posts';
import { getSiteConfig } from '@/lib/config';
import { jsonLdScriptProps } from 'react-schemaorg';
import type { WebSite, Person } from 'schema-dts';
import Link from 'next/link';

export default function Home() {
  const posts = getAllPosts().filter(post => !post.archived);
  const config = getSiteConfig();
  
  return (
    <>
      {/* JSON-LD structured data for SEO */}
      <script
        {...jsonLdScriptProps<WebSite>({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: config.title,
          description: config.description,
          url: config.url,
          author: {
            '@type': 'Person',
            name: config.author.name,
          },
        })}
      />
      <script
        {...jsonLdScriptProps<Person>({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: config.author.name,
          url: config.url,
          sameAs: config.social.links,
          jobTitle: config.job_title,
          worksFor: {
            '@type': 'Organization',
            name: config.employer.name,
            url: config.employer.url,
          },
        })}
      />
      
      {/* Hero header image */}
      <div 
        className="hero-unit rounded-top position-relative mb-3" 
        style={{ 
          backgroundImage: 'url(/assets/img/header.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'top left',
          height: '400px'
        }}
      >
        &nbsp;
      </div>
      
      {/* Posts list */}
      {posts.map(post => {
        const { url } = getPostUrlParts(post);
        
        return (
          <div className="row mb-2" key={post.slug}>
            <div className="col-sm-9">
              <Link href={url}>{post.title}</Link>
            </div>
            <div className="col-sm-3 text-muted text-md-end">
              <small>
                {new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </small>
            </div>
          </div>
        );
      })}
    </>
  );
}
