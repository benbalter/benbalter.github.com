import { getPageData } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Ben Balter',
  description: 'About Ben Balter',
}

export default async function About() {
  const pageData = await getPageData('about.md')
  
  if (!pageData) {
    return (
      <div className="container">
        <h1>About</h1>
        <p>Content not found.</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div 
        className="page-content"
        dangerouslySetInnerHTML={{ __html: pageData.content }}
      />
    </div>
  )
}
