---
title: AI made open source fun again
description: "Open source projects die when catching up costs more than ignoring them. AI flipped that math on my 15-year-old WordPress plugin, and it can on yours."
tldr: "AI agents took over the toil on my 15-year-old WordPress plugin, 2026 became its busiest year, and maintaining it got fun again. Point agents at the work you've been dreading, read every diff, and keep the decisions for yourself."
---

In 2023, I made seven commits to [WP Document Revisions](https://github.com/wp-document-revisions/wp-document-revisions), the WordPress plugin I started in 2011. In 2024, four. This year, the plugin passed [200,000 downloads](https://wordpress.org/plugins/wp-document-revisions/) and had its busiest year ever: 756 commits, 478 of them made by AI agents working for me. I didn't type that code, but I carefully read every diff.

![Stacked bar chart of commits per year to WP Document Revisions, 2011 to 2026. My handwritten commits spike in 2011 to 2012, 2017, and 2021, then nearly vanish in 2023 and 2024 while Neil James carries the plugin, and stop entirely after that. From 2025, AI agents take over: 121 commits in 2025 and 478 in 2026. 2026 is the tallest bar by far, with 756 commits: 478 from AI agents, 138 from Neil, and 140 from everyone else, including dependency bots. The previous high was 467 in 2021.](/assets/img/wp-document-revisions-commits-by-year-1600x900.svg "Commits per year, by who made them. Every commit from my account since May 2025 counts as AI. Merges excluded; 2026 is through November 7.")

I didn't find more free time, and nobody started paying me to maintain it. :quote[Open source projects don't die because maintainers quit. They die when catching up costs more than ignoring them.]{#catching-up-costs-more} For years, that math kept me away from my own project, my first "real" open source project. This year, AI agents flipped it, and once the toil was gone, maintaining it was fun again.

If there's a repository you feel a little guilty about every time it crosses your mind, it can be fun again for you, too.

## Nobody decides to walk away

### It worked too well

In 2011, I was a law and business student[^business-school] trying to set up [SharePoint](https://en.wikipedia.org/wiki/SharePoint) for my law journal's publishing workflow, and [losing](/2011/04/04/when-all-you-have-is-a-pair-of-bolt-cutters/). WordPress already had revisions, permissions, and permalinks. All it was missing was documents, so I pitched bolting them on as a [Google Summer of Code project](https://gsoc2011.wordpress.com/document-revisions/), and WordPress [picked it](https://make.wordpress.org/core/2011/04/25/2011-gsoc-students-announced/). My entire public reaction was "[W00t I can haz Google Summer of Code](https://ben.balter.com/tweets/status/62596492455723008/)."[^w00t]

I spent that summer writing PHP with three WordPress developers looking over my shoulder,[^mentors] and [WP Document Revisions launched that August](/2011/08/29/wp-document-revisions-document-management-version-control-wordpress/). Then it did something side projects rarely do: it worked. Sites installed it and kept running it, and nothing broke badly enough to drag me back. Every few years, something would pull me in for a burst of work, and then I'd drift off again.

The closest it came to forcing my hand was an email in April 2019 from a student editor at my old law journal. I hadn't heard from the journal since I graduated, nearly six years earlier, and I'd assumed they'd moved on to something better. They hadn't. Eight years after I'd built it, the journal still ran its publishing workflow on it, someone's well-intentioned changes had broken it, and I was still the person they emailed. I was surprised, flattered, and a little humbled.[^maintainability]

### A stranger kept it alive

While I was drifting,[^drifting] the plugin got lucky. In 2017, a stranger named [Neil James](https://github.com/NeilWJames) [filed a bug](https://github.com/wp-document-revisions/wp-document-revisions/issues/98) about its sidebar widget, and then he never left. (In the best way possible. Thank you, Neil.) He went from bug reports to [features that became major releases](https://github.com/wp-document-revisions/wp-document-revisions/pull/265), and he's essentially co-maintained the plugin ever since, with more than a thousand contributions to show for it. From 2019 through 2024, he's most of the chart above in every year but one.[^wpml] If you've used the plugin in the last few years, thank him.

But one volunteer can only do so much. By 2023, I'd nearly stopped committing, and the plugin went 14 months without a release.

Most abandoned open source looks like this. :quote[Nobody decides to walk away. The maintainer's attention goes somewhere else, and the issue queue gets a little longer every month.]{#nobody-decides-to-walk-away}

If that's your project, you didn't stop caring. You're a volunteer, and the shift stopped being fun, because every visit cost an evening of catching up before you got to the part you liked.

## The cost of ignoring it went up

WordPress.org says the plugin runs on [more than 2,000 sites](https://wordpress.org/plugins/wp-document-revisions/). One of them is the UK Ministry of Justice, whose [intranet](https://github.com/ministryofjustice/intranet) and [WordPress hosting platform](https://github.com/ministryofjustice/hale-platform) both build on it.

The plugin shipped two releases in 2024. Each went out the day [Davey](https://github.com/EarthlingDavey), a developer on the Ministry's intranet, politely opened an issue asking for one, [in March](https://github.com/wp-document-revisions/wp-document-revisions/issues/344) and [again in June](https://github.com/wp-document-revisions/wp-document-revisions/issues/349). Those requests were how I found out a government department depended on a plugin I wrote as a law student.

## The cost of catching up came down

### Four failed attempts taught me how to work with an agent

Every old project has a rewrite nobody wants to do. Mine was [CoffeeScript](https://coffeescript.org/), a language that compiles to JavaScript and was briefly the cool way to write it.[^coffeescript] I [adopted it in 2013](https://github.com/wp-document-revisions/wp-document-revisions/commit/d94eb54a), [opened an issue](https://github.com/wp-document-revisions/wp-document-revisions/issues/327) to get rid of it a decade later, and then didn't touch that issue for a year and a half.

So I handed it to an AI agent, and it failed. So did the next three. I closed all four attempts without merging them, and each one taught me something about working with agents.

- **Check the work, not the summary.** An agent will say it's finished when it isn't. The [first attempt](https://github.com/wp-document-revisions/wp-document-revisions/pull/362) added a "modern" copy beside the old code instead of replacing it. The [fourth](https://github.com/wp-document-revisions/wp-document-revisions/pull/438) converted one file and told me the rest were "already written in modern ES6+." They weren't.
- **Keep the change small enough to read.** The [second attempt](https://github.com/wp-document-revisions/wp-document-revisions/pull/387) ballooned into 96 files and 21,000 lines. If you can't review it, you can't merge it.
- **Ask for evidence.** When I asked the [third attempt](https://github.com/wp-document-revisions/wp-document-revisions/pull/407) how I could be confident nothing would break, it replied, "You can be confident there are no breaking changes." So I [asked for tests](https://github.com/wp-document-revisions/wp-document-revisions/issues/409) instead, which the plugin's JavaScript had never had, and got [181 of them](https://github.com/wp-document-revisions/wp-document-revisions/pull/410) that night.
- **Give the agent a way to check itself.** With those tests to check its work against, the [fifth attempt](https://github.com/wp-document-revisions/wp-document-revisions/pull/464) converted all five files and passed every one.[^tests] It then [added end-to-end tests](https://github.com/wp-document-revisions/wp-document-revisions/commit/a2a019a1) that drive a real WordPress install in a browser, and they [caught breakage](https://github.com/wp-document-revisions/wp-document-revisions/commit/97145e35) the unit tests had missed.

Eleven months after the first try, the last `.coffee` file was gone.

### Review takes minutes, not evenings

The expensive part of maintaining an old project is the context switch, not the typing: remembering how the upload path works, rebuilding the test environment, reading a three-year-old issue to figure out what the reporter meant. On a side project you touch twice a year, that ramp-up eats the whole evening before you change a line.

Agents do the ramp-up.[^setup] I point one at an issue and come back to a pull request with a fix and a failing test that now passes. My job is to read it and decide whether it's right.

That's a short job if you keep the pull requests small and the tests real. Half of the 180 pull requests I merged this year were merged within 10 minutes of opening. Those had a median of about 60 changed lines, and none could merge until the unit tests, the end-to-end tests, and WordPress's own plugin checks passed.[^checks] Write down how the project works, too, because [an agent is only as good as the docs you feed it](/2026/10/26/documentation-quality-is-ai-quality/).

Quick reviews turn into quick releases. One morning in September, Davey reported two bugs from the Ministry of Justice, a [slow Media Library](https://github.com/wp-document-revisions/wp-document-revisions/issues/725) and a [missing revision log](https://github.com/wp-document-revisions/wp-document-revisions/issues/726). Both fixes merged that night and shipped the next day. Then he and Neil spent two weeks benchmarking queries against his database, to see if it could go faster.

The plugin shipped 33 releases this year, 23 of them small patches. The previous record was 11, set the year it launched.

![Bar chart of releases per year of WP Document Revisions, 2011 to 2026. 11 in 2011 and 9 in 2012, then between zero and five a year from 2013 through 2025. 2026 has 33.](/assets/img/wp-document-revisions-releases-by-year-1600x900.svg "Releases per year, counted from release tags. 2026 is through November 7.")

### Agents do the chores maintainers skip

The biggest change was all the work a solo maintainer rationally skips. Changelogs are written for humans now. The [5.8.3 changelog](https://github.com/wp-document-revisions/wp-document-revisions/releases/tag/v5.8.3) explains what broke, who saw it, and what to do about it, instead of "misc fixes." Weird edge cases get handled, too. One recent fix covers the case where a PHP upgrade changes which account PHP runs as, so the server can't read a document's file anymore. Before, people got a blank error page. Now they get a message that says what's wrong.

None of that is glamorous, and none of it would have happened if each item cost me an evening.

### The math flipped on my other projects, too

I maintain [sev](https://github.com/benbalter/jekyll-optional-front-matter "jekyll-optional-front-matter")[en](https://github.com/benbalter/jekyll-readme-index "jekyll-readme-index") [Jek](https://github.com/benbalter/jekyll-default-layout "jekyll-default-layout")[yll](https://github.com/benbalter/jekyll-titles-from-headings "jekyll-titles-from-headings") [plu](https://github.com/benbalter/jekyll-relative-links "jekyll-relative-links")[gi](https://github.com/benbalter/jekyll-remote-theme "jekyll-remote-theme")[ns](https://github.com/benbalter/jekyll-include-cache "jekyll-include-cache"), and [GitHub Pages](https://pages.github.com/) turns five of them on by default for every site it builds. Across all seven, I made five commits from 2022 through 2024. This year, they've had 274 commits and 29 releases.[^pages-versions] [word2md](https://word2md.com), my twelve-year-old Word-to-Markdown converter, has had 449 commits this year.

### Moving fast made the plugin safer, mostly

The plugin published [11 security advisories](https://github.com/wp-document-revisions/wp-document-revisions/security/advisories) this year, each explaining in plain language who was affected and what to do. That sounds like bad news, and mostly it isn't. Seven fixed long-standing holes, some of them years old, that otherwise wouldn't have been found.

The other four are the cost of moving fast. They covered code the agents wrote this year, including private documents uploaded through the new block editor panel landing in an unprotected folder. More than 2,000 sites run this code, which is why I read every diff.

:::objection[Isn't this the same AI slop other maintainers are drowning in?]
The difference is who's driving. The slop that buries maintainers is the drive-by: a stranger points an agent at someone else's project, opens a pull request they haven't read, and leaves the maintainer to review it. Here, I'm the maintainer. I asked for the change, and I own whatever merges. The agent works for the person accountable for the project, not around them.

That's also why review still matters. Agents are logical to a fault, but they lack taste and product judgment. :quote[AI can generate the right solution to the wrong problem.]{#right-solution-wrong-problem}

The agents write a draft. The plugin's existing tests, CI, and code review decide whether it ships, the same way they would for a human contributor I'd never met. [Pull requests are the right interface for agents](/2026/03/18/agentic-workflows/) for exactly this reason.
:::

## What's left is the fun part

Cheap work still needs someone to decide what the plugin is for, which feature requests to turn down, when a fix is risky enough to hold for a minor release, and what to tell users when something went wrong. That's the maintainer's job, and it's the fun part.

It's also where ideas stop dying of neglect. One evening in April, I decided the plugin's WordPress.org page should have a [Live Preview](https://wordpress.org/plugins/wp-document-revisions/), so anyone can try it in their browser without installing anything.[^playground] It shipped that night, and so did the fix for the file path the agent got wrong. For most of the plugin's life, an idea like that would have sat in my head until some free weekend that never came.

Every pull request arrives with its own tests, so I don't have to write them. [Aaron Jorbin](https://aaron.jorb.in/), one of my Summer of Code mentors, taught me what a unit test was, and I've loathed writing them ever since. (Sorry, Aaron.)

Since my role at GitHub ended in July, open source has been a hobby again, the way it was in 2011. :quote[Contributing to open source has always been a kind of volunteering. It's a lot easier to keep showing up when the shift is fun.]{#volunteering} Take the toil away, and what's left is the reason you started.

In 2024, the plugin shipped two releases, and a government department had to ask for both. This year, it shipped 33, and nobody had to ask.

## How to flip the math on your own project

If you've got a project where catching up looks more expensive than ignoring it, here's where I'd start.

1. **Get CI green before anything else.** Agents need a test suite to check their work against. If yours is broken, the first pull request you ask for is the one that fixes it.
1. **Turn on automated dependency updates.** Dependabot or Renovate turns a year of drift into a stream of small pull requests you can merge between meetings.
1. **Write down how the project works.** A short `AGENTS.md` (or `CLAUDE.md`) with the build, test, and lint commands saves every future session from rediscovering them. [Good documentation makes AI tools better](/2026/10/26/documentation-quality-is-ai-quality/), and it helps the next human contributor too.
1. **Start with the issue queue.** Hand the agent your oldest open bugs, one at a time. Each fix is a small, reviewable pull request, and the queue shrinks visibly.
1. **Review everything, merge nothing blind.** Read the diff. Run it. :quote[If you wouldn't merge it from a stranger, don't merge it from an agent.]{#merge-from-a-stranger}
1. **Thank the people who kept it alive.** If someone held the project together while you were gone, say so publicly. Mine is Neil, along with [more than 50 other people](https://github.com/wp-document-revisions/wp-document-revisions/discussions/913).

Open the oldest issue in your side project's queue tonight and ask an agent to take a pass at it. If the pull request it opens takes less time to review than the issue took to ignore, you've got your answer.

[^business-school]: Like Nathan Fielder, who opens every episode of his Comedy Central show [*Nathan for You*](https://en.wikipedia.org/wiki/Nathan_for_You) with the line, I graduated from one of ~~Canada's~~ Washington, DC's top business schools with "really good grades."

[^w00t]: For the record, I'd like to think the few social media posts I still write have improved since then.

[^mentors]: [Mitcho Erlewine](https://mitcho.com/), [Aaron Jorbin](https://aaron.jorb.in/), and [Jon Cave](https://joncave.co.uk/). Andrew Nacin, then one of WordPress's lead developers, kept a close eye on it too.

[^maintainability]: A student journal replaces its whole board every year or two, so anything you build for one is really built for strangers who'll inherit it without you. Assume whatever you ship will still be running in ten years, long after anyone remembers why it works the way it does. Whoever inherits it won't know who to email. Or worse, they will.

[^drifting]: Mostly toward Ruby. In 2012, I [moved this site from WordPress to Jekyll](/2012/10/01/welcome-to-the-post-cms-world/), a static site generator written in Ruby, and for the next decade, I wrote Jekyll plugins instead of WordPress ones.

[^wpml]: When a user [needed the plugin to work with WPML](https://github.com/wp-document-revisions/wp-document-revisions/issues/324), a closed-source translation plugin, Neil talked WPML into giving him a sandbox and spent six months building an integration. That's the kind of maintainer he is.

[^coffeescript]: CoffeeScript added classes, arrow functions, and a cleaner syntax years before JavaScript had them. JavaScript added most of those features in 2015, which took away most of the reason to use it.

[^tests]: All 181 tests passed, and the fifth attempt added 113 more.

[^setup]: Until my role at GitHub ended in July 2026, my agent was GitHub Copilot. Since then, I've used [Claude Code](https://claude.com/claude-code). The workflow is the same either way: the agent opens a pull request, and I review it.

[^checks]: The repository's branch rules require the unit tests, the end-to-end tests, the WordPress.org Plugin Check, and a few build checks to pass before anything merges, including Renovate's automatic merges.

[^pages-versions]: GitHub Pages pins its own versions of these plugins and updates them on its own schedule, so most of those fixes reach sites that build with Jekyll directly, for example through GitHub Actions. Pages picked up a security fix for one of them [this month](https://github.com/github/pages-gem/pull/965).

[^playground]: WordPress.org can launch any plugin in [WordPress Playground](https://wordpress.org/playground/), a full WordPress that runs entirely in the browser, if the plugin ships a small configuration file describing how to set it up.
