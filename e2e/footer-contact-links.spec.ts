import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

test.describe('Footer Contact Links', () => {
  test('footer contact links should match contact page main links', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact/');
    await waitForPageReady(page);
    
    // Get contact links from the main contact section (first 5 links, excluding PGP key)
    const contactPageLinks = page.locator('.contact-links .row a[href]');
    const contactPageUrls = await contactPageLinks.evaluateAll((links) => 
      links.map(link => link.getAttribute('href')).filter(Boolean)
    );
    
    // Get contact links from the footer
    const footerLinks = page.locator('footer .social-links a[href]');
    const footerUrls = await footerLinks.evaluateAll((links) => 
      links.map(link => link.getAttribute('href')).filter(Boolean)
    );
    
    // Verify footer has the same links as contact page main section
    // (Contact page also has a PGP key link below, which is not in footer)
    expect(footerUrls).toEqual(contactPageUrls);
  });
  
  test('footer should have email link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const emailLink = page.locator('footer a[href^="mailto:"]');
    await expect(emailLink).toHaveCount(1);
    await expect(emailLink).toHaveAttribute('href', 'mailto:ben@balter.com');
  });
  
  test('footer should have vCard link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const vcardLink = page.locator('footer a[href="/vcard.vcf"]');
    await expect(vcardLink).toHaveCount(1);
  });
  
  test('footer should have Bluesky link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const blueskyLink = page.locator('footer a[href*="bsky.app"]');
    await expect(blueskyLink).toHaveCount(1);
    await expect(blueskyLink).toHaveAttribute('href', 'https://bsky.app/profile/ben.balter.com');
  });
  
  test('footer should have LinkedIn link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const linkedinLink = page.locator('footer a[href*="linkedin.com"]');
    await expect(linkedinLink).toHaveCount(1);
    await expect(linkedinLink).toHaveAttribute('href', 'https://www.linkedin.com/in/benbalter');
  });
  
  test('footer should have GitHub link', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const githubLink = page.locator('footer a[href*="github.com/benbalter"]');
    await expect(githubLink).toHaveCount(1);
    await expect(githubLink).toHaveAttribute('href', 'https://github.com/benbalter');
  });
  
  test('footer contact links should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const footerContactLinks = page.locator('footer .social-links a');
    const count = await footerContactLinks.count();
    
    expect(count).toBe(5); // Email, vCard, Bluesky, LinkedIn, GitHub
    
    // Check each link has aria-label
    for (let i = 0; i < count; i++) {
      const link = footerContactLinks.nth(i);
      await expect(link).toHaveAttribute('aria-label');
    }
  });
  
  test('footer contact links should open in new tab', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // All contact links should have target="_blank" (matching contact/about page behavior)
    const footerContactLinks = page.locator('footer .social-links a');
    const count = await footerContactLinks.count();
    
    expect(count).toBe(5); // Email, vCard, Bluesky, LinkedIn, GitHub
    
    for (let i = 0; i < count; i++) {
      const link = footerContactLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });
});
