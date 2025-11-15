'use client';

import { useEffect } from 'react';

/**
 * Client component to initialize Bootstrap components and FontAwesome
 * This component should be included in the root layout
 */
export default function ClientScripts() {
  useEffect(() => {
    // Dynamically import Bootstrap JS on the client side
    import('bootstrap').then((bootstrap) => {
      // Initialize Bootstrap components
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });

    // Initialize FontAwesome
    import('@fortawesome/fontawesome-svg-core').then((fontawesome) => {
      fontawesome.config.mutateApproach = 'sync';
      fontawesome.dom.watch();
    });
  }, []);

  return null;
}
