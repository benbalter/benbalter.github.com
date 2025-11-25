import { processLiquid } from './liquid';

describe('processLiquid', () => {
  describe('{% raw %} tag', () => {
    it('should pass through content inside raw tags without processing', async () => {
      const input = '{% raw %}{{ site.title }}{% endraw %}';
      const result = await processLiquid(input);
      expect(result).toBe('{{ site.title }}');
    });

    it('should handle multiple raw blocks', async () => {
      const input = '{% raw %}{{ a }}{% endraw %} and {% raw %}{{ b }}{% endraw %}';
      const result = await processLiquid(input);
      expect(result).toBe('{{ a }} and {{ b }}');
    });
  });

  describe('{% github_edit_link %} tag', () => {
    it('should render a github edit link with default text', async () => {
      const context = {
        path: '_posts/2024-01-01-test.md',
      };
      const input = '{% github_edit_link %}';
      const result = await processLiquid(input, context);
      expect(result).toContain('<a href="https://github.com/benbalter/benbalter.github.com/edit/main/_posts/2024-01-01-test.md">');
      expect(result).toContain('help improve this content</a>');
    });

    it('should render a github edit link with custom text', async () => {
      const context = {
        path: '_posts/2024-01-01-test.md',
      };
      const input = '{% github_edit_link "edit this post" %}';
      const result = await processLiquid(input, context);
      expect(result).toContain('<a href="https://github.com/benbalter/benbalter.github.com/edit/main/_posts/2024-01-01-test.md">');
      expect(result).toContain('edit this post</a>');
    });

    it('should handle quoted custom text', async () => {
      const context = {
        path: '_posts/2024-01-01-test.md',
      };
      const input = 'Please {% github_edit_link "help improve this article" %}.';
      const result = await processLiquid(input, context);
      expect(result).toContain('help improve this article</a>');
    });
  });

  describe('{% include %} and {% include_cached %} tags', () => {
    it('should render Jekyll includes from _includes directory', async () => {
      // Test includes callout.html which is in _includes/
      const input = '{% include callout.html content="Test callout content" %}';
      const result = await processLiquid(input);
      expect(result).toContain('alert-primary');
      expect(result).toContain('Test callout content');
    });

    it('should render include_cached the same as include', async () => {
      // include_cached should work identically to include in Next.js
      const input = '{% include_cached github-culture.html %}';
      const result = await processLiquid(input);
      expect(result).toContain('alert-primary');
      expect(result).toContain('what-to-read-before-starting-or-interviewing-at-github');
    });

    it('should pass variables to includes', async () => {
      // foss-at-scale.html uses include.nth parameter
      const input = '{% include foss-at-scale.html nth="first" %}';
      const result = await processLiquid(input);
      expect(result).toContain('This is the first post');
      expect(result).toContain('managing-open-source-communities-at-scale');
    });

    it('should handle nested includes', async () => {
      // foss-at-scale.html includes callout.html internally
      const input = '{% include foss-at-scale.html nth="second" %}';
      const result = await processLiquid(input);
      expect(result).toContain('alert-primary');
      expect(result).toContain('This is the second post');
    });
  });

  describe('Jekyll filters', () => {
    it('should handle absolute_url filter', async () => {
      const input = '{{ "/about/" | absolute_url }}';
      const result = await processLiquid(input);
      expect(result).toBe('https://ben.balter.com/about/');
    });

    it('should handle relative_url filter', async () => {
      const input = '{{ "/about/" | relative_url }}';
      const result = await processLiquid(input);
      expect(result).toBe('/about/');
    });

    it('should add leading slash to relative_url if missing', async () => {
      const input = '{{ "about/" | relative_url }}';
      const result = await processLiquid(input);
      expect(result).toBe('/about/');
    });
  });

  describe('variable interpolation', () => {
    it('should replace site variables', async () => {
      const input = '{{ site.title }}';
      const result = await processLiquid(input);
      expect(result).toBe('Ben Balter');
    });

    it('should replace page variables', async () => {
      const context = {
        title: 'Test Post',
      };
      const input = '{{ page.title }}';
      const result = await processLiquid(input, context);
      expect(result).toBe('Test Post');
    });

    it('should handle undefined variables gracefully', async () => {
      const input = '{{ page.nonexistent }}';
      const result = await processLiquid(input);
      // Should render empty string for undefined variables
      expect(result).toBe('');
    });
  });

  describe('complex templates', () => {
    it('should handle mixed content with raw tags and variables', async () => {
      const context = {
        title: 'My Post',
      };
      const input = `
Title: {{ page.title }}

Code example:
\`\`\`liquid
{% raw %}{{ site.title }}{% endraw %}
\`\`\`

Edit: {% github_edit_link %}
`;
      const result = await processLiquid(input, context);
      expect(result).toContain('Title: My Post');
      expect(result).toContain('{{ site.title }}');
      expect(result).toContain('help improve this content');
    });
  });

  describe('error handling', () => {
    it('should return original content if liquid parsing fails', async () => {
      // Malformed liquid syntax - unclosed tag
      const input = '{% if something';
      const result = await processLiquid(input);
      // Should fallback to returning original content
      expect(result).toBe(input);
    });
  });

  describe('{% include %} tag', () => {
    it('should render include tag as empty string', async () => {
      const input = '{% include callout.html content=update %}';
      const result = await processLiquid(input);
      expect(result).toBe('');
    });

    it('should handle include tag with file path', async () => {
      const input = 'Before {% include callout.html %} After';
      const result = await processLiquid(input);
      expect(result).toBe('Before  After');
    });
  });

  describe('{% include_cached %} tag', () => {
    it('should render include_cached tag as empty string', async () => {
      const input = '{% include_cached github-culture.html %}';
      const result = await processLiquid(input);
      expect(result).toBe('');
    });

    it('should handle include_cached in complex content', async () => {
      const input = 'Text before\n{% include_cached github-culture.html %}\nText after';
      const result = await processLiquid(input);
      expect(result).toBe('Text before\n\nText after');
    });
  });
});
