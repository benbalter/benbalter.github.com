import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Other Recommended Reading | Ben Balter',
  description: 'Books that have had a significant influence on my career, management style, and professional development',
}

interface Book {
  title: string
  asin: string
  tldr?: string
}

type BooksData = Record<string, Book[]>

export default async function OtherRecommendedReading() {
  const booksPath = path.join(process.cwd(), '_data', 'books.yml')
  const booksYaml = fs.readFileSync(booksPath, 'utf8')
  const booksData = yaml.load(booksYaml) as BooksData

  return (
    <div className="container">
      <h1>Other Recommended Reading</h1>
      <div style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
        <p>Here are some of the books that have had a significant influence on my career, management style, and professional development.</p>
      </div>
      
      {Object.entries(booksData).map(([category, books]) => (
        <div key={category} style={{ marginBottom: '3rem' }}>
          <h2 id={category.toLowerCase().replace(/\s+/g, '-')}>{category}</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '2rem',
            marginTop: '1.5rem'
          }}>
            {books.map((book) => (
              <div key={book.asin} style={{ textAlign: 'center' }}>
                <a 
                  href={`https://www.amazon.com/gp/product/${book.asin}/?tag=benbalter07-20`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <img
                      src={`https://images.amazon.com/images/P/${book.asin}.01.MZZZZZZZ.jpg`}
                      alt={book.title}
                      style={{ maxWidth: '150px', height: 'auto' }}
                    />
                  </div>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', minHeight: '3rem' }}>
                    {book.title}
                  </div>
                </a>
                {book.tldr && (
                  <div style={{ fontSize: '0.9rem', color: '#666', textAlign: 'left' }}>
                    {book.tldr}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
