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

/**
 * Escape special characters in vCard values according to RFC 6350
 * Backslashes must be escaped first, then commas, then semicolons, then newlines
 */
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, '\\\\')  // Escape backslashes first
    .replace(/,/g, '\\,')    // Escape commas
    .replace(/;/g, '\\;')    // Escape semicolons
    .replace(/\n/g, '\\n');  // Escape newlines
}

export const GET: APIRoute = () => {
  const vCardContent = `BEGIN:VCARD
VERSION:3.0
FN:${escapeVCardValue(siteConfig.author)}
N:${escapeVCardValue(lastName)};${escapeVCardValue(firstName)}
NICKNAME:@${escapeVCardValue(siteConfig.socialUsername)}
EMAIL:${siteConfig.email}
KEY;TYPE=PGP:${siteConfig.url}/key.asc
PHOTO;TYPE=JPEG;VALUE=URI:${siteConfig.url}/assets/img/headshot.jpg
SOURCE:${siteConfig.url}/vcard.vcf
TITLE:${escapeVCardValue(siteConfig.jobTitle)}
ORG:${escapeVCardValue(siteConfig.employer)}
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
