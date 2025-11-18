import Link from 'next/link';

/**
 * Callout component for GitHub culture-related posts.
 * Displays a link to the recommended reading post about GitHub's culture.
 * This is a server component - no client-side JavaScript needed.
 */
export default function GitHubCultureCallout() {
  return (
    <div className="alert alert-primary text-center" role="alert">
      Interested in learning more about how GitHub works and what it&apos;s like to be a GitHubber?<br />
      <Link 
        href="/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/" 
        className="alert-link"
      >
        Check out these popular posts on GitHub&apos;s culture and communication patterns
      </Link>
      .
    </div>
  );
}
