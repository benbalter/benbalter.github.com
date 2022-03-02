import { unified } from 'unified'
import dictionaryEnUs from 'dictionary-en-us'
import fs from 'fs'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGFM from 'remark-gfm'
import remarkInlineLinks from 'remark-inline-links'
import remarkLintBlockquoteIndentation from 'remark-lint-blockquote-indentation'
import remarkLintCode from 'remark-lint-code'
import remarkLintFirstHeadingLevel from 'remark-lint-first-heading-level'
import remarkLintLinkTitleStyle from 'remark-lint-link-title-style'
import remarkLintListItemIndent from 'remark-lint-list-item-indent'
import remarkLintListItemSpacing from 'remark-lint-list-item-spacing'
import remarkLintMatchPunctuation from 'remark-lint-match-punctuation'
import remarkLintMaximumHeadingLength from 'remark-lint-maximum-heading-length'
import remarkLintMaximumLineLength from 'remark-lint-maximum-line-length'
import remarkLintMdashStyle from 'remark-lint-mdash-style'
import remarkLintNoEmptySections from 'remark-lint-no-empty-sections'
import remarkLintNoShortcutReferenceImage from 'remark-lint-no-shortcut-reference-image'
import remarkLintNoShortcutReferenceLink from 'remark-lint-no-shortcut-reference-link'
import remarkLintOrderedListMarkerValue from 'remark-lint-ordered-list-marker-value'
import remarkLintUnorderedListMarkerStyle from 'remark-lint-unordered-list-marker-style'
import remarkLintWriteGood from 'remark-lint-write-good'
import remarkMessageControl from 'remark-message-control'
import remarkPresetLintConsistent from 'remark-preset-lint-consistent'
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'
import remarkPresetLintRecommended from 'remark-preset-lint-recommended'
import remarkRetext from 'remark-retext'
import remarkSqueezeParagraphs from 'remark-squeeze-paragraphs'
import remarkTextr from 'remark-textr'
import remarkValidateLinks from 'remark-validate-links'
import retextContractions from 'retext-contractions'
import retextDiacritics from 'retext-diacritics'
import retextEmoji from 'retext-emoji'
import retextEnglish from 'retext-english'
import retextEquality from 'retext-equality'
import retextIndefiniteArticle from 'retext-indefinite-article'
import retextquotes from 'retext-quotes'
import retextRedundantAcronyms from 'retext-redundant-acronyms'
import retextRepeatedWords from 'retext-repeated-words'
import retextSentenceSpacing from 'retext-sentence-spacing'
import retextSimplify from 'retext-simplify'
import retextSpell from 'retext-spell'
import retextSyntaxMentions from 'retext-syntax-mentions'
import retextSyntaxURLs from 'retext-syntax-urls'
import remarkPrettier from 'remark-prettier'

var personal = fs
  .readFileSync('dictionary.txt', 'utf8')
  .replace(/#.+/gm, '');

const retextSettings = {
  plugins: [
    [retextContractions, {straight: true}],
    [retextquotes, {preferred: 'straight'}],
    [retextSentenceSpacing, {preferred: 1}],
    [retextSpell, {dictionary: dictionaryEnUs, personal: personal}],
    retextDiacritics,
    retextEmoji,
    retextEnglish,
    retextIndefiniteArticle,
    retextRedundantAcronyms,
    retextRepeatedWords,
    retextSyntaxMentions,
    retextSyntaxURLs,
    retextSimplify,
    retextEquality
  ]
};

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

const remarkConfig = {
  settings: {
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
  },
  plugins: [
    remarkGFM,
    remarkInlineLinks,
    //remarkPrettier,
    remarkLintCode,
    remarkLintMatchPunctuation,
    remarkLintMdashStyle,
    remarkLintNoEmptySections,
    //remarkLintWriteGood,
    remarkPresetLintConsistent,
    remarkPresetLintMarkdownStyleGuide,
    remarkPresetLintRecommended,
    remarkSqueezeParagraphs,
    [remarkFrontmatter, 'yaml'],
    [remarkLintBlockquoteIndentation, {number: 2}],
    [remarkLintFirstHeadingLevel, false],
    [remarkLintLinkTitleStyle, false],
    [remarkLintListItemIndent, 'space'],
    [remarkLintListItemSpacing, false],
    [remarkLintMaximumHeadingLength, false],
    [remarkLintMaximumLineLength, false],
    [remarkLintNoShortcutReferenceImage, false],
    [remarkLintNoShortcutReferenceLink, false],
    [remarkLintOrderedListMarkerValue, false],
    [remarkLintUnorderedListMarkerStyle, '*'],
    [remarkMessageControl, { name: 'lint'}], 
    [remarkValidateLinks, false],
    [remarkTextr, textrSettings],
    [remarkRetext, unified().use(retextEnglish).use(retextSettings)]
  ]
}

export default remarkConfig