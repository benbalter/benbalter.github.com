---
title: Manage like an engineer
description: If issues, pull requests, and project boards are the best way to develop software, should they not also be the best way to manage software development?
---

Many engineering and product leaders begin their career as engineers. On a typical engineering team, work is captured in issues, organized in project backlogs, and reviewed in pull requests. For most teams, this is the best way to plan and track software development work.[^7] But as engineers advance in their career and begin down the management path, they too often adopt an entirely different set of tools, workflows, and philosophies for managing their own work. Such management workflows are more cumbersome, more time consuming, and more opaque than their engineering counterparts. If we believe issues, pull requests, and project boards are the best way to develop software, should they not also be the best way to manage software development?[^3]

Rather than tracking bugs or feature requests, in my day-to-day as a Chief of Staff, I use GitHub to track all the "meta work" that supports software development and software development teams. Need to prepare a deck for a business review? Open an issue. Want to refresh our career ladders? Open an issue. Planning an offsite? You guessed it, open an issue.

## Why you should manage like an engineer

Using engineering tools like GitHub to track management tasks is *much* more than an alternative to your personal todo list or an endless stack of Google Docs or group DMs shared with peers. Working like an engineer forces you to work more *transparently* than you would traditionally as a manager. I've written at length before about [the value of leaders "showing their work"](https://ben.balter.com/2022/02/16/leaders-show-their-work/#the-value-of-showing-your-work). When you work in systems that naturally capture and expose process, there's a lot of organic benefits that you and your team get for "free":

> * **Captures institutional knowledge** - When you're purposeful about where and how you share context, you alleviate the need for “you had to be there” and “go ask Susan"-type inquiries.
> * **Empowers others to learn through observation** - What's routine to you is likely novel to someone in another role or at another level of seniority.
> * **Socializes organizational culture and values** - An organization's culture and values is comprised in large part of [the underlying assumptions](https://ben.balter.com/2015/08/12/the-zen-of-github/) that its members fall back on as they resolve ambiguity in pursuit of the organization’s mission.
> * **Fuels engagement** - Transparency offers a sense of agency, situational awareness, and overall engagement that fosters a culture of thoughtful dialog and encourages organization-wide collaborative improvement over time.
> * **Keeps the bar high** - Showing one's work establishes expectations around justification, thoroughness, and accountability that sets and maintains a high standard for decision making within an organization.

## What it means to manage like an engineer

This level of open-source-like managerial transparency is far from automatic nor the default for most management workstreams today. The software tools we use as managers may help influence some outcomes,[^6] but ultimately, leaders must be deliberate in *how* they work for their team to reap the benefits of transparent and collaborative decision making.

Here are a few of the engineer-inspired "how we work" principles which I strive to embody through my own management:

* **Make work visible** - Proactively share to the widest extent practical given the subject.[^4]
* **Write things down** - Especially the why and how. [Ensure that everything has a URL](https://ben.balter.com/2015/11/12/why-urls/). Be generous with links.
* **[Over communicate](https://ben.balter.com/2017/05/23/seven-ways-to-consistently-ship-great-features/#1-over-communicate)** - Use a durable, searchable, and discoverable medium. Let others opt-in to context and subscribe to updates.
* **Bias for shipping** - [Ship early, ship often](https://ben.balter.com/2016/09/13/seven-habits-of-highly-effective-githubbers/#2-ship-early-ship-often). Whether decisions, process, or "manager code", ship an MVP and iterate. Minimize batch size.
* **Streamline and automate** - Never force a human to do what a robot can. Prefer non-blocking over blocking operations. Codify policy as code.
* **Embrace collaboration** - How we work is as important as what we work on. Software development is a team sport.[^5]
* **Asynchronous first** - Reserve higher-fidelity mediums for conversations that require them.
* **Practicality beats purity** - These are guidelines, not rules. Process should drive outcomes.

## How to manage like an engineer

Managing like an engineer means a manager's go to tool for planning, tracking, and communicating managerial work is issues, project boards, markdown files, and pull requests:[^8]

* **Issues** - Issues are the atomic unit of work across teams and is the primary means by which work is planned, tracked, coordinated, and communicated, and where updates are shared.[^2]
* **Project boards** - Project boards are the primary means by which work (in the form of issues) is organized, managed, prioritized, and made visible.
* **Markdown files** - Markdown files are the primary means by which long-lived information is memorialized. Markdown files are created and modified via Pull Requests.
* **Pull requests** - Pull requests are the primary means by which proposals are reviewed and decisions are made.

### Planning and tracking

Issues and project boards create a networked hierarchy of tracking issues that bring visibility to work. This is true both of department-wide goals and initiatives, as well as all the management "meta work" that supports them.

I've written at length before about [how we use issues and projects at GitHub for planning and tracking](https://github.blog/2022-07-01-how-the-github-security-team-uses-projects-and-github-actions-for-planning-tracking-and-more/). We use issues and a project board to track our department-wide OKRs (quarterly goals). Teams may choose to organize issues with labels, milestones, assignees, and project boards to aid in planning and tracking. Issues can capture work at various levels of abstraction, with different "types" of issues encompassing different units of work (initiatives, epics, etc.).

All of the department's management tasks are also tracked in issues, which are made visible to everyone in the company as a management backlog via a GitHub Project. Interested stakeholders wishing to learn more about a given initiative or administrative epic can click into the linked issue to learn more or subscribe to automatically receive ongoing updates.

### Management decision records

Successful distributed teams place an emphasis on written and asynchronous communication. Writing things down serves as a message in a bottle to your future selves, recording what decisions were made, by whom, and why. If issues and project boards track and organize work, "management decision records"[^10] are how decisions are made and communicated.

One common way engineering teams capture important decisions is through [an architecture decision record (ADR)](https://github.com/joelparkerhenderson/architecture-decision-record). ADRs capture not just the decision, but also its context and consequences, and do so in a way that allows stakeholders to deeply participate in the process. In short, the person responsible for a decision writes out their proposal in long form prose, and submits it for discussion and refinement by stakeholders before it is ultimately merged to memorialize the decisions.

While ADRs are intended for engineering decisions, the format and rigour of documentation and process can be adapted to any type of impactful or long-lived decision, especially management decisions with broad impact. That's not to say that management decision records democratize or crowd source management. Rather it formalizes and makes transparent the socializing process that already happens in the course of making such management decisions.

### Automate all the things

Better still, since GitHub is an extensible platform, automation of day-to-day issue management can be "cheap" to implement via shared GitHub actions. If a given OKR hasn't received an update in a while, we use Actions to nudge the responsible individual. When status updates come in as issue comments on a regular cadence, Actions updates the project board so that the health of all our OKRs can be seen in a single view. We even use Actions to automate issue creation at the kick off of the planning cycle, or to have regular meeting and 1:1 agendas created each week.[^9]

## Conclusion

A decade ago, I argued that [working like an open source project would allow us to "Deprecate Management"](https://ben.balter.com/2012/12/16/deprecate-management/). As I wrote then:

> There are so many aspects to the work day that we do just because it’s the way thing’s have been done since the dawn of the industrial revolution, and it puzzles me why nobody’s stopped to think critically about how these processes could be reimagined in an age of technology.

Today, I don't believe that a complete "deprecation" of management is possible, at least not at scale, but by working in the open, managers can shed a lot of management meta-work, moving managers from lower-level to higher-level, more impactful work.

Managing like an engineer means using the same tools and workflows that engineers use to plan, track, and communicate their own work. It means making work visible, writing things down, and embracing collaboration. After all, if that's the best way to build software, should it not also be the best way to manage software development?

[^2]: Track tasks and their progress in issues, cc relevant teams, and cross reference relevant issues to naturally [capture and expose process](https://ben.balter.com/2015/11/18/tools-to-empower-open-collaboration/#2-captures-and-exposes-process). Issues bring the most value to teams when work happens on and around the issue, rather than holding important discussions in chat or over video with the issue being used merely as a "TODO" with tracking open and closed state or a broadcast medium for occasional formal updates to stakeholders (for which Discussions are better suited).

[^3]: Long before the term "inner-source" became popular, GitHub had coopted the workflows and communication patterns of the open source community for its own internal development. While much has been written over the years about "how Github uses GitHub to build GitHub", the concept of using GitHub to _manage_ GitHub fell out of popularity as GitHub grew (and outgrew its own tools). Now that GitHub has native planning-and-tracking capabilities, it's the perfect tool for managers.

[^4]: HR and other personnel matters must often be restricted in their visibility due to their sensitivity, but the vast majority of management work can be shared with increasing circles of trust (peers, other managers, the team, the org, the company, etc.). I've even seen one team use [Mermaid diagrams in Markdown files](https://github.blog/2022-02-14-include-diagrams-markdown-files-mermaid/) to visualize their org chart. Re-org by PR? :thinking:

[^5]: Encourage collaboration among team members, both in terms of setting team-wide goals and executing on individual initiatives. This helps everyone "connect the dots" and understand how their work fits into the bigger picture (and to shape it along the way).

[^6]: For example, transparent and inclusive decision making comes more naturally in a  tools built for collaboration like GitHub than it does in a tool built for conveying information like Slack or email. That's not to say it can't be done, but the tools vision of how work should occur and yours may differ, making things more difficult on both you and you team. When in doubt, start from first principles and ask yourself, "what is the best tool for the job?"

[^7]: Yes, there are different flavors and tools (agile, scrum, JIRA tickets, etc.), but at a high level, most teams have some sort of ongoing list of outstanding TODOs, along with a standard mechanism to review proposed changes.

[^8]: I write about my experience using GitHub, but there's no reason these philosophies couldn't be implemented using another engineering tool. The key is to use a tool that is built for collaboration and transparency and that is extensible via automation.

[^9]: Taking the metaphor further, there's no reason why a manager's workflow couldn't have its own "CI", in the sense that automated checks could keep a high bar for, for example, decision making by ensuring necessary stakeholders were consulted, that ample opportunity was offered to provide feedback, etc. We use this lightly in some places to encourage inclusive language or readability of documentation.

[^10]: Depending on the context, these may also be referred to as "business decision records" (BDRs).