#!/usr/bin/env node

/**
 * Generate static metadata files for Next.js static export
 * 
 * This script generates:
 * - llms.txt - LLM/AI assistant context file
 * - humans.txt - Credits file listing contributors  
 * - security.txt - Security policy file (RFC 9116)
 * - browserconfig.xml - Windows tile configuration
 * 
 * Run this after `next build` to add these files to the output directory.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Load site config
function getSiteConfig() {
  const configPath = path.join(process.cwd(), '_config.yml');
  const fileContents = fs.readFileSync(configPath, 'utf8');
  return yaml.load(fileContents);
}

// Load posts from content directory
function getPosts() {
  const postsDir = path.join(process.cwd(), 'content/posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  
  return files.map(fileName => {
    const fullPath = path.join(postsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = parseMarkdownFrontmatter(fileContents);
    
    // Extract date from filename
    const match = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
    if (!match) return null;
    
    const [, year, month, day, slug] = match;
    const url = `/${year}/${month}/${day}/${slug}/`;
    
    return {
      title: data.title || slug.replace(/-/g, ' '),
      description: data.description || '',
      url,
      date: `${year}-${month}-${day}`,
    };
  }).filter(Boolean).sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Simple front matter parser
function parseMarkdownFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, content };
  
  const data = yaml.load(match[1]) || {};
  const body = content.slice(match[0].length);
  return { data, content: body };
}

// Load pages data
function getPages() {
  const pagesDir = path.join(process.cwd(), 'content/pages');
  if (!fs.existsSync(pagesDir)) {
    // Fall back to root-level markdown files
    const rootFiles = ['about.md', 'contact.md', 'resume.md'];
    return rootFiles.map(f => {
      const fullPath = path.join(process.cwd(), f);
      if (!fs.existsSync(fullPath)) return null;
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = parseMarkdownFrontmatter(fileContents);
      return {
        title: data.title,
        description: data.description,
        permalink: data.permalink,
      };
    }).filter(Boolean);
  }
  
  const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.md'));
  return files.map(fileName => {
    const fullPath = path.join(pagesDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = parseMarkdownFrontmatter(fileContents);
    return {
      title: data.title,
      description: data.description,
      permalink: data.permalink || `/${fileName.replace('.md', '')}/`,
    };
  });
}

// Load about page bio
function getAuthorBio() {
  const aboutPath = path.join(process.cwd(), 'about.md');
  const fileContents = fs.readFileSync(aboutPath, 'utf8');
  
  // Remove front matter
  const withoutFrontMatter = fileContents.replace(/^---[\s\S]*?---\n/, '');
  
  // Get first paragraph
  const firstParagraph = withoutFrontMatter.trim().split('\n\n')[0];
  
  // Strip markdown links but keep the text
  // Use a loop to ensure all HTML tags are removed, even malformed ones
  let stripped = firstParagraph
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');
  
  // Repeatedly remove HTML tags until no more are found
  let previous = '';
  while (stripped !== previous) {
    previous = stripped;
    stripped = stripped.replace(/<[^>]+>/g, '');
  }
  
  return stripped;
}

// Generate llms.txt
function generateLlmsTxt(config, posts, pages) {
  const bio = getAuthorBio();
  const recentPosts = posts.slice(0, 10);
  
  // Find the GitHub culture post to get related posts
  const culturePostUrl = '/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/';
  const culturePost = posts.find(p => p.url === culturePostUrl);
  
  // Get GitHub culture related posts
  const cultureRelatedPosts = posts.filter(p => 
    p.url.includes('rules-of-communicating') ||
    p.url.includes('seven-habits') ||
    p.url.includes('eight-things-i-wish') ||
    p.url.includes('why-urls') ||
    p.url.includes('why-async') ||
    p.url.includes('leaders-show-their-work') ||
    p.url.includes('meetings-are-a-point-of-escalation') ||
    p.url.includes('seven-ways-to-consistently-ship') ||
    p.url.includes('tools-to-empower-open-collaboration')
  ).slice(0, 10);
  
  let content = `# ${config.title}

> ${config.description}

${bio}

## About and Professional Information

`;

  // Add about, resume, contact pages
  pages.forEach(page => {
    if (page.permalink === '/about/' || page.permalink === '/resume/' || page.permalink === '/contact/') {
      content += `* [${page.title}](${config.url}${page.permalink}): ${page.description || ''}\n`;
    }
  });

  content += `
## Recent Blog Posts

`;

  recentPosts.forEach(post => {
    const desc = post.description ? post.description.slice(0, 100) + (post.description.length > 100 ? '...' : '') : '';
    content += `* [${post.title}](${config.url}${post.url}): ${desc}\n`;
  });

  content += `
## GitHub Culture

Understanding GitHub's unique culture and communication patterns:

`;

  cultureRelatedPosts.forEach(post => {
    content += `* [${post.title}](${config.url}${post.url}): ${post.description || ''}\n`;
  });

  content += `

## Site Information

* [RSS Feed](${config.url}/feed.xml): Subscribe to all posts
* [Site Source Code](https://github.com/${config.repository}): This site's source code on GitHub
* [Fine Print](${config.url}/fine-print/): Legal information and site policies
`;

  return content;
}

// Generate humans.txt
function generateHumansTxt(config) {
  const now = new Date();
  const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
  
  // Get Next.js and React versions from package.json
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = packageJson.dependencies || {};
  
  const components = Object.entries(dependencies)
    .filter(([name]) => ['next', 'react', 'react-dom', 'bootstrap', 'liquidjs', 'gray-matter'].includes(name))
    .map(([name, version]) => `${name} ${version.replace('^', '')}`)
    .join(', ');

  return `/* SITE */
Last Updated: ${formattedDate}
Standards: HTML5, CSS3
Components: ${components}

/* TEAM */
Name: ${config.author?.name || 'Ben Balter'}
Site: https://github.com/${config.handle || 'benbalter'}

/* THANKS */
This site is built with Next.js and deployed on GitHub Pages.
`;
}

// Generate security.txt
function generateSecurityTxt(config) {
  // Calculate expiration date (180 days from now)
  const now = new Date();
  const expirationDate = new Date(now.getTime() + (180 * 24 * 60 * 60 * 1000));
  const isoDate = expirationDate.toISOString();
  
  const email = config.email || 'ben@balter.com';
  const repository = config.repository || 'benbalter/benbalter.github.com';
  
  return `Contact: mailto:${email}
Expires: ${isoDate}
Encryption: ${config.url}/key.asc
Canonical: ${config.url}/.well-known/security.txt
Policy: https://github.com/${repository}/security/policy
`;
}

// Generate browserconfig.xml
function generateBrowserconfigXml(config) {
  // Use a simple revision string based on build time
  const buildRevision = Date.now().toString(36);
  
  return `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png?v=${buildRevision}"/>
            <TileColor>#2d89ef</TileColor>
        </tile>
    </msapplication>
</browserconfig>
`;
}

// Main function
async function generateMetadataFiles() {
  const outDir = path.join(process.cwd(), 'out');
  
  // Check if out directory exists
  if (!fs.existsSync(outDir)) {
    console.error('❌ Error: Output directory not found. Please run `next build` first.');
    process.exit(1);
  }
  
  console.log('🔧 Generating metadata files...\n');
  
  const config = getSiteConfig();
  const posts = getPosts();
  const pages = getPages();
  
  let hasErrors = false;
  
  // Generate llms.txt
  try {
    const llmsTxt = generateLlmsTxt(config, posts, pages);
    const llmsPath = path.join(outDir, 'llms.txt');
    fs.writeFileSync(llmsPath, llmsTxt, 'utf-8');
    console.log('✅ Generated llms.txt');
  } catch (error) {
    console.error('❌ Error generating llms.txt:', error);
    hasErrors = true;
  }
  
  // Generate humans.txt
  try {
    const humansTxt = generateHumansTxt(config);
    const humansPath = path.join(outDir, 'humans.txt');
    fs.writeFileSync(humansPath, humansTxt, 'utf-8');
    console.log('✅ Generated humans.txt');
  } catch (error) {
    console.error('❌ Error generating humans.txt:', error);
    hasErrors = true;
  }
  
  // Generate security.txt
  try {
    const securityTxt = generateSecurityTxt(config);
    const wellKnownDir = path.join(outDir, '.well-known');
    fs.mkdirSync(wellKnownDir, { recursive: true });
    const securityPath = path.join(wellKnownDir, 'security.txt');
    fs.writeFileSync(securityPath, securityTxt, 'utf-8');
    // Also put at root for compatibility
    const securityRootPath = path.join(outDir, 'security.txt');
    fs.writeFileSync(securityRootPath, securityTxt, 'utf-8');
    console.log('✅ Generated .well-known/security.txt and security.txt');
  } catch (error) {
    console.error('❌ Error generating security.txt:', error);
    hasErrors = true;
  }
  
  // Generate browserconfig.xml
  try {
    const browserconfigXml = generateBrowserconfigXml(config);
    const browserconfigPath = path.join(outDir, 'browserconfig.xml');
    fs.writeFileSync(browserconfigPath, browserconfigXml, 'utf-8');
    console.log('✅ Generated browserconfig.xml');
  } catch (error) {
    console.error('❌ Error generating browserconfig.xml:', error);
    hasErrors = true;
  }
  
  if (hasErrors) {
    console.log('\n⚠️  Some files failed to generate. Check errors above.');
    process.exit(1);
  }
  
  console.log('\n🎉 Done! All metadata files generated successfully.');
}

// Run the generator
generateMetadataFiles().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
