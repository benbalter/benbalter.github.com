import path from 'path';
import {Liquid} from 'liquidjs';
import {getSiteConfig} from './config';

/**
 * Component placeholder that represents a React component to be rendered inline.
 * Used to replace Liquid includes with React components during SSG.
 */
export interface ComponentPlaceholder {
  type: 'callout' | 'foss-at-scale' | 'github-culture';
  props: Record<string, string>;
  /** Unique identifier for the placeholder in the content */
  id: string;
}

/**
 * Result of extracting components from content.
 */
export interface ExtractedComponents {
  /** The content with placeholders replaced by marker comments */
  content: string;
  /** Array of components to render */
  components: ComponentPlaceholder[];
}

/**
 * Extracts React component placeholders from Liquid include syntax.
 * Replaces supported includes with HTML comments that can be used to split
 * the rendered content and insert React components.
 * 
 * Supported includes:
 * - {% include callout.html content="..." %} -> Callout component
 * - {% include foss-at-scale.html nth="..." %} -> FossAtScale component
 * - {% include_cached github-culture.html %} -> GitHubCultureCallout component
 * 
 * @param content - The raw markdown content with Liquid includes
 * @returns Object containing modified content and extracted components
 */
export function extractComponentPlaceholders(content: string): ExtractedComponents {
  const components: ComponentPlaceholder[] = [];
  let modifiedContent = content;
  let placeholderId = 0;
  
  // Match {% include callout.html content=... %}
  // Supports both content="value" and content=variable
  const calloutRegex = /\{%\s*include\s+callout\.html\s+content\s*=\s*(?:"([^"]*)"|([\w]+))\s*%\}/g;
  modifiedContent = modifiedContent.replace(calloutRegex, (match, quotedContent, variableContent) => {
    const id = `component-${placeholderId++}`;
    components.push({
      type: 'callout',
      props: { content: quotedContent || variableContent || '' },
      id,
    });
    // Use a div with data attribute that will survive HTML sanitization
    return `<div data-component="${id}"></div>`;
  });
  
  // Match {% include foss-at-scale.html nth="..." %}
  const fossRegex = /\{%\s*include\s+foss-at-scale\.html\s+nth\s*=\s*"([^"]*)"\s*%\}/g;
  modifiedContent = modifiedContent.replace(fossRegex, (match, nth) => {
    const id = `component-${placeholderId++}`;
    components.push({
      type: 'foss-at-scale',
      props: { nth },
      id,
    });
    return `<div data-component="${id}"></div>`;
  });
  
  // Match {% include_cached github-culture.html %} or {% include github-culture.html %}
  const githubCultureRegex = /\{%\s*include(?:_cached)?\s+github-culture\.html\s*%\}/g;
  modifiedContent = modifiedContent.replace(githubCultureRegex, () => {
    const id = `component-${placeholderId++}`;
    components.push({
      type: 'github-culture',
      props: {},
      id,
    });
    return `<div data-component="${id}"></div>`;
  });
  
  return { content: modifiedContent, components };
}

/**
 * Splits HTML content at component placeholder markers.
 * Returns an array of content segments that can be interleaved with React components.
 * 
 * @param html - The processed HTML content with <div data-component="id"></div> markers
 * @param components - The array of component placeholders
 * @returns Array of segments, each with type 'html' or 'component'
 */
export function splitContentAtPlaceholders(
  html: string, 
  components: ComponentPlaceholder[]
): Array<{ type: 'html'; content: string } | { type: 'component'; component: ComponentPlaceholder }> {
  if (components.length === 0) {
    return [{ type: 'html', content: html }];
  }
  
  const segments: Array<{ type: 'html'; content: string } | { type: 'component'; component: ComponentPlaceholder }> = [];
  const componentMap = new Map(components.map(c => [c.id, c]));
  
  // Split by component placeholder divs
  // The regex captures the component ID from the data-component attribute
  const parts = html.split(/<div data-component="(component-\d+)"><\/div>/);
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === undefined) continue;
    
    // Even indices are HTML content, odd indices are component IDs
    if (i % 2 === 0) {
      if (part.trim()) {
        segments.push({ type: 'html', content: part });
      }
    } else {
      const component = componentMap.get(part);
      if (component) {
        segments.push({ type: 'component', component });
      }
    }
  }
  
  return segments;
}

/**
 * Process Liquid template syntax in markdown content.
 * This handles Jekyll-style Liquid tags used in blog posts.
 *
 * Supported tags:
 * - {% raw %} / {% endraw %} - Pass through content without processing
 * - {% github_edit_link %} - Generate GitHub edit links
 * - {% include filename.html %} - Include Jekyll includes from _includes/
 * - {% include_cached filename.html %} - Same as include (caching is handled by build)
 * - Variables: {{ site.* }}, {{ page.* }}, {{ include.* }}
 *
 * This allows Next.js to reuse Jekyll includes from the _includes/ directory,
 * reducing duplication and ensuring parity with the Jekyll build.
 */
export async function processLiquid(content: string, context: Record<string, any> = {}): Promise<string> {
  // Create Liquid engine with Jekyll-compatible settings
  const engine = new Liquid({
    // Don't throw on undefined variables - just render empty string
    strictVariables: false,
    // Don't throw on undefined filters - just pass through
    strictFilters: false,
    // Root path for includes - use _includes directory
    root: path.join(process.cwd(), '_includes'),
    // Enable caching for performance
    cache: true,
    // Enable Jekyll-style include syntax (no quotes around filename)
    // This allows: {% include callout.html content=var %}
    jekyllInclude: true,
  });

  // Register custom tags
  registerCustomTags(engine);

  // Prepare template context with site config and page data
  const templateContext = prepareContext(context);

  try {
    // Parse and render the liquid template
    const result = await engine.parseAndRender(content, templateContext);
    return result;
  } catch (error) {
    // If liquid parsing fails, log warning and return original content
    console.warn('Failed to process Liquid syntax:', error);
    return content;
  }
}

/**
 * Register custom Jekyll tags and filters that need special handling
 */
function registerCustomTags(engine: Liquid) {
  const config = getSiteConfig();

  // Register Jekyll's include_cached tag as an alias for include
  // In Next.js SSG, caching is handled by the build process
  const includeTag = engine.tags.include;
  if (includeTag) {
    engine.registerTag('include_cached', includeTag);
  }

  // Register {% github_edit_link %} tag
  // Usage: {% github_edit_link %} or {% github_edit_link "text" %}
  engine.registerTag('github_edit_link', {
    parse(token) {
      // Extract optional link text from tag arguments
      this.linkText = token.args.trim().replace(/^["']|["']$/g, '') || 'help improve this content';
    },
    render(context) {
      const site = context.get(['site']) as any;
      const page = context.get(['page']) as any;

      // Build GitHub edit URL
      const repository = site?.github?.repository_nwo || site?.repository || 'benbalter/benbalter.github.com';
      const branch = site?.branch || 'main';
      const pagePath = page?.path || '';

      const url = `https://github.com/${repository}/edit/${branch}/${pagePath}`;
      const linkText = this.linkText;

      return `<a href="${url}">${linkText}</a>`;
    },
  });

  // Register Jekyll's absolute_url filter
  // Converts relative URLs to absolute URLs using site.url
  engine.registerFilter('absolute_url', (relativePath: string) => {
    if (!relativePath) {
      return config.url;
    }

    // Ensure path has leading slash for proper URL concatenation
    const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `${config.url.replace(/\/$/, '')}${cleanPath}`;
  });

  // Register Jekyll's relative_url filter
  // Returns the path unchanged (Next.js handles base paths differently)
  engine.registerFilter('relative_url', (relativePath: string) => {
    if (!relativePath) {
      return '/';
    }

    return relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  });
}

/**
 * Prepare template context with site configuration and page data
 */
function prepareContext(pageData: Record<string, any> = {}): Record<string, any> {
  const config = getSiteConfig();

  // Build site context matching Jekyll's structure
  const siteContext = {
    title: config.title,
    description: config.description,
    url: config.url,
    repository: config.repository,
    branch: config.branch,
    github: {
      repository_nwo: config.repository,
    },
  };

  // Merge page data with default path
  const pageContext = {
    path: pageData.path || '',
    title: pageData.title || '',
    ...pageData,
  };

  return {
    site: siteContext,
    page: pageContext,
  };
}
