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
});
