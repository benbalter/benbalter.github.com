/**
 * LinkedIn profile bio content.
 *
 * Source of truth for the LinkedIn-format resume page
 * (src/pages/resume/linkedin.astro). Synthesized from the About page bio
 * (src/content/about-bio.ts) and resume content, tailored for LinkedIn's
 * Headline (220 char) and About (2,600 char) fields.
 */

export const linkedinHeadline =
  'Director of Hubber Enablement at GitHub | Engineering leadership, open source, and remote work | Former Presidential Innovation Fellow, attorney';

/**
 * About text as individual lines. Joined with `<br>` for display (respects
 * CSS `white-space: pre-wrap`); the copy button's `innerText` extraction
 * converts `<br>` to `\n`, giving a clean plain-text paste.
 *
 * Empty strings produce blank lines (paragraph breaks).
 */
export const linkedinAboutLines: readonly string[] = [
  "I help thousands of GitHubbers do their best remote work as Director of Hubber Enablement at GitHub.",
  '',
  "I write and speak about engineering leadership, open source, and showing your work. Across nearly a decade at GitHub, I've served as Chief of Staff for Security, Senior Product Manager for Trust and Safety, Staff Technical Program Manager for Enterprise and Compliance, Director of Engineering Operations and Culture, and the company's first Government Evangelist — leading outreach that drove adoption across nearly 2,000 government organizations in over 75 countries.",
  '',
  'Before GitHub, I served as a Presidential Innovation Fellow and a member of the White House\'s first agile development team, helping draft parts of President Obama\'s Digital Strategy and Open Data Policy. The US CTO once called me one of "the baddest of the badass innovators" — the single nicest thing anyone\'s ever put in print about me. I\'m also an attorney, a member of the DC Bar, and argued in the Public Contract Law Journal that federal IT procurement should look more like modern software development.',
  '',
  'What I care about:',
  '• Engineering leadership — how large organizations actually work, and why the obvious answers are usually wrong',
  '• Open source — sustaining communities, licensing, and making collaboration the default',
  '• Remote and async work — clear writing, strong defaults, and showing your work',
  '• Public-interest technology — using modern software practices to deliver better government services',
  '',
  'I hold a J.D. and M.B.A. from the George Washington University.',
  '',
  "When I'm not trying to change the world, I enjoy tackling otherwise-impossible challenges to sharing information using nothing more than duct tape, version control, and occasionally a pack of bubblegum.",
  '',
  'More at ben.balter.com.',
];

/** About content formatted as HTML (for `set:html`, with `<br>` line breaks). */
export const linkedinAboutHtml = linkedinAboutLines.join('<br>');

/** About content as plain text (for char-count assertions). */
export const linkedinAboutText = linkedinAboutLines.join('\n');
