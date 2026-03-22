# Cloudflare Pages Deployment

This document explains how the site is deployed to Cloudflare Pages.

## Overview

The site is deployed directly to Cloudflare Pages via Wrangler. Cloudflare Pages automatically handles cache invalidation on each deployment, so no manual cache purging is needed.

## How It Works

1. **Build**: GitHub Actions builds the Astro site, outputting static files to `dist-astro/`
2. **Deploy**: The `cloudflare/wrangler-action` uploads the build output to Cloudflare Pages
3. **Cache**: Cloudflare Pages automatically invalidates its cache on each new deployment. Astro also generates content-hashed filenames for JS/CSS assets (e.g., `global.E-nqILv5.css`), providing additional cache busting.

## Configuration

### Required Secrets

The deployment workflow requires two GitHub repository secrets:

1. **`CLOUDFLARE_ACCOUNT_ID`**: Your Cloudflare account ID
   - Find this in Cloudflare Dashboard → any domain → Overview (right sidebar)

2. **`CLOUDFLARE_API_TOKEN`**: An API token with Cloudflare Pages permissions
   - Create at: Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - Use the "Edit Cloudflare Workers" template, or create a custom token with:
     - **Account → Cloudflare Pages → Edit**
   - Recommended: Scope to your account

### Setting Up Secrets

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add both secrets:
   - Name: `CLOUDFLARE_ACCOUNT_ID`, Value: `your-account-id`
   - Name: `CLOUDFLARE_API_TOKEN`, Value: `your-api-token`

### Project Configuration

The Cloudflare Pages project is configured in `wrangler.json`:

```json
{
  "name": "benbalter-com",
  "pages_build_output_dir": "dist-astro",
  "compatibility_date": "2025-03-19"
}
```

### Custom Domain

Configure your custom domain in Cloudflare Dashboard → Pages → your project → Custom domains. The `CNAME` file in the repository root is no longer used for deployment.

## Headers and Redirects

Cloudflare Pages uses files in the `public/` directory:

- **`public/_headers`**: Security headers, caching rules, and CSP
- **`public/_redirects`**: URL redirects (301s for old slugs, feed URLs, etc.)

These are automatically picked up by Cloudflare Pages during deployment.

## Security Best Practices

1. **Minimal Permissions**: API token should only have Cloudflare Pages edit permission
2. **Account Scoping**: Restrict token to your specific account
3. **Secret Rotation**: Rotate API tokens periodically
4. **Don't Commit**: Never commit secrets to the repository

## References

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
