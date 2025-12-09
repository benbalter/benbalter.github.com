# Visual QA Comparison: Jekyll vs Astro

**Date**: December 9, 2024  
**Status**: 🔄 In Progress  
**Purpose**: Side-by-side visual comparison to ensure design consistency

---

## Comparison Methodology

### Pages to Compare
1. **Homepage** (`/`)
   - Post listing
   - Navigation
   - Footer

2. **Blog Post** (sample: latest post)
   - Layout
   - Typography
   - Reading time display
   - Related posts section

3. **About Page** (`/about/`)
   - Bio content
   - Structured data

4. **Resume Page** (`/resume/`)
   - Position listings
   - Timeline layout

5. **Contact Page** (`/contact/`)
   - Contact links
   - Icons

6. **404 Page** (`/404/`)
   - Error message
   - Recent posts list

7. **Blog Post with Special Features**
   - Code blocks with syntax highlighting
   - Emoji rendering
   - @mentions
   - Callout boxes
   - Tables

---

## Jekyll URLs (Production)
- Homepage: `https://ben.balter.com/`
- Latest post: `https://ben.balter.com/2025/01/30/how-to-run-language-tool/`
- About: `https://ben.balter.com/about/`
- Resume: `https://ben.balter.com/resume/`
- Contact: `https://ben.balter.com/contact/`
- 404: `https://ben.balter.com/404.html`

## Astro URLs (Local/Staging)
- Homepage: `http://localhost:4321/`
- Latest post: `http://localhost:4321/2025/01/30/how-to-run-language-tool/`
- About: `http://localhost:4321/about/`
- Resume: `http://localhost:4321/resume/`
- Contact: `http://localhost:4321/contact/`
- 404: `http://localhost:4321/404/`

---

## Key Elements to Verify

### Layout & Structure
- [ ] Page width and margins
- [ ] Navigation bar appearance
- [ ] Footer content and layout
- [ ] Responsive breakpoints
- [ ] Content column widths

### Typography
- [ ] Font families match
- [ ] Font sizes match
- [ ] Line heights match
- [ ] Heading styles (h1-h6)
- [ ] Body text styles
- [ ] Link colors and hover states

### Components
- [ ] Navigation active states
- [ ] Post metadata (date, reading time)
- [ ] Related posts section
- [ ] Contact links/buttons
- [ ] Code blocks
- [ ] Callout/alert boxes
- [ ] Tables

### Colors & Styling
- [ ] Primary color
- [ ] Secondary color
- [ ] Link color
- [ ] Background colors
- [ ] Border colors
- [ ] Shadow effects

### Icons & Images
- [ ] Font Awesome icons
- [ ] Social media icons
- [ ] Avatar images
- [ ] Post images
- [ ] Favicon

### Special Features
- [ ] Emoji rendering (`:emoji:` syntax)
- [ ] @mentions (GitHub links)
- [ ] Syntax highlighting theme
- [ ] Reading time calculation
- [ ] Related posts algorithm

---

## Comparison Results

### ✅ Matching Elements
*To be filled in during testing*

### ⚠️ Minor Differences
*To be documented during testing*

### ❌ Significant Differences
*To be documented and addressed during testing*

---

## Testing Process

1. **Build Astro site**: `npm run astro:build`
2. **Start preview server**: `npm run astro:preview`
3. **Open both sites side-by-side** in browser
4. **Take screenshots** of each page
5. **Document differences** in this file
6. **Create tickets** for any issues found
7. **Fix issues** and retest

---

## Screenshot Checklist

### Desktop (1920x1080)
- [ ] Homepage
- [ ] Latest blog post
- [ ] About page
- [ ] Resume page
- [ ] Contact page
- [ ] 404 page
- [ ] Post with code blocks
- [ ] Post with callouts

### Tablet (768x1024)
- [ ] Homepage
- [ ] Blog post
- [ ] Navigation menu

### Mobile (375x667)
- [ ] Homepage
- [ ] Blog post
- [ ] Navigation menu
- [ ] Footer

---

## Browser Testing

### Desktop Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers
- [ ] Safari iOS
- [ ] Chrome Android

---

## Performance Comparison

### Metrics to Compare
- [ ] Page load time
- [ ] Time to First Contentful Paint (FCP)
- [ ] Time to Interactive (TTI)
- [ ] Largest Contentful Paint (LCP)
- [ ] Cumulative Layout Shift (CLS)
- [ ] First Input Delay (FID)

### Tools
- Lighthouse (Chrome DevTools)
- WebPageTest
- PageSpeed Insights

---

## Accessibility Comparison

### Tests to Run
- [ ] WAVE (Web Accessibility Evaluation Tool)
- [ ] axe DevTools
- [ ] Keyboard navigation
- [ ] Screen reader testing (NVDA/JAWS)
- [ ] Color contrast verification

---

## Known Differences (Expected)

### Acceptable Differences
1. **Build artifacts**: Different HTML structure is OK if visual output matches
2. **JavaScript bundles**: Astro ships less JS (this is good!)
3. **CSS organization**: Different compilation but same styles
4. **Meta tags order**: As long as all tags are present

### Intentional Improvements
1. **Performance**: Astro should be faster
2. **Bundle size**: Astro should be smaller
3. **Related posts**: Astro uses TF-IDF algorithm (better than manual)

---

## Issues Found

*To be populated during testing*

### Critical Issues
*Issues that block production deployment*

### High Priority Issues
*Visual inconsistencies that affect user experience*

### Medium Priority Issues
*Minor visual differences*

### Low Priority Issues
*Cosmetic differences with minimal impact*

---

## Sign-off Criteria

Visual QA is complete when:
- [ ] All critical issues resolved
- [ ] All high priority issues resolved
- [ ] Screenshots documented for all pages
- [ ] Performance metrics comparable or better
- [ ] Accessibility compliance verified
- [ ] Tested on all target browsers
- [ ] Mobile responsiveness verified

---

## Next Steps

1. Start Astro preview server
2. Take baseline screenshots of Jekyll site
3. Take comparison screenshots of Astro site
4. Document any differences
5. Address issues found
6. Retest and verify fixes
7. Final sign-off

---

**Status**: Ready to begin visual QA testing  
**Responsible**: GitHub Copilot  
**Reviewer**: @benbalter
