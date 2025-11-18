import { getSiteConfig } from './config';

/**
 * Preprocesses markdown content to replace Liquid include tags with HTML
 * This is done before remark parsing to avoid issues with multi-line patterns
 */
export function processLiquidIncludes(markdown: string): string {
  const config = getSiteConfig();
  let processed = markdown;
  
  // Replace {% include_cached github-culture.html %}
  processed = processed.replace(
    /\{%\s*include(?:_cached)?\s+github-culture\.html\s*%\}/g,
    `<div class="alert alert-primary text-center" role="alert">
  Interested in learning more about how GitHub works and what it's like to be a GitHubber?<br />
  <a href="${config.url}/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/" class="alert-link">Check out these popular posts on GitHub's culture and communication patterns</a>.
</div>`
  );
  
  // Replace {% include foss-at-scale.html nth="..." %}
  processed = processed.replace(
    /\{%\s*include\s+foss-at-scale\.html\s+nth="([^"]+)"\s*%\}/g,
    (_, nth) => `<div class="alert alert-primary text-center" role="alert">
  This is the ${nth} post in <a href="${config.url}/2021/06/15/managing-open-source-communities-at-scale/" class="alert-link">a series</a> on successfully managing open source communities at scale.
</div>`
  );
  
  // Replace {% include contact-links.html %}
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
  
  processed = processed.replace(
    /\{%\s*include\s+contact-links\.html\s*%\}/g,
    `<div class="text-center">
  <div class="row justify-content-center">
    ${linksHtml}
  </div>
  ${pgpHtml}
</div>`
  );
  
  // Replace {% include about-json-ld.html %} (remove it, handled by layout)
  processed = processed.replace(
    /\{%\s*include\s+about-json-ld\.html\s*%\}/g,
    ''
  );
  
  // Replace {% capture variable %}{% assign variable = variable | markdownify %}{% include callout.html content=variable %}
  processed = processed.replace(
    /\{%-?\s*capture\s+(\w+)\s*-?%\}([\s\S]*?)\{%-?\s*endcapture\s*-?%\}\s*\{%-?\s*assign\s+\1\s*=\s*\1\s*\|\s*markdownify\s*-?%\}\s*\{%-?\s*include\s+callout\.html\s+content=\1\s*-?%\}/g,
    (_, _varName, content) => `<div class="alert alert-primary text-center" role="alert">
  ${content.trim()}
</div>`
  );
  
  // Replace {% capture variable %}{% include callout.html content=variable %}
  processed = processed.replace(
    /\{%-?\s*capture\s+(\w+)\s*-?%\}([\s\S]*?)\{%-?\s*endcapture\s*-?%\}\s*\{%-?\s*include\s+callout\.html\s+content=\1\s*-?%\}/g,
    (_, _varName, content) => `<div class="alert alert-primary text-center" role="alert">
  ${content.trim()}
</div>`
  );
  
  return processed;
}
