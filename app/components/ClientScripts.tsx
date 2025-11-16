'use client';

import { useEffect } from 'react';

/**
 * Client component to initialize Bootstrap components
 * This component should be included in the root layout
 * 
 * Note: FontAwesome is now handled via React components (@fortawesome/react-fontawesome)
 * instead of DOM watching, which is more performant and type-safe
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
  }, []);

  return null;
}
