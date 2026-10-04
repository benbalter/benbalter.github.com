# Cloudflare Workers Deployment

This document explains how the site is deployed to Cloudflare Workers using Workers Static Assets.

## Overview

The site is deployed directly to Cloudflare Workers via Wrangler. Cloudflare Workers Static Assets automatically handles serving static files, so no manual cache purging is needed.

## How It Works

1. **Build**: GitHub Actions builds the Astro site, outputting static files to `dist-astro/`
2. **Deploy**: The `cloudflare/wrangler-action` runs `npx wrangler deploy` to upload the build output to Cloudflare Workers
3. **Cache**: Cloudflare Workers automatically invalidates its cache on each new deployment. Astro also generates content-hashed filenames for JS/CSS assets (e.g., `global.E-nqILv5.css`), providing additional cache busting.

## Configuration

### Required Secrets

The deployment workflow requires two GitHub repository secrets:

1. **`CLOUDFLARE_ACCOUNT_ID`**: Your Cloudflare account ID
   - Find this in Cloudflare Dashboard → any domain → Overview (right sidebar)

2. **`CLOUDFLARE_API_TOKEN`**: An API token with Cloudflare Workers permissions
   - Create at: Cloudflare Dashboard → My Profile → API Tokens → Create Token
   - Use the "Edit Cloudflare Workers" template, or create a custom token with:
     - **Account → Cloudflare Workers Scripts → Edit**
   - Recommended: Scope to your account

### Setting Up Secrets

1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add both secrets:
   - Name: `CLOUDFLARE_ACCOUNT_ID`, Value: `your-account-id`
   - Name: `CLOUDFLARE_API_TOKEN`, Value: `your-api-token`

### Project Configuration

The Cloudflare Workers project is configured in `wrangler.json`:

```json
{
  "name": "benbalter-github-com",
  "assets": {
    "directory": "./dist-astro",
    "not_found_handling": "404-page"
  },
  "compatibility_date": "2025-03-19"
}
```

### Custom Domain

Configure your custom domain in Cloudflare Dashboard → Workers & Pages → your worker → Settings → Domains & Routes. The `CNAME` file in the repository root is no longer used for deployment.

## Headers and Redirects

Cloudflare Workers Static Assets uses files in the `public/` directory:

- **`public/_headers`**: Security headers, caching rules, and CSP
- **`public/_redirects`**: URL redirects (301s for old slugs, feed URLs, etc.)

These are automatically picked up by Cloudflare Workers Static Assets during deployment.

### Which requests run the Worker

- **`assets.run_worker_first`** in `wrangler.json` sends page URLs (paths ending in `/`) and `POST /api/event` through [`worker/index.js`](../worker/index.js), which handles Markdown content negotiation, `Vary: Accept`, and engagement events. Static files are excluded with negative patterns (`!/assets/*`, `!/.well-known/*`, `!/*.xml`, `!/*.txt`, `!/*.md`, images, and so on) and served straight from the asset layer, where `_headers` and `_redirects` still apply; any path the list doesn't cover still runs the Worker. The Worker would only pass those files through anyway, and every invocation counts against the account's Workers Free daily request cap (past the cap, [requests matching `run_worker_first` get a 429](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/) while excluded ones keep serving), so feed readers, crawlers, and favicon fetches shouldn't spend it. In these patterns `*` matches across `/`, so `!/*.xml` covers `.xml` files at any depth. [`worker/routing.test.js`](../worker/routing.test.js) fails if an exclusion would ever match a page URL or `/api/event`.

## Security Best Practices

1. **Minimal Permissions**: API token should only have Cloudflare Workers edit permission
2. **Account Scoping**: Restrict token to your specific account
3. **Secret Rotation**: Rotate API tokens periodically
4. **Don't Commit**: Never commit secrets to the repository

## References

- [Cloudflare Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
