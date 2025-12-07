/**
 * Shared MDX Components for Next.js markdown rendering
 * 
 * This file provides custom React components to replace default HTML elements
 * when rendering markdown/MDX content. Used by both MarkdownContent and MdxPostContent.
 * 
 * Benefits of centralizing components:
 * - Consistent rendering across all markdown content
 * - Single source of truth for component overrides
 * - Easier to maintain and update styling/behavior
 * 
 * @see https://nextjs.org/docs/app/building-your-application/configuring/mdx
 */

import Link from 'next/link';
import Image from 'next/image';
import type { MDXComponents } from 'mdx/types';

// Import custom components for MDX posts
import Callout from '@/app/components/Callout';
import FossAtScale from '@/app/components/FossAtScale';
import GitHubCultureCallout from '@/app/components/GitHubCultureCallout';
import PostLink from '@/app/components/PostLink';

/**
 * Custom link component that uses Next.js Link for internal navigation
 */
function CustomLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  // External links use regular anchor tags
  if (href?.startsWith('http') || href?.startsWith('mailto:')) {
    return (
      <a href={href} {...props} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  // Internal links use Next.js Link component for client-side navigation
  return (
    <Link href={href || '#'} {...props}>
      {children}
    </Link>
  );
}

/**
 * Custom image component that uses Next.js Image for optimization
 */
function CustomImage({ src, alt, ...props }: { src?: string; alt?: string; [key: string]: unknown }) {
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={alt || ''}
      width={800}
      height={400}
      className="img-fluid"
      {...props}
    />
  );
}

/**
 * MDX components configuration
 * Provides custom components to replace default HTML elements in MDX/markdown files.
 */
export const mdxComponents: MDXComponents = {
  // Custom components for use in MDX posts (Liquid syntax replacements)
  Callout,
  FossAtScale,
  GitHubCultureCallout,
  PostLink,
  Link,
  
  // Override default HTML elements
  a: CustomLink,
  img: CustomImage,
};

/**
 * Get MDX components with optional overrides
 * Useful when specific pages need additional or different components
 */
export function getMdxComponents(overrides: MDXComponents = {}): MDXComponents {
  return {
    ...mdxComponents,
    ...overrides,
  };
}
