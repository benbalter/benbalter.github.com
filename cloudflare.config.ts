import { bindings, defineConfig } from "cf/config";

export default defineConfig({
	worker: {
		name: "benbalter-github-com",
		compatibilityDate: "2026-04-21",
		entrypoint: "worker/index.js",
		workersDev: false,
		previewUrls: false,
		observability: {
			enabled: true,
			headSamplingRate: 0.1,
			logs: {
				enabled: true,
				headSamplingRate: 0.1,
				persist: true,
				invocationLogs: false,
			},
			traces: {
				enabled: false,
				persist: true,
				headSamplingRate: 1,
			},
			// Real-time issue detection: groups uncaught exceptions, 5xx responses,
			// and console.error() calls into Issues in the dashboard. It has to be
			// set here, because a dashboard-only toggle gets turned off by the next
			// deploy.
			// https://developers.cloudflare.com/workers/observability/issues/
			issues: {
				enabled: true,
			},
		},
		assets: {
			notFoundHandling: "404-page",
			// Run the Worker first for page + API requests (Markdown content
			// negotiation, /api/event). Static asset buckets are excluded via
			// negative rules so they're served directly by the asset layer: smaller
			// blast radius and no extra Worker hop for immutable assets.
			runWorkerFirst: [
				"/*",
				"!/assets/*",
				"!/pagefind/*",
				"!/og/*",
				"!/wp-content/*",
			],
		},
		env: {
			ENGAGEMENT: bindings.analyticsEngineDataset({
				name: "benbalter_engagement",
			}),
			ASSETS: bindings.assets(),
		},
	},
});
