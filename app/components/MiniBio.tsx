import Link from 'next/link';

interface MiniBioProps {
  className?: string;
  authorName: string;
  jobTitle: string;
  employerName: string;
}

export default function MiniBio({ className = '', authorName, jobTitle, employerName }: MiniBioProps) {
  return (
    <div className={`mini-bio ${className}`}>
      <div className="float-start pt-1 pe-3">
        <img
          src="https://github.com/benbalter.png?size=100"
          alt={authorName}
          className="avatar img-fluid rounded"
          width={100}
          height={100}
        />
      </div>
      <p>
        {authorName} is the {jobTitle} at {employerName}, 
        the world&apos;s largest software development platform.{' '}
        <Link href="/about/">More about the author &rarr;</Link>
      </p>
    </div>
  );
}
