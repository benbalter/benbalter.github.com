import Link from 'next/link';
import Image from 'next/image';
import MarkdownContent from './MarkdownContent';

interface MiniBioProps {
  className?: string;
  authorName: string;
  githubHandle: string;
  bioText: string;
}

export default async function MiniBio({ className = '', authorName, githubHandle, bioText }: MiniBioProps) {
  // Append "More about the author" link to bio text as markdown
  const bioWithLink = `${bioText.trim()} [More about the author →](/about/)`;
  
  return (
    <div className={`mini-bio ${className}`}>
      <div className="float-start pt-1 pe-3">
        <Image
          src={`https://github.com/${githubHandle}.png?size=100`}
          alt={authorName}
          className="avatar img-fluid rounded"
          width={100}
          height={100}
        />
      </div>
      <MarkdownContent markdown={bioWithLink} />
    </div>
  );
}
