import { getPageData } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume | Ben Balter',
  description: 'Resume of Ben Balter',
}

export default async function Resume() {
  const pageData = await getPageData('resume.md')
  
  if (!pageData) {
    return (
      <div className="container">
        <h1>Resume</h1>
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
