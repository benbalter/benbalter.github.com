/**
 * LinkedIn profile bio content.
 *
 * Source of truth for the LinkedIn-format resume page
 * (src/pages/resume/linkedin.astro). Synthesized from the About page bio
 * (src/content/about-bio.ts) and resume content, tailored for LinkedIn's
 * Headline (220 char) and About (2,600 char) fields.
 */

export const linkedinHeadline =
  'Product Leader | Developer platforms and open source | 10 years at GitHub: trust & safety, platform security, developer tooling | Author of Open and Async | Attorney, Presidential Innovation Fellow';

/**
 * About text as individual lines. Joined with `<br>` for display (respects
 * CSS `white-space: pre-wrap`); the copy button's `innerText` extraction
 * converts `<br>` to `\n`, giving a clean plain-text paste.
 *
 * Empty strings produce blank lines (paragraph breaks).
 */
const linkedinAboutLines: readonly string[] = [
  "I build developer platforms and the organizations that ship them. Across ten years at GitHub, I shipped 500+ features and policies as Senior Product Manager for Trust and Safety on a developer platform with 50M+ users and 100M+ projects, including the github.com API endpoints behind them. Before that, I led a bottom-up rewrite of GitHub Pages (250,000+ pages a minute) and wrote Licensee, the open source library behind GitHub's license detection. My open source projects have hundreds of millions of downloads.",
  '',
  "Most recently I owned the internal platform 4,000+ GitHubbers use to get work done: 96% durable content ownership, deploys cut from over an hour to under 10 minutes, and self-serve publishing for non-technical teams. I led a team of six and merged 700+ pull requests with Copilot. I've also been Chief of Staff for Security, Director of Engineering Operations and Culture, and the company's first Government Evangelist, driving adoption across nearly 2,000 government organizations in 75+ countries.",
  '',
  "I'm also the author of Open and Async, the collaborative software development playbook for remote and distributed teams. It ships with a Model Context Protocol server, so agents can query its practices directly.",
  '',
  'Before GitHub, I served as a Presidential Innovation Fellow and a member of the White House\'s first agile development team, helping draft parts of President Obama\'s Digital Strategy and Open Data Policy. The US CTO once called me one of "the baddest of the badass innovators," the single nicest thing anyone\'s ever put in print about me. I\'m also an attorney, a member of the DC Bar, and argued in the Public Contract Law Journal that federal IT procurement should look more like modern software development.',
  '',
  'What I care about:',
  '• Developer platforms: APIs, open source libraries, and developer experience',
  '• Building for agents: MCP, Markdown, and making platforms legible to AI tools as well as people',
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

/**
 * LinkedIn profile settings that are NOT copy-paste fields.
 *
 * Everything above is text you paste into a field, so the page can show it and
 * you can see when it's stale. These are toggles, orderings, and links that live
 * in LinkedIn's settings UI with no text to copy, which means they decay
 * silently: nothing reminds you they exist or that they've drifted from the
 * resume. They're also the fields that decide what LinkedIn search surfaces.
 */
export interface LinkedinSetting {
  /** What to set. */
  label: string;
  /** Where it lives in LinkedIn's UI. */
  where: string;
  /** Why it matters, and anything easy to get wrong. */
  detail: string;
  /** Values worth copying, in the order they should be entered. */
  values?: readonly string[];
}

export const linkedinSettings: readonly LinkedinSetting[] = [
  {
    label: 'Top three skills',
    where: 'Profile → Skills → ⋯ → Reorder',
    detail:
      'LinkedIn shows the first three on your profile and weights them in recruiter search. Skills are a typeahead against LinkedIn\'s own taxonomy, so most of the resume phrasing below ("Chief-of-staff operating patterns", "Internal platforms and developer tooling") has no match. Pin these canonical equivalents first, then add the rest as close as the typeahead allows.',
    values: ['Product Management', 'Developer Experience', 'Application Programming Interfaces (API)'],
  },
  {
    label: 'Featured section',
    where: 'Profile → Add profile section → Recommended → Add featured',
    detail:
      'Where the portfolio goes. Nothing else on the profile links out, so without this the book and the writing are invisible to anyone who does not scroll the whole About.',
    values: [
      'https://open-and-async.com/',
      'https://ben.balter.com/resume/',
      'https://github.com/open-and-async/mcp',
      'https://github.blog/2023-10-04-how-to-communicate-like-a-github-engineer-our-principles-practices-and-tools/',
    ],
  },
  {
    label: 'Custom URL',
    where: 'Profile → Edit public profile & URL',
    detail: 'Already set. Verify it still resolves, since it is the address on the resume, the vCard, and every export.',
    values: ['https://www.linkedin.com/in/benbalter/'],
  },
];
