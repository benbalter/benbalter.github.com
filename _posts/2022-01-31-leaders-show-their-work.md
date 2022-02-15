---
title: Leaders show their work
description: For an organization to reap the benefits of sharing context through URLs, its leaders must not only communicate what decision was made, but also how the decision was made, and why.
---

A number of years ago, I [described the value of memorializing decisions through URLs](https://ben.balter.com/2015/11/12/why-urls/):

> [URLs] provides a single, incontrovertible source of truth for the organization’s intentions, and equally important, exposes the reasoning behind the decision, reducing the tendency for top-down decisions to be communicated as “because I said so”.

That’s still true today, but there’s some critical nuance not sufficiently captured in that excerpt: for an organization to reap [those benefits](https://ben.balter.com/2015/11/12/why-urls/#the-value-of-giving-concepts-urls), its leaders must not only communicate via URL *what* decisions were made, but must also explain *why* they made those decision and *how*. There are two ways to do that: [adopt systems that naturally capture and expose process](https://ben.balter.com/2015/11/12/why-urls/#systems-that-naturally-capture-and-expose-process), or absent those systems, leaders must hold one another accountable for spending the additional cycles to *show their work*.

### The challenges of decision making at scale

As teams scale, traditional approaches to decision making force a tradeoff between transparency and efficiency:

If you're working solo, you enjoy the benefits of absolute transparency and absolute efficiency. You know everything you know, and there's no added cost for sharing that information with yourself. As the number of people solving a problem grows, guarantees of both transparency and efficiency often become exponentially more expensive. A small team may experience minor communication costs in terms of say weekly meetings and daily standups, but as teams and companies grow, the cost of traversing that network layer adds up, rendering absolute participation in decision-making practically impossible.

To overcome these limitations of scale, many organizations logically add a management layer, [assigning to managers the responsibility of coordinating and aligning decisions across teams and business units](https://ben.balter.com/2012/12/16/deprecate-management/). Once a decision is made, managers are also responsible for communicating necessary information to those affected. Like a game of telephone, some fidelity is naturally lost in that abstracted process (since it requires a human [extract, transform, and load](https://www.ibm.com/cloud/learn/etl) operation to shuttle information from one reporting structure to the next) and with every layer of abstraction, the quality (and efficiency) of that message transmission degrades.

### Collaboration doesn't have to be an O(n<sup>2</sup>) problem

The easiest way to ensure everyone can understand the how and why of a decision is to adopt systems that, through their daily operation, ensure such context is automatically and readily available to those who might want it (and explicitly not only those who need it). At GitHub, historically adopting workflows inspired by the open source community, we often see this in the form of working transparently within the context of GitHub issues and pull requests.

Let's take a typical software development workflow as an example: bugs and feature requests are captured as detailed [problem statements](https://ben.balter.com/2018/07/16/problems-not-solutions/) and are prioritized transparently by managers in a curated backlog. Developers pick issues off the top of that queue, open up a pull request with their proposed solution (along with a reference back to the associated issue), and the changes are reviewed, refined, and ultimately merged, all available for anyone in the organization (or in the case of open source, the world) to see. Six months or a year later, others interested in the decisions made can use the changed file's history, `git blame`, or issue search among other tools to find exactly who made what change and why, as if they were party to the decision contemporaneously.

That organically transparent process is not limited to changes to code. At GitHub we use that flow to propose, discuss, and ultimately implement changes to architecture, policy, programs, process, documentation, and ironically, how we work. The idea being, that even though working transparently may require additional effort on the part of the moving party initially, doing so benefits the organization in the long run, and does so in a manner that far outweighs any short-term costs.

### Near-term convenience creates long-term communications debt

I admit, as GitHub has grown, I’ve fallen astray and am guilty of starting a Slack DM, Google Doc, or Zoom meeting, tempted by the siren song of near-term efficiency that quickly hashing out a problem in private offers. Similar to how quick technical fixes often saddle an organization with ongoing technical debt, so too can communication shortcuts be an avoidable source of ongoing communications debt. 

There's nothing wrong, per se, with using opaque-to-others tools like Slack, Google Docs, or Zoom, and in fact, [some times they are the best tool for the job](https://ben.balter.com/2020/08/14/tools-of-the-trade/), but all too often in reaching for such tools, we neglect to account for the organizational cost we incur in needing to subsequently, manually, and thoughtfully communicate outcomes to those affected.

For many working opaquely, communicating a decision often takes the form of simply stating "we decided X" or "you must now do Y". This could be as simple as an email, Slack message, or update in an in-person meeting, but at their core, these efforts all too often focus on the "what", even when the "why" or "how" isn't otherwise apparent to outsiders. Such forms of leadership fail to budget for the true cost of those short-term efficiencies.

As the ones with that missing context, leaders naively assume that all that's required for a change to take effect is to communicate the thing that's changed, but humans are not servers. Unlike deploying a change to a codebase, a diff isn't sufficient to truly realize what's intended. Engaged humans rightfully seek to understand how and why the change came to be and often want to double check their leaders's work to fully understand how it impacts their own.

In describing this concept, I've often used the phrase "being treated as an adult", but it goes beyond that. Yes, those affected may naturally question otherwise unanswerable-to-them questions, but at the end of the day, transparent leadership is a sign of trust and respect. 

### The value of showing your work

Great leaders hold themselves and those they work with accountable for showing their work, and doing so in a durable medium at that. At a high level, "showing your work" means capturing who made what decision and when, along with a detailed, but *concise* description of why and how that decision was made. Showing your work offers organizations and teams a number of advantages:

* **Captures institutional knowledge** - When you're purposeful about where and how you share context, you alleviate the need for “you had to be there” and “go ask Susan"-type inquiries. This is the [commander's intent](https://en.wikipedia.org/wiki/Intent_(military)) that allows others to continue the work despite evolving circumstances, not to mention, process artifacts also naturally capture what other alternatives were considered, allowing those to follow to stand on your shoulders.
* **Allow others to learn through observation** - 
* **Socializes organizational culture and values** - An organization's culture and values is comprised, in part, of [the underlying assumptions that its members fall back on as they resolve ambiguity in pursuit of the organization’s mission](https://ben.balter.com/2015/08/12/the-zen-of-github/). Should we be iterative or precise? Process driven or outcome oriented? Do we serve end users or execs? Showing your work allows you to normalize how your organization approaches decision making, and thus makes explicit those otherwise unwritten assumptions.

Beyond the fact that injecting transparency into otherwise opaque workflows take an affirmative step on the part of those responsible, why then, don't more leaders more consistently show their work?

### Transparency as a liability vs. transparency as an asset

There are two ways to think of the transparency afforded by open systems: some think of this transparency as a liability and others think of transparency as an asset.

As a **liability**, transparency in decision making exposes you to the risk of being "wrong", or at the very least, being subject to the fear, uncertainty, and doubt (FUD), that at any moment you may be briggaded with well-intioned, but ultimately both time-consuming and difficult to answer questions.

As an **asset**, transparency, is the belief that collaborative decision making leads to the best outcomes. In theory, that unwanted criticism you must address becomes early validation and feedback. In practice, those affected will appreciate the transparency, but often you will find yourself struggling for engagement on most decisions. I've been responsible for and participated in thousands of decisions at GitHub over the years. I can't think of a single example for which up front transparency did not result in a better outcomes.

It also takes work.

### How to ensure you are showing your work

CALL TO ACTION

* Not just what, but how, and why
* Show alternatives evaluated and why they weren’t right
* Socialize how decisions should be made
* Resolve ambiguity for those implementing
* 
