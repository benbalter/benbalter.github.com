import { getPageData } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fine Print | Ben Balter',
  description: 'Fine print and legal information',
}

export default async function FinePrint() {
  const pageData = await getPageData('fine-print.md')
  
  if (!pageData) {
    return (
      <div className="container">
        <h1>Fine Print</h1>
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
