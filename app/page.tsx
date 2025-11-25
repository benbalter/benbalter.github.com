import { getAllPosts } from '@/lib/posts';
import { getHomePageMetadata, getWebsiteJsonLd } from '@/lib/seo';
import { JsonLdScript } from 'next-seo';
import type { Metadata } from 'next';
import HeroHeader from './components/HeroHeader';
import PostsList from './components/PostsList';

export function generateMetadata(): Metadata {
  return getHomePageMetadata();
}

export default function Home() {
  const posts = getAllPosts().filter(post => !post.archived);
  const websiteJsonLd = getWebsiteJsonLd();
  
  return (
    <>
      {/* WebSite structured data for search engines */}
      <JsonLdScript data={websiteJsonLd} scriptKey="website-schema" />
      
      {/* Hero header image */}
      <HeroHeader imageUrl="/assets/img/header.jpg" alt="Ben Balter's Blog Header" />
      
      {/* Posts list */}
      <PostsList posts={posts} />
    </>
  );
}
