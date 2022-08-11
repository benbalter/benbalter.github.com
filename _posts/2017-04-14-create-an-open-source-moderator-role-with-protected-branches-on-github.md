---
title: Using protected branches to empower non-code contributors on GitHub
description: With GitHub's protected branches feature, you can grant collaborators permission to moderate comments, manage issues, or serve as project managers/team leads without the ability to merge pull requests or commit to master.
---

<div class="border p-1 m-1" markdown="1">

**Update 2019–05–23**: This is now possible more intuitively with [GitHub's triage role](https://github.blog/changelog/2019-05-23-triage-and-maintain-roles-beta/).

</div>

Out of the box, GitHub enables you to grant collaborators [read, write, or admin permissions](https://help.github.com/articles/repository-permission-levels-for-an-organization/) to a project. It's not uncommon, however, for open source communities to want to empower a class of non-code contributors to moderate comments, manage issues, or serve as project managers/team leads, even if they ultimately don't have permission to modify the code on the repository's primary branch.

Fortunately, with [GitHub's protected branches feature](https://help.github.com/articles/about-protected-branches), you can grant contributors these permissions without also giving them the ability to merge pull requests or commit directly to `main`.

If your project is owned by an organization, it's relatively easy to set up on a per-repository basis:

1. From the repository in question, navigate to "Settings" → "Branches"
2. Under "Protected branches" choose your primary branch from the dropdown, or if it is already protected, click "edit"
   ![Protected branches](https://cloud.GitHubusercontent.com/assets/282759/25056313/056e9944-2136-11e7-8415-5ec036f8ad6a.png){: .w-75 .border .m-1 style="box-shadow: 10px 10px 10px #ccc;"}
3. Ensure "Protect this branch" is checked[^1]
   ![Protect this branch](https://cloud.GitHubusercontent.com/assets/282759/25056314/05751300-2136-11e7-85c8-6d7d61f10017.png){: .w-75 .border .m-1 style="box-shadow: 10px 10px 10px #ccc;" }
4. Check "Restrict who can push to this branch"
   ![Restrict who can push to this branch](https://cloud.GitHubusercontent.com/assets/282759/25056312/056cef5e-2136-11e7-8d09-b6a0cb38d1fe.png){: .w-75 .border .m-1 style="box-shadow: 10px 10px 10px #ccc;" }
5. Add any users you want to be able to merge pull requests to this list[^2]
6. Grant any users you'd like "write" access to the repository as you would normally, confident they can't commit or merge to `main`

With [branch restrictions](https://help.github.com/articles/about-branch-restrictions/) enforced, these non-code committing users, which you might describe as "community managers", "team leads", or "project managers" can now close/re-open issues, moderate comments, and push to feature branches, but cannot merge pull requests or commit directly to your project's primary branch (only those users you specified in step five above can).

While [I'm generally a fan of preferring social constraints over administrative or technical constraints](https://ben.balter.com/2015/03/08/open-source-best-practices-internal-collaboration/#4-embrace-the-constraints-of-open-source), sometimes technical constraints allow you to decentralize project governance and empower those you otherwise wouldn't trust with less-restrictive permissions. This somewhat-hidden feature gives maintainers the ability to grant an additional level of access beyond just read/write/admin, and may provide some open source projects the ability to implement (and enforce) their natural (or preferred) community-management workflows.

[^1]: It's probably also a good idea to check "Require pull request reviews before merging" and "Require status checks to pass before merging", but those aren't strictly necessary for what we're doing

[^2]: Even better, create a team, for example, `core-committers` to make managing permissions across repositories even easier
