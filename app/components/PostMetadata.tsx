import Link from 'next/link';

interface PostMetadataProps {
  publishDate: string;
  revisionHistoryUrl: string;
}

export default function PostMetadata({ publishDate, revisionHistoryUrl }: PostMetadataProps) {
  return (
    <div className="mb-2 text-muted small">
      Originally published {publishDate} | {' '}
      <Link 
        href={revisionHistoryUrl}
        className="link-secondary"
        target="_blank"
        rel="noopener"
      >
        View revision history
      </Link>
    </div>
  );
}
