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
    // Track tooltip instances for cleanup
    // Using Bootstrap.Tooltip type would require importing it, but we dynamically import Bootstrap
    // so we define a minimal interface matching the dispose method we need
    interface BootstrapTooltip { dispose(): void }
    const tooltipInstances: BootstrapTooltip[] = [];
    let isMounted = true;

    // Dynamically import Bootstrap JS on the client side
    import('bootstrap').then((bootstrap) => {
      // Don't initialize if component was unmounted during import
      if (!isMounted) return;

      // Initialize Bootstrap tooltips for all tooltip elements
      // Re-run on pathname change to initialize tooltips on newly rendered elements
      // after client-side navigation
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        // Check if tooltip is already initialized to avoid duplicates
        const existingTooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (!existingTooltip) {
          const tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
          tooltipInstances.push(tooltip);
        }
      });
    });

    // Cleanup function to dispose tooltips when pathname changes
    // This prevents memory leaks from orphaned tooltip instances
    return () => {
      isMounted = false;
      tooltipInstances.forEach(tooltip => tooltip.dispose());
    };
  }, [pathname]);

  return null;
}
