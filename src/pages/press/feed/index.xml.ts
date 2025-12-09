/**
 * Press Feed (RSS/Atom)
 * 
 * Generates an RSS feed at /press/feed/index.xml for press clips.
 * This matches the Jekyll press feed structure.
 * Loads clips from _data/clips.yml in repository root.
 */

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { resolve } from 'node:path';

export async function GET(context: APIContext) {
  // Load clips data from repository root
  // Using resolve to build path from current working directory
  const clipsPath = resolve(process.cwd(), '_data/clips.yml');
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
