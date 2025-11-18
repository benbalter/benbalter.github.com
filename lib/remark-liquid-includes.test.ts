import { describe, it } from 'node:test';
import assert from 'node:assert';
import { processLiquidIncludes } from './liquid-includes';

describe('Liquid Includes Replacement', () => {
  describe('github-culture include', () => {
    it('should replace {% include_cached github-culture.html %}', () => {
      const input = 'Some text\n\n{% include_cached github-culture.html %}\n\nMore text';
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('Interested in learning more about how GitHub works'));
      assert.ok(output.includes('class="alert alert-primary text-center"'));
      assert.ok(!output.includes('{% include_cached'));
    });

    it('should replace {% include github-culture.html %}', () => {
      const input = '{% include github-culture.html %}';
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('Interested in learning more about how GitHub works'));
      assert.ok(!output.includes('{% include'));
    });
  });

  describe('foss-at-scale include', () => {
    it('should replace {% include foss-at-scale.html nth="first" %}', () => {
      const input = '{% include foss-at-scale.html nth="first" %}';
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('This is the first post in'));
      assert.ok(output.includes('a series'));
      assert.ok(output.includes('managing-open-source-communities-at-scale'));
      assert.ok(!output.includes('{% include'));
    });

    it('should replace {% include foss-at-scale.html nth="second" %}', () => {
      const input = '{% include foss-at-scale.html nth="second" %}';
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('This is the second post in'));
    });

    it('should replace {% include foss-at-scale.html nth="fourth and final" %}', () => {
      const input = '{% include foss-at-scale.html nth="fourth and final" %}';
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('This is the fourth and final post in'));
    });
  });

  describe('callout include', () => {
    it('should replace simple {% capture %}...{% include callout.html %}', () => {
      const input = `{% capture disclaimer -%}
This is a disclaimer message.
{%- endcapture %}

{% include callout.html content=disclaimer %}`;
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('This is a disclaimer message'));
      assert.ok(output.includes('class="alert alert-primary text-center"'));
      assert.ok(!output.includes('{% capture'));
      assert.ok(!output.includes('{% include'));
    });

    it('should replace {% capture %}{% assign markdownify %}{% include callout.html %}', () => {
      const input = `{% capture update %}
This is an update with [a link](https://example.com).
{% endcapture %}
{% assign update = update | markdownify %}
{% include callout.html content=update %}`;
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('This is an update with [a link](https://example.com)'));
      assert.ok(output.includes('class="alert alert-primary text-center"'));
      assert.ok(!output.includes('{% capture'));
      assert.ok(!output.includes('{% assign'));
      assert.ok(!output.includes('{% include'));
    });
  });

  describe('contact-links include', () => {
    it('should replace {% include contact-links.html %}', () => {
      const input = 'Contact me:\n\n{% include contact-links.html %}';
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('col-sm'));
      assert.ok(output.includes('fa-2x'));
      assert.ok(!output.includes('{% include'));
    });
  });

  describe('about-json-ld include', () => {
    it('should remove {% include about-json-ld.html %} (handled by layout)', () => {
      const input = '{% include about-json-ld.html %}\n\nSome content';
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('Some content'));
      assert.ok(!output.includes('{% include'));
      assert.ok(!output.includes('about-json-ld'));
    });
  });

  describe('mixed includes', () => {
    it('should replace multiple different includes in one document', () => {
      const input = `# Title

{% include_cached github-culture.html %}

Some text here.

{% include foss-at-scale.html nth="first" %}

More content.`;
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('Interested in learning more about how GitHub works'));
      assert.ok(output.includes('This is the first post in'));
      assert.ok(!output.includes('{% include'));
    });
  });

  describe('non-include content', () => {
    it('should leave regular markdown unchanged', () => {
      const input = '# Hello\n\nThis is regular markdown with no includes.';
      const output = processLiquidIncludes(input);
      
      assert.ok(output.includes('# Hello'));
      assert.ok(output.includes('This is regular markdown'));
    });
  });
});


