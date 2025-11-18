import { render } from '@testing-library/react';
import PostContent from './PostContent';

describe('PostContent', () => {
  it('should render HTML content', () => {
    const html = '<p>Test content</p>';
    const { container } = render(<PostContent contentHtml={html} />);
    
    expect(container.querySelector('p')).toBeInTheDocument();
    expect(container.textContent).toContain('Test content');
  });

  it('should apply entrybody class', () => {
    const html = '<p>Content</p>';
    const { container } = render(<PostContent contentHtml={html} />);
    
    const div = container.firstChild;
    expect(div).toHaveClass('entrybody');
  });

  it('should render complex HTML structure', () => {
    const html = `
      <h2>Heading</h2>
      <p>Paragraph with <strong>bold</strong> text</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    `;
    const { container } = render(<PostContent contentHtml={html} />);
    
    expect(container.querySelector('h2')).toBeInTheDocument();
    expect(container.querySelector('strong')).toBeInTheDocument();
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });

  it('should handle empty content', () => {
    const { container } = render(<PostContent contentHtml="" />);
    
    expect(container.firstChild).toBeInTheDocument();
    expect(container.textContent).toBe('');
  });

  it('should render code blocks', () => {
    const html = '<pre><code>const x = 1;</code></pre>';
    const { container } = render(<PostContent contentHtml={html} />);
    
    expect(container.querySelector('code')).toBeInTheDocument();
    expect(container.textContent).toContain('const x = 1;');
  });

  it('should render links', () => {
    const html = '<a href="/test">Link text</a>';
    const { container } = render(<PostContent contentHtml={html} />);
    
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });
});
