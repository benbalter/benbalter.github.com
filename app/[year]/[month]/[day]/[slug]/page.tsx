import { getAllPostSlugs, getPostData } from '@/lib/posts'
import { format } from 'date-fns'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ year: string; month: string; day: string; slug: string }>
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs()
  
  return slugs.map((slug) => {
    // Extract date parts from slug (format: YYYY-MM-DD-title)
    const dateParts = slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/)
    if (!dateParts) return null
    
    return {
      year: dateParts[1],
      month: dateParts[2],
      day: dateParts[3],
      slug: dateParts[4],
    }
  }).filter(Boolean)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, month, day, slug } = await params
  const fullSlug = `${year}-${month}-${day}-${slug}`
  const post = await getPostData(fullSlug)
  
  return {
    title: `${post.title} | Ben Balter`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [post.image] : [],
    },
  }
}

export default async function Post({ params }: Props) {
  const { year, month, day, slug } = await params
  const fullSlug = `${year}-${month}-${day}-${slug}`
  const post = await getPostData(fullSlug)

  return (
    <article className="container">
      <header>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{post.title}</h1>
        <div className="post-meta" style={{ marginBottom: '2rem' }}>
          {format(new Date(post.date), 'MMMM d, yyyy')}
        </div>
      </header>
      <div 
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}
