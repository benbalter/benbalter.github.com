import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export async function GET() {
  const posts = await getAllPosts()
  const baseUrl = 'https://ben.balter.com'
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ben Balter</title>
    <link>${baseUrl}</link>
    <description>Technology leadership, collaboration, and open source</description>
    <language>en-US</language>
    <atom:link href="${baseUrl}/feed/rss.xml" rel="self" type="application/rss+xml" />
    ${posts.slice(0, 20).map((post) => {
      const dateParts = post.date.split('-')
      const title = post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, '')
      const postUrl = `${baseUrl}/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/${title}`
      
      return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.description ? `<description><![CDATA[${post.description}]]></description>` : ''}
    </item>`
    }).join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
