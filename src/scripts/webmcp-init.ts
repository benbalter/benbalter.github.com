/**
 * Register the site's WebMCP tools, but only in browsers that support WebMCP.
 *
 * This is the only part that ships on every page: a feature check. The tools
 * (and Pagefind, which they load on first search) are a separate chunk that
 * only browsers exposing `modelContext` ever download. See webmcp.ts.
 */

import type { ModelContext } from './webmcp';

/** `document.modelContext` per the current spec; older Chrome builds put it on `navigator`. */
export function getModelContext(): ModelContext | undefined {
  return (
    (document as Document & { modelContext?: ModelContext }).modelContext ??
    (navigator as Navigator & { modelContext?: ModelContext }).modelContext
  );
}

const context = getModelContext();
if (context) {
  import('./webmcp')
    .then(({ registerWebMcpTools }) => registerWebMcpTools(context))
    .catch((e) => console.warn('WebMCP: tools failed to load:', e));
}
