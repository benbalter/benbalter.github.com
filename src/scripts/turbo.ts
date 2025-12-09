/**
 * Turbo Drive Initialization
 * 
 * Turbo Drive speeds up page navigation by intercepting link clicks and form submissions,
 * using fetch() to replace the page body instead of doing full page reloads.
 * This provides a faster, app-like experience while maintaining SSG benefits.
 * 
 * @see https://turbo.hotwired.dev/handbook/drive
 */

// Import Turbo for its side effects - it automatically starts when imported
import '@hotwired/turbo';
