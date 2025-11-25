import { Liquid } from 'liquidjs';
import { getSiteConfig } from './config';

/**
 * Process Liquid template syntax in markdown content.
 * This handles Jekyll-style Liquid tags used in blog posts.
 * 
 * Supported tags:
 * - {% raw %} / {% endraw %} - Pass through content without processing
 * - {% github_edit_link %} - Generate GitHub edit links
 * - {% include %} - Jekyll includes (rendered as empty, handled by React components)
 * - {% include_cached %} - Cached Jekyll includes (rendered as empty, handled by React components)
 * - Variables: {{ site.* }}, {{ page.* }}
 * 
 * Note: Jekyll includes are stripped out because they are handled by React components
 * in the Next.js build (e.g., GitHubCultureCallout component).
 */
export async function processLiquid(content: string, context: Record<string, any> = {}): Promise<string> {
  // Create Liquid engine
  const engine = new Liquid({
    // Don't throw on undefined variables - just render empty string
    strictVariables: false,
    // Don't throw on undefined filters - just pass through
    strictFilters: false,
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
  
  // Register {% include_cached %} tag - used in Jekyll for caching includes
  // In Next.js, includes like github-culture.html are handled by React components,
  // so we return empty string and let the component system handle them
  engine.registerTag('include_cached', {
    parse() {
      // File argument is parsed by LiquidJS but not used since includes are stripped
    },
    render() {
      // Return empty - includes are handled by React components
      return '';
    },
  });
  
  // Register {% include %} tag - Jekyll include directive
  // Similar to include_cached, these are handled by React components in Next.js
  engine.registerTag('include', {
    parse() {
      // File argument is parsed by LiquidJS but not used since includes are stripped
    },
    render() {
      // Return empty - includes are handled by React components
      return '';
    },
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
