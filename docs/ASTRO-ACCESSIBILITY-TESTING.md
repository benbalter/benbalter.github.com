# Accessibility Testing Guide for Astro

This guide outlines accessibility testing strategies and requirements for ben.balter.com's Astro implementation.

---

## Table of Contents

1. [Automated Testing](#automated-testing)
2. [Manual Testing](#manual-testing)
3. [Keyboard Navigation](#keyboard-navigation)
4. [Screen Reader Testing](#screen-reader-testing)
5. [Color Contrast](#color-contrast)
6. [ARIA Best Practices](#aria-best-practices)
7. [Testing Checklist](#testing-checklist)

---

## Automated Testing

### axe-core Integration

**Installation:**

```bash
npm install --save-dev @axe-core/playwright
```

**Usage in Playwright Tests:**

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### Lighthouse CI

**Configuration (.lighthouserc.json):**

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4321"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.9 }],
        "categories:seo": ["error", { "minScore": 0.95 }],
        "categories:performance": ["warn", { "minScore": 0.9 }]
      }
    }
  }
}
```

---

## Manual Testing

### WCAG 2.1 Level AA Requirements

#### Perceivable

- [ ] **Text Alternatives (1.1.1)**: All images have alt text
- [ ] **Audio Descriptions (1.2.5)**: Videos have captions/transcripts
- [ ] **Adaptable Content (1.3.1)**: Semantic HTML used
- [ ] **Distinguishable (1.4.3)**: Color contrast meets 4.5:1 ratio

#### Operable

- [ ] **Keyboard Accessible (2.1.1)**: All functionality via keyboard
- [ ] **No Keyboard Trap (2.1.2)**: Users can navigate away from all elements
- [ ] **Focus Visible (2.4.7)**: Visible focus indicators
- [ ] **Multiple Ways (2.4.5)**: Multiple navigation methods

#### Understandable

- [ ] **Language (3.1.1)**: Page language specified (`<html lang="en">`)
- [ ] **Predictable (3.2.1)**: No context changes on focus
- [ ] **Input Assistance (3.3.1)**: Error identification and suggestions
- [ ] **Labels (3.3.2)**: Labels provided for inputs

#### Robust

- [ ] **Valid HTML (4.1.1)**: Passes HTML validation
- [ ] **Name, Role, Value (4.1.2)**: Proper ARIA attributes
- [ ] **Status Messages (4.1.3)**: Status messages announced

---

## Keyboard Navigation

### Testing Procedure

1. **Tab Navigation**
   - Press `Tab` to move forward through interactive elements
   - Press `Shift+Tab` to move backward
   - Verify logical tab order
   - Check all interactive elements are reachable

2. **Skip Links**
   - Press `Tab` on page load
   - Verify "Skip to main content" link appears
   - Press `Enter` to activate
   - Verify focus moves to main content

3. **Navigation Menu**
   - Tab to navigation links
   - Press `Enter` to follow links
   - Verify current page indicator

4. **Interactive Components**
   - Tab to buttons, links, form fields
   - Press `Enter` or `Space` to activate
   - Verify actions execute properly

### Common Issues to Check

- ❌ **Keyboard Trap**: Focus gets stuck in a component
- ❌ **Missing Focus**: Invisible focus indicator
- ❌ **Illogical Order**: Tab order doesn't match visual order
- ❌ **Inaccessible Elements**: Interactive elements not in tab order

### Keyboard Shortcuts

- `Tab` - Move focus forward
- `Shift+Tab` - Move focus backward
- `Enter` - Activate links/buttons
- `Space` - Activate buttons/checkboxes
- `Esc` - Close modals/menus
- `Arrow Keys` - Navigate within components (menus, tabs)

---

## Screen Reader Testing

### Screen Readers by Platform

- **Windows**: NVDA (free), JAWS (paid)
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca (free)
- **iOS**: VoiceOver (built-in)
- **Android**: TalkBack (built-in)

### VoiceOver Testing (macOS)

**Enable VoiceOver:**

- Press `Cmd+F5`
- Or: System Settings → Accessibility → VoiceOver → Enable

**Basic Commands:**

- `Ctrl+Option+A` - Start reading
- `Ctrl+Option+Right Arrow` - Next item
- `Ctrl+Option+Left Arrow` - Previous item
- `Ctrl+Option+Space` - Activate item
- `Ctrl+Option+U` - Open rotor (navigate by headings, links, etc.)

**Testing Checklist:**

- [ ] Page title announced on load
- [ ] Landmark regions announced (nav, main, footer)
- [ ] Headings hierarchy makes sense
- [ ] Links have descriptive text
- [ ] Images have meaningful alt text
- [ ] Form labels associated correctly
- [ ] Error messages announced
- [ ] Dynamic content changes announced

### NVDA Testing (Windows)

**Download:** https://www.nvaccess.org/download/

**Basic Commands:**

- `Ctrl` - Stop reading
- `Insert+Down Arrow` - Start reading
- `Insert+Up Arrow` - Current line
- `Tab` - Next focusable element
- `H` - Next heading
- `K` - Next link
- `F` - Next form field

---

## Color Contrast

### Tools

1. **Browser DevTools**
   - Chrome: Inspect element → Styles → Contrast ratio
   - Firefox: Inspect element → Accessibility panel

2. **Online Tools**
   - [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
   - [Contrast Ratio](https://contrast-ratio.com/)

3. **Browser Extensions**
   - [axe DevTools](https://www.deque.com/axe/devtools/)
   - [WAVE](https://wave.webaim.org/extension/)

### Requirements

**WCAG AA (Minimum):**

- Normal text: 4.5:1 contrast ratio
- Large text (18pt+): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

**WCAG AAA (Enhanced):**

- Normal text: 7:1 contrast ratio
- Large text: 4.5:1 contrast ratio

### Common Issues

- ❌ Light gray text on white background
- ❌ Blue links on black background
- ❌ Placeholder text too light
- ❌ Disabled buttons with insufficient contrast

### Testing Script

```typescript
import { test, expect } from '@playwright/test';

test('text should have sufficient contrast', async ({ page }) => {
  await page.goto('/');
  
  // Get all text elements
  const textElements = await page.locator('body *:has-text(/./):not(:has(*))').all();
  
  for (const element of textElements) {
    const contrast = await element.evaluate((el) => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // Calculate contrast ratio
      // (Simplified - use actual contrast calculation library)
      return { color, backgroundColor };
    });
    
    // Verify contrast meets minimum requirements
    // expect(contrast.ratio).toBeGreaterThan(4.5);
  }
});
```

---

## ARIA Best Practices

### When to Use ARIA

**Use ARIA when:**

- Native HTML elements don't exist for the functionality
- Custom widgets need semantic meaning
- Dynamic content updates need to be announced
- Visual labels aren't available

**Don't use ARIA when:**

- Native HTML elements exist (`<button>` not `<div role="button">`)
- The element already has implicit semantics
- It would duplicate native semantics

### Common ARIA Attributes

#### Roles

```html
<!-- Landmark roles -->
<nav role="navigation">
<main role="main">
<aside role="complementary">
<footer role="contentinfo">

<!-- Widget roles -->
<div role="button">
<div role="tab">
<div role="dialog">
```

#### States

```html
<!-- Expandable content -->
<button aria-expanded="false">Menu</button>
<div aria-hidden="true">Content</div>

<!-- Current state -->
<a href="/about/" aria-current="page">About</a>

<!-- Selected state -->
<div role="tab" aria-selected="true">Tab 1</div>
```

#### Properties

```html
<!-- Labels -->
<button aria-label="Close dialog">×</button>
<img src="icon.png" aria-labelledby="icon-label" />
<span id="icon-label">Settings</span>

<!-- Descriptions -->
<button aria-describedby="help-text">Submit</button>
<div id="help-text">This will submit your form</div>

<!-- Live regions -->
<div role="alert">Error message</div>
<div aria-live="polite">Status update</div>
```

### ARIA Validation Script

```typescript
import { test, expect } from '@playwright/test';

test('ARIA attributes should be valid', async ({ page }) => {
  await page.goto('/');
  
  // Check for common ARIA issues
  const issues = await page.evaluate(() => {
    const problems: string[] = [];
    
    // Check for duplicate IDs (referenced by aria-labelledby, etc.)
    const ids = new Set();
    document.querySelectorAll('[id]').forEach((el) => {
      if (ids.has(el.id)) {
        problems.push(`Duplicate ID: ${el.id}`);
      }
      ids.add(el.id);
    });
    
    // Check for aria-labelledby/describedby referencing non-existent IDs
    document.querySelectorAll('[aria-labelledby], [aria-describedby]').forEach((el) => {
      const labelledBy = el.getAttribute('aria-labelledby');
      const describedBy = el.getAttribute('aria-describedby');
      
      [labelledBy, describedBy].forEach((attr) => {
        if (attr) {
          attr.split(' ').forEach((id) => {
            if (!document.getElementById(id)) {
              problems.push(`Missing referenced ID: ${id}`);
            }
          });
        }
      });
    });
    
    return problems;
  });
  
  expect(issues).toEqual([]);
});
```

---

## Testing Checklist

### Every Page Should Have

- [ ] Unique, descriptive title
- [ ] Skip to main content link
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Semantic HTML (nav, main, article, footer)
- [ ] Language attribute (`<html lang="en">`)
- [ ] Viewport meta tag
- [ ] Focus visible on all interactive elements
- [ ] All images have alt text
- [ ] Color contrast meets WCAG AA (4.5:1)

### Interactive Elements Should

- [ ] Be keyboard accessible
- [ ] Have visible focus indicators
- [ ] Have descriptive labels
- [ ] Provide feedback on activation
- [ ] Be announced correctly by screen readers
- [ ] Not create keyboard traps

### Forms Should Have

- [ ] Labels for all inputs
- [ ] Error messages associated with fields
- [ ] Required fields indicated
- [ ] Submit buttons clearly labeled
- [ ] Validation messages announced

### Dynamic Content Should

- [ ] Announce updates via ARIA live regions
- [ ] Maintain focus appropriately
- [ ] Not cause unexpected context changes
- [ ] Be dismissible if modal/popup

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Accessibility Tests

on: [push, pull_request]

jobs:
  a11y-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build site
        run: npm run astro:build
      
      - name: Run accessibility tests
        run: npm run test:e2e:astro -- e2e/accessibility*.spec.ts
      
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: accessibility-test-results
          path: playwright-report/
```

---

## Resources

### Standards

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Resources](https://webaim.org/resources/)

### Tools

- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WAVE](https://wave.webaim.org/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Pa11y](https://pa11y.org/)
- [Tenon](https://tenon.io/)

### Testing Services

- [NVDA](https://www.nvaccess.org/) - Free screen reader (Windows)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) - Built-in (macOS/iOS)
- [JAWS](https://www.freedomscientific.com/products/software/jaws/) - Commercial screen reader (Windows)
- [TalkBack](https://support.google.com/accessibility/android/answer/6283677) - Built-in (Android)

---

**Document Version:** 1.0  
**Last Updated:** December 10, 2024  
**Maintainer:** GitHub Copilot
