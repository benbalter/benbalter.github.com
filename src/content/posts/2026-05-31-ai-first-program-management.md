---
title: "AI-first program management"
bookRelation: inspired
description: "AI-augmented program management is the natural evolution of async-first and engineering-inspired workflows — amplifying human judgment, not replacing it."
---

When I first wrote about [the nine things a program manager does](/2021/03/26/nine-things-a-technical-program-manager-does/), I didn't dwell on what the job actually feels like first thing on a Monday. The hardest part was always the scramble: a dozen threads that moved over the weekend, a risk or two that quietly materialized, and a critical deliverable whose scope someone changed in a comment buried three levels deep. All of it has to be synthesized into a coherent picture before the leadership sync, and the clock doesn't care how many tabs you have open.

That scramble hasn't gone away. But increasingly, I'm not doing it alone.

## From async to AI-augmented

The evolution makes sense in hindsight. I've argued that teams should [default to async communication](/2022/03/17/why-async/) — written, durable, discoverable artifacts over synchronous [meetings](/2023/04/20/meetings-are-a-point-of-escalation/). That managers should [use the same tools engineers use](/2023/01/10/manage-like-an-engineer/) — issues, pull requests, project boards — to plan and track their own work. And most recently, that [AI agents are extending the same patterns](/2026/03/18/agentic-workflows/) of transparency and code review that made open source successful.

If the shift from synchronous to async was about decoupling communication from presence, and managing like an engineer was about applying developer workflows to leadership, then AI-first program management is the next logical step: using AI to amplify the judgment, pattern recognition, and relationship work that makes program managers effective.

The through-line is the same principle I've been writing about for years: [make work visible](/2022/02/16/leaders-show-their-work/), make it durable, and reduce the friction between having an idea and acting on it. AI doesn't change that philosophy so much as run it faster.

## AI across the PM toolkit

Each core PM responsibility shifts when AI enters the picture — and some don't.

### Communication, coordination, and facilitation

Program managers are professional context-switchers. You spend your day translating between engineering teams, product managers, designers, and executives — each with different mental models and vocabulary.[^1] It's an O(n²) communication problem, and it only gets worse as the organization grows.

AI doesn't eliminate that complexity, but it compresses the information-shuttling work. Hand an LLM a 200-message thread and it'll hand back a paragraph. Feed it the engineering team's "we're blocked on a schema migration that requires a backward-compatible rollout strategy" and it'll translate that into language an executive actually cares about. Drop in a wall of meeting notes and it'll surface the three things that matter from the twenty that were discussed.

I've [written about how we communicated at GitHub](/2023/10/04/how-to-communicate-like-a-github-engineer/) — optimizing for clarity, discoverability, and low-context readers. AI handles the mechanical work of drafting and reformatting for different audiences. The editorial choices — *what* to communicate, what to emphasize, when to pick up the phone instead — stay with you.

### Capture and track work

One of a PM's most underappreciated responsibilities is ensuring that work doesn't fall through the cracks. Every conversation, decision, and commitment needs to land somewhere trackable — usually an issue or a project board.

Point AI at a meeting transcript and it'll auto-generate the issues. Point it at a month of Slack and it'll surface the commitments that never made it into a tracker, flag the issues nobody's touched in weeks, and notice when a project board has quietly drifted from reality. Think of it as a continuous reconciliation process — a linter for your program's state, catching the gap between what people *said* they'd do and what the artifacts actually reflect.

This matters because the biggest risk in program management isn't that something goes wrong. It's that something goes wrong *and nobody notices* until it's too late.

### Risk identification and mitigation

Speaking of risk — PMs are supposed to see around corners. In practice, that means reading a lot of threads, attending a lot of standups, and developing an intuition for when something *feels* off.

AI augments that intuition with pattern recognition at scale. It can analyze velocity trends across repositories, flag pull requests that have been open too long, identify dependencies that no human mapped, and surface cross-project risks that are invisible when you're looking at one team's board in isolation. I've called [transparent collaboration the andon of knowledge work](/2023/08/30/transparency-collaboration-is-the-andon-of-knowledge-production/) — pull the cord when something's off. AI is an andon that monitors every cord at once, catching a staffing conflict between two programs before either PM realizes they're competing for the same engineer's time.

AI won't replace the experienced PM's gut feeling that "this one's going to slip." But it surfaces the signals earlier, giving you more time to act. The best risk management has always been about buying time.

### Reporting up and across

Nobody became a program manager because they love writing weekly status reports. And yet, clear upward reporting is one of the highest-leverage things a PM does. It's how leadership knows where to pay attention and where to stay out of the way.

At GitHub, I built an internal tool called SnippetGPT that drafted these reports from a team's activity for the week — commits, merged PRs, issue closures, comment threads. It rolled all of that up into a first draft aimed at engineering leaders. Instead of spending Friday afternoon assembling a narrative from memory and half-updated boards, I started from something that reflected what actually happened, then layered on interpretation and recommendations.

The key word there is *start*. An AI-generated status report is a first draft, not a finished product. The PM's job is to add the "so what" — the strategic interpretation that turns a list of activities into insight. SnippetGPT gave me the *what*. I added the *why it matters* and the *what to do about it*. And once that draft existed, retargeting it for another audience — execs, a partner team, my own engineers — was nearly free: the same week's activity, recut for whoever needed to read it.

### Relationship management

Program management is fundamentally a relationship business. When I first moved into the TPM role, I remember watching senior PMs set up "just wanted to say hello" meetings and dismissing it as socializing on company time — until I realized that's exactly the point.[^2] You make regular deposits to the social capital bank long before you need a withdrawal. AI doesn't replace that. You can't automate trust.

But it can help you *maintain* those relationships at scale: a nudge that you haven't checked in with a particular stakeholder in two weeks, a bit of context surfaced before a meeting — "last time you spoke with this team, they raised concerns about the timeline for the API migration." A first pass at a thoughtful reply to a tricky message when you're running low on cognitive bandwidth at 4 PM on a Thursday.

The human work — building rapport, reading a room, knowing when someone's frustrated versus when they're genuinely blocked — stays firmly in the PM's domain. AI just helps you show up more prepared and more responsive than you could be on your own.

### Consensus and conflict resolution

Driving consensus across teams with competing priorities is among the hardest things a PM does. It requires understanding not just each team's *position*, but their *interests* — the underlying needs that drive those positions.

AI can help by synthesizing different viewpoints, drafting proposals that incorporate multiple perspectives, and suggesting compromises based on stated constraints. Need an RFC that reflects six teams' input? AI can produce a first draft that no single person could assemble manually — but you still need to facilitate the conversation that turns a draft into a decision.

Where AI falls short is in reading the political dynamics. Understanding that Team A's objection is really about being burned in a previous launch, or that a particular VP's silence means something different than a junior engineer's silence — that's pattern recognition of a deeply human kind. No model is going to learn the org chart's shadow topology from a prompt.

## What doesn't change

It would be easy to read all of this and conclude that AI is about to make program managers obsolete. It won't.

The responsibilities haven't changed. What's shifted is the mix of the day: less time processing information, more time on judgment. AI reads the forty-message thread; you still decide whether the disagreement buried two-thirds of the way down needs a meeting or just a quiet word with the two people in it.

The things AI can't do are the parts that were always the hard part: reading a room, building trust over months, knowing when to push and when to back off, making the call when the data is ambiguous and someone still has to own the outcome. Those get *more* valuable as AI absorbs the routine work. :quote[When everyone has access to the same AI tools, the differentiator is the human wielding them.]{#differentiator-is-the-human}

## What changes for PMs

That said, AI-first program management does require new muscles — or at least, new applications of existing ones. Four stand out:

**Prompt craft is just requirements-writing.** Ask an LLM to "summarize the launch thread" and you'll get mush. Ask it to "pull out every unresolved decision and its owner, and flag anything blocked on another team" and you'll get something you can act on before the sync. It's [garbage in, garbage out](https://en.wikipedia.org/wiki/Garbage_in,_garbage_out), a principle as old as punch cards, now pointed at prompts. The years you spent writing crisp issue descriptions and acceptance criteria were the training.

**Knowing when *not* to reach for it.** The message to the stakeholder whose project just got cut, the escalation where two directors are fighting a proxy war over headcount, the report who's having a rough week—hand any of those to an AI and you'll ship something correct and tone-deaf. Which conversations are yours alone is a skill, and you mostly learn it by getting it wrong once.

**Verification, because AI fails confidently.** It'll summarize a forty-message thread and drop the one comment where an engineer admitted the date was slipping. It'll draft a status report that's 90% right and 10% quietly wrong. Your job moves from writing the draft to catching that 10% before it ships—which means knowing the ground truth well enough to see where the model smoothed it over.

**Fluency is table stakes.** Nobody lists "can use a project board" on a résumé anymore. Working with AI assistants is on the same curve: a novelty this year, an assumption the next, as unremarkable as Slack or email or GitHub Issues.

## The judgment is still yours

The last big launch I ran, every dashboard was green the Friday before ship: PRs merged, tests passing, no open blockers, and SnippetGPT's rollup said exactly that. What the board didn't show was that one engineer had gone quiet in the launch channel three days running—terse in a way he normally wasn't—and the security reviewer had signed off with a single "lgtm, mostly." No tool reads "mostly" as anything but approval. I read it as a person who had found something and hadn't decided how much it mattered yet. We held the launch a week, and the hedge turned out to be an auth edge case that would have paged us at 2 AM on day one.

No model was going to catch that. It would have read the same green board I did. The job was never assembling the status—AI can do that now—it's knowing which green is actually green, and who to call when it isn't.

The shift to async made program management more intentional. Managing like an engineer made it more transparent. AI makes the same hours count for more. Each of those shifts moved routine work off the PM's plate and left the judgment exactly where it was.

Much of the job is a long tail of grab-bag work that never fits a clean category — writing the missing spec, scheduling the meeting nobody wants to own, reformatting a spreadsheet at 9 PM because a VP asked for a different view of the data. AI is exceptional at exactly this kind of mundane-but-necessary task, and it's the easiest place to start. If you're a PM wondering where to begin, pick the task that consumes the most time but requires the least judgment — status report assembly, meeting note cleanup, stakeholder update drafts — and hand it to an AI. You'll free up hours for the work that actually drew you to the role: solving hard problems with smart people across organizational boundaries.

[^1]: Tally up the number of distinct audiences a PM communicates with in a single week and the answer is genuinely depressing. Every additional team or stakeholder doesn't just add one more communication channel — it adds one for every stakeholder you *already* had. This is why PMs' calendars look the way they do.

[^2]: As much as I might like them to be, [human-to-human requests are unlike server-to-server requests](/2021/03/26/nine-things-a-technical-program-manager-does/). A properly authenticated request from a never-before-seen client is less likely to be fulfilled, or fulfilled in a timely manner, even if it's facially valid. Invest in the relationship before you need the favor.
