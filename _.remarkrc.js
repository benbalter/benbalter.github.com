'use strict';

var fs = require('fs');
var path = require('path');
var unified = import('unified');
var english = import('retext-english');

// Dictonaries
var enUS = import('dictionary-en-us');

var personal = fs
  .readFileSync(path.join(__dirname, 'dictionary.txt'), 'utf8')
  .replace(/#.+/gm, '');

var retextSettings = {
  plugins: [
    [import('retext-contractions'), {straight: true}],
    [import('retext-quotes'), {preferred: 'straight'}],
    [import('retext-sentence-spacing'), {preferred: 1}],
    [import('retext-spell'), {dictionary: enUS, personal: personal}],
    import('retext-diacritics'),
    import('retext-emoji'),
    import('retext-english'),
    import('retext-indefinite-article'),
    import('retext-redundant-acronyms'),
    import('retext-repeated-words'),
    import('retext-syntax-mentions'),
    import('retext-syntax-urls')
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
  [import('remark-frontmatter'), 'yaml'],
  [import('remark-lint-blockquote-indentation'), {number: 2}],
  [import('remark-lint-first-heading-level'), false],
  [import('remark-lint-link-title-style'), false],
  [import('remark-lint-list-item-indent'), 'space'],
  [import('remark-lint-list-item-spacing'), false],
  [import('remark-lint-maximum-heading-length'), false],
  [import('remark-lint-maximum-line-length'), false],
  [import('remark-lint-no-shortcut-reference-image'), false],
  [import('remark-lint-no-shortcut-reference-link'), false],
  [import('remark-lint-ordered-list-marker-value'), false],
  [import('remark-lint-unordered-list-marker-style'), '*'],
  [import('remark-message-control'), {name: 'lint'}],
  [import('remark-validate-links'), false],
  import('remark-inline-links'),
  import('remark-lint-code'),
  import('remark-lint-match-punctuation'),
  import('remark-lint-mdash-style'),
  import('remark-lint-no-empty-sections'),
  import('remark-lint-write-good'),
  import('remark-preset-lint-consistent'),
  import('remark-preset-lint-markdown-style-guide'),
  import('remark-preset-lint-recommended'),
  import('remark-squeeze-paragraphs'),
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
  ]//,
//  [import('remark-retext'), unified().use(english).use(retextSettings)]
];
