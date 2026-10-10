import { test, expect } from '@playwright/test';
import { waitForPageReady } from './helpers';

test.describe('Footer Contact Links', () => {
  test('footer contact links should match contact page main links', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact/');
    await waitForPageReady(page);
    
    // Get contact links from the page body: the email link, the vCard, and
    // the network list, in that order (the PGP key link is excluded)
    const contactPageLinks = page.locator('main [data-contact-link]');
    const contactPageUrls = await contactPageLinks.evaluateAll((links) => 
      links.map(link => link.getAttribute('href')).filter(Boolean)
    );
    
    // Get contact links from the footer (uses ul.contact-links for accessible markup)
    const footerLinks = page.locator('footer ul.contact-links a[href]');
    const footerUrls = await footerLinks.evaluateAll((links) => 
      links.map(link => link.getAttribute('href')).filter(Boolean)
    );
    
    // Guard against a vacuous pass ([] equals []) if a selector stops matching
    expect(contactPageUrls.length).toBeGreaterThan(0);

    // Verify footer has the same links as the contact page body
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
    
    // Footer uses ul.contact-links for accessible markup
    const footerContactLinks = page.locator('footer ul.contact-links a');
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
    
    // Footer uses ul.contact-links for accessible markup
    const footerContactLinks = page.locator('footer ul.contact-links a');
    const count = await footerContactLinks.count();
    
    expect(count).toBe(5); // Email, vCard, Bluesky, LinkedIn, GitHub
    
    for (let i = 0; i < count; i++) {
      const link = footerContactLinks.nth(i);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });
  
  test('footer contact link icons should render after Astro navigation', async ({ page }) => {
    // Start on homepage
    await page.goto('/');
    await waitForPageReady(page);
    
    
    // Check that SVG icons are present on initial load
    // We use inline SVGs instead of FontAwesome for better performance
    // Footer uses ul.contact-links for accessible markup
    const initialIcons = page.locator('footer ul.contact-links svg.icon');
    await expect(initialIcons).toHaveCount(5); // Email, vCard, Bluesky, LinkedIn, GitHub
    
    // Navigate to another page using Astro View Transitions
    const aboutLink = page.locator('a[href="/about/"]').first();
    await aboutLink.click();
    await page.waitForURL('**/about/');
    await waitForPageReady(page);
    
    
    // Check that footer contact link icons still render after navigation
    const iconsAfterNav = page.locator('footer ul.contact-links svg.icon');
    await expect(iconsAfterNav).toHaveCount(5);
    
    // Verify icons are actually visible (not just present in DOM)
    for (let i = 0; i < 5; i++) {
      await expect(iconsAfterNav.nth(i)).toBeVisible();
    }
    
    // Navigate to another page to test multiple navigations
    const contactLink = page.locator('a[href="/contact/"]').first();
    await contactLink.click();
    await page.waitForURL('**/contact/');
    await waitForPageReady(page);
    
    
    // Check icons still work after second navigation
    const iconsAfterSecondNav = page.locator('footer ul.contact-links svg.icon');
    await expect(iconsAfterSecondNav).toHaveCount(5);
    
    // Verify all icons are visible
    for (let i = 0; i < 5; i++) {
      await expect(iconsAfterSecondNav.nth(i)).toBeVisible();
    }
  });
});
