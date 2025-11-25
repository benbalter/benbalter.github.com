import { markdownToHtml } from '@/lib/markdown';
import { extractComponentPlaceholders, splitContentAtPlaceholders, type ComponentPlaceholder } from '@/lib/liquid';
import Callout from './Callout';
import FossAtScale from './FossAtScale';
import GitHubCultureCallout from './GitHubCultureCallout';

interface MarkdownContentProps {
  markdown: string;
  className?: string;
  context?: Record<string, any>;
}

/**
 * Renders a component based on its placeholder type and props.
 * This is a server component helper that maps placeholder data to React components.
 */
function renderComponent(component: ComponentPlaceholder): React.ReactNode {
  switch (component.type) {
    case 'callout':
      // Callout content comes from the rendered Liquid include after variable resolution.
      // The content is HTML that was rendered by the Jekyll include, so we use
      // dangerouslySetInnerHTML. Since this is SSG with trusted markdown files
      // from the repository (not user input), this is safe.
      return (
        <Callout key={component.id}>
          <span dangerouslySetInnerHTML={{ __html: component.props.content || '' }} />
        </Callout>
      );
    case 'foss-at-scale':
      return <FossAtScale key={component.id} nth={component.props.nth || ''} />;
    case 'github-culture':
      return <GitHubCultureCallout key={component.id} />;
    default:
      return null;
  }
}

/**
 * Optimized markdown content renderer for SSG (Static Site Generation)
 * 
 * This component processes markdown to HTML at build time, not runtime.
 * It also extracts and renders React components for supported Liquid includes.
 * 
 * Benefits over react-markdown:
 * - Smaller JavaScript bundle (eliminates react-markdown dependency ~88KB)
 * - Faster page loads (no runtime markdown processing)
 * - Better SSG performance (processing happens once at build time)
 * - Maintains security with rehype-sanitize
 * - Still a server component (no client-side JS)
 * - React components for Liquid includes instead of raw HTML
 * 
 * The markdownToHtml function handles:
 * - Liquid template syntax (Jekyll compatibility)
 * - GitHub Flavored Markdown (GFM)
 * - Emoji processing
 * - GitHub references (@mentions, #issues)
 * - Heading IDs and anchor links
 * - HTML sanitization
 * 
 * Supported React component includes:
 * - {% include callout.html content="..." %} -> Callout
 * - {% include foss-at-scale.html nth="..." %} -> FossAtScale  
 * - {% include_cached github-culture.html %} -> GitHubCultureCallout
 */
export default async function MarkdownContent({ markdown, className = '', context }: MarkdownContentProps) {
  // Convert markdown to HTML at build time, including liquid template processing
  // This resolves all Liquid variables and renders includes to HTML
  const html = await markdownToHtml(markdown, context);
  
  // Extract component placeholders AFTER Liquid processing
  // This ensures all variables are resolved before we detect component patterns
  const { content: contentWithPlaceholders, components } = extractComponentPlaceholders(html);
  
  // If no components were extracted, use the simple dangerouslySetInnerHTML approach
  if (components.length === 0) {
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  
  // Split content at placeholders and render with React components
  const segments = splitContentAtPlaceholders(contentWithPlaceholders, components);
  
  return (
    <div className={className}>
      {segments.map((segment, index) => {
        if (segment.type === 'html') {
          return (
            <div 
              key={`html-${index}`}
              dangerouslySetInnerHTML={{ __html: segment.content }}
            />
          );
        }
        return renderComponent(segment.component);
      })}
    </div>
  );
}
