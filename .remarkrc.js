import fs from 'node:fs';
import {unified} from 'unified';
import dictionaryEn from 'dictionary-en';
import retextEnglish from 'retext-english';
import retextEquality from 'retext-equality';
import retextIndefiniteArticle from 'retext-indefinite-article';
import _retextPassive from 'retext-passive';
import _retextReadability from 'retext-readability';
import retextRepeatedWords from 'retext-repeated-words';
import _retextSimplify from 'retext-simplify';
import _retextIntensify from 'retext-intensify';
import retextSpell from 'retext-spell';
import retextRedundantAcronyms from 'retext-redundant-acronyms';
import retextSentenceSpacing from 'retext-sentence-spacing';
import retextStringify from 'retext-stringify';
import remarkTextr from 'remark-textr';

const personalDict = fs
  .readFileSync('dictionary.txt', 'utf8')
  .replaceAll(/#.+/gm, '');

const retextSettings = {
  plugins: [
    retextEnglish,
    retextEquality,
    retextIndefiniteArticle,
    // Disabled noisy plugins that generate too many false positives:
    // - retextPassive: too many warnings about passive voice in technical writing
    // - retextReadability: too strict for blog post style
    // - retextSimplify: too many suggestions that don't improve clarity
    // - retextIntensify: generates warnings about hedge/weasel words that are often appropriate
    retextRepeatedWords,
    [retextSpell, {dictionary: dictionaryEn, personal: personalDict}],
    //  RetextContractions,
    retextRedundantAcronyms,
    retextSentenceSpacing,
    retextStringify,
  ],
};

const textrSettings = {
  options: {
    locale: 'en-us',
  },
  plugins: [
    'typographic-arrows',
    'typographic-copyright',
    'typographic-em-dashes',
    'typographic-en-dashes',
    'typographic-math-symbols',
    'typographic-registered-trademark',
    'typographic-single-spaces',
    'typographic-trademark',
  ],
};

const config = {
  plugins: [
    'remark-gfm',
    'remark-preset-lint-recommended',
    'remark-preset-lint-consistent',
    'remark-preset-lint-markdown-style-guide',
    ['remark-lint-no-undefined-references', false], // FIX THIS
    ['remark-lint-maximum-line-length', false],
    ['remark-lint-unordered-list-marker-style', '-'],
    ['remark-lint-maximum-heading-length', false],
    ['remark-frontmatter', 'yaml'],
    [remarkTextr, textrSettings],
    ['remark-retext', unified().use(retextSettings)], // TODO: Use Stringify to auto fix
  ],
  settings: {
    rule: '-',
    footnotes: true,
    gfm: true,
    fence: '`',
    ruleSpaces: false,
    ruleRepetition: 3,
    yaml: true,
    fences: true,
    spacedTable: true,
  },
};

export default config;
