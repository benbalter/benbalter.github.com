import { getPageData } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Ben Balter',
  description: 'Contact Ben Balter',
}

export default async function Contact() {
  const pageData = await getPageData('contact.md')
  
  if (!pageData) {
    return (
      <div className="container">
        <h1>Contact</h1>
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
