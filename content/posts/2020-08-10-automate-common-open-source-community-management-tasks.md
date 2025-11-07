---
title: Automate common open source community management tasks
description: Successful open source projects rely heavily on automation to implement and enforce community workflows and to make contributing a more self-serve experience.
---

{% include foss-at-scale.html nth="second" %}

Successful open source projects rely heavily on automation to implement and enforce community workflows and to make contributing a more self-serve experience. Once you've [set open source contributors up for success](https://ben.balter.com/2020/05/15/set-open-source-contributors-up-for-success/), you can and should automate common community management tasks like issue triage, initial code review, and pruning your project backlog to ensure you can scale your own efforts and contributors continue to have a great experience and want to contribute, even as your community grows. Better yet, it can often be done with without writing any code that you have to host or maintain. As I like to say, never force a human to do what a computer can.

## Automate code review

Many developers think of continuous integration (CI) as a workflow tool, or a software quality tool, but it’s actually a powerful community building tool as well. Rather than needing to wait for a maintainer to review their work, which might span timezones or work schedules, automated tests provide contributors with instant feedback on their contribution. Beyond providing contributors with the opportunity to improve their code before a human has the chance to review it, CI also provides maintainers with confidence that a given feature or bugfix doesn’t introduce a regression, without necessarily needing to run the code locally.

Automated testing can be used for more than just “does this thing work”. If your project (or language or framework) has adopted coding standards, use CI to enforce them. Most common languages have customizable linters, or, if necessary, you could always write your own for custom or one-off rules. As we say at GitHub, “pedantic robots > pedantic humans”. If a human comes along and criticizes your coding style or nit-picks every detail of your implementation, you might take it personally. If a robot makes those same suggestions, you’re less likely to.

CI is often trivial to set up for open source projects, especially if your project already has automated tests. Services like GitHub Actions or Travis CI have examples for every major framework and language, are usually free for open source projects, and are often a matter of simply committing the necessary metadata to your project. Once enabled, potential contributions are automatically tested, and their status is reported directly on the pull request.

## Automate issue management

One of the biggest improvements to open source community management in recent memory has been [Probot](https://probot.github.io) and subsequently the GitHub Actions inspired by it. Probot is an extensible framework for automating common tasks based on activity in your repository. With dozens of community-maintained apps, chances are whatever pain point or bottleneck your project is experiencing has already been experienced (and solved) by an open source maintainer.

You can use Probot for things like welcoming first-time users, automatically closing stale issues, requesting more information, or even moderating toxic conversations. Better still, if your problem hasn’t been solved, Probot makes it easy to write your own app. Generally speaking, I'd recommend prototyping processes out manually to get a feel for what practices best support your community before automating them.

Here are a few of my favorite Probot plugins and GitHub Actions for community management:

| Task                       | Probot Plugin                                                                                                          | GitHub Action                                                     |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Welcome new contributors   | [Welcome](https://probot.github.io/apps/welcome/)                                                                      | [First interaction](https://github.com/actions/first-interaction) |
| Close stale issues and PRs | [Stale](https://probot.github.io/apps/stale/)                                                                          | [Stale](https://github.com/actions/stale)                         |
| Request more info          | [Request info](https://probot.github.io/apps/request-info/), [No response](https://probot.github.io/apps/no-response/) |                                                                   |
| Label issues               | [Issue labeler](https://probot.github.io/apps/issuelabeler/)                                                           | [Labeler](https://github.com/actions/labeler)                     |
{: .table }

*Have a favorite community management Probot Plugin or GitHub Action not listed here? Please {% github_edit_link "Add it" %}.*

### A note on Probot

[Probot](https://probot.github.io/) is a great framework for building tools for automating many common maintainer workflows. It has an extensive plugin ecosystem for most common tasks, and can be installed to your repository with a single click, as plugins are distributed as hosted GitHub apps, running on the developers' infrastructure (often Heroku).

Probot predates [GitHub Actions](https://github.com/features/actions), which allows you to run custom code in response to various repository events. Although the Actions ecosystem for automating common community management tasks is significantly smaller, many Probot plugins are being converted to GitHub Actions workflows. You can even [run existing Probot plugins on Actions](https://github.com/probot/actions-adapter) by adding them to your repository.

Whether you use Probot, a community-maintained Actions workflow, or your own Actions workflow is up to you, and largely depends on how much you're willing to trust a hosted tool versus being willing to stand up and maintain the execution environment yourself. The important thing is that you're automating common community management tasks.

## Automate maintainer workflows

Finally, take a critical look at repetitive or time consuming tasks that can be automated to support your own workflow. Can releases be automated to get pushed to a package manager as soon as a release is cut? Can you automate generating the changelog or list of contributors based on pull requests merged since the last release? What about updating dependencies? If you can automate it, often times you should, as doing so frees you up to work on higher-value, more human-centric work.

We often start open source projects to solve shared or novel technical challenges, but as a project grows, a maintainer's focus naturally shifts from the code to the people and processes around it. By automating common open source community management tasks, maintainers can better scale their own efforts, can create a better experience for contributors, and can create the space to focus on the types of problems maintainers are uniquely positioned to solve.
