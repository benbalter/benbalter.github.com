import path from 'path';
import {Liquid} from 'liquidjs';
import {getSiteConfig} from './config';
import {getAllResumePositions, type ResumePosition} from './resume';

/**
 * Render markdown to HTML without Liquid processing.
 * Used for rendering collection item content (like resume positions)
 * where Liquid templating is not needed and would cause circular dependencies.
 */
// Cache the markdown processor instance
let cachedMarkdownProcessor: any = null;

async function getMarkdownProcessor() {
  if (!cachedMarkdownProcessor) {
    const {remark} = await import('remark');
    const gfm = (await import('remark-gfm')).default;
    const remarkRehype = (await import('remark-rehype')).default;
    const rehypeRaw = (await import('rehype-raw')).default;
    const rehypeSanitize = (await import('rehype-sanitize')).default;
    const rehypeStringify = (await import('rehype-stringify')).default;

    cachedMarkdownProcessor = remark()
      .use(gfm)
      .use(remarkRehype, {allowDangerousHtml: true})
      .use(rehypeRaw)
      .use(rehypeSanitize)
      .use(rehypeStringify);
  }
  return cachedMarkdownProcessor;
}

/**
 * Render markdown to HTML without Liquid processing.
 * Used for rendering collection item content (like resume positions)
 * where Liquid templating is not needed and would cause circular dependencies.
 */
async function renderSimpleMarkdown(markdown: string): Promise<string> {
  const processor = await getMarkdownProcessor();
  const result = await processor.process(markdown);
  return result.toString();
}

/**
 * Load resume positions with rendered markdown content.
 * Separated from prepareContext to allow lazy loading only when needed.
 */
async function loadResumePositions(): Promise<Record<string, any>[]> {
  const rawPositions = getAllResumePositions();
  return Promise.all(
    rawPositions.map(async (position: ResumePosition) => ({
      ...position,
      // Jekyll uses 'output' for rendered markdown content
      output: await renderSimpleMarkdown(position.content),
    })),
  );
}

export interface LiquidOptions {
  /**
   * If true, load Jekyll collections (like resume_positions) into the context.
   * This enables templates to use site.resume_positions, etc.
   * Default is false for backward compatibility and performance.
   */
  loadCollections?: boolean;
}

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
  /** The content with component HTML replaced by placeholder markers */
  content: string;
  /** Array of components to render */
  components: ComponentPlaceholder[];
}

/**
 * Extracts React component placeholders from rendered HTML.
 * This function works on HTML AFTER Liquid processing, so all variables are resolved.
 * 
 * It detects specific HTML patterns rendered by Jekyll includes and replaces them
 * with React component placeholders. This allows the Liquid engine to resolve all
 * variables and filters first, then we extract the rendered content for React.
 * 
 * Detected patterns:
 * - callout.html: <div class="alert alert-primary text-center" role="alert">content</div>
 * - github-culture.html: Specific content pattern for GitHub culture callout
 * - foss-at-scale.html: Specific content pattern for FOSS at scale series
 * 
 * @param html - The rendered HTML content after Liquid processing
 * @returns Object containing modified content and extracted components
 */
export function extractComponentPlaceholders(html: string): ExtractedComponents {
  const components: ComponentPlaceholder[] = [];
  let modifiedContent = html;
  let placeholderId = 0;
  
  // Match callout HTML pattern: <div class="alert alert-primary text-center" role="alert">content</div>
  // This pattern is rendered by _includes/callout.html after Liquid processing
  // Use [^]* instead of .* to match across newlines
  const calloutRegex = /<div\s+class="alert alert-primary text-center"\s+role="alert">\s*([^]*?)\s*<\/div>/g;
  
  modifiedContent = modifiedContent.replace(calloutRegex, (match, content) => {
    const id = `component-${placeholderId++}`;
    
    // Detect if this is a github-culture callout by checking for specific link
    if (content.includes('/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/')) {
      components.push({
        type: 'github-culture',
        props: {},
        id,
      });
    }
    // Detect if this is a foss-at-scale callout by checking for specific link and pattern
    else if (content.includes('/2021/06/15/managing-open-source-communities-at-scale/') && content.includes('post in')) {
      // Extract the "nth" value (e.g., "first", "second", etc.)
      const nthMatch = content.match(/This is the ([^<]+) post in/);
      const nth = nthMatch ? nthMatch[1].trim() : '';
      
      components.push({
        type: 'foss-at-scale',
        props: { nth },
        id,
      });
    }
    // Generic callout
    else {
      components.push({
        type: 'callout',
        props: { content: content.trim() },
        id,
      });
    }
    
    // Replace with a placeholder div
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
 * - {% for %} / {% endfor %} - Loop iteration
 * - {% if %} / {% elsif %} / {% else %} / {% endif %} - Conditionals
 * - {% unless %} / {% endunless %} - Negative conditionals
 * - {% assign %} - Variable assignment
 * - Variables: {{ site.* }}, {{ page.* }}, {{ include.* }}
 * - Filters: | date, | sort, | absolute_url, | relative_url
 *
 * This allows Next.js to reuse Jekyll includes from the _includes/ directory,
 * reducing duplication and ensuring parity with the Jekyll build.
 */
export async function processLiquid(
  content: string,
  context: Record<string, any> = {},
  options: LiquidOptions = {},
): Promise<string> {
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

  // Register custom tags and filters
  registerCustomTags(engine);

  // Prepare template context with site config, page data, and optionally collections
  const templateContext = await prepareContext(context, options);

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
 * Prepare template context with site configuration, page data, and optionally collections
 */
async function prepareContext(
  pageData: Record<string, any> = {},
  options: LiquidOptions = {},
): Promise<Record<string, any>> {
  const config = getSiteConfig();

  // Build site context matching Jekyll's structure
  const siteContext: Record<string, any> = {
    title: config.title,
    description: config.description,
    url: config.url,
    repository: config.repository,
    branch: config.branch,
    github: {
      repository_nwo: config.repository,
    },
  };

  // Only load collections if explicitly requested (for performance and test compatibility)
  if (options.loadCollections) {
    siteContext.resume_positions = await loadResumePositions();
  }

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
