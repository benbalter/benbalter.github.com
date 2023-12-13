const options = require('@github/markdownlint-github').init({ 'line-length': false, 'first-line-heading': false })
module.exports = {
  config: options,
  customRules: ["@github/markdownlint-github"],
  outputFormatters: [
    ["markdownlint-cli2-formatter-pretty", { "appendLink": true }] // ensures the error message includes a link to the rule documentation
  ]
}