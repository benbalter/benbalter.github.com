import { getAllPosts, getPostUrlParts } from '@/lib/posts';
import Link from 'next/link';

export default function Home() {
  const posts = getAllPosts().filter(post => !post.archived);
  
  return (
    <>
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
      
      {/* Posts list */}
      {posts.map(post => {
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
      })}
    </>
  );
}
