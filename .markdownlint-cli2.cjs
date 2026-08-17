// 'link-fragments' (MD051) is disabled: it validates `#fragment` links against
// headings/anchors it can see in the raw Markdown, but many of our anchors are
// generated at render by remark plugins (e.g. the quote directive emits
// id="quote-<id>"), which it can't see — so it false-positives on valid deep
// links. Fragment integrity is instead enforced authoritatively by lychee in
// .github/workflows/links.yml, which runs against the built HTML with
// --include-fragments, checking the anchors as they actually exist.
const options = require('@github/markdownlint-github').init({ 'line-length': false, 'first-line-heading': false, 'ul-style': { 'style': 'dash' }, 'heading-increment': false, 'table-column-style': false, 'fenced-code-language': false, 'no-emphasis-as-heading': false, 'no-duplicate-heading': { 'siblings_only': true }, 'link-fragments': false })
module.exports = {
  config: options,
  // Skip build output (dist-astro/) and local artifacts (analytics-report.md,
  // Foundry qa/ and drafts/). All are gitignored and absent in CI; this keeps
  // local lint runs clean too.
  ignores: ["dist-astro/**", "analytics-report.md", "qa/**", "drafts/**"],
  customRules: ["@github/markdownlint-github"],
  outputFormatters: [
    ["markdownlint-cli2-formatter-pretty", { "appendLink": true }] // ensures the error message includes a link to the rule documentation
  ]
}