---
title: Issues are not pull requests
description: Understanding the distinction between defining problems in issues and proposing solutions in pull requests is fundamental to effective software collaboration and can dramatically improve your team's workflow.
---

One of the most common antipatterns I see in software development is conflating issues with pull requests. While they may seem interchangeable on the surface—both are mechanisms for proposing changes—they serve fundamentally different purposes in the software development lifecycle. Understanding this distinction is crucial for effective collaboration and can dramatically improve your team's workflow.

## Two distinct conversations

At their core, issues and pull requests represent two distinct conversations that should happen sequentially, not simultaneously:

**Issues are about problems:**

* What is the problem we're trying to solve?
* Is this a problem we should be solving?
* What's the relative importance of solving this problem?
* What's the best user-facing solution to this problem?

**Pull requests are about solutions:**

* Is this the right technical implementation of the previously agreed-upon solution?
* Is the solution implemented properly?
* Does it follow our coding standards and best practices?
* Are there edge cases we haven't considered?

When you skip the issue phase and jump straight to a pull request, you're asking reviewers to evaluate both the problem definition and the implementation simultaneously. This makes reviews harder, takes longer, and often results in wasted effort when the underlying problem itself is questioned or deemed not worth solving.

## Why the distinction matters

### 1. Separating "what" from "how"

Issues allow you to achieve consensus on *what* to build before anyone invests time in building it. This prevents the common scenario where a developer spends days or weeks implementing a feature, only to discover in PR review that the team disagrees with the approach or doesn't think the problem is worth solving at all.

By discussing the problem and desired outcome first, you ensure everyone is aligned before code is written. The PR review can then focus purely on the quality of the implementation, not whether the feature should exist.

### 2. Encouraging diverse perspectives

Issues are where product managers, designers, end users, and stakeholders can all contribute meaningfully, regardless of their technical background. The conversation focuses on user needs, product direction, and business value—areas where non-engineers often have critical insights.

Once you move to a pull request, the conversation naturally becomes more technical. If you haven't established shared understanding in an issue first, valuable non-technical perspectives may be drowned out by implementation details.

### 3. Enabling asynchronous collaboration

Issues provide a dedicated space for iterating on problem definition and solution design before anyone writes code. This is especially valuable for distributed teams across time zones. Team members can weigh in on the problem, propose alternatives, and reach consensus asynchronously.

Pull requests are inherently more time-sensitive—there's code waiting to be merged. By front-loading the discussion into an issue, you reduce the back-and-forth in PR review and allow developers to implement solutions with confidence.

### 4. Creating better documentation

When you separate problem definition from implementation, you create two complementary forms of documentation:

* The issue documents *why* something was built, what problem it solves, and what alternatives were considered
* The pull request documents *how* it was built, implementation decisions, and technical trade-offs

This dual documentation becomes invaluable months or years later when someone asks "Why do we do it this way?" or "Why does this feature exist?" Having the full context captured in linked issues and PRs creates a trail of breadcrumbs for future contributors.

## The ideal workflow

Here's what the ideal workflow looks like:

1. **Open an issue** to describe the problem, not the solution
2. **Discuss and iterate** on the problem definition and desired outcome
3. **Reach consensus** on whether to solve it and what the user-facing solution should be
4. **Reference the issue** when opening a pull request
5. **Review the PR** focusing purely on implementation quality

The issue becomes your requirements document. The PR becomes your implementation proposal. Both serve distinct purposes in your project's history.

## When to break the rule

Like all guidelines, there are exceptions. It's fine to skip the issue phase when:

* The change is trivial (fixing a typo, updating dependencies)
* The problem is obvious and universally agreed upon (critical security fix)
* You're experimenting with an idea and want early technical feedback

For everything else, take the time to define the problem before proposing a solution. Your reviewers—and your future self—will thank you.

## Putting it into practice

Start treating issues and pull requests as distinct phases of work:

* **In issues:** Focus on user needs, business value, and product direction. Ask "should we?" and "what should we build?"
* **In pull requests:** Focus on code quality, architecture, and implementation details. Ask "did we build it right?"

Use the issue description to link to related issues and provide context. Use the PR description to link back to the issue and explain your implementation approach. Create that web of cross-references that makes your project's history navigable and understandable.

By separating these concerns, you'll find that both conversations become more focused, reviews go faster, and your team makes better decisions. Issues help you build the right thing. Pull requests help you build the thing right. Both are essential, but they're not the same thing.

{% include\_cached github-culture.html %}
