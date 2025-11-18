import Link from 'next/link';

interface PostListItemProps {
  title: string;
  url: string;
  date: string;
}

/**
 * PostListItem component (Server Component)
 * Displays a single post in the list with title and date
 * Works with SSG - no client-side JavaScript needed
 */
export default function PostListItem({ title, url, date }: PostListItemProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="row mb-2">
      <div className="col-sm-9">
        <Link href={url}>{title}</Link>
      </div>
      <div className="col-sm-3 text-muted text-md-end">
        <small>{formattedDate}</small>
      </div>
    </div>
  );
}
