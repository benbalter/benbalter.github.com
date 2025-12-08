/**
 * security.txt - Security Policy and Contact Information
 * 
 * Generates security.txt file at /.well-known/security.txt per RFC 9116.
 * This file provides security researchers with contact information and policies.
 * This replaces the Jekyll template version at the root.
 * 
 * Reference: https://securitytxt.org/
 */

import type { APIRoute } from 'astro';
import { siteConfig } from '../../config';

export const GET: APIRoute = () => {
  // Calculate expiration date (180 days from now)
  const now = new Date();
  const expiresDate = new Date(now.getTime() + (180 * 24 * 60 * 60 * 1000));
  const expiresISO = expiresDate.toISOString();
  
  const content = `Contact: mailto:${siteConfig.email}
Expires: ${expiresISO}
Encryption: https://ben.balter.com/key.asc
Canonical: https://ben.balter.com/.well-known/security.txt
Policy: https://github.com/${siteConfig.githubRepo}/security/policy
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
