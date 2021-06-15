---
title: Moderating open source conversations to keep them productive
description: Successful open source projects create a welcoming community by fostering productive conversations, promoting healthy collaboration, and de-escalating conflict when things get heated or off topic.
---

{% include foss-at-scale.html nth="fourth and final" %}

Successful open source projects create a welcoming community by fostering productive conversations, promoting healthy collaboration, and de-escalating conflict when things get heated or off topic. Once you've [set contributors up for success](https://ben.balter.com/2020/05/15/set-open-source-contributors-up-for-success/), [automated common community-management tasks](https://ben.balter.com/2020/08/10/automate-common-open-source-community-management-tasks/), and [establishd a governance model](https://ben.balter.com/2021/06/14/open-source-governance/), you should be prepared to moderate conversations in the repositories you maintain, to help [build a strong community](https://help.github.com/en/github/building-a-strong-community) around your code.

### Establish a Code of Conduct

Before you begin moderating, [establish a code of conduct](https://opensource.guide/code-of-conduct/). Codes of conduct communicate expectations for behavior within your community, as well as how you will enforce those expectations when a contributor's behavior diverges. While you don't necessarily need to adopt a code of conduct on day one for small projects, as your project matures and your community grows, you'll want to adopt a code of conduct, and adopt one _before_ you need it. Not only does it signal to potential contributors that you will take action when necessary, it will reduce the appearance of bias when you respond to disruptive behavior.

Like open source licenses, a number of widely-adopted codes of conduct already exist, and you adopt one by adding a `CODE_OF_CONDUCT` file to the root of your repository. This is best accomplished through a pull request, which often prompts a necessary conversation within your community, and allows you to adapt the code of conduct to your needs. On GitHub, if you visit your community profile, you should be prompted to choose from several popular code of conduct templates.

### Allow community members to report comments 

Before you can moderate disruptive behavior, you first need to learn about it. While it's possible for maintainers of small projects to read every single comment and issue, as your project grows and matures, that quickly becomes untenable. Empower your community to flag unproductive comments for your review by [opting-in to community reporting](https://help.github.com/en/github/building-a-strong-community/managing-reported-content-in-your-organizations-repository). Once enabled for your repository, you'll have access to a queue where community flagged comments can be reviewed and moderated using the suite of [tiered moderation tools](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#7-offer-tiered-moderation-tools), described below, allowing you to respond proportionately to unwanted behavior, and ideally bring contributor behavior back in line with community norms.

### Moderating disruptive comments

The least severe tiered moderation response is [minimizing a comment](https://help.github.com/en/github/building-a-strong-community/managing-disruptive-comments#hiding-a-comment). Minimized comments are hidden by default when a comment thread loads, meaning viewers must opt-in to seeing the comment's content. Hiding a comment is useful for reducing the screen real estate of off-topic or inappropriate comments, politely signaling to the author that such comments are not in line with community expectations.

If part of a comment contributes to the conversation but another part detracts, you can consider [editing the comment](https://docs.github.com/en/communities/moderating-comments-and-conversations/managing-disruptive-comments#editing-a-comment) to bring it in line with community norms, or for particularly egregious comments, you can [delete it entirely](https://docs.github.com/en/communities/moderating-comments-and-conversations/managing-disruptive-comments#deleting-a-comment).

### Lock heated conversations

When an entire conversation is heated, unproductive, or violates your code of conduct, sometimes it's best to [lock the conversation](https://help.github.com/en/github/building-a-strong-community/locking-conversations) entirely, either permanently or temporarily. Locking a conversation prevents anyone without `write` access to the repository from commenting or reacting on the issue. Doing so can force folks to step away from the conversation for a bit - to create space for emotions to settle - so that things can get back on track, in the issue and across your repository. 

Sometimes you might also lock an issue when a decision has been made and subsequent comments are not constructive. When you lock the conversation, you'll be prompted to offer a reason, which appears in the issue timeline. Like minimized comments, this once again communicates to contributors what behavior is acceptable and what is not.

### Limit interactions to force a cooldown 

When disruptive behavior spills from one or two issues to your entire repository (or even across repositories), consider [limiting interactions](https://help.github.com/en/github/building-a-strong-community/limiting-interactions-in-your-repository). Interaction limits are the next more aggressive moderation tier, and allow you to restrict who can comment or open issues and pull requests to established users, to those that have previously contributed to your repository, or only to those with write access. Similar to locking conversations, interaction limits are intendeds to enforce a temporary cooldown period when things get heated. 

### Block disruptive users

The final and most aggressive form of moderation is [blocking a disruptive user](https://help.github.com/en/github/building-a-strong-community/blocking-a-user-from-your-organization#blocking-a-user-in-a-comment). Blocking a user prevents them from interacting with your repositories in any way. This ban can be permanent, or if a first or second infraction, ideally temporary to allow for self-rehabilitation of their behavior. When you block the user, you could do so silently to avoid conflict, or if you'd like to, you can notify the user that they've been blocked, with a link to the offending content and/or your code of conduct. In a perfect world, disruptive comments would be a misunderstanding or lack of understanding of community norms, meaning a "time out", along with specifics about the deviation, could create more constructive community members, moving disruptive contributors into productive contributors.

By establishing a code of conduct, enabling community reporting, and using GitHub's moderation tools, active community management keeps conversations constructive by promoting healthy collaboration, keeping discussions on track, de-escalating conflict, and overall creating a welcoming community, all of which, help make your open source project (and its conversations) productive.
