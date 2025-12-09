/**
 * Press Feed (RSS/Atom)
 * 
 * Generates an RSS feed at /press/feed/index.xml for press clips.
 * This matches the Jekyll press feed structure.
 */

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

export async function GET(context: APIContext) {
  // Load clips data
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const clipsPath = join(__dirname, '../../../../_data/clips.yml');
  const clipsYaml = readFileSync(clipsPath, 'utf-8');
  const clips = parse(clipsYaml);

  // Sort clips by date (newest first)
  const sortedClips = clips.sort((a: any, b: any) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: 'Ben Balter in the Press',
    description: 'Select media clips of Ben Balter in the press talking about open source, open data, and government innovation.',
    site: context.site || 'https://ben.balter.com',
    items: sortedClips.map((clip: any) => ({
      title: clip.title,
      link: clip.url,
      pubDate: new Date(clip.date),
      description: `${clip.publication} - ${clip.title}`,
      author: 'Ben Balter',
    })),
    customData: `<language>en-us</language>`,
  });
}
