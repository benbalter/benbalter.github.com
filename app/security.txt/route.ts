import { getSiteConfig } from '@/lib/config';

export const dynamic = 'force-static';

export async function GET() {
  const config = getSiteConfig();

  // Calculate expiration date (180 days from now)
  const now = new Date();
  const expirationDate = new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000);
  const isoDate = expirationDate.toISOString();

  const email = config.email || 'ben@balter.com';
  const repository = config.repository || 'benbalter/benbalter.github.com';

  const content = `Contact: mailto:${email}
Expires: ${isoDate}
Encryption: ${config.url}/key.asc
Canonical: ${config.url}/.well-known/security.txt
Policy: https://github.com/${repository}/security/policy
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
