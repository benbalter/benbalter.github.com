import { render } from '@testing-library/react';
import HtmlContent from './HtmlContent';

describe('HtmlContent', () => {
  it('renders HTML content', () => {
    const html = '<p>Test content</p>';
    const { container } = render(<HtmlContent html={html} />);
    
    expect(container.querySelector('p')).toHaveTextContent('Test content');
  });

  it('applies custom className', () => {
    const html = '<p>Test</p>';
    const { container } = render(<HtmlContent html={html} className="entrybody" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toHaveClass('entrybody');
  });

  it('renders complex HTML structures', () => {
    const html = '<div><h1>Title</h1><p>Paragraph</p><ul><li>Item</li></ul></div>';
    const { container } = render(<HtmlContent html={html} />);
    
    expect(container.querySelector('h1')).toHaveTextContent('Title');
    expect(container.querySelector('p')).toHaveTextContent('Paragraph');
    expect(container.querySelector('li')).toHaveTextContent('Item');
  });

  it('handles empty HTML', () => {
    const { container } = render(<HtmlContent html="" />);
    const element = container.firstChild as HTMLElement;
    
    expect(element).toBeInTheDocument();
    expect(element).toBeEmptyDOMElement();
  });

  it('preserves HTML attributes and structure', () => {
    const html = '<div class="test" id="content"><span style="color: red;">Styled</span></div>';
    const { container } = render(<HtmlContent html={html} />);
    
    const innerDiv = container.querySelector('#content');
    expect(innerDiv).toHaveClass('test');
    // Color will be normalized to rgb format by the browser
    const span = innerDiv?.querySelector('span');
    expect(span).toHaveStyle('color: rgb(255, 0, 0)');
  });
});
