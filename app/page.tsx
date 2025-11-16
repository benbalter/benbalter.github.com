import { getAllPosts, getPostUrlParts } from '@/lib/posts';
import Link from 'next/link';

export default function Home() {
  const posts = getAllPosts().filter(post => !post.archived);
  
  return (
    <main>
      {/* Hero header image */}
      <div 
        className="hero-unit rounded-top position-relative mb-3" 
        style={{ 
          backgroundImage: 'url(/assets/img/header.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'top left',
          height: '400px'
        }}
      >
        &nbsp;
      </div>
      
      {/* Main heading */}
      <h1 className="h2 mb-4">Ben Balter</h1>
      
      {/* Posts list */}
      <section>
        <h2 className="h4 mb-3">Recent Posts</h2>
        {posts.length > 0 ? (
          posts.map(post => {
            const { url } = getPostUrlParts(post);
            
            return (
              <div className="row mb-2" key={post.slug}>
                <div className="col-sm-9">
                  <Link href={url}>{post.title}</Link>
                </div>
                <div className="col-sm-3 text-muted text-md-end">
                  <small>
                    {new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </small>
                </div>
              </div>
            );
          })
        ) : (
          <p>No posts available.</p>
        )}
      </section>
    </main>
  );
}
