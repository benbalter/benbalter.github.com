import Link from 'next/link';

interface MiniBioProps {
  className?: string;
}

export default function MiniBio({ className = '' }: MiniBioProps) {
  return (
    <div className={`mini-bio ${className}`}>
      <div className="float-start pt-1 pe-3">
        <img
          src="https://github.com/benbalter.png?size=100"
          alt="Ben Balter"
          className="avatar img-fluid rounded"
          width={100}
          height={100}
        />
      </div>
      <p>
        Ben Balter is the Director of Engineering Operations and Culture at GitHub, 
        the world&apos;s largest software development platform.{' '}
        <Link href="/about/">More about the author &rarr;</Link>
      </p>
    </div>
  );
}
