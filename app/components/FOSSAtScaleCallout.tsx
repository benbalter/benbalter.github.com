import Link from 'next/link';
import Callout from './Callout';

interface FOSSAtScaleCalloutProps {
  nth: string;
}

/**
 * FOSSAtScaleCallout component (Server Component)
 * Displays a callout linking to the "managing open source at scale" series
 * Matches Jekyll's foss-at-scale.html include
 */
export default function FOSSAtScaleCallout({ nth }: FOSSAtScaleCalloutProps) {
  return (
    <Callout>
      This is the {nth} post in{' '}
      <Link 
        href="/2021/06/15/managing-open-source-communities-at-scale" 
        className="alert-link"
      >
        a series
      </Link>{' '}
      on successfully managing open source communities at scale.
    </Callout>
  );
}
