---
title: Pull requests are a form of documentation
description: When authoring a pull request, use the body as an opportunity to document the proposed change, especially the "why", and cross link any related issues or other PRs to create a trail of breadcrumbs for future contributors.
---

We often think of pull requests purely as a code review mechanism, but they are also an organic and natural form of documentation. I can't count the number of times I've spelunked historic GitHub PRs to understand the context around a feature or product decision.

Pull requests capture not just what change was made, but who made it, why, and what alternatives were considered. They create a cross-linked web of context for others, and  capture the discussion *around* the change, which is often an equally valuable technical artifact.

When I write a PR, I write it not just with the immediate reviewers in mind, but how it will read for outsiders down the line who might land on in from search results or a cross reference. Beyond documentation, PRs are a great place for your colleagues to ask the type of "dumb questions" that gives you the confidence to ship.

To that end, here are a few practices I follow when authoring pull requests to ensure I'm capturing sufficient context for myself and future contributors:

* **Descriptive title** - Avoid the default `Update FILE.md` and instead use the title to capture the essence of the change in a way that is clear when scanning a list of PRs
* **Brief description of the change** - Right up front, add a quick TL;DR describing the "what" of the change for others landing on the PR from search or a cross link so that they can quickly understand the change
* **Ensure the body describes the "why"** - Equally essential as the "what" is the "why". Why is this change being made? What problem does it solve? What alternatives were considered? What are the tradeoffs? What are the risks? Be sure to include relevant links.
* **Enough context** - So that others outside your team (or yourself years from now) can understand the change. Think of it as a time capsule or a message in a bottle to your future self and future contributors.
* **@mention responsible team** - if not automatically requested via `CODEOWNERS`. Not only does this bring visibility to the PR, it also makes ownership clear by explicitly calling out the responsible team. Be sure to include why you're @mentioning the team (what action is requested, if any) so that it's surfaced in the notification.
* **CC or [`fixes`](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/using-keywords-in-issues-and-pull-requests) related issues** - to create a trail of breadcrumbs to improve discoverability and allow others to opt-in to additional context. As an added bonus, it will auto close the tracking issue for you.
* **Task lists** - To reflect the current state of the PR - e.g. "TODO: add tests" and to capture process
* **Screenshots or animated GIFs** - to illustrate UI changes without requiring other to spin up a dev environment
* **In-line documentation** - Linking back to the PR from the code itself for especially complex or nuanced changes
* **Review your own PR** - Comment in line to highlight specific changes for reviewers that you're less confident on.
* **Discrete changes** - Avoid bundling unrelated changes into a single PR which can hinder future discovery and understanding. Bonus use atomic, descriptive commits within the PR.

Yes, organic documentation takes slightly more time, but it's less overhead than keeping static documentation up to date, and I promise you, it's well worth it - your future self (and future coworkers) will thank you.

For even more tips, check out [how to write the perfect pull request](https://github.blog/2015-01-21-how-to-write-the-perfect-pull-request/) on the GitHub Blog.
