'use strict';

var fs = require('fs');
var path = require('path');
var unified = require('unified');
var english = require('retext-english');

// Dictonaries
var enUS = require('dictionary-en-us');

var personal = fs
  .readFileSync(path.join(__dirname, 'dictionary.txt'), 'utf8')
  .replace(/#.+/gm, '');

var retextSettings = {
  plugins: [
    [require('retext-contractions'), {straight: true}],
    [require('retext-quotes'), {preferred: 'straight'}],
    [require('retext-sentence-spacing'), {preferred: 1}],
    [require('retext-spell'), {dictionary: enUS, personal: personal}],
    require('retext-diacritics'),
    require('retext-emoji'),
    require('retext-english'),
    require('retext-indefinite-article'),
    require('retext-redundant-acronyms'),
    require('retext-repeated-words'),
    require('retext-syntax-mentions'),
    require('retext-syntax-urls')
  ]
};

exports.settings = {
  bullet: '*',
  emphasis: '*',
  strong: '*',
  fence: '`',
  rule: '-',
  ruleSpaces: false,
  ruleRepetition: 3,
  gfm: true,
  yaml: true,
  footnotes: true,
  listItemIndent: '1',
  commonmark: false,
  pedantic: false,
  entities: false,
  fences: true,
  spacedTable: true
};

exports.plugins = [
  [require('remark-frontmatter'), 'yaml'],
  [require('remark-lint-blockquote-indentation'), {number: 2}],
  [require('remark-lint-first-heading-level'), false],
  [require('remark-lint-link-title-style'), false],
  [require('remark-lint-list-item-indent'), 'space'],
  [require('remark-lint-list-item-spacing'), false],
  [require('remark-lint-maximum-heading-length'), false],
  [require('remark-lint-maximum-line-length'), false],
  [require('remark-lint-no-shortcut-reference-image'), false],
  [require('remark-lint-no-shortcut-reference-link'), false],
  [require('remark-lint-ordered-list-marker-value'), false],
  [require('remark-lint-unordered-list-marker-style'), '*'],
  [require('remark-message-control'), {name: 'lint'}],
  [require('remark-validate-links'), false],
  require('remark-inline-links'),
  require('remark-lint-code'),
  require('remark-lint-match-punctuation'),
  require('remark-lint-mdash-style'),
  require('remark-lint-no-empty-sections'),
  require('remark-lint-write-good'),
  require('remark-preset-lint-consistent'),
  require('remark-preset-lint-markdown-style-guide'),
  require('remark-preset-lint-recommended'),
  require('remark-squeeze-paragraphs'),
  [
    'remark-textr',
    {
      options: {
        locale: 'en-us'
      },
      plugins: [
        'typographic-arrows',
        'typographic-copyright',
        'typographic-em-dashes',
        'typographic-en-dashes',
        'typographic-math-symbols',
        'typographic-registered-trademark',
        'typographic-single-spaces',
        'typographic-trademark'
      ]
    }
  ],
  [require('remark-retext'), unified().use(english).use(retextSettings)]
];
