import Link from 'next/link';
import Callout from './Callout';

interface FossAtScaleProps {
  nth: string;
}

/**
 * A callout component for the FOSS at Scale blog post series.
 * Equivalent to Jekyll's _includes/foss-at-scale.html
 * 
 * @param nth - The position in the series (e.g., "first", "second", "third")
 */
export default function FossAtScale({ nth }: FossAtScaleProps) {
  return (
    <Callout>
      This is the {nth} post in{' '}
      <Link 
        href="/2021/06/15/managing-open-source-communities-at-scale/" 
        className="alert-link"
      >
        a series
      </Link>
      {' '}on successfully managing open source communities at scale.
    </Callout>
  );
}
