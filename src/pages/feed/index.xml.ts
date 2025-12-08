/**
 * Feed Redirect (Legacy URL)
 * 
 * This feed existed at /feed/index.xml in earlier versions of the site.
 * It redirects users to the current feed location at /feed.xml.
 * 
 * This maintains compatibility with older feed readers that may have
 * bookmarked the /feed/ URL.
 */

import type { APIRoute } from 'astro';
import { siteConfig } from '../../config';

export const GET: APIRoute = async () => {
  const currentDate = new Date().toISOString();
  
  const redirectFeed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <link href="${siteConfig.url}/feed.xml" rel="self" type="application/atom+xml" />
  <link href="${siteConfig.url}/" rel="alternate" type="text/html" />
  <updated>${currentDate}</updated>
  <id>${siteConfig.url}/</id>
  <title>${siteConfig.name}</title>
  <subtitle>${siteConfig.description}</subtitle>
  <entry>
    <title>This feed has moved</title>
    <link href="${siteConfig.url}/feed.xml" rel="alternate" type="text/html" title="This feed has moved" />
    <published>${currentDate}</published>
    <updated>${currentDate}</updated>
    <id>${siteConfig.url}/feed.xml</id>
    <content type="html" xml:base="${siteConfig.url}/feed.xml">
      This feed has moved. Please update your feed reader to <a href="${siteConfig.url}/feed.xml"><code>${siteConfig.url}/feed.xml</code></a>
    </content>
  </entry>
</feed>`;

  return new Response(redirectFeed, {
    status: 200,
    headers: {
      'Content-Type': 'application/atom+xml; charset=utf-8',
    },
  });
};
