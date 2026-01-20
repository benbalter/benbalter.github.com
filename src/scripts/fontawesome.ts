/**
 * Font Awesome Icon Initialization
 * 
 * This script initializes Font Awesome icons on the page using the library
 * installed via npm. This is more performant than loading from a CDN.
 */

import { library, dom } from '@fortawesome/fontawesome-svg-core';

// Import only the icons we actually use on the site
import { 
  faCalendar,
  faClock,
  faEdit,
} from '@fortawesome/free-regular-svg-icons';

import {
  faRss,
  faEnvelope,
  faHeart,
  faArrowLeft,
  faEdit as faEditSolid,
  faAddressCard,
  faCloud,
} from '@fortawesome/free-solid-svg-icons';

import {
  faGithub,
  faTwitter,
  faLinkedin,
  faMastodon,
  faBluesky,
} from '@fortawesome/free-brands-svg-icons';

// Add icons to the library
library.add(
  // Regular icons
  faCalendar,
  faClock,
  faEdit,
  // Solid icons
  faRss,
  faEnvelope,
  faHeart,
  faArrowLeft,
  faEditSolid,
  faAddressCard,
  faCloud,
  // Brand icons
  faGithub,
  faTwitter,
  faLinkedin,
  faMastodon,
  faBluesky
);

// Watch the DOM for any icon tags and replace them
dom.watch();

// Re-process icons after Astro View Transitions navigation
// This ensures FontAwesome icons render correctly after client-side navigation
document.addEventListener('astro:page-load', () => {
  // Convert all <i> tags to <svg> after navigation
  dom.i2svg();
});
