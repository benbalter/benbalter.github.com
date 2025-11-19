import Link from 'next/link';
import Image from 'next/image';
import { markdownToHtml } from '@/lib/markdown';

interface MiniBioProps {
  className?: string;
  authorName: string;
  githubHandle: string;
  bioText: string;
}

export default async function MiniBio({ className = '', authorName, githubHandle, bioText }: MiniBioProps) {
  // Convert bio text markdown to HTML at build time
  const bioHtml = await markdownToHtml(bioText);
  
  // Append "More about the author" link to bio HTML
  const bioWithLink = bioHtml.replace(
    /<\/p>$/,
    ' <a href="/about/">More about the author &rarr;</a></p>'
  );
  
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
      <div dangerouslySetInnerHTML={{ __html: bioWithLink }} />
    </div>
  );
}
