import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default async function NotFound() {
  const posts = await getAllPosts()
  const recentPosts = posts.slice(0, 10)

  return (
    <div className="container">
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem 1rem',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        marginBottom: '3rem'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>404 - Not Found 😢</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>
          The page you are trying to view does not exist.
        </p>
      </div>

      <div>
        <h2>Recent Posts</h2>
        <ul className="posts-list" style={{ listStyle: 'disc', marginLeft: '2rem' }}>
          {recentPosts.map((post) => {
            const dateParts = post.date.split('-')
            const title = post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, '')
            const postUrl = `/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/${title}`
            
            return (
              <li key={post.slug} style={{ marginBottom: '0.5rem' }}>
                <Link href={postUrl}>{post.title}</Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
