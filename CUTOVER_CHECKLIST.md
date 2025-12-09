# Big-Bang Cutover Checklist

**Migration**: Jekyll → Astro  
**Target Date**: TBD  
**Prepared**: December 9, 2024

---

## Pre-Flight Checks (Day Before)

### Build Verification
- [ ] Run `npm run astro:build` - verify successful
- [ ] Run `npm run astro:check` - verify no TypeScript errors
- [ ] Check `dist-astro/` output - verify all expected files present
- [ ] Verify file count: ~217 HTML files + assets
- [ ] Check `dist-astro/feed.xml` - verify valid RSS
- [ ] Check `dist-astro/press/feed/index.xml` - verify valid RSS
- [ ] Check `dist-astro/sitemap-index.xml` - verify valid XML

### Content Verification
- [ ] Run `npx tsx script/parity-check.ts` - verify 100% parity
- [ ] Spot check 5-10 random blog post URLs
- [ ] Verify homepage renders correctly
- [ ] Verify /about/, /contact/, /resume/, /talks/, /press/ pages
- [ ] Check /404/ page

### Testing
- [ ] Run E2E tests: `npm run test:e2e:astro` (if available)
- [ ] Run Lighthouse audit on preview site
- [ ] Test mobile responsive design
- [ ] Test in Chrome, Firefox, Safari
- [ ] Verify forms work (contact form, etc.)
- [ ] Test all internal links
- [ ] Verify syntax highlighting in code blocks

### Backup
- [ ] Backup current live site files
- [ ] Document current Jekyll build command
- [ ] Save current GitHub Pages configuration
- [ ] Tag current main branch: `git tag pre-astro-cutover`
- [ ] Push tags: `git push --tags`

---

## Cutover Day - Go Live

### Time Estimate: 15-30 minutes downtime

### Step 1: Final Build (5 min)
```bash
# Clean previous builds
rm -rf dist-astro/

# Final production build
npm run astro:build

# Verify build success
echo "Build completed with exit code: $?"

# Quick verification
ls -la dist-astro/ | head -20
```

- [ ] Build completed successfully
- [ ] Output directory `dist-astro/` exists
- [ ] Expected file count (~217 HTML pages)

### Step 2: GitHub Pages Configuration (5 min)

#### Option A: GitHub Pages Settings (Recommended for GitHub Pages)
1. [ ] Go to repository Settings → Pages
2. [ ] Under "Build and deployment"
3. [ ] Source: Deploy from a branch
4. [ ] Branch: `main` / Folder: `/dist-astro`
5. [ ] Click "Save"
6. [ ] Wait for deployment (check Actions tab)

#### Option B: Custom GitHub Actions Workflow
If using custom workflow, update `.github/workflows/pages.yml`:

```yaml
# Replace Jekyll build steps with:
- name: Build Astro site
  run: npm run astro:build

- name: Upload artifact
  uses: actions/upload-pages-artifact@v2
  with:
    path: './dist-astro'
```

- [ ] Workflow file updated
- [ ] Changes committed and pushed
- [ ] Workflow triggered
- [ ] Deployment successful

### Step 3: Verify Deployment (5-10 min)

**Critical URLs to Test:**
```
https://ben.balter.com/                    # Homepage
https://ben.balter.com/about/              # About page
https://ben.balter.com/contact/            # Contact page  
https://ben.balter.com/resume/             # Resume page
https://ben.balter.com/press/              # Press page
https://ben.balter.com/feed.xml            # Main RSS feed
https://ben.balter.com/press/feed/         # Press RSS feed
https://ben.balter.com/sitemap-index.xml   # Sitemap
https://ben.balter.com/2025/01/30/how-to-run-language-tool-open-source-grammarly-alternative-on-macos/  # Latest post
https://ben.balter.com/2010/09/12/wordpress-resume-plugin/  # Oldest post
https://ben.balter.com/404                 # 404 page
```

**Verification Checklist:**
- [ ] Homepage loads correctly
- [ ] Navigation menu works
- [ ] All page links work
- [ ] At least 5 blog post URLs load correctly
- [ ] RSS feeds are valid XML (use feed validator)
- [ ] Sitemap is valid XML
- [ ] Images load correctly
- [ ] CSS styles applied
- [ ] No console errors (check browser DevTools)
- [ ] Mobile view works
- [ ] Dark mode toggle works (if applicable)

### Step 4: DNS and CDN (if applicable)
- [ ] Verify DNS pointing to correct location
- [ ] Clear CDN cache (if using Cloudflare, etc.)
- [ ] Wait for DNS propagation if changed

### Step 5: Third-Party Services (5 min)
- [ ] Google Search Console: Submit new sitemap
- [ ] Bing Webmaster Tools: Submit new sitemap
- [ ] RSS feed aggregators: Verify no errors (Feedly, etc.)
- [ ] Analytics: Verify tracking still works
- [ ] Social media: Test Open Graph tags (LinkedIn, Twitter preview)

---

## Post-Cutover Monitoring (First Hour)

### Immediate Checks (15 min after go-live)
- [ ] Check GitHub Pages deployment status
- [ ] Verify site is live and responding
- [ ] Check for 404 errors in browser network tab
- [ ] Review first round of analytics (if real-time)
- [ ] Check RSS feed readers for errors
- [ ] Monitor social media mentions/issues

### Extended Monitoring (1-6 hours)
- [ ] Monitor server logs for errors
- [ ] Check Google Search Console for crawl errors
- [ ] Review analytics for unusual traffic patterns
- [ ] Monitor email/GitHub issues for user reports
- [ ] Check RSS subscriber counts
- [ ] Test a few random historical URLs

---

## First 24 Hours

### Day 1 Checklist
- [ ] Morning check: Site still live and working
- [ ] Review overnight analytics
- [ ] Check Google Search Console for crawl stats
- [ ] Monitor 404 error reports
- [ ] Review any user-reported issues
- [ ] Check RSS feed subscriber counts
- [ ] Verify no broken internal links
- [ ] Evening check: All systems normal

### Known Issues Log
_Document any issues discovered post-launch:_

| Time | Issue | Severity | Fix Applied | Status |
|------|-------|----------|-------------|--------|
|      |       |          |             |        |

---

## Rollback Plan (If Needed)

### When to Rollback
- Multiple critical pages returning 404
- RSS feeds completely broken
- Site not loading at all
- Major layout/CSS issues affecting readability
- Widespread content rendering failures

### Rollback Steps (10-15 min)

1. **Revert GitHub Pages Configuration**
   ```bash
   # If using GitHub Pages settings
   # Go to Settings → Pages → Change folder to /_site
   
   # If using GitHub Actions
   git revert <commit-sha-of-astro-changes>
   git push origin main
   ```
   - [ ] Configuration reverted
   - [ ] Jekyll site deployed

2. **Verify Jekyll Site Live**
   - [ ] Homepage loads
   - [ ] RSS feeds work
   - [ ] Sample posts load
   - [ ] No console errors

3. **Communicate**
   - [ ] Post issue to GitHub (if public)
   - [ ] Notify stakeholders
   - [ ] Document what went wrong

4. **Investigate and Fix**
   - [ ] Review deployment logs
   - [ ] Identify root cause
   - [ ] Fix in development
   - [ ] Re-test thoroughly
   - [ ] Schedule new cutover date

---

## First Week Monitoring

### Daily Checks
- [ ] **Day 2**: Site status, analytics review, search console check
- [ ] **Day 3**: RSS feed validation, 404 monitoring, user feedback review
- [ ] **Day 4**: Performance check, search rankings spot check
- [ ] **Day 5**: Complete analytics review, identify any anomalies
- [ ] **Day 6**: Search engine indexing check, social media preview tests
- [ ] **Day 7**: Week-in-review report, address any outstanding issues

### Weekly Report Template
```markdown
## Week 1 Post-Cutover Report

**Date**: [Date]
**Status**: [Green/Yellow/Red]

### Metrics
- Uptime: [X]%
- Page Views: [X] (vs [Y] previous week)
- 404 Errors: [X]
- Average Page Load: [X]s
- Search Impressions: [X] (Google Search Console)

### Issues Encountered
1. [Issue description] - [Resolution]
2. ...

### Action Items
- [ ] [Action 1]
- [ ] [Action 2]

### Overall Assessment
[Summary paragraph]
```

---

## Success Criteria (Final Sign-Off)

After 1 week, migration is considered successful if:

- [ ] **Uptime**: > 99.5% (allowing for brief cutover window)
- [ ] **404 Rate**: < 1% of requests
- [ ] **Page Load Time**: Similar or better than Jekyll
- [ ] **RSS Feed**: No reported issues from subscribers
- [ ] **Search Traffic**: No significant drop (> 10% decline)
- [ ] **User Reports**: No critical bugs reported
- [ ] **Analytics**: Normal traffic patterns
- [ ] **Search Console**: No major crawl errors

### Final Sign-Off
- [ ] All success criteria met
- [ ] No rollback required
- [ ] Jekyll configuration can be archived
- [ ] Migration declared complete

**Signed off by**: _______________  
**Date**: _______________

---

## Cleanup (After Successful Week)

Once migration is stable:

- [ ] Archive Jekyll configuration files
  - [ ] Move `_config.yml` to `archive/_config.yml.jekyll`
  - [ ] Move `Gemfile` to `archive/Gemfile.jekyll`
  - [ ] Document Jekyll dependencies for reference
- [ ] Update README.md
  - [ ] Remove Jekyll instructions
  - [ ] Make Astro the primary documentation
  - [ ] Add "Migration completed" note with date
- [ ] Update CONTRIBUTING.md
  - [ ] Update build instructions for Astro
  - [ ] Update development setup
- [ ] Clean up GitHub Actions workflows
  - [ ] Remove Jekyll CI jobs
  - [ ] Keep Astro CI jobs only
- [ ] Update issue/PR templates if they reference Jekyll
- [ ] Celebrate! 🎉

---

## Contact Information

**Technical Lead**: [Name]  
**Emergency Contact**: [Email/Phone]  
**Rollback Authority**: [Name]  

---

## Notes Section

_Use this space for any additional notes during cutover:_

```
[Date/Time] - [Note]
```

---

**Document Version**: 1.0  
**Last Updated**: December 9, 2024  
**Next Review**: [Cutover date]
