---
title: Open source community management at scale
description:
---

Maintaining a popular open source project presents unique challenges of open source community management at scale. 

### 1. Set contributors up for success

Before a user interacts with your project for the first time, you want to do everything you can to set them up for success to ensure that they can discover and understand your project, that they can contribute constructively, and that everyone (yourself included) has a good experience. If this is your first time managing a popular open source project (congrats! :tada:), or even if it's not, but you could use a quick refresher, the [Building Welcoming Communities](https://opensource.guide/building-community/) and [Best Practices for Maintainers](https://opensource.guide/best-practices/) guides from [opensource.guide](https://opensource.guide/) are an incredible resource. Here a few specific suggestions to consider when setting up your project for healthy contributions:

#### Guide users down the contributor funnel

My colleague Mike McQuaid has the concept of the [contributor funnel](https://mikemcquaid.com/2018/08/14/the-open-source-contributor-funnel-why-people-dont-contribute-to-your-open-source-project/). Similar to prospects traveling down a sales funnel, maintainers should market their project to attract users, provide easy opportunities for those users to contribute, and encourage repeat contributors to take on additional responsibilities to help maintain the project.

#### Make it easy for someone to use your project

The first step is making it as easy as possible for users to discover and use your project. Not only will this increase the top of your funnel and make using your project a better experience, but the easier it is for users to get started and self-troubleshoot, the less likely they are to require support. At minimum, [add topics](https://help.github.com/en/github/administering-a-repository/classifying-your-repository-with-topics) to your project, so it's easier to find, and surface user-facing documentation [via a README](https://opensource.guide/starting-a-project/#writing-a-readme). As a simple rule, if I answer a question twice, I add it to the documentation so that I don't have to answer it a third time.

#### Encourage community support

You write software so that others can use it, but no software is perfect, and sometimes users have questions or run into trouble. Unless you create the necessary space to support your project, this can easily become one of the most time consuming and often frustrating aspects of being a maintainer. Use [a SUPPORT file](https://help.github.com/en/github/building-a-strong-community/adding-support-resources-to-your-project) to better [direct users to dedicated support channels](https://ben.balter.com/2017/11/10/twelve-tips-for-growing-communities-around-your-open-source-project/#6-clarify-support-versus-development) (Discourse, Slack, Discussions, etc.) for non-bug, non-feature requests, to keep issue trackers on-track, and most importantly, to encourage community members to support one another.

#### Call out good "first issues"

Bug reports and feature requests can quickly become an overwhelming burden if you don't have the bandwidth to take them on. Encourage commenters, reporters, and requesters to make their first code contribution by adding [good first issue labels](https://help.github.com/en/github/building-a-strong-community/encouraging-helpful-contributions-to-your-project-with-labels) to bite-size issues. "Be the pull request you want to see in the world", as I jokingly like to say. In addition to calling out good starting points for the uninitiated, good first issues are also surfaced throughout GitHub's discovery tools, attracting additional potential contributors to your projects to further reduce the backlog.

#### Make it easy for users to contribute back

Just as you think through your end-user experience, think critically about your developer and contributor experience. The easier it is for users to contribute, and to contribute in the ways you expect, the more contributions you'll get, and the less maintainers will have to intervene to enforce process or norms. In practice, that means [minimizing the friction](https://ben.balter.com/2013/08/11/friction/) one must overcome to contribute and [documenting how to contribute](https://ben.balter.com/2017/11/10/twelve-tips-for-growing-communities-around-your-open-source-project/#5-document-how-to-contribute-and-that-you-want-contributions).

#### Set up issue and pull request templates

Encourage high-quality bug reports and feature requests and make it easier for users to follow your project's contributing guidelines by setting up [issue and pull request templates](https://help.github.com/en/github/building-a-strong-community/about-issue-and-pull-request-templates). Templates can also help streamline the triage process, by automatically applying labels or assignees. You can even add custom links to the new issue flow (such as to an external support forum or bug bounty program) or disable blank issues entirely. It's a delicate balance to strike, but be mindful of not introducing too much friction to the process, which might discourage contributions.

#### Be responsive

https://opensource.guide/building-community/#be-responsive
Welcome and thank first-time contributors https://ben.balter.com/2017/11/10/twelve-tips-for-growing-communities-around-your-open-source-project/#7-welcome-new-contributors

For more information on how to put these concepts into action, see the [Setting up your project for healthy contributions](https://help.github.com/en/github/building-a-strong-community/setting-up-your-project-for-healthy-contributions) GitHub documentation.



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

