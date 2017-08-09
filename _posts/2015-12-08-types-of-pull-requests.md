---
title: The six types of pull requests you see on GitHub
description: Whether collaborating on code, data, or prose text, there are lots of different strategies for using pull requests on GitHub.
redirect_from: "/2014/12/08/types-of-pull-requests/"
---

Whether collaborating on code, data, or prose text, there are lots of different strategies for using pull requests on GitHub. I once saw a post that outlined a handful of ways teams use pull requests, that seems to be subsequently lost forever, despite looking high and low. Here's how I see pull requests used at GitHub:

### Just a heads up

**How it works:** Create a pull request and immediately merge it yourself without others' review.

**When to use it:** When you're making a change so uncontroversial or straight forward that no review is required, but you want to let your teammates know that you've made the change. Dependency bumps are a good use case.

### Sanity check

**How it works:** Submit a pull request with a minor change, wait a short period for a sniff-test review, and self merge.

**When to use it:** When you've got a small change, potentially in a part of the codebase outside your area of expertise, and you'd like someone with more experience to provide a quick :+1: before your merge the change.

### Work in progress (WIP)

**How it works:** Prefix the pull request title with `WIP:`. Optionally add :warning: emoji and "DO NOT MERGE" in bold if you're ultra-paranoid.

**When to use it:** When you've started a new feature, document, or bug fix, that's not quite ready for others to review, but you want to let your teammates know that you're working on the feature. This can be used to prevent the duplication of effort, save work that you've started, or complement your team's workflow.

### Early feedback

**How it works:** Roughly spike out a feature by creating a proof of concept or rough outline that expressed your idea in its final form.

**When to use it:** When you want feedback on your general approach or the idea itself. *Is this a dumb idea? Is there a better way to do this?* The content of the pull request exists to convey the idea, and will likely not be the final implementation. This may start as a WIP and may end with a line-by-line review.

### Line-by-line review

**How it works:** Submit a feature-complete pull request and cc relevant teams, asking for their review. Team members will comment line-by-line and re-review as you implement their changes.

**When to use it:** When you're ready to :ship: the thing. It may have been started as a work in progress, or for early feedback, but you've made it clear that unless you hear otherwise, you're going to hit merge.

### Pull request to a pull request

**How it works:** You submit a pull request, that instead of requesting a merge into the `master` branch, requests that its changes be merged into a branch that is the basis of another pull request.

**When to use it:** When you don't have write access to the source repository (e.g. open source), and would like to make substantial changes to an existing pull request created by another user. For smaller changes, use line-by-line comments with the proposed code.

*Did I miss any? How does your team use pull requests? [Submit a pull request](https://github.com/benbalter/benbalter.github.com/edit/master/_posts/2015-12-08-types-of-pull-requests.md) or let me know in the comments below.*
