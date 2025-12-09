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
    
    // Get contact links from the footer - use more flexible selector
    const footerLinks = page.locator('footer .social-links a[href], footer .social-link[href]');
    const footerUrls = await footerLinks.evaluateAll((links) => 
      links.map(link => link.getAttribute('href')).filter(Boolean)
    );
    
    // Verify footer has the same links as contact page main section
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
    
    // Use broader selector - the footer has github.com links
    const githubLink = page.locator('footer a[href="https://github.com/benbalter"]');
    await expect(githubLink).toHaveCount(1);
  });
  
  test('footer contact links should have proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    // Use the actual class from Footer.astro
    const footerContactLinks = page.locator('footer .social-links a.social-link');
    const count = await footerContactLinks.count();
    
    // Dynamically check based on actual count from contactLinks config
    expect(count).toBeGreaterThan(0);
    
    // Check each link has aria-label
    for (let i = 0; i < count; i++) {
      const link = footerContactLinks.nth(i);
      await expect(link).toHaveAttribute('aria-label');
    }
  });
  
  test('footer contact links should open in new tab', async ({ page }) => {
    await page.goto('/');
    await waitForPageReady(page);
    
    const footerContactLinks = page.locator('footer .social-links a.social-link');
    const count = await footerContactLinks.count();
    
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const link = footerContactLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });
});
