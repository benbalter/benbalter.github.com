import Link from 'next/link';

interface TopPost {
  title: string;
  url: string;
}

interface TopPostsListProps {
  posts: Record<string, string>;
}

export default function TopPostsList({ posts }: TopPostsListProps) {
  const postEntries = Object.entries(posts).map(([title, url]) => ({ title, url }));
  
  return (
    <ol reversed>
      {postEntries.map((post, index) => (
        <li key={post.url} style={{ marginBottom: '1em' }}>
          <Link href={post.url}>{post.title}</Link>
        </li>
      ))}
    </ol>
  );
}
