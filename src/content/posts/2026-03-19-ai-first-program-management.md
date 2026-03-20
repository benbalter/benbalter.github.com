---
title: "AI-first program management: amplifying judgment, not replacing it"
description: "AI-augmented program management is the natural evolution of async-first and engineering-inspired workflows — amplifying human judgment, not replacing it."
---

Picture this: it's Monday morning, and you've got six ongoing programs across four teams spanning three time zones. Over the weekend, a dozen threads moved forward, two risks materialized, and someone quietly changed the scope of a critical deliverable in a comment buried three levels deep. Your job is to synthesize all of that into a coherent picture before your 10 AM leadership sync.

This is the reality of modern program management — and it's exactly the kind of work that AI is poised to transform.

## From async to AI-augmented

A few years ago, I wrote about the nine core things a program manager does on any given day.[^1] Shortly after, I made the case for why teams should default to asynchronous communication[^2] — written, durable, discoverable artifacts over synchronous meetings.[^6] Then I argued that managers should use the same tools engineers use — issues, pull requests, project boards — to plan and track their own work.[^3] Most recently, I explored how AI agents are extending the same patterns of transparency and code review that made open source successful.[^4]

These ideas aren't disconnected. They're an evolution.

If the shift from synchronous to async was about decoupling communication from presence, and managing like an engineer was about applying developer workflows to leadership, then AI-first program management is the next logical step: using AI to amplify the judgment, pattern recognition, and relationship work that makes program managers effective.

The through-line is the same principle I've been writing about for years: make work visible, make it durable, and reduce the friction between having an idea and acting on it. AI doesn't change that philosophy. It accelerates it.

## AI across the PM toolkit

Let me walk through the core program management responsibilities and show what changes — and what doesn't — when AI enters the picture.

### Communication, coordination, and facilitation

Program managers are professional context-switchers. You spend your day translating between engineering teams, product managers, designers, and executives — each with different mental models and vocabulary. It's an O(n²) communication problem, and it only gets worse as the organization grows.

AI doesn't eliminate that complexity, but it compresses the information-shuttling work. An LLM can summarize a 200-message thread into a paragraph. It can draft a status update that translates "we're blocked on a schema migration that requires a backward-compatible rollout strategy" into language an executive actually cares about. It can take meeting notes and extract the three things that matter from the twenty that were discussed.

The PM still decides *what* to communicate and *when* — that's judgment.[^5] But the mechanical work of drafting, reformatting, and distributing information across audiences? That's exactly the kind of task AI handles well.

### Capture and track work

One of a PM's most underappreciated responsibilities is ensuring that work doesn't fall through the cracks. Every conversation, decision, and commitment needs to land somewhere trackable — usually an issue or a project board.

AI can auto-generate issues from meeting transcripts. It can scan Slack threads and surface commitments that never made it into a tracker. It can flag stale issues that haven't been updated in weeks, or detect when a project board is drifting from reality. Think of it as a continuous reconciliation process — a linter for your program's state, catching drift between what people *said* they'd do and what the artifacts actually reflect.

This matters because the biggest risk in program management isn't that something goes wrong. It's that something goes wrong *and nobody notices* until it's too late.

### Risk identification and mitigation

Speaking of risk — PMs are supposed to see around corners. In practice, that often means reading a lot of threads, attending a lot of standups, and developing an intuition for when something *feels* off.

AI can augment that intuition with pattern recognition at scale. It can analyze velocity trends across repositories, flag pull requests that have been open too long, identify dependencies that no human mapped, and surface the kinds of cross-project risks that are invisible when you're looking at one team's board in isolation. Imagine catching a staffing conflict between two programs before either PM even realizes they're competing for the same engineer's time — because the AI noticed overlapping assignments across project boards.

I'm not suggesting AI replaces the experienced PM's gut feeling that "this one's going to slip." But it can surface the signals earlier, giving you more time to act. The best risk management has always been about buying time — and AI buys you more of it.

### Reporting up and across

Let's be honest: nobody became a program manager because they love writing weekly status reports. And yet, clear upward reporting is one of the highest-leverage things a PM does. It's how leadership knows where to pay attention and where to stay out of the way.

AI can draft these reports from project activity — commits, merged PRs, issue closures, comment threads. Instead of spending Friday afternoon manually assembling a narrative from memory and half-updated boards, you start with an AI-generated draft that reflects what actually happened, then layer on your interpretation and recommendations.

The key word there is *start*. An AI-generated status report is a first draft, not a finished product. The PM's job is to add the "so what" — the strategic interpretation that turns a list of activities into insight. AI gives you the *what*. You provide the *why it matters* and the *what to do about it*.

### Relationship management

I've described program management as fundamentally a relationship business — you're making regular deposits to the social capital bank long before you need to make a withdrawal.[^1] AI doesn't replace that. You can't automate trust.

But AI can help you *maintain* relationships at scale. It can remind you that you haven't checked in with a particular stakeholder in two weeks. It can surface context before a meeting — "last time you spoke with this team, they raised concerns about the timeline for the API migration." It can help you draft a thoughtful response to a tricky message when you're running low on cognitive bandwidth at 4 PM on a Thursday.

The human work — building rapport, reading a room, knowing when someone's frustrated versus when they're genuinely blocked — stays firmly in the PM's domain. AI just helps you show up more prepared and more responsive than you could be on your own.

### Consensus and conflict resolution

Driving consensus across teams with competing priorities is among the hardest things a PM does. It requires understanding not just each team's *position*, but their *interests* — the underlying needs that drive those positions.

AI can help by synthesizing different viewpoints, drafting proposals that incorporate multiple perspectives, and suggesting compromises based on stated constraints. Think of it like using AI to write the first draft of an RFC that reflects everyone's input — you still need to facilitate the conversation, but you're starting from a more complete picture than any single person could assemble manually.

Where AI falls short is in reading the political dynamics. Understanding that Team A's objection is really about being burned in a previous launch, or that a particular VP's silence means something different than a junior engineer's silence — that's pattern recognition of a deeply human kind. No model is going to learn the org chart's shadow topology from a prompt.

### Boundaryless engagement

One of the program manager's superpowers is the ability to engage across boundaries — teams, organizations, time zones — without being constrained by reporting lines. The cost of this superpower is context-switching. You might go from a security review to a design critique to a vendor negotiation in the span of an hour.

AI dramatically lowers the cost of those context switches. It can brief you on a project you haven't touched in a week. It can summarize what happened in a channel while you were focused elsewhere. It can help you draft a message calibrated for an audience you don't interact with daily.

If async communication decoupled work from time zones,[^2] AI decouples engagement from the cognitive overhead of maintaining context across a dozen concurrent workstreams. It's like a working memory upgrade for your entire portfolio.

### Doing what needs to be done

The final — and perhaps most important — PM responsibility is the catch-all: doing whatever needs to be done to keep a program moving forward. Sometimes that means writing a missing spec. Sometimes it means scheduling a meeting nobody wants to own. Sometimes it means reformatting a spreadsheet at 9 PM because a VP asked for a different view of the data.

AI is exceptional at this long tail of tasks. Drafting documents, cleaning up data, formatting reports, writing follow-up emails, creating meeting agendas from prior action items — all the mundane-but-necessary work that eats a surprising percentage of a PM's week. Offloading these tasks means more time for the work that actually requires your judgment, empathy, and institutional knowledge.

## What doesn't change

It would be easy to read all of this and conclude that AI is about to make program managers obsolete. I'd argue the opposite.

The responsibilities haven't changed. Communication, risk management, relationship building, consensus-driving — these are still the job. What's shifted is the ratio of *information processing* to *judgment* in a PM's day. AI handles more of the former so you can focus more on the latter.

The things AI can't do are precisely the things that make great PMs great: reading a room, building trust over months, knowing when to push and when to back off, navigating organizational politics, and making the hard call when the data is ambiguous. These are deeply human skills, and they become *more* valuable as AI handles the routine work, not less. When everyone has access to the same AI tools, the differentiator is the human wielding them.

## What changes for PMs

That said, AI-first program management does require new muscles — or at least, new applications of existing ones.

**Prompt craft matters.** The quality of what AI produces depends entirely on the quality of what you ask for. PMs who can write clear, specific prompts — essentially, good requirements — will get dramatically better results than those who can't. It turns out that years of writing crisp issue descriptions and well-defined acceptance criteria is excellent training for working with LLMs. Good requirements have always been a PM superpower. Now they're a superpower twice over.

**Knowing when *not* to use AI is as important as knowing when to use it.** A sensitive personnel conversation, a politically charged escalation, a message to a stakeholder who's having a rough week — these require a human touch that AI can't fake. Developing judgment about when AI helps versus when it gets in the way is a skill in itself, and it's one that's hard to teach in the abstract.

**Verification becomes a core competency.** AI will confidently summarize a thread and miss the most important nuance. It'll draft a status report that's 90% accurate and 10% dangerously misleading. PMs need to be skilled editors and fact-checkers, not just consumers of AI output. The role shifts from *author* to *editor-in-chief* — you set direction, review drafts, and ensure quality before anything ships.

**AI fluency is table stakes.** Just as PMs were expected to be comfortable with project management tools, version control, and whatever collaboration platform their teams use, they'll be expected to work fluently with AI assistants. Not as a novelty, but as a core part of the daily workflow — the way we already think about Slack or email or GitHub Issues.

## The PM as orchestra conductor

Here's the mental model I keep coming back to: the program manager as orchestra conductor.

A conductor doesn't play every instrument. They don't play *any* instrument during the performance. But they're essential — they set the tempo, bring in the right sections at the right time, interpret the score, and turn individual performances into a coherent whole.

AI agents are new instruments in the orchestra. They can play fast, they can play consistently, and they can handle parts that used to require a human musician. But someone still needs to read the score, understand the audience, and make the hundred small decisions that turn a technically correct performance into something that actually moves people.

That someone is the program manager.

The shift from synchronous to async made program management more intentional. Managing like an engineer made it more transparent. AI makes it more leveraged. Each evolution builds on the last, and each one makes the human judgment at the center of the work more important, not less.

The job isn't going away. It's getting more interesting — because when you spend less time on information logistics, you can spend more time on the parts of the job that drew you to it in the first place: solving hard problems with smart people across organizational boundaries.

[^1]: [Nine things a (technical) program manager does](/2021/03/26/nine-things-a-technical-program-manager-does/)

[^2]: [Why you should work asynchronously](/2022/03/17/why-async/)

[^3]: [Manage like an engineer](/2023/01/10/manage-like-an-engineer/)

[^4]: [Agentic workflows and the future of software development](/2026/03/18/agentic-workflows/)

[^5]: [Leaders show their work](/2022/02/16/leaders-show-their-work/)

[^6]: [Meetings are a point of escalation, not the default](/2023/04/20/meetings-are-a-point-of-escalation/)
