#!/usr/bin/env tsx

/**
 * Convert Jekyll posts with Liquid tags to Astro MDX format
 * 
 * This script:
 * 1. Renames .md files to .mdx
 * 2. Converts Liquid template tags to MDX components
 * 3. Adds necessary component imports
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const POSTS_DIR = path.join(ROOT_DIR, 'src', 'content', 'posts');

const POSTS_WITH_LIQUID = [
  '2014-10-07-expose-process-through-urls.md',
  '2014-11-06-rules-of-communicating-at-github.md',
  '2015-03-08-open-source-best-practices-internal-collaboration.md',
  '2015-03-17-open-source-best-practices-external-engagement.md',
  '2015-06-11-using-github-pages-to-showcase-your-orgs-open-source-efforts.md',
  '2015-08-12-the-zen-of-github.md',
  '2015-09-13-github-pages-edit-button.md',
  '2015-11-12-why-urls.md',
  '2015-11-18-tools-to-empower-open-collaboration.md',
  '2015-12-08-types-of-pull-requests.md',
  '2016-09-13-seven-habits-of-highly-effective-githubbers.md',
  '2016-10-31-eight-things-i-wish-i-knew-my-first-week-at-github.md',
  '2020-05-15-set-open-source-contributors-up-for-success.md',
  '2020-08-10-automate-common-open-source-community-management-tasks.md',
  '2020-08-14-tools-of-the-trade.md',
  '2020-08-25-how-i-manage-github-notifications.md',
  '2020-09-12-10-years.md',
  '2020-12-04-over-engineered-home-network-for-privacy-and-security.md',
  '2021-02-01-what-to-read-before-starting-or-interviewing-at-github.md',
  '2021-06-14-open-source-governance.md',
  '2021-06-15-how-to-moderate-open-source-conversations-to-keep-them-productive.md',
  '2021-09-01-how-i-re-over-engineered-my-home-network.md',
  '2021-12-15-github-actions-website-api-change-notification.md',
  '2022-02-16-leaders-show-their-work.md',
  '2022-03-17-why-async.md',
  '2023-03-02-github-for-non-technical-roles.md',
  '2023-04-20-meetings-are-a-point-of-escalation.md',
];

interface ConversionResult {
  filename: string;
  success: boolean;
  changes: string[];
  errors: string[];
}

/**
 * Convert Liquid tags to MDX components
 */
function convertLiquidToMDX(content: string): { content: string, components: Set<string>, changes: string[] } {
  let converted = content;
  const components = new Set<string>();
  const changes: string[] = [];
  
  // Convert {% include_cached github-culture.html %}
  if (converted.includes('{% include_cached github-culture.html %}')) {
    converted = converted.replace(/\{% include_cached github-culture\.html %\}/g, '<GitHubCulture />');
    components.add('GitHubCulture');
    changes.push('Converted {% include_cached github-culture.html %} to <GitHubCulture />');
  }
  
  // Convert {% raw %}...{% endraw %} - just remove the tags for code examples
  const rawTagCount = (converted.match(/\{% raw %\}/g) || []).length;
  if (rawTagCount > 0) {
    converted = converted.replace(/\{% raw %\}/g, '');
    converted = converted.replace(/\{% endraw %\}/g, '');
    changes.push(`Removed ${rawTagCount} {% raw %} tags (content preserved as-is)`);
  }
  
  // Convert {% capture %}...{% endcapture %} with {% include callout.html content=content %}
  const captureRegex = /\{% capture (\w+) -?%\}([\s\S]*?)\{%- endcapture %\}\s*\{% include callout\.html content=\1 %\}/g;
  const captureMatches = converted.match(captureRegex);
  if (captureMatches) {
    converted = converted.replace(captureRegex, (match, varName, content) => {
      components.add('Callout');
      return `<Callout type="info">\n${content.trim()}\n</Callout>`;
    });
    changes.push(`Converted ${captureMatches.length} {% capture %}/{% include callout.html %} to <Callout />`);
  }
  
  // Convert standalone {% include callout.html content=... %}
  const calloutRegex = /\{% include callout\.html content=([^\s]+) %\}/g;
  const calloutMatches = converted.match(calloutRegex);
  if (calloutMatches) {
    // Note: This is tricky because the content variable needs to be defined
    // For now, we'll just flag it for manual review
    changes.push(`Found ${calloutMatches.length} standalone callout includes - may need manual conversion`);
  }
  
  return { content: converted, components, changes };
}

/**
 * Add component imports to frontmatter
 */
function addComponentImports(content: string, components: Set<string>): string {
  if (components.size === 0) {
    return content;
  }
  
  // Find the end of frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatterMatch) {
    return content;
  }
  
  const frontmatterEnd = frontmatterMatch[0].length;
  const imports: string[] = [];
  
  for (const component of components) {
    imports.push(`import ${component} from '../../components/${component}.astro';`);
  }
  
  const beforeFrontmatter = content.slice(0, frontmatterEnd);
  const afterFrontmatter = content.slice(frontmatterEnd);
  
  return beforeFrontmatter + '\n' + imports.join('\n') + '\n' + afterFrontmatter;
}

/**
 * Convert a single post
 */
function convertPost(filename: string): ConversionResult {
  const result: ConversionResult = {
    filename,
    success: false,
    changes: [],
    errors: [],
  };
  
  const mdPath = path.join(POSTS_DIR, filename);
  const mdxPath = path.join(POSTS_DIR, filename.replace('.md', '.mdx'));
  
  try {
    // Read the file
    const content = fs.readFileSync(mdPath, 'utf-8');
    
    // Convert Liquid to MDX
    const { content: converted, components, changes } = convertLiquidToMDX(content);
    result.changes.push(...changes);
    
    // Add component imports
    const withImports = addComponentImports(converted, components);
    
    // Write to .mdx file
    fs.writeFileSync(mdxPath, withImports, 'utf-8');
    result.changes.push(`Renamed ${filename} to ${filename.replace('.md', '.mdx')}`);
    
    // Delete the .md file
    fs.unlinkSync(mdPath);
    
    result.success = true;
  } catch (error) {
    result.errors.push(`Failed to convert: ${error.message}`);
  }
  
  return result;
}

/**
 * Main conversion function
 */
function main() {
  console.log('🔄 Converting posts with Liquid tags to MDX...\n');
  
  let successful = 0;
  let failed = 0;
  
  for (const filename of POSTS_WITH_LIQUID) {
    console.log(`Processing ${filename}...`);
    const result = convertPost(filename);
    
    if (result.success) {
      successful++;
      console.log('  ✅ Success');
      for (const change of result.changes) {
        console.log(`     - ${change}`);
      }
    } else {
      failed++;
      console.log('  ❌ Failed');
      for (const error of result.errors) {
        console.log(`     - ${error}`);
      }
    }
    console.log();
  }
  
  console.log('📊 Conversion Summary');
  console.log('='.repeat(50));
  console.log(`Total posts:  ${POSTS_WITH_LIQUID.length}`);
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed:     ${failed}`);
  console.log('='.repeat(50));
  
  if (failed > 0) {
    process.exit(1);
  }
}

main();
