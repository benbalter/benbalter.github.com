'use client';

import { HelmetProvider as ReactHelmetProvider } from 'react-helmet-async';

/**
 * Client component wrapper for React Helmet Async provider.
 * 
 * This component provides React Helmet context for any child components
 * that need to dynamically modify document head tags on the client side.
 * 
 * Note: Next.js's native Metadata API should be used for static metadata
 * in server components. This Helmet provider is only needed for dynamic
 * client-side metadata changes.
 */
export default function HelmetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactHelmetProvider>
      {children}
    </ReactHelmetProvider>
  );
}
