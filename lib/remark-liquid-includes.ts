import { visit } from 'unist-util-visit';
import type { Root, Text, Html } from 'mdast';
import { getSiteConfig } from './config';

/**
 * Remark plugin to replace Liquid include tags with HTML
 * This allows us to migrate away from Jekyll Liquid includes
 */
export default function remarkLiquidIncludes() {
  return (tree: Root) => {
    const config = getSiteConfig();
    
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!node.value || !parent || typeof index !== 'number') return;
      
      let content = node.value;
      const replacements: Array<{ start: number; end: number; html: string }> = [];
      
      // Replace {% include_cached github-culture.html %}
      const githubCultureRegex = /\{%\s*include(?:_cached)?\s+github-culture\.html\s*%\}/g;
      let match;
      while ((match = githubCultureRegex.exec(content)) !== null) {
        const html = `<div class="alert alert-primary text-center" role="alert">
  Interested in learning more about how GitHub works and what it's like to be a GitHubber?<br />
  <a href="${config.url}/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/" class="alert-link">Check out these popular posts on GitHub's culture and communication patterns</a>.
</div>`;
        replacements.push({ start: match.index, end: match.index + match[0].length, html });
      }
      
      // Replace {% include foss-at-scale.html nth="..." %}
      const fossRegex = /\{%\s*include\s+foss-at-scale\.html\s+nth="([^"]+)"\s*%\}/g;
      while ((match = fossRegex.exec(content)) !== null) {
        const nth = match[1];
        const html = `<div class="alert alert-primary text-center" role="alert">
  This is the ${nth} post in <a href="${config.url}/2021/06/15/managing-open-source-communities-at-scale/" class="alert-link">a series</a> on successfully managing open source communities at scale.
</div>`;
        replacements.push({ start: match.index, end: match.index + match[0].length, html });
      }
      
      // Replace {% include contact-links.html %}
      const contactLinksRegex = /\{%\s*include\s+contact-links\.html\s*%\}/g;
      while ((match = contactLinksRegex.exec(content)) !== null) {
        const contactLinks = config.contact_links || [];
        const pgpKey = config.pgp_key;
        
        const linksHtml = contactLinks.map((link) => `
          <div class="col-sm">
            <a href="${link.url}" rel="me noopener" target="_blank" data-proofer-ignore="true">
              <div class="row justify-content-center mb-3 align-items-center">
                <div class="col-sm-12 col-2 offset-3 offset-sm-0 text-center">
                  <i class="${link.icon} fa-2x" aria-hidden="true"></i>
                </div>
                <div class="col-sm-12 col-6 text-sm-center text-start">
                  ${link.name}
                </div>
              </div>
            </a>
          </div>
        `).join('');
        
        const pgpHtml = pgpKey ? `
          <p class="small">
            <a href="/key.asc">PGP: <code>${pgpKey}</code></a>
          </p>
        ` : '';
        
        const html = `<div class="text-center">
  <div class="row justify-content-center">
    ${linksHtml}
  </div>
  ${pgpHtml}
</div>`;
        replacements.push({ start: match.index, end: match.index + match[0].length, html });
      }
      
      // Replace {% include about-json-ld.html %}
      // Note: This is now handled by the layout, but we'll remove the tag to avoid duplication
      const aboutJsonLdRegex = /\{%\s*include\s+about-json-ld\.html\s*%\}/g;
      while ((match = aboutJsonLdRegex.exec(content)) !== null) {
        // Replace with empty string since it's handled in the layout
        replacements.push({ start: match.index, end: match.index + match[0].length, html: '' });
      }
      
      // Replace {% capture variable %}...{% endcapture %}{% include callout.html content=variable %}
      const calloutRegex = /\{%\s*capture\s+(\w+)\s*%\}([\s\S]*?)\{%\s*endcapture\s*%\}\s*\{%\s*include\s+callout\.html\s+content=\1\s*%\}/g;
      while ((match = calloutRegex.exec(content)) !== null) {
        if (match[2]) {
          const capturedContent = match[2].trim();
          const html = `<div class="alert alert-primary text-center" role="alert">
  ${capturedContent}
</div>`;
          replacements.push({ start: match.index, end: match.index + match[0].length, html });
        }
      }
      
      // If we found any replacements, split the text node into multiple nodes
      if (replacements.length > 0) {
        // Sort replacements by start position
        replacements.sort((a, b) => a.start - b.start);
        
        const newNodes: Array<Text | Html> = [];
        let lastEnd = 0;
        
        for (const replacement of replacements) {
          // Add text before the replacement
          if (replacement.start > lastEnd) {
            newNodes.push({
              type: 'text',
              value: content.slice(lastEnd, replacement.start),
            });
          }
          
          // Add the HTML replacement (if not empty)
          if (replacement.html) {
            newNodes.push({
              type: 'html',
              value: replacement.html,
            });
          }
          
          lastEnd = replacement.end;
        }
        
        // Add remaining text
        if (lastEnd < content.length) {
          newNodes.push({
            type: 'text',
            value: content.slice(lastEnd),
          });
        }
        
        // Replace the node with the new nodes
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}
