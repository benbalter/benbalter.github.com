/**
 * Press RSS Feed
 * 
 * Generates an RSS 2.0 feed at /press/feed/index.xml for press clips.
 * This matches the Jekyll press feed structure and URLs.
 */

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteConfig } from '../../../config';
import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { join } from 'path';

interface Clip {
  title: string;
  publication: string;
  url: string;
  date: string;
  ignore_check?: boolean;
}

export async function GET(context: APIContext) {
  // Read and parse clips.yml from _data directory
  const clipsPath = join(process.cwd(), '_data', 'clips.yml');
  const clipsYaml = readFileSync(clipsPath, 'utf-8');
  const clips = parse(clipsYaml) as Clip[];
  
  // Sort clips by date (newest first)
  const sortedClips = clips.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return rss({
    title: `${siteConfig.name} - Press`,
    description: `Press clips for ${siteConfig.name}`,
    site: context.site || siteConfig.url,
    
    // Customize the feed URL to match Jekyll structure
    customData: `<language>en-US</language>
    <atom:link type="application/atom+xml" href="${siteConfig.url}/press/feed/" rel="self"/>
    <link>${siteConfig.url}/press</link>`,
    
    items: sortedClips.map((clip) => {
      const pubDate = new Date(clip.date);
      
      return {
        title: clip.title,
        link: clip.url,
        pubDate,
        // Use publication as creator
        customData: `<dc:creator>${clip.publication}</dc:creator>`,
      };
    }),
    
    // Add necessary XML namespaces to match Jekyll feed
    xmlns: {
      content: 'http://purl.org/rss/1.0/modules/content/',
      wfw: 'http://wellformedweb.org/CommentAPI/',
      dc: 'http://purl.org/dc/elements/1.1/',
      atom: 'http://www.w3.org/2005/Atom',
      sy: 'http://purl.org/rss/1.0/modules/syndication/',
      slash: 'http://purl.org/rss/1.0/modules/slash/',
    },
  });
}
