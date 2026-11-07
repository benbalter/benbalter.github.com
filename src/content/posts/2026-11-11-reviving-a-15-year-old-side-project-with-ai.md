---
title: Reviving a 15-year-old side project with AI
description: "My WordPress plugin just passed 200,000 downloads. I made 11 commits to it in 2023 and 2024 combined, then 460 this year. AI agents changed the math on old side projects."
tldr: "WP Document Revisions passed 200,000 downloads after a year where I went from barely touching it to shipping 33 releases. AI coding agents made an hour of maintainer attention go far enough that an old side project was worth caring about again. Point them at the chores you've been skipping, and keep the decisions for yourself."
---

Here's the commit history for [WP Document Revisions](https://github.com/wp-document-revisions/wp-document-revisions), the WordPress plugin I started in 2011. In 2023, I made seven commits to it. In 2024, four. This year, I've made 460.

The plugin also just passed 200,000 downloads on [WordPress.org](https://wordpress.org/plugins/wp-document-revisions/), which feels like a good excuse to look at what changed. I didn't find more free time, and nobody started paying me. :quote[AI coding agents made an hour of my attention go far enough that a side project I'd quietly drifted away from was worth caring about again.]{#worth-caring-about-again}

TK: one or two sentences on what got you back in. Your first commit after 11 months was in May 2025, and v4.0.0 shipped in April 2026. What happened? A bug report, a tool you wanted to try, guilt?

## Side projects starve before they die

I built WP Document Revisions because I was trying to set up [SharePoint](https://en.wikipedia.org/wiki/SharePoint) for my law journal's publishing workflow and [found it baffling](/2011/04/04/when-all-you-have-is-a-pair-of-bolt-cutters/). WordPress already had revisions, permissions, and permalinks, so I [bolted document management onto it](/2011/08/29/wp-document-revisions-document-management-version-control-wordpress/). In 2011 and 2012, I made 343 commits.

Then life happened, the way it does with side projects. The plugin never broke badly enough to force my hand. It just got less of me every year. Between June 2024 and August 2025, it went 14 months without a release.

It survived that stretch because of [Neil James](https://github.com/NeilWJames), who started contributing in 2017 and has made nearly 1,200 commits since, more than half my own lifetime count. For most of a decade, Neil was the reason the plugin kept working on new versions of WordPress and PHP. If you've used it in the last few years, thank him.

Most abandoned open source looks like this. Nobody decides to walk away. The maintainer's attention goes somewhere else, the issue queue gets a little longer every month, and eventually the cost of catching up looks bigger than the cost of ignoring it.

## Agents changed what an hour of maintenance buys

The expensive part of maintaining an old project is the context switch, not the typing: remembering how the upload path works, rebuilding the test environment, reading a three-year-old issue to figure out what the reporter meant. On a side project you touch twice a year, that ramp-up eats the whole evening before you change a line.

Agents eat most of that ramp-up. I can point one at an issue and come back to a pull request with a diagnosis, a fix, and a failing test that now passes. My job becomes reading it and deciding whether it's right. That's a short task, and I can do a short task on a Tuesday night. TK: how long a typical review actually takes you.

TK: name your actual setup. GitHub shows 108 commits from Copilot's coding agent (the first in June 2025) on top of your 460 this year. Which tool drove most of yours? Add one concrete example: a specific issue an agent turned around, and roughly how long your review took.

Multiply that by a year and you get the 2026 numbers: 33 releases between v4.0.0 in April and v5.8.3 this week, 173 merged pull requests from my account, and another 117 dependency updates from [Dependabot](https://docs.github.com/en/code-security/dependabot) and [Renovate](https://docs.renovatebot.com/) that nobody had to think about.

## Agents are best at the chores maintainers skip

The most valuable work wasn't the big features, though there were some: opt-in block editor support, a [Live Preview](https://wordpress.org/plugins/wp-document-revisions/) that lets you try the plugin in your browser without installing it, and support for AI agents to look up documents through the WordPress Abilities API.[^abilities] The real change was all the work that a solo maintainer rationally skips:

- **Changelogs a human can read.** The [5.8.3 changelog](https://github.com/wp-document-revisions/wp-document-revisions/releases) explains what broke, who saw it, and what to do about it, instead of "misc fixes."
- **Translations.** The plugin moved its bundled translations to WordPress.org language packs, so translators get their work in front of users without waiting on me to cut a release.
- **The weird edge cases.** One recent fix covers the case where a PHP upgrade changes which account PHP runs as, so the server can't read a document's file anymore. Before, people got a blank error page. Now they get a message that says what's wrong.
- **Security advisories.** When a researcher reported problems, the fixes shipped with [published advisories](https://github.com/wp-document-revisions/wp-document-revisions/security/advisories) that explain who was affected and what to do, in plain language.

None of that is glamorous, and none of it would have happened if each item cost me an evening. Once each one took a short review instead, they all fit.

:::objection[Isn't this just flooding an old codebase with AI slop?]
It would be if nobody read the pull requests. TK: confirm, in your words, how you review agent pull requests and how often you reject or rework one. The agents write a draft. The plugin's existing tests, CI, and code review decide whether it ships, the same way they would for a human contributor I'd never met. A 460-commit year is only possible because there's a decade of process underneath it. That process is the part I'd keep if the agents disappeared tomorrow.
:::

TK: a real example of an agent getting it wrong and you catching it. Something you rejected or rewrote.

## You still own the decisions

Agents made the work cheap. They didn't make it free, and they didn't make it theirs. Someone still has to decide what the plugin is for, which feature requests to turn down, when a fix is risky enough to hold for a minor release, and what to tell users when something went wrong. That's the maintainer's job, and it's the part of the job I always liked.

:quote[The scarcest thing in open source is a maintainer with enough time left over to care.]{#scarcest-thing-in-open-source} Agents gave me some of that time back, and the work rose to fill it.

## How to revive your own side project

If you've got a project in the same state mine was in, here's roughly what worked:

1. **Get CI green before anything else.** Agents need a test suite to check their work against. If yours is broken, the first pull request you ask for is the one that fixes it.
1. **Turn on automated dependency updates.** Dependabot or Renovate turns a year of drift into a stream of small pull requests you can merge between meetings.
1. **Write down how the project works.** A short `AGENTS.md` (or `CLAUDE.md`) with the build, test, and lint commands saves every future session from rediscovering them. It helps the next human contributor too.
1. **Start with the issue queue.** Hand the agent your oldest open bugs, one at a time. Each fix is a small, reviewable pull request, and the queue shrinks visibly.
1. **Review everything, merge nothing blind.** Read the diff. Run it. If you wouldn't merge it from a stranger, don't merge it from an agent.
1. **Thank the people who kept it alive.** If someone held the project together while you were gone, say so publicly. Mine is Neil.

Open the oldest issue in your side project's queue tonight and ask an agent to take a pass at it. If the pull request it opens takes less time to review than the issue took to ignore, you've got your answer.

[^abilities]: The Abilities API is WordPress's way of describing what a plugin can do, so that AI agents and the command palette can call it. The plugin's abilities are read-only, and the [WordPress MCP Adapter](https://github.com/WordPress/mcp-adapter) exposes them over the Model Context Protocol, so an assistant can look up documents without being able to change them.
