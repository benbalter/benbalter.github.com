import { getPageData } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Talks | Ben Balter',
  description: 'Talks by Ben Balter',
}

export default async function Talks() {
  const pageData = await getPageData('talks.md')
  
  if (!pageData) {
    return (
      <div className="container">
        <h1>Talks</h1>
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
