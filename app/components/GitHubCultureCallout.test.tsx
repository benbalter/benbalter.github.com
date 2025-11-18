import { describe, it } from 'node:test';
import assert from 'node:assert';
import { render } from '@testing-library/react';
import GitHubCultureCallout from './GitHubCultureCallout';

describe('GitHubCultureCallout', () => {
  it('renders the callout with correct text', () => {
    const { getByRole, getByText } = render(<GitHubCultureCallout />);
    
    const alert = getByRole('alert');
    assert.ok(alert);
    assert.strictEqual(alert.className, 'alert alert-primary text-center');
    
    const link = getByText("Check out these popular posts on GitHub's culture and communication patterns");
    assert.ok(link);
  });

  it('contains a link to the GitHub culture post', () => {
    const { container } = render(<GitHubCultureCallout />);
    
    const link = container.querySelector('a[href="/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/"]');
    assert.ok(link);
    assert.strictEqual(link?.className, 'alert-link');
  });
});
