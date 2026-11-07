---
title: AI made open source fun again
description: "My 15-year-old WordPress plugin passed 200,000 downloads. I made 11 commits in 2023–24. This year, AI agents made 478. AI made open source fun again."
tldr: "WP Document Revisions passed 200,000 downloads in its busiest year ever: more commits and releases than any year since I started it in 2011. AI coding agents took the toil out of maintaining it, the ramp-up and the chores, and left the parts of open source I liked. Point them at the work you've been skipping, and keep the decisions for yourself."
---

Here's the commit history for [WP Document Revisions](https://github.com/wp-document-revisions/wp-document-revisions), the WordPress plugin I started in 2011. In 2023, I made seven commits to it. In 2024, four. This year, the plugin had its busiest year ever, 756 commits, and I didn't write a line of it by hand. AI agents working for me made 478 of them.

![Stacked bar chart of commits per year to WP Document Revisions, 2011 to 2026. My handwritten commits spike in 2011 to 2012, 2017, and 2021, then nearly vanish in 2023 and 2024 while Neil James carries the plugin, and stop entirely after that. From 2025, AI agents take over: 121 commits in 2025 and 478 in 2026. 2026 is the tallest bar by far, with 756 commits: 478 from AI agents, 138 from Neil, and 140 from everyone else, including dependency bots. The previous high was 467 in 2021.](/assets/img/wp-document-revisions-commits-by-year-1600x900.svg "Commits per year, by who made them. Every commit from my account since May 2025 counts as AI. Merges excluded; 2026 is through November 7.")

The plugin also just passed 200,000 downloads (TK: confirm the count on the [plugin stats page](https://wordpress.org/plugins/wp-document-revisions/advanced/) before merging; it was 199,598 on November 7) on [WordPress.org](https://wordpress.org/plugins/wp-document-revisions/), which feels like a good excuse to look at what changed. I didn't find more free time, and nobody started paying me. :quote[AI coding agents took the toil out of maintaining an open source project and left the parts I liked. They made open source fun again.]{#open-source-fun-again}

What brought me back was a number. WordPress.org says the plugin runs on [more than 2,000 sites](https://wordpress.org/plugins/wp-document-revisions/). One of them is the UK Ministry of Justice, whose [intranet](https://github.com/ministryofjustice/intranet) and [WordPress hosting platform](https://github.com/ministryofjustice/hale-platform) both build on it.

The plugin shipped two releases in 2024, and both went out the same day [Davey](https://github.com/EarthlingDavey), a developer on the Ministry's intranet, opened an issue [asking for one](https://github.com/wp-document-revisions/wp-document-revisions/issues/344), [politely, twice](https://github.com/wp-document-revisions/wp-document-revisions/issues/349). All four of my commits that year were on the second of those days. A plugin I wrote as a law student was holding up a government department's documents, and its maintainer needed reminders to ship.

What pulled me back in was CoffeeScript. In 2013, I [moved the plugin's JavaScript to CoffeeScript](https://github.com/wp-document-revisions/wp-document-revisions/commit/d94eb54a), a language that compiles to JavaScript and was briefly the cool way to write it.[^coffeescript] A decade later, I wanted out, so I [opened an issue](https://github.com/wp-document-revisions/wp-document-revisions/issues/327) to convert it back to modern JavaScript. Then nothing happened for a year and a half.

It took five tries. Copilot's coding agent [took](https://github.com/wp-document-revisions/wp-document-revisions/pull/362) [three](https://github.com/wp-document-revisions/wp-document-revisions/pull/407) [swings](https://github.com/wp-document-revisions/wp-document-revisions/pull/438) at it in 2025, and I drove [a fourth](https://github.com/wp-document-revisions/wp-document-revisions/pull/387) from my own account (a 21,000-line diff). None of them merged.

Along the way, I asked the agent how I could be confident nothing would break, and the answer was a [JavaScript test suite](https://github.com/wp-document-revisions/wp-document-revisions/pull/410) the plugin had never had. In April 2026, the [fifth attempt](https://github.com/wp-document-revisions/wp-document-revisions/pull/464) deleted the last `.coffee` file with 181 unit tests passing, 113 of them written in that pull request. What changed by the fifth try? The models got better, and the agent had more ways to check its own work. That same evening, it [added end-to-end tests](https://github.com/wp-document-revisions/wp-document-revisions/commit/a2a019a1) that drive a real WordPress install in a browser, and they [promptly caught breakage](https://github.com/wp-document-revisions/wp-document-revisions/commit/97145e35) in the modernized blocks that the unit tests had missed.

## Side projects starve before they die

I built WP Document Revisions because I was trying to set up [SharePoint](https://en.wikipedia.org/wiki/SharePoint) for my law journal's publishing workflow and [found it baffling](/2011/04/04/when-all-you-have-is-a-pair-of-bolt-cutters/). WordPress already had revisions, permissions, and permalinks, so I pitched bolting document management onto it as a [Google Summer of Code project](https://gsoc2011.wordpress.com/document-revisions/).

I was a law and business student at the time. WordPress [picked it as one of its 12 student projects that year](https://make.wordpress.org/core/2011/04/25/2011-gsoc-students-announced/), news I took [about as calmly as you'd expect](https://ben.balter.com/tweets/status/62596492455723008/). Three WordPress developers, Mitcho Erlewine, Aaron Jorbin, and Jon Cave, mentored me through the summer, and [WP Document Revisions launched that August](/2011/08/29/wp-document-revisions-document-management-version-control-wordpress/). In 2011 and 2012, I made 343 commits.

After that, I came back in bursts, in 2017 and again in 2021, and drifted off in between. Life happened, and the plugin never broke badly enough to force my hand. The closest it came was an email in April 2019 from a student editor at my old law journal. Someone had tampered with the journal's workspace, members couldn't log in, and nobody on the board knew how to fix it. Eight years after I'd built it, the journal was still running its publishing workflow on it, and I was still the person they emailed. By 2023, I was down to seven commits a year, and between June 2024 and August 2025, the plugin went 14 months without a release.

It survived because of [Neil James](https://github.com/NeilWJames), who started contributing in 2017 and has made nearly 1,200 commits since, more than half my own lifetime count. In the chart above, he's most of the plugin from 2019 through 2024. When a user [needed it to work with WPML](https://github.com/wp-document-revisions/wp-document-revisions/issues/324), a closed-source translation plugin, Neil talked WPML into giving him a sandbox and spent six months building an integration. TK: confirm how Neil wants to be credited (his GitHub profile has no display name) and how you'd describe his role. If you've used the plugin in the last few years, thank him.

Most abandoned open source looks like this. Nobody decides to walk away. The maintainer's attention goes somewhere else, the issue queue gets a little longer every month, and eventually the cost of catching up looks bigger than the cost of ignoring it.

## Agents took the toil out of maintenance

The expensive part of maintaining an old project is the context switch, not the typing: remembering how the upload path works, rebuilding the test environment, reading a three-year-old issue to figure out what the reporter meant. On a side project you touch twice a year, that ramp-up eats the whole evening before you change a line. It's also the least fun part of open source.

Agents eat most of that ramp-up. I can point one at an issue and come back to a pull request with a diagnosis, a fix, and a failing test that now passes. My job becomes reading it and deciding whether it's right. That's a short task. TK: how long a typical review takes you, and when you fit them in.

TK: name your actual setup. Of the 599 AI commits since May 2025, 108 came from Copilot's coding agent and the rest from your account. Which tool drove those (Copilot in the editor, Claude Code)? Add one concrete example: a specific issue an agent turned around, and roughly how long your review took.

Multiply that by a year and you get the 2026 numbers: 33 releases between v4.0.0 in April and v5.8.3 on November 7, 173 merged pull requests from my account, and another 117 dependency updates from [Dependabot](https://docs.github.com/en/code-security/dependabot) and [Renovate](https://docs.renovatebot.com/) that nobody had to think about. The previous record for releases in a year was 11, set the year the plugin launched.

![Bar chart of releases per year of WP Document Revisions, 2011 to 2026. 11 in 2011 and 9 in 2012, then between zero and five a year from 2013 through 2025. 2026 has 33.](/assets/img/wp-document-revisions-releases-by-year-1600x900.svg "Releases per year, counted from release tags. 2026 is through November 7.")

## Agents are best at the chores maintainers skip

The most valuable work wasn't the big features, though there were some: opt-in block editor support, a [Live Preview](https://wordpress.org/plugins/wp-document-revisions/) that lets you try the plugin in your browser without installing it, and support for AI agents to look up documents through the WordPress Abilities API.[^abilities] The real change was all the work that a solo maintainer rationally skips. TK: confirm which of these were agent-driven; all four PRs came from your account, so the repository can't tell.

- **Changelogs a human can read.** The [5.8.3 changelog](https://github.com/wp-document-revisions/wp-document-revisions/releases) explains what broke, who saw it, and what to do about it, instead of "misc fixes."
- **Translations.** The plugin moved its bundled translations to WordPress.org language packs, so translators get their work in front of users without waiting on me to cut a release.
- **The weird edge cases.** One recent fix covers the case where a PHP upgrade changes which account PHP runs as, so the server can't read a document's file anymore. Before, people got a blank error page. Now they get a message that says what's wrong.
- **Problems that only show up at scale.** Davey [reported](https://github.com/wp-document-revisions/wp-document-revisions/issues/725) that his site, with about 27,000 documents among 120,000 attachments, took 3–4 seconds to load each page of the Media Library, and he'd already traced it to the query. The [fix](https://github.com/wp-document-revisions/wp-document-revisions/pull/730) merged the next day, and then he and Neil spent two weeks benchmarking query variants against his database.
- **Security advisories.** When a researcher reported problems, the fixes shipped with [published advisories](https://github.com/wp-document-revisions/wp-document-revisions/security/advisories) that explain who was affected and what to do, in plain language.

None of that is glamorous, and none of it would have happened if each item cost me an evening. Once each one took a short review instead, they all fit.

:::objection[Isn't this just flooding an old codebase with AI slop?]
It would be if nobody read the pull requests. TK: confirm, in your words, how you review agent pull requests and how often you reject or rework one. The agents write a draft. The plugin's existing tests, CI, and code review decide whether it ships, the same way they would for a human contributor I'd never met. [Pull requests are the right interface for agents](/2026/03/18/agentic-workflows/) for exactly this reason. A 756-commit year is only possible because there's a decade of process underneath it. That process is the part I'd keep if the agents disappeared tomorrow.
:::

The CoffeeScript migration is the receipt: three agent attempts that didn't meet the bar, closed without merging. TK: optional, a line on what was wrong with them, in your words.

## What's left is the fun part

Agents made the work cheap. They didn't make it free, and they didn't make it theirs. Someone still has to decide what the plugin is for, which feature requests to turn down, when a fix is risky enough to hold for a minor release, and what to tell users when something went wrong. That's the maintainer's job. TK: one sentence on what the fun part is for you now, in your words.

:quote[The scarcest thing in open source is a maintainer with enough time left over to care.]{#scarcest-thing-in-open-source} Agents gave me some of that time back, and the work rose to fill it.

## How to revive your own side project

If you've got a project in the same state mine was in, here's roughly what worked. TK: confirm each step matches what you did (the plugin repository has CI, `renovate.json`, and a `CLAUDE.md`, so steps 1–3 check out).

1. **Get CI green before anything else.** Agents need a test suite to check their work against. If yours is broken, the first pull request you ask for is the one that fixes it.
1. **Turn on automated dependency updates.** Dependabot or Renovate turns a year of drift into a stream of small pull requests you can merge between meetings.
1. **Write down how the project works.** A short `AGENTS.md` (or `CLAUDE.md`) with the build, test, and lint commands saves every future session from rediscovering them. [Good documentation makes AI tools better](/2026/10/26/documentation-quality-is-ai-quality/), and it helps the next human contributor too.
1. **Start with the issue queue.** Hand the agent your oldest open bugs, one at a time. Each fix is a small, reviewable pull request, and the queue shrinks visibly.
1. **Review everything, merge nothing blind.** Read the diff. Run it. :quote[If you wouldn't merge it from a stranger, don't merge it from an agent.]{#merge-from-a-stranger}
1. **Thank the people who kept it alive.** If someone held the project together while you were gone, say so publicly. Mine is Neil.

Open the oldest issue in your side project's queue tonight and ask an agent to take a pass at it. If the pull request it opens takes less time to review than the issue took to ignore, you've got your answer.

[^coffeescript]: [CoffeeScript](https://coffeescript.org/) added classes, arrow functions, and a cleaner syntax years before JavaScript had them. JavaScript added most of those features in 2015, which took away most of the reason to use it.

[^abilities]: The Abilities API is WordPress's way of describing what a plugin can do, so that AI agents and the command palette can call it. The plugin's abilities are read-only, and the [WordPress MCP Adapter](https://github.com/WordPress/mcp-adapter) exposes them over the Model Context Protocol, so an assistant can look up documents without being able to change them.
