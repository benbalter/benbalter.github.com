import { defineWranglerConfig } from "wrangler/experimental-config";

// Build-tool settings for the Wrangler delegate that `cf` uses. Deploy config
// (bindings, routing, observability) lives in cloudflare.config.ts.
export default defineWranglerConfig({
	types: {
		generate: false,
	},
	assetsDirectory: "./dist-astro",
});
