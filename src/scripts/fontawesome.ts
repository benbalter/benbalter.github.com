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
