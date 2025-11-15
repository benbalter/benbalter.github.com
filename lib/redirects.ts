/**
 * Legacy URL redirects from Jekyll
 * 
 * TypeScript types and utilities for handling redirects from YAML frontmatter.
 * Redirects are parsed from source files by script/generate-redirects.mjs
 * 
 * Types:
 * - redirect_from: Legacy URLs that should redirect to current pages
 * - redirect_to: Current URLs that should redirect to external sites
 */

export interface Redirect {
  source: string;
  destination: string;
  type: 'redirect_from' | 'redirect_to';
}
