---
title: Manage like an engineer
description:
---

## Principals

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