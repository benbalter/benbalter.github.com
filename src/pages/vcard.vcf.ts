import type { APIRoute } from 'astro';
import {
  VCARD,
  FNProperty,
  NProperty,
  NicknameProperty,
  EmailProperty,
  KeyProperty,
  PhotoProperty,
  SourceProperty,
  TitleProperty,
  OrgProperty,
  TzProperty,
  URLProperty,
  TextType,
  TextListType,
  SpecialValueType,
  URIType,
  MediatypeParameter,
  ParameterValueType,
} from 'vcard4';
import { siteConfig } from '../config';

/**
 * vCard endpoint - generates a downloadable contact card using vcard4 library
 * Replicates the Jekyll vcard.vcf functionality with RFC 6350 compliance
 */

/**
 * Sanitize filename to only allow safe characters (alphanumeric, hyphens, underscores, periods)
 * This prevents HTTP header injection attacks via Content-Disposition header
 */
function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9\-_.]/g, ''); // Remove any unsafe characters
}

// Generate filename from author name (e.g., "Ben Balter" -> "ben-balter.vcf")
const vcfFilename = `${sanitizeFilename(siteConfig.author)}.vcf`;

export const GET: APIRoute = () => {
  // Get name parts for vCard N property (Last;First)
  const nameParts = siteConfig.author.split(' ');
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  const firstName = nameParts.slice(0, -1).join(' ');

  // Create vCard using vcard4 library
  const vcard = new VCARD([
    // FN (Formatted Name) - Required property
    new FNProperty([], new TextType(siteConfig.author)),

    // N (Name) - Family name; Given name; Additional names; Honorific prefixes; Honorific suffixes
    // All 5 parts are required per RFC 6350
    // Using empty TextListType arrays for empty components (additional names, suffixes)
    // Note: TextType requires non-empty strings, so we cannot use empty strings for single-value components
    new NProperty(
      [],
      new SpecialValueType('nproperty', [
        new TextType(lastName || ' '),                      // Family name
        new TextType(firstName || ' '),                     // Given name
        new TextListType([]),                               // Additional names (empty)
        new TextType(' '),                                  // Honorific prefixes (empty - TextType doesn't accept '')
        new TextListType([]),                               // Honorific suffixes (empty)
      ])
    ),

    // NICKNAME
    new NicknameProperty([], new TextType(`@${siteConfig.socialUsername}`)),

    // EMAIL
    new EmailProperty([], new TextType(siteConfig.email)),

    // KEY (PGP key URL)
    // Using MEDIATYPE parameter to indicate PGP key type per vCard 4.0 spec
    new KeyProperty(
      [new MediatypeParameter(new ParameterValueType('application/pgp-keys'))],
      new URIType(`${siteConfig.url}/key.asc`)
    ),

    // PHOTO
    // In vCard 4.0, PHOTO with URI value doesn't need explicit TYPE or VALUE parameters
    new PhotoProperty([], new URIType(`${siteConfig.url}/assets/img/headshot.jpg`)),

    // SOURCE
    new SourceProperty([], new URIType(`${siteConfig.url}/vcard.vcf`)),

    // TITLE
    new TitleProperty([], new TextType(siteConfig.jobTitle)),

    // ORG (Organization)
    new OrgProperty(
      [],
      new SpecialValueType('orgproperty', [new TextType(siteConfig.employer)])
    ),

    // TZ (Timezone)
    new TzProperty([], new TextType(siteConfig.timezone)),

    // URL
    new URLProperty([], new URIType(siteConfig.url)),
  ]);

  // Generate vCard string (VERSION 4.0 format with \r\n line endings)
  const vCardContent = vcard.repr();

  return new Response(vCardContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${vcfFilename}"`,
    },
  });
};
