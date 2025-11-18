import Hero from './components/Hero';
import PostList from './components/PostList';

export default function Home() {
  return (
    <>
      <Hero imageUrl="/assets/img/header.jpg" alt="Site header" />
      <PostList showArchived={false} />
    </>
  );
}
