/**
 * vCard Endpoint
 * 
 * Generates a vCard file with contact information.
 * Endpoint for /vcard.vcf
 */

import type { APIRoute } from 'astro';
import { siteConfig } from '../config';

export const GET: APIRoute = () => {
  const nameParts = siteConfig.author.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(' ');
  
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${siteConfig.author}
N:${lastName};${firstName}
NICKNAME:@${siteConfig.socialUsername}
EMAIL:${siteConfig.email}
KEY;TYPE=PGP:${siteConfig.url}/key.asc
PHOTO;TYPE=JPEG;VALUE=URI:${siteConfig.url}/assets/img/headshot.jpg
SOURCE:${siteConfig.url}/vcard.vcf
URL:${siteConfig.url}
END:VCARD`;

  return new Response(vcard, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard',
      'Content-Disposition': 'attachment; filename="ben-balter.vcf"'
    }
  });
};
