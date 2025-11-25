import { processLiquid, extractComponentPlaceholders, splitContentAtPlaceholders } from './liquid';

describe('extractComponentPlaceholders', () => {
  it('should extract callout includes with quoted content', () => {
    const content = 'Before {% include callout.html content="Test content" %} After';
    const result = extractComponentPlaceholders(content);
    
    expect(result.components).toHaveLength(1);
    expect(result.components[0]).toEqual({
      type: 'callout',
      props: { content: 'Test content' },
      id: 'component-0',
    });
    expect(result.content).toBe('Before <div data-component="component-0"></div> After');
  });
  
  it('should extract foss-at-scale includes', () => {
    const content = '{% include foss-at-scale.html nth="first" %}';
    const result = extractComponentPlaceholders(content);
    
    expect(result.components).toHaveLength(1);
    expect(result.components[0]).toEqual({
      type: 'foss-at-scale',
      props: { nth: 'first' },
      id: 'component-0',
    });
  });
  
  it('should extract github-culture includes', () => {
    const content = '{% include_cached github-culture.html %}';
    const result = extractComponentPlaceholders(content);
    
    expect(result.components).toHaveLength(1);
    expect(result.components[0]).toEqual({
      type: 'github-culture',
      props: {},
      id: 'component-0',
    });
  });
  
  it('should extract github-culture without _cached', () => {
    const content = '{% include github-culture.html %}';
    const result = extractComponentPlaceholders(content);
    
    expect(result.components).toHaveLength(1);
    expect(result.components[0].type).toBe('github-culture');
  });
  
  it('should extract multiple components', () => {
    const content = `
{% include foss-at-scale.html nth="first" %}
Some content
{% include callout.html content="A callout" %}
More content
{% include_cached github-culture.html %}
    `;
    const result = extractComponentPlaceholders(content);
    
    expect(result.components).toHaveLength(3);
    // Components are extracted in order: callout regex first, then foss-at-scale, then github-culture
    // But since they appear in different positions, the order depends on regex execution
    const types = result.components.map(c => c.type);
    expect(types).toContain('foss-at-scale');
    expect(types).toContain('callout');
    expect(types).toContain('github-culture');
  });
  
  it('should return empty components array when no includes found', () => {
    const content = 'Just some regular content without includes';
    const result = extractComponentPlaceholders(content);
    
    expect(result.components).toHaveLength(0);
    expect(result.content).toBe(content);
  });
  
  it('should handle varying whitespace in include syntax', () => {
    const content1 = '{%include foss-at-scale.html nth="test"%}';
    const content2 = '{%  include  foss-at-scale.html  nth="test"  %}';
    
    const result1 = extractComponentPlaceholders(content1);
    const result2 = extractComponentPlaceholders(content2);
    
    expect(result1.components).toHaveLength(1);
    expect(result2.components).toHaveLength(1);
  });
});

describe('splitContentAtPlaceholders', () => {
  it('should return single segment when no components', () => {
    const html = '<p>Simple content</p>';
    const result = splitContentAtPlaceholders(html, []);
    
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ type: 'html', content: html });
  });
  
  it('should split content at placeholder markers', () => {
    const html = '<p>Before</p><div data-component="component-0"></div><p>After</p>';
    const components = [{ type: 'callout' as const, props: { content: 'test' }, id: 'component-0' }];
    
    const result = splitContentAtPlaceholders(html, components);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ type: 'html', content: '<p>Before</p>' });
    expect(result[1]).toEqual({ type: 'component', component: components[0] });
    expect(result[2]).toEqual({ type: 'html', content: '<p>After</p>' });
  });
  
  it('should handle component at start', () => {
    const html = '<div data-component="component-0"></div><p>After</p>';
    const components = [{ type: 'foss-at-scale' as const, props: { nth: 'first' }, id: 'component-0' }];
    
    const result = splitContentAtPlaceholders(html, components);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ type: 'component', component: components[0] });
    expect(result[1]).toEqual({ type: 'html', content: '<p>After</p>' });
  });
  
  it('should handle component at end', () => {
    const html = '<p>Before</p><div data-component="component-0"></div>';
    const components = [{ type: 'github-culture' as const, props: {}, id: 'component-0' }];
    
    const result = splitContentAtPlaceholders(html, components);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ type: 'html', content: '<p>Before</p>' });
    expect(result[1]).toEqual({ type: 'component', component: components[0] });
  });
  
  it('should handle multiple components', () => {
    const html = '<p>A</p><div data-component="component-0"></div><p>B</p><div data-component="component-1"></div><p>C</p>';
    const components = [
      { type: 'callout' as const, props: { content: '1' }, id: 'component-0' },
      { type: 'callout' as const, props: { content: '2' }, id: 'component-1' },
    ];
    
    const result = splitContentAtPlaceholders(html, components);
    
    expect(result).toHaveLength(5);
    expect(result[0].type).toBe('html');
    expect(result[1].type).toBe('component');
    expect(result[2].type).toBe('html');
    expect(result[3].type).toBe('component');
    expect(result[4].type).toBe('html');
  });
  
  it('should skip empty HTML segments', () => {
    const html = '<div data-component="component-0"></div><div data-component="component-1"></div>';
    const components = [
      { type: 'callout' as const, props: { content: '1' }, id: 'component-0' },
      { type: 'callout' as const, props: { content: '2' }, id: 'component-1' },
    ];
    
    const result = splitContentAtPlaceholders(html, components);
    
    expect(result).toHaveLength(2);
    expect(result[0].type).toBe('component');
    expect(result[1].type).toBe('component');
  });
});

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
});
