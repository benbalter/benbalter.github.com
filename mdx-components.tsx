import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import Image from 'next/image';

/**
 * MDX Components configuration for Next.js
 * Provides custom components to replace default HTML elements in MDX files.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/configuring/mdx
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Use Next.js Link for internal links with client-side navigation
    a: ({ href, children, ...props }) => {
      // External links use regular anchor tags
      if (href?.startsWith('http') || href?.startsWith('mailto:')) {
        return (
          <a href={href} {...props} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      }
      // Internal links use Next.js Link component
      return (
        <Link href={href || '#'} {...props}>
          {children}
        </Link>
      );
    },
    // Use Next.js Image for optimized image loading
    img: ({ src, alt, ...props }) => {
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
    },
    // Allow component overrides
    ...components,
  };
}
