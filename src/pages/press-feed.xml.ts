/**
 * Press Feed
 * 
 * Generates an RSS feed at /press-feed.xml for press clips.
 * This matches the Jekyll press feed structure.
 */

import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteConfig } from '../config';
import clipsData from '../../_data/clips.yml';

// Define the structure of a clip item
interface Clip {
  title: string;
  publication: string;
  url: string;
  date: string;
}

export async function GET(context: APIContext) {
  // Cast the imported data to the correct type
  const clips = clipsData as unknown as Clip[];
  
  // Sort clips by date (newest first)
  const sortedClips = [...clips].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return rss({
    title: `${siteConfig.name} - Press`,
    description: `Press clips for ${siteConfig.name}`,
    site: context.site || siteConfig.url,
    
    items: sortedClips.map((clip) => ({
      title: clip.title,
      link: clip.url,
      pubDate: new Date(clip.date),
      // Use publication as author/creator
      customData: `<dc:creator>${clip.publication}</dc:creator>`,
    })),
    
    // RSS 2.0 specific settings with additional namespaces
    xmlns: {
      content: 'http://purl.org/rss/1.0/modules/content/',
      wfw: 'http://wellformedweb.org/CommentAPI/',
      dc: 'http://purl.org/dc/elements/1.1/',
      atom: 'http://www.w3.org/2005/Atom',
      sy: 'http://purl.org/rss/1.0/modules/syndication/',
      slash: 'http://purl.org/rss/1.0/modules/slash/',
    },
    
    // Custom XML data for RSS 2.0 channel
    customData: [
      `<atom:link type="application/rss+xml" href="${siteConfig.url}/press-feed.xml" rel="self"/>`,
      `<language>en-US</language>`,
    ].join('\n    '),
  });
}
