import type { APIRoute } from 'astro';
import { siteConfig } from '../config';

/**
 * vCard endpoint - generates a downloadable contact card
 * Replicates the Jekyll vcard.vcf functionality
 */

// Get name parts for vCard format (Last;First)
const nameParts = siteConfig.author.split(' ');
const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
const firstName = nameParts.slice(0, -1).join(' ');

// Generate filename from author name (e.g., "Ben Balter" -> "ben-balter.vcf")
const vcfFilename = `${siteConfig.author.toLowerCase().replace(/\s+/g, '-')}.vcf`;

export const GET: APIRoute = () => {
  const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${siteConfig.author}
N:${lastName};${firstName}
NICKNAME:@${siteConfig.socialUsername}
EMAIL:${siteConfig.email}
KEY;TYPE=PGP:${siteConfig.url}/key.asc
PHOTO;TYPE=JPEG;VALUE=URI:${siteConfig.url}/assets/img/headshot.jpg
SOURCE:${siteConfig.url}/vcard.vcf
TITLE:${siteConfig.jobTitle.replace(/,/g, '\\,')}
ORG:${siteConfig.employer}
TZ:${siteConfig.timezone}
URL:${siteConfig.url}
END:VCARD`;

  return new Response(vCardContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard',
      'Content-Disposition': `attachment; filename="${vcfFilename}"`,
    },
  });
};
