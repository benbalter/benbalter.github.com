
import { unified } from 'unified'
import dictionaryEn from 'dictionary-en'
import fs from 'fs'
import retextEnglish from 'retext-english'
import retextEquality from 'retext-equality'
import retextIndefiniteArticle from 'retext-indefinite-article'
import retextPassive from 'retext-passive'
import retextReadability from 'retext-readability'
import retextRepeatedWords from 'retext-repeated-words'
import retextSimplify from 'retext-simplify'
import retextIntensify from 'retext-intensify'
import retextProfanities from 'retext-profanities'
import retextSpell from 'retext-spell'
import retextRedundantAcronyms from 'retext-redundant-acronyms'
import retextSentenceSpacing from 'retext-sentence-spacing'
import retextStringify from 'retext-stringify'
import remarkTextr from 'remark-textr'

const personalDict = fs
  .readFileSync('dictionary.txt', 'utf8')
  .replace(/#.+/gm, '');

const retextSettings = {
  "plugins": [
    retextEnglish,
    retextEquality,
    retextIndefiniteArticle,
    retextPassive,
    retextReadability,
    retextRepeatedWords,
    retextSimplify,
    [retextSpell, {dictionary: dictionaryEn, personal: personalDict}],
  //  retextContractions,
    retextIntensify,
    retextProfanities,
    retextRedundantAcronyms,
    retextSentenceSpacing,
    retextStringify,
  ]
}

const textrSettings = {
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
};

const config = {
  "plugins": [
   "remark-gfm",
   "remark-preset-lint-recommended",
    "remark-preset-lint-consistent",
    "remark-preset-lint-markdown-style-guide",
    ["remark-lint-no-undefined-references", false], // FIX THIS
    ["remark-lint-maximum-line-length", false],
    ["remark-lint-unordered-list-marker-style", "*"],
    ["remark-lint-maximum-heading-length", false], 
    ["remark-frontmatter", 'yaml'],
    [remarkTextr, textrSettings],
    ["remark-retext", unified().use(retextSettings)], // TODO: Use Stringify to auto fix
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
    spacedTable: true
  },
}

export default config;