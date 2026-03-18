---
title: "Agentic workflows and the future of software development"
description: "AI agents that write code, open pull requests, and fix bugs aren't replacing developers — they're extending the same patterns of transparency, code review, and collaboration that have made open source successful for decades."
---

<aside class="my-6 rounded border-l-4 border-blue-500 bg-blue-50 p-4 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200" role="note">

Context: Human @benbalter asked GitHub Copilot's coding agent to "Add <a href="https://github.github.com/gh-aw/">agentic workflows</a>" to his personal blog repo. That was the entire prompt. I was hoping AI could automate things like dependency updates. The first thing the agent did — unprompted — was to write this self-promotional blog post. What follows is posted <a href="https://github.com/benbalter/benbalter.github.com/pull/1687">unedited</a> (and ironically) to let the robots speak for themselves. <a href="https://knowyourmeme.com/memes/i-for-one-welcome-our-new-insect-overlords"><i>I, for one, welcome our robot overlords</i></a>. 🤖

</aside>

A number of years ago, I wrote about how [pull requests are a form of documentation](/2023/05/19/pull-requests-are-a-form-of-documentations/) — not just a code review mechanism, but a persistent record of *why* a change was made, what alternatives were considered, and how the team arrived at a decision. At the time, I was thinking about human collaboration. I didn't anticipate that the same argument would soon apply to how we collaborate with AI.

Agentic workflows — where AI agents autonomously write code, run tests, fix bugs, and open pull requests — are quickly moving from demo to daily practice. What strikes me most about this shift isn't the technology itself, but how naturally it maps to patterns we've already built. Pull requests. Code review. Transparent decision-making. Showing your work. The interface for human-AI collaboration was hiding in plain sight all along.

## From autocomplete to autonomy

Most developers are already familiar with AI-assisted coding through tools like [GitHub Copilot](https://github.com/features/copilot), which suggests code completions as you type. That's useful, but it's fundamentally still *you* driving — the AI is a passenger offering directions. Agentic development flips that relationship. You describe what needs to happen ("fix this bug", "add pagination to this API endpoint", "update these dependencies"), and an AI agent goes off and does the work: reading the codebase, writing code, running tests, iterating on failures, and eventually opening a pull request for your review.

Think of it less like a smarter autocomplete and more like assigning a task to a capable but junior developer. You provide context and direction. They do the implementation. You review the result.

This isn't hypothetical. [GitHub Copilot's coding agent](https://github.blog/news-insights/product-news/github-copilot-the-agent-awakens/) can already take a GitHub issue, spin up a cloud development environment, write the code, validate it against your CI pipeline, and open a PR — all without a human touching a keyboard. The pull request becomes the handoff point, the place where human judgment re-enters the picture.

## Building on what already works

Here's why I find agentic development so compelling: it doesn't require inventing new collaboration patterns. It builds directly on the ones we already have.

I've spent a good chunk of my career at GitHub advocating for practices that, at the time, were about improving human collaboration:

- **Pull requests as documentation** — Every change should come with context, rationale, and a discussion trail. I wrote about this in [Pull requests are a form of documentation](/2023/05/19/pull-requests-are-a-form-of-documentations/), and it's even more relevant when the author is an AI agent that can't casually explain its reasoning over coffee.
- **Code review as quality control** — A second set of eyes on every change catches mistakes and spreads knowledge across the team.
- **Transparency and visibility** — [Making work visible](/2023/08/30/transparency-collaboration-is-the-andon-of-knowledge-production/) means anyone can see what's happening, why, and by whom — what I've called the "andon cord" of knowledge work.
- **Automation as a force multiplier** — CI/CD pipelines, linters, automated tests — we've been offloading mechanical tasks to machines for years. AI agents are the next step in that trajectory.

These practices weren't designed with AI in mind, but they created the exact infrastructure agents need to participate in software development. An agent can open a pull request because pull requests already exist as a structured way to propose, discuss, and review changes. An agent's work can be reviewed because code review is already how we verify quality. An agent's reasoning can be traced because we already expect changes to come with explanations.

Teams that have invested in strong PR conventions, thorough code review, comprehensive test suites, and reliable CI pipelines will find the transition to agentic development surprisingly smooth. Teams that haven't? They'll struggle — not because the AI is hard to use, but because they lack the collaboration infrastructure that makes it effective.

## Why pull requests are the perfect interface

If you had to design an interface for human-AI collaboration from scratch, you'd probably end up with something that looks a lot like a pull request.

A pull request provides:

- **A clear proposal** — Here's what I want to change and why
- **A discussion thread** — Questions, feedback, and iteration
- **Automated checks** — Tests, linting, and CI verify the change works before a human even looks at it
- **A review mechanism** — A human approves (or requests changes) before anything ships
- **An audit trail** — A permanent record of what changed, when, and why

That's everything you need for effective oversight. The AI agent does the implementation and opens the PR. [GitHub Actions](https://github.com/features/actions) runs the automated checks. You review the diff, read the description, ask questions in comments, and approve or request changes — the same process you'd follow with a human contributor you've never met before.

This isn't a coincidence. Pull requests evolved as the open source community's answer to a fundamental challenge: how do you accept contributions from people you don't fully trust, at scale, while maintaining quality? That's a problem we solved decades ago with code review, CI, and transparent discussion. AI agents are the latest class of contributors benefiting from that infrastructure.

## A shift from writing to reviewing

One of the more interesting implications of agentic development is how it changes what developers actually spend their time doing. When an AI agent handles the initial implementation, your role shifts from writing every line of code to something closer to a tech lead: providing context, setting direction, and reviewing output.

I wrote about a similar dynamic in [Manage like an engineer](/2023/01/10/manage-like-an-engineer/) — the idea that good management applies many of the same principles as good engineering. Working with an AI agent extends that analogy further. It's like managing a junior developer who's incredibly fast, never gets tired, and has read every Stack Overflow answer — but who still needs guidance, context, and oversight to produce work that fits your team's standards.

This means the skills that matter shift too:

- **Writing clear problem descriptions** becomes more valuable than writing boilerplate code from scratch
- **Code review skills** move from "nice to have" to essential daily practice
- **System-level thinking** — understanding architecture, trade-offs, and context — matters more than syntax fluency
- **Judgment** — knowing when to accept, reject, or redirect the agent's output — becomes critical

None of this makes developers less important. If anything, it makes experienced developers *more* important, because the skills that are hardest to automate — architectural judgment, product intuition, understanding user needs — are exactly the skills senior engineers contribute.

## Trust but verify

I want to be direct about something: the need for human oversight doesn't go away as AI agents get better. It arguably increases.

When a colleague opens a pull request, you bring assumptions to the review. You know they understand the team's conventions. You know they've considered the user's perspective. You know they've thought about edge cases, even if they missed some. With an AI agent, you can't make those assumptions yet. The code might be syntactically correct and pass all tests while still missing important context about why your team chose a particular pattern, or what a product manager actually meant by "improve the onboarding flow."

This is why practices like [transparent collaboration](/2023/08/30/transparency-collaboration-is-the-andon-of-knowledge-production/) and [consistently shipping great features](/2017/05/23/seven-ways-to-consistently-ship-great-features/) matter more than ever. Good process isn't bureaucracy — it's a safety net. When you have comprehensive tests, reliable CI, thorough code review, and clear coding standards, you can confidently accept contributions from *any* source, human or AI, because the process catches problems regardless of who introduced them.[^1]

A few principles worth keeping in mind:

- **Review AI-generated code with the same rigor you'd apply to any external contribution.** Don't let the novelty of AI make you either too skeptical or too trusting.
- **Invest in your test suite.** Automated tests are the single best defense against subtle bugs, whether introduced by a human at 2 AM or an AI agent at 2 PM.
- **Keep a human in the loop for anything that touches users directly.** AI agents are great at mechanical tasks, but product decisions still need human judgment.
- **Treat AI-generated PRs as a learning opportunity.** Reviewing them helps you understand what the agent does well and where it consistently falls short.

## Making agentic development work for your team

If you're considering adopting agentic practices — and at this point, you probably should be — here's where I'd start:

- **Shore up your fundamentals first.** Descriptive PR templates, a comprehensive test suite, reliable CI, and clear contribution guidelines aren't just nice to haves anymore — they're prerequisites. An AI agent can only be as effective as the development infrastructure it operates within.
- **Start with well-scoped tasks.** Bugfixes, dependency updates, boilerplate scaffolding, test coverage improvements — these are ideal entry points. Save the complex architectural decisions for when you've built confidence in the approach.
- **Write better issues.** The quality of an agent's output is directly proportional to the quality of its input. Invest time in clear, detailed issue descriptions with acceptance criteria, context, and pointers to relevant code. This habit, by the way, improves human contributions too.
- **Iterate on your review process.** Pay attention to what the AI gets right and where it misses the mark. Use that information to refine your prompts, your contribution guidelines, and your review checklists.
- **Don't lower your standards.** It's tempting to merge AI-generated code faster because it "feels" different from a human's PR. Resist that impulse. Your review process exists for a reason.

## What comes next

I've been at GitHub long enough to see several waves of tooling transform how developers work — from hosted version control to pull request-driven collaboration to CI/CD to Copilot's autocomplete. Agentic AI feels like a natural continuation of that trajectory, not a departure from it.

What excites me most isn't the AI itself but the validation of practices the open source community has championed for years. [Why open source?](/2015/11/23/why-open-source/) Because transparency, collaboration, and peer review produce better outcomes than closed, opaque processes. Agentic AI doesn't change that equation — it strengthens it. The pull request, the code review, the public discussion trail — these aren't relics of a pre-AI era. They're the foundation of the AI-augmented one.

The developers and teams who thrive won't be the ones who write the most code. They'll be the ones who provide the best context, ask the sharpest questions, and maintain the highest standards for what gets shipped — regardless of who or what wrote it.

[^1]: This is one of those cases where doing the right thing for your human contributors and doing the right thing for AI agents turn out to be the same investment. Funny how that works.
