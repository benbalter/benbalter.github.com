'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Client component to initialize Bootstrap components
 * This component should be included in the root layout
 * 
 * Note: FontAwesome is now handled via React components (@fortawesome/react-fontawesome)
 * instead of DOM watching, which is more performant and type-safe
 * 
 * Note: Anchor links are now generated server-side using rehype-slug and rehype-autolink-headings
 * instead of client-side with AnchorJS, which is more performant and SEO-friendly
 */
export default function ClientScripts() {
  const pathname = usePathname();

  useEffect(() => {
    // Dynamically import Bootstrap JS on the client side
    import('bootstrap').then((bootstrap) => {
      // Initialize Bootstrap tooltips for all tooltip elements
      // Re-run on pathname change to initialize tooltips on newly rendered elements
      // after client-side navigation
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        // Check if tooltip is already initialized to avoid duplicates
        const existingTooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (!existingTooltip) {
          new bootstrap.Tooltip(tooltipTriggerEl);
        }
      });
    });
  }, [pathname]);

  return null;
}
