---
title: Manage like an open source developer
description:
---

Long before the term "inner-source" became popular, GitHub had coopted the workflows and communication patterns of the open source community for its own internal development. While much has been written over the years about "how we use GitHub to build GitHub", the concept of using GitHub to _manage_ GitHub is relatively new. After all, if we believe issues, pull requests, and project boards are the best way to develop software, should it not also be the best way to manage software development?

Rather than tracking bugs or feature requests, in my day-to-day, I use GitHub to track all the "meta work" that supports software development. Need to prepare a deck for a business review? Open an issue. Want to refresh our career ladders? Open an issue. Planning an offsite? You guessed it, open an issue. 

But using GitHub this way is much more than an alternative to your personal todo list. I've written before about [the value of "showing your work"](https://ben.balter.com/2022/02/16/leaders-show-their-work/#the-value-of-showing-your-work). Absent working within systems that naturally capture and expose process, transparency takes effort. There's a lot that you get for "free" when transparency is organic:

> * **Captures institutional knowledge** - When you're purposeful about where and how you share context, you alleviate the need for “you had to be there” and “go ask Susan"-type inquiries.
> * **Empowers others to learn through observation** - What's routine to you is likely novel to someone in another role or at another level of seniority.
> * **Socializes organizational culture and values** - An organization's culture and values is comprised in large part of [the underlying assumptions](https://ben.balter.com/2015/08/12/the-zen-of-github/) that its members fall back on as they resolve ambiguity in pursuit of the organization’s mission.
> * **Fuels engagement** - Transparency offers a sense of agency, situational awareness, and overall engagement that fosters a culture of thoughtful dialog and encourages organization-wide collaborative improvement over time.
> * **Keeps the bar high** - Showing one's work establishes expectations around justification, thoroughness, and accountability that sets and maintains a high standard for decision making within an organization.


## Principles

* **Make work visible** - Proactively share to the widest extent practical given the subject.
* **Write things down** - Show your work, especially the why and how.[^1] [Ensure that everything has a URL](https://ben.balter.com/2015/11/12/why-urls/). 
* **[Over communicate](https://ben.balter.com/2017/05/23/seven-ways-to-consistently-ship-great-features/#1-over-communicate)** - Use a durable, searchable, and discoverable medium. Let others opt-in to context and subscribe to updates.
* **Bias for shipping** - [Ship early, ship often](https://ben.balter.com/2016/09/13/seven-habits-of-highly-effective-githubbers/#2-ship-early-ship-often). Whether decisions, process, or code, ship the smallest thing possible and iterate. Minimize batch size. 
* **Seek efficiency and automation** - Never force a human to do what a robot can. Prefer non-blocking over blocking operations. Codify policy as code.
* **Collaborate** - How we work is as important as what we work on. Software development is a team sport.
* **Asynchronous first** - Reserve higher-fidelity mediums for conversations that require them.
* **Practicality beats purity** - These are guidelines, not rules. Process should drive outcomes.

## Tracking work

Issues on GitHub.com are the atomic unit of work across teams and is the primary means by which work is planned, tracked, managed, coordinated, communicated, and shared. Track tasks and their progress in issues, cc relevant teams, and cross reference relevant issues to naturally [capture and expose process](https://ben.balter.com/2015/11/18/tools-to-empower-open-collaboration/#2-captures-and-exposes-process). [^2] 

Teams may choose to organize issues with labels, milestones, assignees, and project boards to aid in planning and tracking. Issues can capture work at various levels of abstraction, with different "types" of issues encompassing different units of work (initiatives, epics, etc.).

[^1]: Successful distributed teams place an emphasis on written and asynchronous communication. Writing things down serves as a message in a bottle to your future self and you future peers, recording what decisions were made, by whom, and why. One common way to capture important decisions is through [an architecture decision record (ADR)](https://github.com/joelparkerhenderson/architecture-decision-record). ADRs capture not just the decision, but also its context and consequences, and do so in a way that allows stakeholders to deeply participate in the process. While ADRs are intended for engineering decisions, the format and rigour of documentation and process can be adapted to any type of impactful or long-lived decision by documenting and discussing key outcomes in issues and pull requests.

[^2]: Issues bring the most value to teams when conversations and status updates happen on and around the issue, rather than holding important discussions in chat or over video with the issue being used merely as a "TODO" with only an open and closed state.