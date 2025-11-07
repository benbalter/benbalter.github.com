import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts()
  const baseUrl = 'https://ben.balter.com'

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/resume',
    '/talks',
    '/press',
    '/fine-print',
    '/other-recommended-reading',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Blog posts
  const postPages = posts.map((post) => {
    const dateParts = post.date.split('-')
    const title = post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, '')
    const postUrl = `/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/${title}`
    
    return {
      url: `${baseUrl}${postUrl}`,
      lastModified: new Date(post.date),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    }
  })

  return [...staticPages, ...postPages]
}
