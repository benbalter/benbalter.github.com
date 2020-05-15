---
title: Open source community management at scale
description:
---

Maintaining a popular open source project presents unique challenges of open source community management at scale. 

### 2. Automate common community management tasks

* CI and style linters https://ben.balter.com/2017/11/10/, twelve-tips-for-growing-communities-around-your-open-source-project/#8-set-up-automated-tests, https://ben.balter.com/2017/11/10/twelve-tips-for-growing-communities-around-your-open-source-project/#9-enforce-code-standards
* Welcome new contributors - https://github.com/actions/first-interaction, https://probot.github.io/apps/welcome/
* Close stale issues and PRs - https://github.com/actions/stale, https://probot.github.io/apps/stale/
* Request more info - https://probot.github.io/apps/request-info/, https://probot.github.io/apps/no-response/
* Let folks know when an issue's been resolved - https://github.com/release-notifier/release-notifier
* Label issues - https://github.com/actions/labeler

#### A note on Probot

[Probot](https://probot.github.io/) is a great framework for building tools for automating many common maintainer workflows. It has an extensive plugin ecosystem for most common tasks, and can be installed to your repository with a single click, as plugins are distributed as hosted GitHub apps, running on the developers' infrastructure (often Heroku). 

Probot predates [GitHub Actions](https://github.com/features/actions), which allows you to run custom code in response to various repository events, and as a result, although the Actions ecosystem for automating common community management tasks is significantly smaller, many Probot plugins are being converted to GitHub Actions workflows. You can even [run existing Probot plugins on Actions](https://github.com/probot/actions-adapte) by adding them to your repository.

Whether you use Probot, a community-maintained Actions workflow, or your own Actions workflow is up to you, and largely depends on how much you're willing to trust a hosted tool versus being willing to stand up and maintain the execution environment yourself. The important thing is that you're automating common community management tasks. "Never force a human to do what a robot can", as I like to say.

### 3. Share

* Org owned
* 2FA enforcement
* Triage role
* Advanced features
* Community manager

### 4. Moderate conversations to keep them constructive

* Code of conduct
* Hide disruptive comments - https://help.github.com/en/github/building-a-strong-community/managing-disruptive-comments#hiding-a-comment
* Lock conversations - https://help.github.com/en/github/building-a-strong-community/locking-conversations
* Limit interactions - https://help.github.com/en/github/building-a-strong-community/limiting-interactions-in-your-repository
* Allow users to report comments - https://help.github.com/en/github/building-a-strong-community/managing-reported-content-in-your-organizations-repository
* Block disruptive users - https://help.github.com/en/github/building-a-strong-community/blocking-a-user-from-your-organization#blocking-a-user-in-a-comment

https://opensource.guide/code-of-conduct/
https://help.github.com/en/github/building-a-strong-community

