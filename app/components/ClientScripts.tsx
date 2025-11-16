'use client';

import { useEffect } from 'react';

/**
 * Client component to initialize Bootstrap and AnchorJS
 * This component should be included in the root layout
 * 
 * Note: FontAwesome is now handled via React components (@fortawesome/react-fontawesome)
 * instead of DOM watching, which is more performant and type-safe
 */
export default function ClientScripts() {
  useEffect(() => {
    // Dynamically import Bootstrap JS and AnchorJS on the client side
    import('bootstrap').then((bootstrap) => {
      // Initialize Bootstrap components
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    });

    // Initialize AnchorJS for heading anchor links
    import('anchor-js').then((AnchorJS) => {
      const anchors = new AnchorJS.default();
      anchors.add('h2, h3, h4, h5, h6');
    });
  }, []);

  return null;
}
