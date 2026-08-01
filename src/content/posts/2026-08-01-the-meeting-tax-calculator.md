---
title: "Calculate and Slash Your Team's Meeting Tax"
description: "Most teams treat meetings as free. They're not. Here's how to calculate your meeting tax, make it visible, and cut it without breaking collaboration."
published: false
---
<!--
  AI DRAFTING EXPERIMENT — drafted by an LLM (Azure AI Foundry, gpt-5.4) from a
  mined idea backlog, then linted against this repo's anti-AI-pattern Vale style.
  Unedited draft (published: false). Verify every [BRACKETED] placeholder and any
  specific statistic before publishing. See the PR description for details and a
  gpt-4.1 A/B variant of the same idea.
-->

I once ran the numbers for a [NUMBER: e.g., "20-person"] engineering group, and the result was ugly: meetings consumed 21% of all engineering hours. Not 21% of one team’s week. Twenty-one percent of the entire group’s capacity. More than any single feature project on the roadmap.

Nobody thought they had a meeting problem.

That’s the trick. Meeting overload rarely feels like one giant, obviously broken thing. It feels like a calendar dotted with “quick syncs,” recurring status updates, stakeholder check-ins, planning ceremonies, and the occasional standing meeting that survived three reorganizations out of pure inertia. Each one looks defensible on its own. Collectively, they eat your team alive.

My view is simple: if you don’t measure your team’s meeting load, you’re almost certainly underestimating what it costs you. And if you’re leading engineers who spend more time in meetings than building, reviewing, writing, debugging, or thinking, that’s not collaboration. That’s a tax.

## The silent bill most leaders never calculate

Leaders tend to track headcount carefully. We track cloud spend, vendor spend, and project budgets down to the dollar. But calendar spend? For some reason, that gets a pass.

It shouldn’t.

A one-hour meeting with eight people is not a one-hour meeting. It’s an eight-hour meeting. Add prep time, context switching, and the inevitable follow-up, and the true cost climbs from there. Knowledge work has ugly coordination overhead, and meetings are where that overhead goes to hide.

Engineers feel this first. They need uninterrupted time to hold a codebase, a system design, or a thorny production problem in their head. A two-hour block is not fungible with four thirty-minute scraps jammed between calls. Once the calendar gets perforated enough, the day stops being a workday and starts becoming a series of recoveries.

You see the symptoms everywhere:

- Pull requests sit longer than they should.
- Design docs stay half-written.
- Decisions get revisited because nobody captured the reasoning.
- People work earlier, later, or both, to make up for the fact that their actual workday got consumed by talking about work.

Then someone says the team needs to “move faster,” which is a bit rich given that you’ve scheduled away a meaningful chunk of their capacity.

## Meetings are often unpriced communications debt

I’ve written before about [communications debt](https://ben.balter.com/2022/02/16/leaders-show-their-work/): the hidden cost you incur when you choose the near-term convenience of ephemeral communication over durable, discoverable communication. Meetings are one of the easiest ways to rack up that debt.

That doesn’t mean meetings are bad. Some are absolutely worth it. Brainstorming can be worth it. Sensitive feedback can be worth it. Incident response is worth it. Complex, high-trust conversations are often worth it.

But most recurring meetings are never forced to compete against an async alternative. Nobody asks whether a decision doc, issue, pull request, or written update would produce the same outcome at a fraction of the cost. The meeting just exists, renews itself every Tuesday, and quietly becomes part of the operating system.

That’s how you end up paying for the same information twice: once in the meeting itself, and again when people have to reconstruct what happened because the discussion disappeared into the ether.

## Run the numbers

If you want to change this, start with arithmetic, not vibes.

Create a simple Google Sheet with one row per recurring meeting. The goal isn’t perfect accounting. The goal is to make the total visible enough that nobody can pretend it’s free.

Here’s the template structure I’d use.

### Sheet 1: Meetings

Create columns with these headers:

| Meeting name | Cadence | Hours per occurrence | Attendees | Role mix | Weekly hours | Monthly hours | Monthly cost notes | Keep / cut / async / reduce |
|---|---:|---:|---:|---|---:|---:|---|---|

Use these formulas:

- **Weekly hours** = `Hours per occurrence * Attendees * Cadence multiplier`
- **Monthly hours** = `Weekly hours * 4.33`

Use cadence multipliers like:

- Weekly = `1`
- Biweekly = `0.5`
- Monthly = `0.23`
- Twice weekly = `2`

If you want to get slightly fancier, split attendees by role instead of using one total:

| Eng attendees | Manager attendees | PM attendees | Design attendees | Total weekly hours |
|---:|---:|---:|---:|---:|

Then calculate:

`=(Eng attendees + Manager attendees + PM attendees + Design attendees) * Hours per occurrence * Cadence multiplier`

That gives you the all-in time cost. More useful, though, is role-specific cost.

### Sheet 2: Role capacity

Create a second tab with:

| Role | People in role | Weekly hours per person | Total weekly capacity | Meeting cap % | Max meeting hours |
|---|---:|---:|---:|---:|---:|

Formula examples:

- **Total weekly capacity** = `People in role * Weekly hours per person`
- **Max meeting hours** = `Total weekly capacity * Meeting cap %`

Example caps I’d start with:

- Engineers: `10%–15%`
- Engineering managers: `25%–40%`
- Staff/principal engineers: `15%–25%`
- PMs: `30%–50%`

Those aren’t laws of physics. They’re guardrails. Your team may need different numbers. But if you don’t set explicit caps by role, meetings expand to fill the calendar available.

### Sheet 3: By-role allocation

Now map each meeting’s attendance by role and sum the hours per role.

Columns:

| Meeting name | Eng weekly hours | EM weekly hours | PM weekly hours | Design weekly hours |
|---|---:|---:|---:|---:|

Formula for each role:

`=Role attendees * Hours per occurrence * Cadence multiplier`

Then sum each column at the bottom.

Finally, compare those totals to the caps in the Role capacity tab:

`=Actual meeting hours / Total weekly capacity`

Format that as a percentage. Now you have your meeting tax rate by role.

That’s the number you want in front of every leader.

## What to look for

When you audit the sheet, a few patterns usually jump out.

First, recurring meetings with lots of senior people. These are expensive in raw hours and often produce the weakest return. Senior folks are frequently there “just in case,” which is calendar-speak for “we never redesigned this meeting once it started.”

Second, status meetings. These are almost always ripe for async replacement. If the primary function is to report progress, share blockers, or broadcast updates, you want a written artifact, not a meeting. A GitHub issue, a project board update, or a lightweight weekly memo scales better and creates a durable record. That’s [showing your work](https://ben.balter.com/2022/02/16/leaders-show-their-work/), not forcing everyone to attend a live reading of it.

Third, meetings with unclear owners or no decision rights. If nobody knows why the meeting exists, who it serves, or what gets decided there, you don’t have a meeting. You have a habit.

Fourth, role mismatch. If engineers are over cap while managers are under cap, you’re probably pushing coordination work onto the wrong people. Managers should absorb more of the communication overhead so engineers can stay closer to the work. Otherwise, you’ve built a system where your most expensive makers spend their week as part-time meeting furniture.

## How to cut the tax without breaking collaboration

You don’t need some performative “meeting-free company” stunt. You need a budget and the discipline to enforce it.

Start here:

### Put every recurring meeting on a renewal clock

No recurring meeting should live forever by default. Give each one an owner, a purpose, and an expiration date. If nobody explicitly renews it, it dies. That sounds harsh until you remember that the default alternative is quietly charging the team forever.

### Replace status with written updates

If a meeting exists to answer “What happened?”, “What’s next?”, or “What’s blocked?”, make it async first. Write it down where others can discover it later. This is the boring, effective heart of [why async](https://ben.balter.com/2022/03/17/why-async/): written communication lowers coordination cost, improves inclusion, and reduces the "you had to be there" nonsense that plagues so many teams.

### Shrink attendee lists aggressively

Invite the people who decide and the people who do. Everyone else can read the notes, comment asynchronously, or get tagged when their input is needed. A meeting is not a distribution list.

### Protect maker time on purpose

Set explicit no-meeting blocks for engineers. Not aspirationally. On the calendar. If your team can’t get two to four contiguous hours to think, you don’t have a focus problem. You have a scheduling problem.

### Make cost visible in the invite itself

This one is delightfully effective. Add a line to recurring meeting descriptions like: “Cost: 6 people x 1 hour = 6 team-hours weekly.” Once you expose the price tag, people get a lot more thoughtful about whether the agenda merits the spend.

## The uncomfortable part

Some leaders like meetings because meetings feel like control.

You can see people, hear status, resolve ambiguity quickly, and reassure yourself that alignment is happening because everyone nodded on Zoom. I get the appeal. I’ve felt it myself.

But a full calendar is not evidence of good leadership. More often, it’s evidence that the system depends too heavily on synchronous intervention. If your team needs constant meetings to stay aligned, that’s not proof the meetings are working. It’s proof the underlying communication system is weak.

The better alternative is to build habits and tools that make work visible by default. Write decisions down. Capture context where the work happens. Use meetings sparingly for the kinds of conversations that actually benefit from being live. In other words, default to open and async, and spend sync time where it earns its keep.

That 21% number stuck with me because it turned an ambient frustration into an operational problem. Once the cost was visible, nobody could unsee it. And once nobody could unsee it, cutting meetings stopped feeling like a preference and started feeling like basic fiscal hygiene.

Your team already pays a meeting tax. The only question is whether you know the bill.
