---
title: Great leaders show their work
description:
---

A number of years ago, I opined on the value of memorializing decisions through URLs. [As I wrote then](https://ben.balter.com/2015/11/12/why-urls/):

> [URLs] provides a single, incontrovertible source of truth for the organization’s intentions, and equally important, exposes the reasoning behind the decision, reducing the tendency for top-down decisions to be communicated as “because I said so”.

That’s still true today, but there’s some critical nuance missing from that excerpt: for an organization to reap [those benefits](https://ben.balter.com/2015/11/12/why-urls/#the-value-of-giving-concepts-urls), its leaders must not only communicate via URL *what* decisions were made, but must also explain *why* they made those decision and *how*.

There are two ways to do that: [adopt systems that naturally capture and expose process](https://ben.balter.com/2015/11/12/why-urls/#systems-that-naturally-capture-and-expose-process), or absent those systems, leaders must hold one another accountable for spending the additional cycles to *show their work*.

### The challenges of scale

Let's start by looking at traditional approaches to scaling decision making. As teams scale, traditional approaches force a tradeoff between transparency and efficiency:

If you're working solo, you enjoy the benefits of absolute transparency and absolute efficiency. You know everything you know, and there's no added cost for sharing that information with yourself. As the number of people solving a problem grows, guarantees of both transparency and efficiency often become exponentially more expensive. A small team may experience minor communication costs in terms of say weekly meetings and daily standups, but as teams and companies grow, the cost of traversing that network layer adds up, rendering absolute participation in decision-making practically impossible.

Instead, organizations naturally add a management layer, [delegating the responsibility to coordinate and align decisions across business units and then subsequently communicate information to affected teams](https://ben.balter.com/2012/12/16/deprecate-management/). Like a game of telephone, some fidelity of decision making is naturally lost in that abstracted process (since it requires a human ETL to shuttle information from one business unit to the next) and with every layer of abstraction, the quality (and efficiency) of that message degrades.

### Collaboration doesn't have to be an O(n<sup>2</sup>) problem

The easiest way to ensure everyone can understand the how and why is to adopt systems that, through their daily operation, ensure such context is automatically and readily available to others. At GitHub, historically adopting workflows from the open source community, we often see this in the form of working transparently within the context of GitHub issues.

Lets take a typical software development workflow as an example: bugs and features are captured as detailed [problem statements](https://ben.balter.com/2018/07/16/problems-not-solutions/) and are prioritized by managers in a curated backlog. Developers pick issues off the top of that queue, open up a pull request with their proposed solution (and a reference back to the associated issue), and it is reviewed, refined, and ultimately merged. Six months or a year later, others interested in the decisions made can use the changed file's history, git blame, or issue search to find exactly who made, what change, and why, as if they were party to the change contemporaneously.

That organically transparent process is not limited to changes to code. At GitHub we use that flow to propose, discuss, and ultimately implement changes to architecture, policy, programs, process, documentation, and ironically, how we work.

* Collaborative reorg example 


### Showing your work

I admit, as GitHub has grown, I’ve fallen astray and am guilty of starting a Slack DM, Google Doc, or Zoom meeting, tempted by the siren song of near-term efficiency that quickly hashing out a problem in private offers.

There's nothing wrong, per se, with using opaque-to-others tools like chat or Zoom (FWIW, they're [not my preferred workflow](https://ben.balter.com/2020/08/14/tools-of-the-trade/), and in fact, some times they are the best tools for the discussion, but if you choose to use such tools, you must then take on the burden of communicating the decision to those affected.

For many, I suspect that involves simply communicating "we decided X". For larger changes this might involve coordinate communications and roll out plans, but at the core, that's what's generally required for a chance to take effect, and could be as simple as mentioning something during a team all hands or other in-person meeting.

Great leaders, on the other hand, hold themselves and others accountable for showing their work in a more durable medium afer the fact. At a high level, "showing your work" means capturing who made what decision and when, along with a detailed, but concise description of why and how that decision was made. 

Beyond the fact that injecting transparency into otherwise opaque workflows take an affirmative step on the part of those involved, why then, don't more leaders show their work?

### Transparency as a liability vs. transparency as an asset

There are two ways to think of the transparency afforded by open systems: some think of this transparency as a liability and others think of transparency as an asset.

As a liability, transparency in decision making exposes you to the risk of being "wrong", or at the very least, being subject to the fear, uncertainty, and doubt, that at any moment you may be briggaded with well-intioned, but ultiamtely both time-consuming and difficult to answer questions.

As an asset, transparency, is the belief that collaborative decision making leads to the best outcomes. In theory, that unwanted criticism you must refute becomes early validation and feedback. In practice, those affected will appreciate the transparency, but ultimately you will often find yourself struggling for engagement on most decisions, with said pitchfork brigade never materializing.

I've been responsible for and participated in thousands of decisions at GitHub over the years. I can think of exactly ___ for which transparency ___.

### How to ensure you are showing your work

CALL TO ACTION

* Not just what, but how, and why
* Show alternatives evaluated and why they weren’t right
* Socialize how decisions should be made
* Resolve ambiguity for those implementing
* 
