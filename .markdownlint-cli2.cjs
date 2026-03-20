const options = require('@github/markdownlint-github').init({ 'line-length': false, 'first-line-heading': false, 'ul-style': { 'style': 'dash' }, 'heading-increment': false, 'table-column-style': false, 'fenced-code-language': false, 'no-emphasis-as-heading': false, 'no-duplicate-heading': { 'siblings_only': true } })
module.exports = {
  config: options,
  customRules: ["@github/markdownlint-github"],
  outputFormatters: [
    ["markdownlint-cli2-formatter-pretty", { "appendLink": true }] // ensures the error message includes a link to the rule documentation
  ]
}