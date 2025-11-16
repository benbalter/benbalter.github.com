import Link from 'next/link';

interface MiniBioProps {
  className?: string;
  authorName: string;
  githubHandle: string;
  bioText: string;
}

export default function MiniBio({ className = '', authorName, githubHandle, bioText }: MiniBioProps) {
  return (
    <div className={`mini-bio ${className}`}>
      <div className="float-start pt-1 pe-3">
        <img
          src={`https://github.com/${githubHandle}.png?size=100`}
          alt={authorName}
          className="avatar img-fluid rounded"
          width={100}
          height={100}
        />
      </div>
      <p>
        {bioText}{' '}
        <Link href="/about/">More about the author &rarr;</Link>
      </p>
    </div>
  );
}
