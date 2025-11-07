import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), '_posts');

export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
}

export async function getPosts(): Promise<Post[]> {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // Extract date and slug from filename (YYYY-MM-DD-slug.md)
      const match = fileName.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
      if (!match) return null;
      
      const [, date, slug] = match;
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        date,
        title: data.title || slug,
        description: data.description || '',
        content,
      };
    })
    .filter((post): post is Post => post !== null);

  // Sort posts by date in descending order
  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await getPosts();
  return posts.find((post) => post.slug === slug) || null;
}
