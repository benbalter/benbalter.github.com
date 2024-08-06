---
title: Leaders show their work
description: Absent working within systems that naturally capture and expose process, transparency takes effort. Leaders should hold one another accountable for spending the additional cycles to show their work through communicating not only what decision was made, but also how the decision was made, and why.
---

A number of years ago, I [described the value of memorializing decisions through URLs](https://ben.balter.com/2015/11/12/why-urls/):

> [URLs] provides a single, incontrovertible source of truth for the organization’s intentions, and equally important, exposes the reasoning behind the decision, reducing the tendency for top-down decisions to be communicated as “because I said so”.

That’s still true today, but there’s some critical nuance not sufficiently captured in that excerpt: a URL is necessary, but not sufficient to communicate organizational intentionality. For an organization to reap [the benefits of transparency](https://ben.balter.com/2015/11/12/why-urls/#the-value-of-giving-concepts-urls), its leaders must not only communicate via URL *what* decisions were made, but must also explain *why* they made those decisions and *how*. There are two ways to do that: [adopt systems that naturally capture and expose process](https://ben.balter.com/2015/11/18/tools-to-empower-open-collaboration/), or absent those systems, leaders must hold one another accountable for spending the additional cycles to *show their work*.

## The challenges of decision making at scale

As teams scale, traditional approaches to decision making force a trade-off between transparency and efficiency:

If you're working solo, you enjoy the benefits of absolute transparency and absolute efficiency. You know everything you know, and there's no added cost for sharing that information with yourself. As the number of people solving a problem grows, guarantees of both transparency and efficiency often become exponentially more expensive.[^2]

To overcome these limitations of scale, many organizations logically add a management layer, [assigning to managers the responsibility of coordinating and aligning decisions across teams and business units](https://ben.balter.com/2012/12/16/deprecate-management/). Once a decision is made, managers are also responsible for communicating necessary information to those affected.[^1] Like a game of telephone, some fidelity is naturally lost in that abstracted process[^3] and with every layer of abstraction, the quality (and efficiency) of that message transmission degrades.

## Collaboration doesn't have to be an O(n<sup>2</sup>) problem

The easiest way to ensure everyone can understand the how and why of a decision is to adopt systems that, through their daily operation, ensure such context is automatically and readily available to those who might want it (and explicitly not only those who presently need it). At GitHub, historically adopting workflows inspired by the open source community, we often see this in the form of working transparently within the context of GitHub issues and pull requests.[^4]

That organically transparent process is not limited to changes to code. At GitHub we often use that flow to propose, discuss, and ultimately implement changes to architecture, policy, programs, process, documentation, and ironically, how we work. The idea being, that even though working transparently may require additional effort on the part of the moving party initially, doing so benefits the organization in the long run, and does so in a manner that far outweighs any short-term costs. This learned reality short circuits that trade-off between transparency and efficiency that limits traditional approaches to decision making through managerial abstraction.

## Near-term convenience creates long-term communications debt

I admit, as GitHub has grown, I’ve fallen astray and am guilty of starting a Slack DM, Google Doc, or Zoom meeting, tempted by the siren song of near-term efficiency that quickly hashing out a problem in private offers. Similar to how quick technical fixes often saddle an organization with ongoing technical debt, so too can communication shortcuts be an avoidable source of ongoing communications debt.

There's nothing wrong, per se, with using opaque-to-others tools like Slack, Google Docs, or Zoom, and in fact, [some times they are the best tool for the job](https://ben.balter.com/2020/08/14/tools-of-the-trade/), but all too often in reaching for such tools, we neglect to account for the organizational cost we incur in needing to subsequently, manually, and thoughtfully communicate outcomes to all those affected over time.[^5] Such seemingly innocuous, but unintentionally near-sighted and exclusionary forms of communication fail to budget for the true cost that those short-term efficiencies accrue.

As the ones with that missing context, leaders sometimes naively or inadvertently assume that all that's required for a change to take effect is to communicate the thing that's changed, but humans are not servers. Unlike deploying a change to a codebase, a diff isn't sufficient to truly realize what's intended. Engaged humans rightfully seek to understand how and why the change came to be and often want to double check their leaders' work to fully understand how it impacts their own. I've often used the phrase "being treated as an adult" to describe the culture this creates, but it goes beyond that.

## The value of showing your work

Those affected by a decision may naturally question otherwise unanswerable-to-them questions, but at the end of the day, transparent leadership is not only a sign of trust and respect, it's also a sign of great leadership. Great leaders hold themselves and those they work with accountable for showing how decisions came to be, ideally in a durable medium. At a high level, "showing your work" means capturing who made what decision and when, along with a detailed, but *concise* description of why and how that decision was made. Showing your work offers organizations and teams a number of advantages:

* **Captures institutional knowledge** - When you're purposeful about where and how you share context, you alleviate the need for “you had to be there” and “go ask Susan"-type inquiries. This allows those implementing the change to resolve ambiguity in instruction, and also allows others to continue the work as circumstances evolve, not to mention, process artifacts naturally capture what other alternatives were considered, allowing those who follow to more easily stand on the shoulders of those before them.
* **Empowers others to learn through observation** - What's routine to you is likely novel to someone in another role or at another level of seniority. There's a reason junior developers regularly observe code reviews and participate in pull requests - it's one of the primary ways to learn about the codebase. When other types of knowledge work is transparent, you offer opportunities for the next generation of leaders to learn and grow through passive observation and lightweight participation.
* **Socializes organizational culture and values** - An organization's culture and values is comprised in large part of [the underlying assumptions](https://ben.balter.com/2015/08/12/the-zen-of-github/) that its members fall back on as they resolve ambiguity in pursuit of the organization’s mission. Should we be iterative or precise? Process driven or outcome oriented? Do we serve end users or execs? Showing your work allows you to normalize how your organization approaches decision making, and thus makes explicit those otherwise unwritten assumptions.
* **Fuels engagement** - I'll take a passionate (even if critical) team over a disinterested team any day. Transparency offers a sense of agency, situational awareness, and overall engagement that fosters a culture of thoughtful dialog and encourages organization-wide collaborative improvement over time. Showing your work is akin to the traditional comment box in the break room, but taken to the next level in terms of opportunities for participation.
* **Keeps the bar high** - Scientists have reproducibility. Mathematicians have proofs. Developers have open source. Whatever the method, showing one's work establishes expectations around justification, thoroughness, and accountability that sets and maintains a high standard for decision making within an organization.

Beyond the fact that injecting transparency into otherwise opaque workflows takes an affirmative, and often time-consuming step on the part of those responsible, why then, do so many leaders so often fail to show their work?

## Transparency as a liability vs. transparency as an asset

There are two ways to think of the transparency afforded by open systems: some think of this transparency as a liability and others think of transparency as an asset:

* As a **liability**, transparency in decision making exposes you to the risk of being (or appearing) "wrong", or at the very least, being subject to the fear, uncertainty, and doubt (FUD), that at any moment you may be briggaded with well-intioned, but ultimately both time-consuming and difficult to answer questions. In my mind, this mindset is analogous to software's [equivalent FUD around the insecurity of open source](https://ben.balter.com/2014/09/22/open-source-is-not-insecure/). Yes, decisions have had poor roll outs in the past, just as some open source projects have had vulnerabilities, but just as more eyes render all bugs shallow, avoiding security (or in this case management) through obscurity, produces better outcomes when paired with a healthy culture of collaboration.
* As an **asset**, transparency is the belief that collaborative decision making leads to the best outcomes. In theory, that unwanted criticism you must address becomes early validation and feedback that allows you to fine tune and course correct. In practice, those affected will appreciate the transparency for the reasons described above, but often you will find yourself struggling for engagement on the vast majority of non-[controversial decisions](/2016/05/11/moderating-a-controversial-pull-request/). I've been responsible for and participated in thousands of decisions at GitHub over the years and I can't think of a single one for which up front transparency did not result in a better outcomes (even when it came with those near-term transaction costs).

## How to ensure you are showing your work

The easiest way to show your work is to quite literally [prefer asynchronous communication](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#1-prefer-asynchronous-communication) over real-time or just-in-time formats, even when it feels like doing so might not be the most convenient format for you in the moment. It's a matter of optimizing your communication for the recipient, not for the sender, which may be a shift for some communications cultures.

There's a lot you get for "free" from such naturally transparent tools, but async is not always going to be the best option for every situation. If you are striving to inject transparency after the fact, here are a few ways to hold yourself and others accountable for showing your work:

* Start by stating the problem you're trying to solve and why
* Enumerate what your goals were and what principles you followed
* Communicate not just what, but how, and why the decision came to be
* Link to any source materials or prior art that you used to make the decision
* Include what alternatives you evaluated and why they were ultimately dismissed
* If it's not apparent, explain who was involved with the decision along with their roles
* Set expectations around opportunities for feedback, improvement, or participation, if any
* Explain the state of the decision (for example, final, proposed), and when it will be revisited, if ever
* Distill meeting recordings and chat transcripts to create a concise and easily consumed historic record
* Avoid using "best practice", "industry standard", or "parent company/former employer does X" as a justification
* Establish clear timelines and provide regular updates to avoid the perception that lack of visibility is lack of movement

## Conclusion

Absent working within systems that through their day-to-day use captures and exposes process, transparency takes effort, effort well worth the cost in the long run. When necessary, leaders should hold one another accountable for spending the additional cycles to show their work through communicating not only what decision was made, but also how the decision was made, and why. Showing one's work not only captures historic context, but also socializes organizational culture and values, helps grow the next generation of leaders, fuels engagement and continuous improvement, and establishes and maintains a high standard for decision making for the entire organization.

While I still agree [everything should have a URL](https://ben.balter.com/2015/11/12/why-urls/), how we go about thoughtfully creating and curating the content within those URLs - rich with high-value historic context, a gift for others and our future selves - matters more than the fact that the URL itself exists.

{% include_cached github-culture.html %}

[^1]: I use the term "management" here broadly. Yes, this could be a people manager, but the concept applies equally to product managers, program managers, and individual contributors in leadership roles. At GitHub, we have the concept of directly responsible individual (DRI), a role regardless of position within the organization for which visibility of work is an explicit expectation.

[^2]: A small team may experience minor communication costs in terms of say weekly meetings and daily standups, but as teams and companies grow, the cost of traversing that network layer adds up, rendering absolute participation in decision-making practically impossible.

[^3]: Since it requires a human [extract, transform, and load](https://www.ibm.com/cloud/learn/etl) operation to shuttle information from one reporting structure to the next

[^4]: Let's take a typical software development workflow as an example: bugs and feature requests are captured as detailed [problem statements](https://ben.balter.com/2018/07/16/problems-not-solutions/) and are prioritized transparently by managers in a curated backlog. Developers pick issues off the top of that queue, open up a pull request with their proposed solution (along with a reference back to the associated issue and an @mention to the responsible team), and the changes are reviewed, discussed, iterated on, and ultimately merged, all available for anyone in the organization (or in the case of open source, the world) to see. Six months or a year later, others interested in the decisions made can use the changed file's history, `git blame`, or issue search among other tools to find exactly who made what change and why, as if they were party to the decision contemporaneously.

[^5]: For some, communicating a decision can be as straightforward as stating "we decided X" or "you must now do Y". This could be as simple as an email, Slack message, or brief update at the top of an in-person meeting, but at their core, these efforts all too often focus on the "what", even when the "why" or "how" isn't otherwise apparent to outsiders (and arguably given the long-tail of history, these are the more important bits of the decision worth preserving).
