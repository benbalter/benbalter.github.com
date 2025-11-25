'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Import FontAwesome
import { config, library, dom } from '@fortawesome/fontawesome-svg-core';
import { faRss } from '@fortawesome/free-solid-svg-icons/faRss';
import { faRetweet } from '@fortawesome/free-solid-svg-icons/faRetweet';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons/faLinkedin';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faAddressCard } from '@fortawesome/free-solid-svg-icons/faAddressCard';
import { faBluesky } from '@fortawesome/free-brands-svg-icons/faBluesky';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { faHeart } from '@fortawesome/free-regular-svg-icons/faHeart';

// Configure FontAwesome
config.mutateApproach = 'sync';
library.add(
  faRss,
  faTwitter,
  faLinkedin,
  faGithub,
  faEnvelope,
  faAddressCard,
  faRetweet,
  faHeart,
  faClock,
  faBluesky
);

/**
 * ClientScripts component handles client-side JavaScript initialization for Next.js
 * This replaces the functionality previously provided by bundle.js (Webpack build)
 * while maintaining backwards compatibility with Jekyll (which still uses bundle.js)
 * 
 * Features:
 * - Bootstrap tooltip initialization
 * - AnchorJS for heading anchors
 * - FontAwesome icon rendering
 * - Active navigation link highlighting
 */
export default function ClientScripts() {
  const pathname = usePathname();

  useEffect(() => {
    // Initialize FontAwesome DOM watching
    dom.watch();

    // Dynamically import AnchorJS (it's a client-only library)
    const initAnchorJS = async () => {
      const AnchorJS = (await import('anchor-js')).default;
      const anchors = new AnchorJS();
      anchors.add();
    };
    initAnchorJS();

    // Initialize Bootstrap tooltips
    const initTooltips = async () => {
      const { Tooltip } = await import('bootstrap');
      const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
      tooltipElements.forEach((el) => {
        new Tooltip(el);
      });
    };
    initTooltips();
  }, []);

  // Update active navigation link when pathname changes
  useEffect(() => {
    const navLinks = document.querySelectorAll('[data-nav-path]');
    navLinks.forEach((link) => {
      const navPath = link.getAttribute('data-nav-path');
      link.classList.remove('active');
      if (navPath === pathname) {
        link.classList.add('active');
      }
    });
  }, [pathname]);

  return null;
}
