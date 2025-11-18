import { getAllPosts } from '@/lib/posts';
import HeroHeader from './components/HeroHeader';
import PostsList from './components/PostsList';

export default function Home() {
  const posts = getAllPosts().filter(post => !post.archived);
  
  return (
    <>
      {/* Hero header image */}
      <HeroHeader imageUrl="/assets/img/header.jpg" alt="Ben Balter's Blog Header" />
      
      {/* Posts list */}
      <PostsList posts={posts} />
    </>
  );
}
