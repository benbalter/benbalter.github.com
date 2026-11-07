---
title: AI made open source fun again
description: "My 15-year-old WordPress plugin passed 200,000 downloads. I made 11 commits in 2023–24. This year, AI agents made 478. AI made open source fun again."
tldr: "WP Document Revisions passed 200,000 downloads in its busiest year ever: more commits and releases than any year since I started it in 2011. AI coding agents took the toil out of maintaining it, the ramp-up and the chores, and left the parts of open source I liked. Point them at the work you've been skipping, and keep the decisions for yourself."
---

Here's the commit history for [WP Document Revisions](https://github.com/wp-document-revisions/wp-document-revisions), the WordPress plugin I started in 2011. In 2023, I made seven commits to it. In 2024, four. This year, the plugin had its busiest year ever, 756 commits, and AI agents working for me made 478 of them. I didn't type that code, but I read every diff.

![Stacked bar chart of commits per year to WP Document Revisions, 2011 to 2026. My handwritten commits spike in 2011 to 2012, 2017, and 2021, then nearly vanish in 2023 and 2024 while Neil James carries the plugin, and stop entirely after that. From 2025, AI agents take over: 121 commits in 2025 and 478 in 2026. 2026 is the tallest bar by far, with 756 commits: 478 from AI agents, 138 from Neil, and 140 from everyone else, including dependency bots. The previous high was 467 in 2021.](/assets/img/wp-document-revisions-commits-by-year-1600x900.svg "Commits per year, by who made them. Every commit from my account since May 2025 counts as AI. Merges excluded; 2026 is through November 7.")

The plugin also just passed 200,000 downloads (TK: confirm the count on the [plugin stats page](https://wordpress.org/plugins/wp-document-revisions/advanced/) before merging; it was 199,598 on November 7) on [WordPress.org](https://wordpress.org/plugins/wp-document-revisions/), which feels like a good excuse to look at what changed. I didn't find more free time, and nobody started paying me. :quote[AI coding agents took the toil out of maintaining an open source project and left the parts I liked. They made open source fun again.]{#open-source-fun-again}

## Side projects starve before they die

In 2011, I was a law and business student trying to set up [SharePoint](https://en.wikipedia.org/wiki/SharePoint) for my law journal's publishing workflow, and [losing](/2011/04/04/when-all-you-have-is-a-pair-of-bolt-cutters/). WordPress already had revisions, permissions, and permalinks. All it was missing was documents, so I pitched bolting them on as a [Google Summer of Code project](https://gsoc2011.wordpress.com/document-revisions/), and WordPress [picked it](https://make.wordpress.org/core/2011/04/25/2011-gsoc-students-announced/). My entire public reaction was "[W00t I can haz Google Summer of Code](https://ben.balter.com/tweets/status/62596492455723008/)."

I spent that summer writing PHP with three WordPress developers looking over my shoulder,[^mentors] and [WP Document Revisions launched that August](/2011/08/29/wp-document-revisions-document-management-version-control-wordpress/). Then it did something side projects rarely do: it worked. Sites installed it and kept running it, and nothing broke badly enough to drag me back. Every few years, something would pull me in for a burst of work, and then I'd drift off again.

The closest it came to forcing my hand was an email in April 2019 from a student editor at my old law journal. Someone had tampered with the journal's workspace, members couldn't log in, and nobody on the board knew how to fix it. Eight years after I'd built it, the journal was still running its publishing workflow on it, and I was still the person they emailed.[^maintainability]

While I was drifting, someone else showed up. In October 2017, a stranger named [Neil James](https://github.com/NeilWJames) [filed a bug](https://github.com/wp-document-revisions/wp-document-revisions/issues/98) about the plugin's sidebar widget. Four years later, he was [shipping whole releases](https://github.com/wp-document-revisions/wp-document-revisions/pull/265). By the time I'd stopped paying attention, he'd made more than 950 commits, and from 2019 through 2024, he's most of the chart above.[^wpml]

TK: confirm how Neil wants to be credited (his GitHub profile has no display name) and how you'd describe his role. If you've used the plugin in the last few years, thank him.

He kept it alive, but one volunteer can only do so much. By 2023, I was down to seven commits a year, and between June 2024 and August 2025, the plugin went 14 months without a release.

Most abandoned open source looks like this. Nobody decides to walk away. The maintainer's attention goes somewhere else, the issue queue gets a little longer every month, and eventually the cost of catching up looks bigger than the cost of ignoring it.

## A government department was waiting on me

What brought me back was a number. WordPress.org says the plugin runs on [more than 2,000 sites](https://wordpress.org/plugins/wp-document-revisions/). One of them is the UK Ministry of Justice, whose [intranet](https://github.com/ministryofjustice/intranet) and [WordPress hosting platform](https://github.com/ministryofjustice/hale-platform) both build on it.

The plugin shipped two releases in 2024, and both went out the same day [Davey](https://github.com/EarthlingDavey), a developer on the Ministry's intranet, opened an issue [asking for one](https://github.com/wp-document-revisions/wp-document-revisions/issues/344), [politely, twice](https://github.com/wp-document-revisions/wp-document-revisions/issues/349). All four of my commits that year were on the second of those days. A plugin I wrote as a law student was holding up a government department's documents, and its maintainer needed reminders to ship.

## It took five tries to escape CoffeeScript

What pulled me back in was CoffeeScript. In 2013, I [moved the plugin's JavaScript to CoffeeScript](https://github.com/wp-document-revisions/wp-document-revisions/commit/d94eb54a), a language that compiles to JavaScript and was briefly the cool way to write it.[^coffeescript] A decade later, I wanted out, so I [opened an issue](https://github.com/wp-document-revisions/wp-document-revisions/issues/327) to convert it back to modern JavaScript. Then nothing happened for a year and a half.

It took five tries. Copilot's coding agent [took](https://github.com/wp-document-revisions/wp-document-revisions/pull/362) [three](https://github.com/wp-document-revisions/wp-document-revisions/pull/407) [swings](https://github.com/wp-document-revisions/wp-document-revisions/pull/438) at it in 2025, and I drove [a fourth](https://github.com/wp-document-revisions/wp-document-revisions/pull/387) from my own account (a 21,000-line diff).

None of them merged, and for good reason. Each was a big change I had low confidence in, on code more than 2,000 sites run. The first added a "modern" copy of the code next to the old one instead of replacing it. The second, which I drove myself, ballooned into 96 files, from the development container to the deploy workflow.

The third passed CI, but when I asked how I could be confident nothing would break, the agent answered with reassurance instead of evidence. The fourth converted one file and declared the rest already modern. They weren't.

That third question turned out to be the useful part. The answer to it was a [JavaScript test suite](https://github.com/wp-document-revisions/wp-document-revisions/pull/410) the plugin had never had. In April 2026, the [fifth attempt](https://github.com/wp-document-revisions/wp-document-revisions/pull/464) deleted the last `.coffee` file with every test passing.[^tests]

What changed by the fifth try? The models got better, and the agent had more ways to check its own work. That same evening, it [added end-to-end tests](https://github.com/wp-document-revisions/wp-document-revisions/commit/a2a019a1) that drive a real WordPress install in a browser, and they [promptly caught breakage](https://github.com/wp-document-revisions/wp-document-revisions/commit/97145e35) in the modernized blocks that the unit tests had missed.

## Agents took the toil out of maintenance

The expensive part of maintaining an old project is the context switch, not the typing: remembering how the upload path works, rebuilding the test environment, reading a three-year-old issue to figure out what the reporter meant. On a side project you touch twice a year, that ramp-up eats the whole evening before you change a line. It's also the least fun part of open source.

Agents handle most of that ramp-up. I can point one at an issue and come back to a pull request with a diagnosis, a fix, and a failing test that now passes. My job becomes reading it and deciding whether it's right. That's a short task, as long as the pull request is small and the tests are real. Of the 180 pull requests I merged on the plugin this year, half merged within 10 minutes of being opened. Those were small: a median of about 60 changed lines, and none could merge until the unit tests, the end-to-end tests, and WordPress's own plugin checks passed.[^checks]

Here's what that looks like in practice.[^setup] On the morning of September 28, Davey filed two bug reports from the Ministry of Justice: a [slow Media Library](https://github.com/wp-document-revisions/wp-document-revisions/issues/725) and a [missing revision log](https://github.com/wp-document-revisions/wp-document-revisions/issues/726) on older documents. Both fixes merged that night, and they shipped in a release the next day.

Over a year, that adds up: 180 merged pull requests from me and my agents, plus 117 dependency updates from [Dependabot](https://docs.github.com/en/code-security/dependabot) and [Renovate](https://docs.renovatebot.com/), and 33 releases between v4.0.0 in April and v5.8.3 on November 7. Twenty-three of those releases were small patch releases. The previous record for releases in a year was 11, set the year the plugin launched.

I should be upfront about the cost, too. Until May 2026, a lot of this happened on my employer's dime, while I worked at GitHub. Since then, it's been on my own time.

![Bar chart of releases per year of WP Document Revisions, 2011 to 2026. 11 in 2011 and 9 in 2012, then between zero and five a year from 2013 through 2025. 2026 has 33.](/assets/img/wp-document-revisions-releases-by-year-1600x900.svg "Releases per year, counted from release tags. 2026 is through November 7.")

## Agents are best at the chores maintainers skip

The most valuable work wasn't the big features, though there were some: opt-in block editor support, a [Live Preview](https://wordpress.org/plugins/wp-document-revisions/) that lets you try the plugin in your browser without installing it, and support for AI agents to look up documents through the WordPress Abilities API.[^abilities] The real change was all the work that a solo maintainer rationally skips. TK: confirm which of these were agent-driven; all four PRs came from your account, so the repository can't tell.

- **Changelogs a human can read.** The [5.8.3 changelog](https://github.com/wp-document-revisions/wp-document-revisions/releases) explains what broke, who saw it, and what to do about it, instead of "misc fixes."
- **Translations.** The plugin moved its bundled translations to WordPress.org language packs, so translators get their work in front of users without waiting on me to cut a release.
- **The weird edge cases.** One recent fix covers the case where a PHP upgrade changes which account PHP runs as, so the server can't read a document's file anymore. Before, people got a blank error page. Now they get a message that says what's wrong.
- **Problems that only show up at scale.** Davey's [Media Library report](https://github.com/wp-document-revisions/wp-document-revisions/issues/725) came with his site's numbers (about 27,000 documents among 120,000 attachments, and 3–4 seconds to load each page) and a diagnosis of the query. After the fix shipped, he and Neil spent two weeks benchmarking query variants against his database.
- **Security advisories.** The plugin published [11 security advisories](https://github.com/wp-document-revisions/wp-document-revisions/security/advisories) this year, each explaining in plain language who was affected and what to do. Seven covered code that predates the agents, some of it by years. Four covered code the agents wrote this year, including private documents uploaded through the new block editor panel landing in an unprotected folder. That's the cost of moving this fast.

None of that is glamorous, and none of it would have happened if each item cost me an evening. Once each one took a short review instead, they all fit.

## Review is still the job

:::objection[Isn't this the same AI slop other maintainers are drowning in?]
The difference is who's driving. The slop that buries maintainers is the drive-by: a stranger points an agent at someone else's project, opens a pull request they haven't read, and leaves the maintainer to review it. Here, I'm the maintainer. I asked for the change, I know the code, and I own whatever merges. The agent works for the person accountable for the project, not around them.

That's also why review still matters. Agents are logical to a fault, but they lack taste and product judgment. :quote[AI can generate the right solution to the wrong problem.]{#right-solution-wrong-problem}

The agents write a draft. The plugin's existing tests, CI, and code review decide whether it ships, the same way they would for a human contributor I'd never met. [Pull requests are the right interface for agents](/2026/03/18/agentic-workflows/) for exactly this reason. A 756-commit year is only possible because there's a decade of process underneath it. That process is the part I'd keep if the agents disappeared tomorrow.
:::

The CoffeeScript migration is the receipt: four attempts I closed without merging, because I didn't trust them on code more than 2,000 sites run.

Review doesn't catch everything, either. In 2025, someone reported a bug in [jekyll-optional-front-matter](https://github.com/benbalter/jekyll-optional-front-matter), another plugin of mine, and [traced it](https://github.com/benbalter/jekyll-optional-front-matter/issues/42) to the order Jekyll sorts pages in. Copilot's [fix](https://github.com/benbalter/jekyll-optional-front-matter/pull/43) ignored that diagnosis and patched the symptom, and I merged it.

Two days later, the reporter found it had emptied their site's search index and navigation. Their own [smaller fix](https://github.com/benbalter/jekyll-optional-front-matter/pull/44), which re-sorted the pages, replaced it a month later. The person who'd read the code closely got it right, and the agent didn't, and my quick review let it through. TK: what you changed after this, if anything (for example, the end-to-end tests that now gate every merge on WP Document Revisions).

## What's left is the fun part

Agents made the work cheap, but someone still has to decide what the plugin is for, which feature requests to turn down, when a fix is risky enough to hold for a minor release, and what to tell users when something went wrong. That's the maintainer's job, and it turns out to be the fun part.

Most of the toil is gone. [Renovate](https://docs.renovatebot.com/) merges many dependency updates on its own now, and a trivial bug fix takes a few minutes of review instead of an evening. An idea can go from issue to release in hours instead of days, and I keep learning along the way.

And every pull request now arrives with its own tests, so I don't have to write them. Aaron Jorbin, one of my Summer of Code mentors, is the person who taught me what a unit test was, and I've loathed writing them ever since. (Sorry, Aaron.) Since May, it's been a hobby again, the way it was in 2011. Contributing to open source has always been a kind of volunteering. It's a lot easier to keep showing up when the shift is fun.

## It wasn't just one plugin

WP Document Revisions wasn't the only thing I'd let go quiet. I maintain seven Jekyll plugins, and [GitHub Pages](https://pages.github.com/) turns five of them on by default for every site it builds. Across all seven, I made five commits from 2022 through 2024. Three hadn't had a release since 2019. This year, they've had 274 commits and 29 releases.[^pages-versions]

Same story with [word2md](https://word2md.com), the Word-to-Markdown converter that started as [a little Heroku app](/2026/10/26/documentation-quality-is-ai-quality/) twelve years ago. I started rewriting it in JavaScript in 2024 so it could run entirely in your browser, and it's had 449 commits this year, compared with 52 that first year. Its mirror image, [md2word](https://md2word.app), didn't exist until March. It has 197 commits now.

## How to revive your own side project

If you've got a project in the same state mine was in, here's roughly what worked. TK: confirm each step matches what you did (the plugin repository has CI, `renovate.json`, and a `CLAUDE.md`, so steps 1–3 check out).

1. **Get CI green before anything else.** Agents need a test suite to check their work against. If yours is broken, the first pull request you ask for is the one that fixes it.
1. **Turn on automated dependency updates.** Dependabot or Renovate turns a year of drift into a stream of small pull requests you can merge between meetings.
1. **Write down how the project works.** A short `AGENTS.md` (or `CLAUDE.md`) with the build, test, and lint commands saves every future session from rediscovering them. [Good documentation makes AI tools better](/2026/10/26/documentation-quality-is-ai-quality/), and it helps the next human contributor too.
1. **Start with the issue queue.** Hand the agent your oldest open bugs, one at a time. Each fix is a small, reviewable pull request, and the queue shrinks visibly.
1. **Review everything, merge nothing blind.** Read the diff. Run it. :quote[If you wouldn't merge it from a stranger, don't merge it from an agent.]{#merge-from-a-stranger}
1. **Thank the people who kept it alive.** If someone held the project together while you were gone, say so publicly. Mine is Neil.

Open the oldest issue in your side project's queue tonight and ask an agent to take a pass at it. If the pull request it opens takes less time to review than the issue took to ignore, you've got your answer.

[^mentors]: [Mitcho Erlewine](https://mitcho.com/), Aaron Jorbin, and [Jon Cave](https://joncave.co.uk/). Andrew Nacin, then one of WordPress's lead developers, kept a close eye on it too.

[^maintainability]: A student journal replaces its whole board every year or two, so anything you build for one is really built for strangers who'll inherit it without you. The lesson I took is about product decisions. Assume whatever you ship will still be running in ten years, long after anyone remembers why it works the way it does. Ask what will break first, and who will support it when you're not around. Cut the features and settings that each need care and feeding forever. Make it obvious to the next person, who never saw the issue thread or the launch post, what the thing does and what to do when it stops doing it. Whoever inherits it won't know who to email. Or worse, they will.

[^wpml]: When a user [needed the plugin to work with WPML](https://github.com/wp-document-revisions/wp-document-revisions/issues/324), a closed-source translation plugin, Neil talked WPML into giving him a sandbox and spent six months building an integration. That's the kind of maintainer he is.

[^coffeescript]: [CoffeeScript](https://coffeescript.org/) added classes, arrow functions, and a cleaner syntax years before JavaScript had them. JavaScript added most of those features in 2015, which took away most of the reason to use it.

[^tests]: 181 unit tests, 113 of them written in that pull request.

[^setup]: Until May 2026, I worked at GitHub, and my agent was GitHub Copilot, both in VS Code and as its cloud coding agent, which has 108 commits of its own. That was a time when the company encouraged employees to get fluent with AI tools by using them as much as possible. When that job ended in May, I switched to [Claude Code](https://claude.com/claude-code). The workflow is the same either way: the agent opens a pull request, and I review it.

[^abilities]: The Abilities API is WordPress's way of describing what a plugin can do, so that AI agents and the command palette can call it. The plugin's abilities are read-only, and the [WordPress MCP Adapter](https://github.com/WordPress/mcp-adapter) exposes them over the Model Context Protocol, so an assistant can look up documents without being able to change them.

[^pages-versions]: GitHub Pages pins its own versions of these plugins and updates them on its own schedule, so most of those fixes reach sites that build with Jekyll directly, for example through GitHub Actions. Pages picked up a security fix for one of them [this month](https://github.com/github/pages-gem/pull/965).

[^checks]: The repository's branch rules require the unit tests, the end-to-end tests, the WordPress.org Plugin Check, and a few build checks to pass before anything merges, including Renovate's automatic merges.
