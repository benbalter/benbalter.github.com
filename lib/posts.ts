import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
  slug: string;
  date: string;
  title: string;
  description?: string;
  image?: string;
  content: string;
  [key: string]: any;
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Extract date from filename if not in frontmatter
      let date = data.date;
      if (!date) {
        const match = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-/);
        if (match) {
          date = `${match[1]}-${match[2]}-${match[3]}`;
        }
      }
      
      // Generate title from filename if not in frontmatter
      let title = data.title;
      if (!title) {
        title = fileName
          .replace(/^\d{4}-\d{2}-\d{2}-/, '')
          .replace(/\.md$/, '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
      }
      
      return {
        slug,
        date,
        title,
        description: data.description,
        image: data.image,
        content,
        ...data,
      };
    });
  
  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

export function getPostByDate(year: string, month: string, day: string, slug: string): Post | null {
  const fullSlug = `${year}-${month}-${day}-${slug}`;
  return getPostBySlug(fullSlug);
}

export function getAllPostParams(): Array<{year: string; month: string; day: string; slug: string}> {
  const posts = getAllPosts();
  
  return posts.map(post => {
    const [year, month, day, ...rest] = post.slug.split('-');
    return {
      year,
      month,
      day,
      slug: rest.join('-'),
    };
  });
}
