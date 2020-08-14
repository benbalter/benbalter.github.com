---
title: "Tools of the trade: How I communicate at GitHub (and why)"
description: How I work and how I think about the tools we use to communicate at GitHub
---

One of my favorite "laws" is [Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law), an adage that organizations will design systems that mirror their communication structure. As I've [long said](https://ben.balter.com/2015/09/21/open-source-behind-the-firewall/#how-you-work-is-as-important-as-what-you-work-on), "how you work is as important as what you work on":

> The tools you choose matter. Tools are more than mere convenience. Tools force teams into particular workflows, workflows that constrain not just how software is produced, but what software is possible. It’s no coincidence then that the open source community, in order to produce the type of software it produces, adopts vastly different tools than most enterprise developers have available to them at their office.

Many organizations are dogmatic about how they communicate and the tools they use, some purposefully, some out of habit or default. But even among opinionated organizations, so many fail to communicate _why_ they choose to work the way they do. This missed connection can lead to somewhat of a [cargo cult mentality](https://en.wikipedia.org/wiki/Cargo_cult) in which tools are (mis)used, often superficially, solely because they've observed others use them, and without appreciating what value they bring to the organization. Understandably, when those opaque-to-the-user tools introduce friction or bring their own learning curve, it's easy for frustration (and skepticism) to result.

### First principles

If tools constrain our communication patterns and thus the outcomes they produce, before choosing a tool for a given job, you need to first understand what outcomes you want the system to optimize for. Every organization is different, but here are some guiding principles for how I believe organizations best communicate, principles largely based on [GitHub's historic communication patterns](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/) (and before that, the open source community as a whole):

* Default to [open](https://ben.balter.com/2015/11/18/tools-to-empower-open-collaboration/#1-open).
* [Prefer asynchronous](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#1-prefer-asynchronous-communication), unless the conversation requires higher-fidelity.
* Use systems that [naturally capture and expose process](https://ben.balter.com/2015/11/18/tools-to-empower-open-collaboration/#2-captures-and-exposes-process). If you don't, memorialize outcomes after the fact.
* Use the best tool for the job, but favor to GitHub.
* Optimize for discoverability. Solve for "fewer places to look".
* Err on the side of [over-communicating](https://ben.balter.com/2017/05/23/seven-ways-to-consistently-ship-great-features/#1-over-communicate).
* Write things down and capture the "why".
* [Everything should have a URL](https://ben.balter.com/2015/11/12/why-urls/).
* [Practicality beats purity](https://ben.balter.com/2015/11/18/tools-to-empower-open-collaboration/#practicality-beats-purity)

### The tools I use (and why I use them)

Here's how I think about the tools we use to communicate at GitHub: **What** tools I use, **when** I use them, **who** I use them to collaborate with, and most importantly, **why** I believe you should use that particular tool for the job.

#### Issues

* **When**: Task tracking. Think of issues as team- or [organization-wide TODOs](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#7-issues-are-organization-wide-todos). Issues should be the default unless another medium is more appropriate.
* **Who**: Directly responsible parties and extended stakeholders
* **Why**: Issues naturally capture and expose process, can easily loop in additional teams, create opt-out-able notifications, cross link to other issues for ease of discoverability, and can be closed out once the required action is complete to increase the visibility of in-flight efforts. They’re not perfect, but as GitHub's most common medium, issues start conversations, allow stakeholders to opt-in to additional context, and create permanent, searchable, and linkable records of who made what decision when and why. 
* **How**: [Keep discussions logically distinct](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#9-keep-discussions-logically-distinct). When opening an issue (or commenting on one), [be sure to offer sufficient context](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#3-nobody-gets-fired-for-buying-ibm-opening-an-issue).

#### Projects

* **When**: Project tracking and task-level coordination
* **Who**: Entire team, occasionally extended stakeholders
* **Why**: If issues track state at the task level, projects track state at the project level - what's on deck, what's in flight, what's done, who's working on what, etc. When using issues (instead of cards) to track work, projects have all the benefits of issues, but offer a perspective one level of abstraction up.

#### Discussions
 
* **When**: Long-lived conversations that don't involve an open/closed state. This can be Q&A, internal updates, or social discussions. you can even treat discussions like an internal blog.
* **Who**: Entire teams or the entire organization.
* **Why**: Many of the benefits of issues, except they don't have an open/closed state and thus are more suited for ongoing discussions or blog-like posts with comments that live outside day-to-day workstreams.

#### Documentation

* **Who**: Team, stakeholders, the entire organization
* **When**: Project plans, technical overviews, [ADRs](https://github.blog/2020-08-13-why-write-adrs/), team process, how-to's, company policies, etc. - anything non-ephemeral and without an open/closed state
* **Why**: Discoverability, auditability, permanence, and ease of contribution.
* **How**: Tracked in Git as Markdown in the most-logical repository. [If you can't diff it, don't use it](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#13-if-you-cant-diff-it-dont-use-it).

#### Real-time collaborative editing

*Caveat emptor*: Google Docs (and Office) discovery is poor, as is understanding the state of a document once you discover it. Use Google docs (or Office) early in an idea's lifecycle, but burn it down as soon as possible and replace the content with a link to the canonical source (see above) to avoid confusion. Specifically:

###### Docs

* **When**: Early ideation and definition (or in-meeting note taking), with the goal of ultimately memorializing the document in an issue or pull request for visibility and reach. Think of it as "top-of-the funnel collaboration".
* **Who**: Small group of trusted stakeholders (grant access liberally to avoid contributor friction)
* **Why**: Quick iteration cycles, collaborative editing
 
###### Slides

* **When**: Briefings, proposals, and updates that summarize information captured by other means (e.g., Issues, Git). 
* **Who**: Leadership
* **Why**: Short-form and easily digestible. Be sure to memorialize in-person decisions after the fact.

#### Chat

Generally, use chat for informal office communication, community comradery, water cooler talk, tactical coordination, to amplify messages communicated elsewhere, and other time-sensitive matters that are best handled semi-synchronously, but **not** as a primary means of decision making or a canonical source of truth (due to its lack of discoverability and permanence). If important conversations do occur via chat, memorialize them in issues. Unless it’s sensitive, prefer shared channels over private DMs for sake of discoverability, shared responsibility, and creating a shared team context. Chat is useful but it's ephemeral and provides no guarantee of delivery, especially across timezones where it can be unintentionally exclusive. Treat chat as transient and hold each other accountable for writing important things down more durably. Specifically:

###### Public (to the company) channels

* **When**: Questions, updates, coordination, and to amplify messages communicated elsewhere. This should be your default method of chat unless DMs or a private channel are required.
* **Who**: Team, stakeholders, the entire organization.
* **Why**: Discoverability, passive awareness, and learning.

###### Private channels

* **When**: Conversations not appropriate for public channels - social, sensitive, frank, or any time you want to encourage participants to share freely, but aren't concerned with capturing context or excluding others.
* **Who**: Teams, affinity groups, etc.
* **Why**: Informal, ephemeral, and uncensored conversations not appropriate for public channels

###### 1:1 DMs

* **When**: Urgent needs, conversations not appropriate for any other channel
* **Who**: Peers, manager, directs
* **Why**: Sometimes a private side-conversation is necessary, but to ensure context is surfaced, it should be the exception, not the default.

###### Small group DMs

* **When**: Only if absolutely necessary for short-lived and ad-hoc coordination 
* **Who**: Peers
* **Why**: While immediately convenient, small group DMs don't allow you to add additional recipients, can't be descriptively named, push all messages by default, and are difficult to recall after the fact. Prefer (named) private or public channels whenever you can.

#### Video chat and meatspace

###### In-person 1:1s

* **When**: Regular checkins, manager 1:1s, catching up, feedback, resolving conflict, etc.
* **Who**: Peers, manager, directs
* **Why**: [Human conversations deserve human faces](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#2-dont-underestimate-high-fidelity-mediums).

###### In-person meetings

* **When**: Regular syncs, working through complex issues, ideation, project kickoffs, retros, social time, etc. Meetings shouldn't be used for status updates, to force work, or any task that's best handled asynchronously. [Reserve high-fidelity mediums for the types of conversations that benefit from being face-to-face or ephemeral](https://ben.balter.com/2015/11/18/tools-to-empower-open-collaboration/#4-asynchronous-decision-making).
* **Who**: Teams, extended stakeholders, peers.
* **Why**: Some conversations require higher fidelity than issues or chat can offer. Be sure to have an agenda and goals. Memorialize decisions after the fact in a more-permanent medium. 

#### Email

* **When**: Use e-mail as a last resort or when necessary with external parties.
* **Who**: Customers, partners, and other external stakeholders
* **Why**: [Email is a terrible, terrible collaboration medium, and an even worse mechanism for storing organizational knowledge](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#11-secrets-secrets-are-no-fun).

At least, that's how I communicate at GitHub, and I often see those communication patterns reflected in the products my teams produce. Why does your organizations (or team) communicate the way it does? Are those principles written down? Do the tools you use reflect the outcomes you'd like to drive?

*A huge hat tip to @corywilkerson, whose words inspired (and in some cases comprise) this post.* 