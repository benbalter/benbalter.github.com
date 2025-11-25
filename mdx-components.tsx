import type { MDXComponents } from 'mdx/types';

/**
 * MDX Components configuration for @next/mdx plugin.
 * 
 * This file is required for MDX support in Next.js when using the @next/mdx package.
 * It allows customizing how MDX elements are rendered using React components.
 * 
 * The components defined here are used for MDX files imported directly as pages
 * or components. For markdown content processed through lib/markdown.ts 
 * (blog posts, pages), the existing remark/rehype pipeline is used instead.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/configuring/mdx
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Apply default components with any custom overrides
    // Examples of customizations you could add:
    // h1: (props) => <h1 className="text-4xl font-bold" {...props} />,
    // a: (props) => <a className="text-blue-600 hover:underline" {...props} />,
    // code: (props) => <code className="bg-gray-100 p-1 rounded" {...props} />,
    ...components,
  };
}
