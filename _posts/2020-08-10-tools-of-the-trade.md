---
title: "Tools of the trade: How I communicate at GitHub"
description: How I work and how I think about the tools we use to communicate at GitHub
---

I've [long said](https://twitter.com/benbalter/status/1236050708996243456), "how we work is as important as what we work on". Here's how I work and how I think about the tools we use to communicate at GitHub:

### First principles

Regardless of the tools you use, here are a few overarching principles that should guide your choices:

* Default to open, visible, and discoverable.
* Prefer asynchronous, unless the conversation requires higher-fidelity.
* Use systems that naturally capture and expose process. If you don't, memorialize after the fact.
* Use the best tool for the job, but favor to GitHub.
* Optimize for discoverability. Solve for "fewer places to look".
* Err on the side of over-communicating.
* Write things down and capture the "why".
* [Everything should have a URL](https://ben.balter.com/2015/11/12/why-urls/).

Now, as for when to use specific tools:

### Issues

* **When**: Task tracking. Think of issues as team- or organization-wide TODOs. Issues should be the default unless another medium is more appropriate.
* **Who**: Directly responsible parties and extended stakeholders
* **Why**: Issues naturally capture and expose process, can easily loop in additional stakeholders, create opt-out-able notifications, cross link to other issues for ease of discoverability, and can be closed out once the required action is complete to increase the visibility of in-flight efforts.

### Discussions
 
* **When**: Long-lived conversations that don't involve an open/closed state. This can be Q&A, internal updates, or social discussions. you can even treat discussions like an internal blog.
* **Who**: Entire teams or the entire organization.
* **Why**: Many of the benefits of issues, except they don't have an open/closed state and thus are more suited for ongoing discussions or blog-like posts with comments.

### Documentation (Git)

* **Who**: Team, stakeholders, the entire organization
* **When**: Project plans, technical overviews, ADRs, team process, etc. - anything non-ephemeral and without an open/closed state
* **Why**: Discoverability, auditability, permanence.
  
### Google Docs

* **When**: Early ideation and definition (or in-meeting note taking), with the goal of ultimately memorializing the document in an issue or pull request for visibility and reach. Think of it as "top-of-the funnel collaboration".
* **Who**: Small group of trusted stakeholders (grant access liberally to avoid contributor friction)
* **Why**: Quick iteration cycles, collaborative editing

*Caveat emptor: Google Docs discovery is poor, as is understanding the state of a document once you discover it. Use Google docs early in an idea's lifecycle, but burn it down as soon as possible and replace the content with a link to the canonical source to avoid confusion.*
 
### Google Slides

* **When**: Briefings, proposals, and updates that summarize information captured by other means (e.g., Issues, Git). 
* **Who**: Leadership
* **Why**: Short-form and easily digestible. Be sure to memorialize in-person decisions after the fact.

### Chat

Generally, use chat for informal office communication, community comradery, water cooler talk, tactical coordination, and to amplify messages communicated elsewhere, not as a canonical source of truth. Chat is useful but it's ephemeral and provides no guarantee of delivery, especially across timezones where it can be unintentionally exclusive. Treat chat as transient and hold each other accountable for writing important things down more durably. Specifically:

#### 1:1 DMs

* **When**: Urgent needs, conversations not appropriate for any other channel
* **Who**: Peers, manager, directs
* **Why**: Sometimes a private side-conversation is necessary, but to ensure context is surfaced, it should be the exception, not the default.

#### Small group DMs

* **When**: Only if absolutely necessary for short-lived and ad-hoc coordination. 
* **Who**: Peers
* **Why**: While immediately convenient, small group DMs don't allow you to add additional recipients, can't be descriptively named, push all messages by default, and are difficult to recall after the fact. Prefer (named) private or public channels whenever you can.

#### Private channels

* **When**: Conversations not appropriate for public channels - social, sensitive, frank, or any time you want to encourage participants to share freely, but aren't concerned with capturing context or excluding others.
* **Who**: Teams, affinity groups, etc.
* **Why**: Informal, ephemeral, and uncensored conversations not appropriate for public channels

#### Public (to the company) channels

* **When**: Questions, updates, coordination, and to amplify messages communicated elsewhere. This should be your default method of chat unless DMs or a private channel are required.
* **Who**: Team, stakeholders, the entire organization.
* **Why**: Discoverability, passive awareness, and learning.

### Video chat and meatspace

#### In-person 1:1s

* **When**: Regular checkins, manager 1:1s, catching up, resolving conflict, etc.
* **Who**: Peers, manager, directs
* **Why**: [Human conversations deserve human faces](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#2-dont-underestimate-high-fidelity-mediums).

#### In-person meetings

* **When**: Regular syncs, resolving complex issues, ideation, project kickoffs, social time, etc.
* **Who**: Teams, extended stakeholders, peers.
* **Why**: Some conversations require higher fidelity than issues or chat can offer. Be sure to have an agenda and goals. Memorialize decisions after the fact in a more-permanent medium.

At least, that's how I communicate at GitHub. A huge hat tip to @corywilkerson, who's words inspired (and in some cases compromise) this post. Do you use these tools differently? Find other tools get the job done better? Let me know in the comments below.