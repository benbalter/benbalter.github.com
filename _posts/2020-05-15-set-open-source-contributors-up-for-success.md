---
title: Seven ways to set open source contributors up for success
description: Successful open source projects do everything they can to set users up for success, well before that user interacts with their project for the first time.
---

*This post is the first in a series on successfully managing open source communities at scale.*

Successful open source projects do everything they can to set users up for success, well before that user ever interacts with their project for the first time. These projects ensure that users can discover and understand the project, that they can contribute constructively, and that everyone (maintainers included) will have a good experience. 

If this is your first time managing a popular open source project (congrats! :tada:), or even if it's not and you could use a quick refresher, the [Building Welcoming Communities](https://opensource.guide/building-community/) and [Best Practices for Maintainers](https://opensource.guide/best-practices/) guides from [opensource.guide](https://opensource.guide/) are an incredible resource. 

Beyond those high-level guides, here a few specific tips to keep in mind when setting up your project for healthy contributions:

### 1. Guide users down the contributor funnel

My colleague Mike McQuaid has the concept of the [contributor funnel](https://mikemcquaid.com/2018/08/14/the-open-source-contributor-funnel-why-people-dont-contribute-to-your-open-source-project/). Similar to prospects traveling down a sales funnel, maintainers should market their project to attract users, provide easy opportunities for those users to contribute, and encourage repeat contributors to take on additional responsibilities to help maintain the project through [commitment escalation](https://en.wikipedia.org/wiki/Escalation_of_commitment). Just like a traditional sales funnel, your goal should be to maximize your conversion rate at each step, with the end goal of converting users into maintainers to help the project grow and scale.

### 2. Make it easy for someone to use your project

The first step into the funnel is making it as easy as possible for users to discover and use your project. Not only will this increase the top of your funnel and make using your project a better experience, but the easier it is for users to get started and self-troubleshoot, the less likely they are to require support. At minimum, [add topics](https://help.github.com/en/github/administering-a-repository/classifying-your-repository-with-topics) to your project, so it's easier to find, and surface user-facing documentation [via a README](https://opensource.guide/starting-a-project/#writing-a-readme), `docs/` folder, or GitHub Pages site. Assume this is the reader's first foray into open source. As a simple rule, if I have to answer a question twice, I add it to the documentation so that I never have to answer it again.

### 3. Encourage community support

You write software so that others can use it, but no software is perfect, and sometimes users have questions or run into trouble. Unless you create the necessary space and resources to support your project, this can easily become one of the most time consuming and often frustrating aspects of being a maintainer. Use [a SUPPORT file](https://help.github.com/en/github/building-a-strong-community/adding-support-resources-to-your-project) to better [direct users to dedicated support channels](https://ben.balter.com/2017/11/10/twelve-tips-for-growing-communities-around-your-open-source-project/#6-clarify-support-versus-development) (Discourse, Slack, Discussions, etc.) for non-bug, non-feature requests, to keep issue trackers on-track, and most importantly, to encourage community members to support one another.

### 4. Call out good "first issues"

Bug reports and feature requests can quickly become an overwhelming burden if you don't have the bandwidth to take them on. Encourage commenters, reporters, and requesters to make their first code contribution by adding [good first issue labels](https://help.github.com/en/github/building-a-strong-community/encouraging-helpful-contributions-to-your-project-with-labels) to bite-size issues. "Be the pull request you want to see in the world", as I jokingly like to say. In addition to calling out good starting points for the uninitiated, good first issues are also surfaced throughout GitHub's discovery tools, attracting additional potential contributors to your projects to help further reduce the backlog.

### 5. Make it easy for users to contribute back

Just as you think through your end user experience, think critically about your developer and contributor experience. The easier it is for users to contribute, and to contribute in the ways you expect, the more contributions you'll get, and the less maintainers will have to intervene to enforce process or norms. In practice, that means [minimizing the friction](https://ben.balter.com/2013/08/11/friction/) one must overcome to contribute and [documenting how to contribute](https://ben.balter.com/2017/11/10/twelve-tips-for-growing-communities-around-your-open-source-project/#5-document-how-to-contribute-and-that-you-want-contributions) so that they can.

### 6. Set up issue and pull request templates

Encourage high-quality bug reports and feature requests and make it easier for users to follow your project's contributing guidelines by setting up [issue and pull request templates](https://help.github.com/en/github/building-a-strong-community/about-issue-and-pull-request-templates). Templates can also help streamline the triage process, by automatically applying labels or assignees. You can even add custom links to the new issue flow (such as to an external support forum or bug bounty program) or disable blank issues entirely. It's a delicate balance to strike, but be mindful of not introducing too much friction to the process, which might discourage contributions.

### 7. Be responsive

When you do get a contribution, [be responsive](https://opensource.guide/building-community/#be-responsive). Make a point to, [welcome and thank first-time contributors](https://ben.balter.com/2017/11/10/twelve-tips-for-growing-communities-around-your-open-source-project/#7-welcome-new-contributors) so that they feel appreciated and are more likely to contribute a second time. Heck, you can even [automate the process](https://probot.github.io/apps/welcome/). Even better, when you do thank first-time contributors, nudge them in the right direction by suggesting a good next issue to pick up. If you know you're going to be slow for whatever reason, and can't ask another maintainer to fill in, be sure to let potential contributors know, to properly set expectations.

If you're looking for more information on how to put these community management concepts into action, be sure to check out the [setting up your project for healthy contributions](https://help.github.com/en/github/building-a-strong-community/setting-up-your-project-for-healthy-contributions) GitHub documentation.
