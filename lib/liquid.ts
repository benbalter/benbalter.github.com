import { Liquid } from 'liquidjs';
import { getSiteConfig } from './config';
import path from 'path';

/**
 * Process Liquid template syntax in markdown content.
 * This handles Jekyll-style Liquid tags used in blog posts.
 * 
 * Supported tags:
 * - {% raw %} / {% endraw %} - Pass through content without processing
 * - {% github_edit_link %} - Generate GitHub edit links
 * - {% capture %} / {% endcapture %} - Capture content to a variable
 * - {% include %} / {% include_cached %} - Include partial templates
 * - Variables: {{ site.* }}, {{ page.* }}
 * 
 * Note: Some complex Jekyll tags ({% for %}, etc.) may need
 * additional implementation if encountered.
 */
export async function processLiquid(content: string, context: Record<string, any> = {}): Promise<string> {
  // Pre-process Jekyll-style includes to liquidjs format
  // Jekyll: {% include callout.html content=update %}
  // Liquidjs: {% include "callout" content: update %}
  const processedContent = convertJekyllIncludes(content);
  
  // Create Liquid engine with includes root path
  const engine = new Liquid({
    // Don't throw on undefined variables - just render empty string
    strictVariables: false,
    // Don't throw on undefined filters - just pass through
    strictFilters: false,
    // Set root path for includes - prefer content/includes (liquidjs format) over _includes (Jekyll format)
    root: [
      path.join(process.cwd(), 'content/includes'),
      path.join(process.cwd(), '_includes'),
    ],
    // Allow dynamic includes
    dynamicPartials: true,
    // Use .html extension by default for partials
    extname: '.html',
  });
  
  // Register custom tags
  registerCustomTags(engine);
  
  // Register custom filters
  registerCustomFilters(engine);
  
  // Prepare template context with site config and page data
  const templateContext = prepareContext(context);
  
  try {
    // Parse and render the liquid template
    const result = await engine.parseAndRender(processedContent, templateContext);
    return result;
  } catch (error) {
    // If liquid parsing fails, log warning and return original content
    console.warn('Failed to process Liquid syntax:', error);
    return content;
  }
}

/**
 * Convert Jekyll-style include syntax to liquidjs format
 * Jekyll: {% include file.html param=value %}
 * Jekyll: {% include_cached file.html param=value %}
 * Liquidjs: {% include "file" param: value %}
 */
function convertJekyllIncludes(content: string): string {
  // Match {% include filename.html param=value %} or {% include_cached filename.html param=value %}
  const includeRegex = /\{%\s*include(?:_cached)?\s+([a-zA-Z0-9_-]+)\.html(?:\s+([^%]*))?\s*%\}/g;
  
  return content.replace(includeRegex, (match, filename, params) => {
    // Convert params from Jekyll format (param=value) to liquidjs format (param: value)
    let liquidParams = '';
    if (params) {
      // Replace = with : for each parameter
      liquidParams = params.trim().replace(/(\w+)=(\w+)/g, '$1: $2') + ' ';
    }
    
    // Return liquidjs-compatible include syntax
    return `{% include "${filename}" ${liquidParams}%}`;
  });
}

/**
 * Register custom Jekyll tags that need special handling
 */
function registerCustomTags(engine: Liquid) {
  // Register {% github_edit_link %} tag
  // Usage: {% github_edit_link %} or {% github_edit_link "text" %}
  engine.registerTag('github_edit_link', {
    parse(token) {
      // Extract optional link text from tag arguments
      this.linkText = token.args.trim().replace(/^["']|["']$/g, '') || 'help improve this content';
    },
    render(ctx) {
      const site = ctx.get(['site']) as any;
      const page = ctx.get(['page']) as any;
      
      // Build GitHub edit URL
      const repository = site?.github?.repository_nwo || site?.repository || 'benbalter/benbalter.github.com';
      const branch = site?.branch || 'main';
      const path = page?.path || '';
      
      const url = `https://github.com/${repository}/edit/${branch}/${path}`;
      const linkText = this.linkText;
      
      return `<a href="${url}">${linkText}</a>`;
    },
  });
}

/**
 * Register custom filters for Jekyll compatibility
 */
function registerCustomFilters(engine: Liquid) {
  // Register absolute_url filter
  engine.registerFilter('absolute_url', (value: string) => {
    if (!value) return value;
    const config = getSiteConfig();
    // If already absolute, return as-is
    if (value.startsWith('http://') || value.startsWith('https://')) {
      return value;
    }
    // Add site URL
    const url = config.url || 'https://ben.balter.com';
    return `${url}${value.startsWith('/') ? '' : '/'}${value}`;
  });
  
  // Register relative_url filter  
  engine.registerFilter('relative_url', (value: string) => {
    if (!value) return value;
    // For static export, just return the path as-is
    return value.startsWith('/') ? value : `/${value}`;
  });
  
  // Register markdownify filter (simple version - converts to HTML)
  engine.registerFilter('markdownify', (value: string) => {
    if (!value) return value;
    // Simple markdown processing - replace links, bold, etc.
    // For complex markdown, we'd need a full markdown processor
    return value
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  });
  
  // Register strip_html filter
  engine.registerFilter('strip_html', (value: string) => {
    if (!value) return value;
    return value.replace(/<[^>]*>/g, '');
  });
  
  // Register newline_to_br filter
  engine.registerFilter('newline_to_br', (value: string) => {
    if (!value) return value;
    return value.replace(/\n/g, '<br />');
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
