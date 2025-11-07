import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import { format } from 'date-fns'

export default async function Home() {
  const posts = await getAllPosts()

  return (
    <div className="container">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Recent Posts</h1>
      <ul className="posts-list">
        {posts.map((post) => {
          // Convert slug to URL format: YYYY-MM-DD-title -> /YYYY/MM/DD/title/
          const dateParts = post.date.split('-')
          const title = post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, '')
          const postUrl = `/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/${title}`
          
          return (
            <li key={post.slug} className="post-item">
              <h2 className="post-title">
                <Link href={postUrl}>{post.title}</Link>
              </h2>
              <div className="post-meta">
                {format(new Date(post.date), 'MMMM d, yyyy')}
              </div>
              {post.description && (
                <p className="post-description">{post.description}</p>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
