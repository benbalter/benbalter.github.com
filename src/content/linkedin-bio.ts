/**
 * LinkedIn profile bio content.
 *
 * Source of truth for the LinkedIn-format resume page
 * (src/pages/resume/linkedin.astro). Synthesized from the About page bio
 * (src/content/about-bio.ts) and resume content, tailored for LinkedIn's
 * Headline (220 char) and About (2,600 char) fields.
 */

export const linkedinHeadline =
  'Product Leader | 10 years at GitHub: platform, trust & safety, developer experience | Author of Open & Async | Attorney, Presidential Innovation Fellow';

/**
 * About text as individual lines. Joined with `<br>` for display (respects
 * CSS `white-space: pre-wrap`); the copy button's `innerText` extraction
 * converts `<br>` to `\n`, giving a clean plain-text paste.
 *
 * Empty strings produce blank lines (paragraph breaks).
 */
export const linkedinAboutLines: readonly string[] = [
  "I build products and the organizations that ship them. Most recently I owned GitHub's internal employee platform, the knowledge base and tooling 4,000+ GitHubbers use to get work done: 96% durable content ownership, deploys cut from over an hour to under 10 minutes, and a WYSIWYG editor that moved non-technical teams off filing tickets and onto self-serve publishing. I led a team of six, merged 700+ pull requests with Copilot, and built agentic workflows and an MCP server along the way.",
  '',
  "Before that, as Senior Product Manager for Trust and Safety, I shipped 500+ features and policies to a developer platform with 50M+ users and 100M+ projects, spanning community health, account security, privacy, and compliance. Across ten years at GitHub I've also been Chief of Staff for Security, Staff Technical Program Manager for Enterprise and Compliance, Director of Engineering Operations and Culture, and the company's first Government Evangelist, leading outreach that drove adoption across nearly 2,000 government organizations in over 75 countries.",
  '',
  "I'm also the author of Open & Async, the collaborative software development playbook for remote and distributed teams, drawn from a decade of remote-first work at GitHub.",
  '',
  'Before GitHub, I served as a Presidential Innovation Fellow and a member of the White House\'s first agile development team, helping draft parts of President Obama\'s Digital Strategy and Open Data Policy. The US CTO once called me one of "the baddest of the badass innovators," the single nicest thing anyone\'s ever put in print about me. I\'m also an attorney, a member of the DC Bar, and argued in the Public Contract Law Journal that federal IT procurement should look more like modern software development.',
  '',
  'What I care about:',
  '• Product and platform: internal tools, developer experience, and the unglamorous surfaces people use every day',
  '• Trust and safety: community health, account security, and privacy at platform scale',
  '• Engineering leadership: how large organizations actually work, and why the obvious answers are usually wrong',
  '• Open source: sustaining communities, licensing, and making collaboration the default',
  '• Remote and async work: clear writing, strong defaults, and showing your work',
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
