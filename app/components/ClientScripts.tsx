'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ClientScripts component handles client-side JavaScript initialization for Next.js.
 * This replaces the functionality previously provided by bundle.js (Webpack build)
 * while maintaining backwards compatibility with Jekyll (which still uses bundle.js).
 *
 * Features:
 * - Bootstrap tooltip initialization
 *
 * Note: Other features such as heading anchors (AnchorJS), FontAwesome icon rendering,
 * and active navigation link highlighting are handled elsewhere in the codebase.
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
