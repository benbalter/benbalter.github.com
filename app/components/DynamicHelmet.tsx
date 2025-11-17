'use client';

import { Helmet } from 'react-helmet-async';

/**
 * Example client component showing how to use React Helmet for dynamic metadata.
 * 
 * This demonstrates how to update document head tags on the client side when needed.
 * For most cases, you should use Next.js's generateMetadata() function instead,
 * as it's more performant for static site generation.
 * 
 * Use this pattern only when you need to:
 * - Update metadata based on client-side state or interactions
 * - Modify head tags dynamically after the page loads
 * - Override server-rendered metadata conditionally
 * 
 * @example
 * ```tsx
 * import DynamicHelmet from '@/app/components/DynamicHelmet';
 * 
 * function MyPage() {
 *   return (
 *     <>
 *       <DynamicHelmet
 *         title="Dynamic Page Title"
 *         description="This updates on the client side"
 *       />
 *       <div>Page content...</div>
 *     </>
 *   );
 * }
 * ```
 */
export default function DynamicHelmet({
  title,
  description,
  keywords,
}: {
  title?: string;
  description?: string;
  keywords?: string[];
}) {
  return (
    <Helmet>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords.join(', ')} />}
    </Helmet>
  );
}
