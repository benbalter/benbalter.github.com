---
title: Five (and a half) practical tips for governing your open source project
description: As your open source project grows, here are some practical steps you can take to help operationalize common governance decisions.
---

{% include foss-at-scale.html nth="third" %}

Successful open source projects are purposeful about not only how development is managed day-to-day, but also how community is governed (and nurtured) from release-to-release. Once you've [set contributors up for success](https://ben.balter.com/2020/05/15/set-open-source-contributors-up-for-success/) and [automated common community-management tasks](https://ben.balter.com/2020/08/10/automate-common-open-source-community-management-tasks/), you should decide (and document) how your project will be governed. Much has been written about [open source leadership and governance](https://opensource.guide/leadership-and-governance/). There's a great deal of nuance to consider when deciding on models, roles, entities, and documentation, which I encourage you to read up on. As your open source project grows and matures, here are some practical steps you can take to help operationalize those governance decisions:

## Organization-owned

Open source projects of a certain maturity should be organization-owned. There a few reasons for this:

First, many of GitHub's best community management tools are exclusive to organization-owned repositories. This is a feature intended to reduce the administrative complexity for smaller hobby projects that don't yet need advanced features like community content reporting. It's also an incentive to reduce your project's [bus factor](https://en.wikipedia.org/wiki/Bus_factor).

Second, organization-owned projects allow for a distributed ownership model. Rather then having a single "owner" with the ability to grant `write` permission to collaborators, organization-owned projects can have multiple admins and benefit from more granular permissions like the triage and maintainer roles, allowing you to spread maintainer responsibilities across more contributors at various levels.

Finally, you'll also gain the benefit of teams to organize contributors, allowing you to create @mentionable affinity groups for components or specialized domains such as accessability or security.

## Enforce two-factor authentication

Supply chain attacks are a reality of modern software development. Without two-factor authentication (2FA), a reused password could lead to malicious code slipping into your next release, or if you use GitHub Actions or other CI/CD systems, compromised secrets (and the systems they access as a result). While [you should, of course, enable 2FA on your own account](https://docs.github.com/en/github/authenticating-to-github/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication), if you grant contributors elevated permissions to your project, ensure they have 2FA enabled themselves, by [requiring a second authentication factor as a condition of organization membership](https://docs.github.com/en/organizations/keeping-your-organization-secure/requiring-two-factor-authentication-in-your-organization). This adds a layer of protection such that if a contributors' credentials are compromised, your project (and your downstream dependents) aren't necessarily compromised as a result.

## Triage role

In 2019, GitHub [introduced the `triage` role](https://github.blog/2019-10-03-delegate-responsibilities-with-expanded-repository-permissions/) to help maintainers share the burden of community management with the community. If a contributor proves their ability to drive technical discussions or lead development of your project, as the next step in the [contributor funnel](https://ben.balter.com/2020/05/15/set-open-source-contributors-up-for-success/#1-guide-users-down-the-contributor-funnel), you can empower them to take on additional issue management responsibilities without needing to also grant the ability to modify your project’s source code directtly or change potentially destructive repository settings.

Specifically, contributors with the `triage` role can help keep things in your project organized by managing labels (such as adding `bug` or `feature` label), issue state (close, reopen, assign), milestones, pull request reviews, discussions, and marking issues as duplicate so that maintainers can focus on the trickier governance problems facing the project. Best of all, the `triage` role does not afford `write` project access, so it can be granted more liberally, with little risk to the code itself.

## Advanced features

Two other community-governance-adjacent features are worth calling out here to help streamline and safely share project maintenance responsibilities:

1. **Code owners** - [Code owners](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/about-code-owners) (one of GitHub's most underutilized features, in my opinion), allows you to designate teams as "owners" of certain parts of the codebase. When a pull request is opened against a matching file, the team is automatically notified via a requested review, and if you enable branch protection (see below), they could be required to approve the pull request before the "owned" file can be modified. This allows you to distribute ownership and review responsibilities across teams, while also making granting `write` access less risky for lesser-known contributors.
2. **Branch protection** - [Protected branches](https://docs.github.com/en/github/administering-a-repository/defining-the-mergeability-of-pull-requests/about-protected-branches), allows you to set rules for when a branch (most often your primary branch) can be modified. You can require status checks to pass or reviews to be completed before a pull request is eligible to be merged. Along with code owners, this gives you further confidence to grant expanded community permissions, taking confidence in robot and human review occurring before code can be modified, even by contributors with `write` access.

## Community manager

Last, for sufficiently mature open source projects, consider appointing a designated community manager, either paid or volunteer (depending on your project's governance). It's easy to overlook the burden of open source community management, arguably one of the most impactful roles for large or popular open source projects. Community managers bring a number of unique benefits to open source projects often neglected when community management is "everyone's responsibility" such as welcoming new contributors and streamlining the new contributor experience, moderating controversial conversations to ensure discussions remain productive, marshalling community feature and support requests into actionable feedback, and serving as a community advocate for corporate-backed projects.

As an open source project grows and matures, so too does the complexity of managing not just the software development itself, but the community around the project as well. Open source governance should never be an afterthought, but hopefully these concrete steps can help minimize the community management burden so that your project and your community can continue to grow and thrive.
