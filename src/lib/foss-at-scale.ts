/**
 * The "FOSS at scale" series note, shared by the <FossAtScale> component (web
 * pages) and stripMdxSyntax (feed, email, and `.md` outputs), so both say the
 * same thing.
 */
export const FOSS_AT_SCALE = {
  url: '/2021/06/15/managing-open-source-communities-at-scale/',
  linkText: 'a series',
  rest: 'on successfully managing open source communities at scale.',
} as const;

/** The series note as Markdown, for outputs that can't render the component. */
export function fossAtScaleMarkdown(nth = 'first'): string {
  return `This is the ${nth} post in [${FOSS_AT_SCALE.linkText}](${FOSS_AT_SCALE.url}) ${FOSS_AT_SCALE.rest}`;
}
