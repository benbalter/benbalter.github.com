import fs from 'fs';
import path from 'path';
import { getSiteConfig } from '@/lib/config';

export const dynamic = 'force-static';

export async function GET() {
  const config = getSiteConfig();
  const now = new Date();
  const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;

  // Get package versions from package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies || {};

  const components = Object.entries(dependencies)
    .filter(([name]) => ['next', 'react', 'react-dom', 'bootstrap', 'gray-matter'].includes(name))
    .map(([name, version]) => `${name} ${(version as string).replace('^', '')}`)
    .join(', ');

  const content = `/* SITE */
Last Updated: ${formattedDate}
Standards: HTML5, CSS3
Components: ${components}

/* TEAM */
Name: ${config.author?.name || 'Ben Balter'}
Site: https://github.com/${config.handle || 'benbalter'}

/* THANKS */
This site is built with Next.js and deployed on GitHub Pages.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
