import Link from 'next/link';

/**
 * FossAtScale component
 * Displays a callout for the FOSS at Scale series
 * Replaces {% include foss-at-scale.html nth="..." %}
 */

interface FossAtScaleProps {
  nth: string;
}

export default function FossAtScale({ nth }: FossAtScaleProps) {
  return (
    <div className="alert alert-primary text-center" role="alert">
      This is the {nth} post in{' '}
      <Link
        href="/2021/06/15/managing-open-source-communities-at-scale/"
        className="alert-link"
      >
        a series
      </Link>{' '}
      on successfully managing open source communities at scale.
    </div>
  );
}
