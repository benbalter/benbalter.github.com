import { getPageData } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Press | Ben Balter',
  description: 'Press mentions of Ben Balter',
}

export default async function Press() {
  const pageData = await getPageData('press.md')
  
  if (!pageData) {
    return (
      <div className="container">
        <h1>Press</h1>
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
