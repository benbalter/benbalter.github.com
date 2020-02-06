---
title: User blocking vs. user muting
description: Most social networks offer some form of user blocking, user muting, or both. Here's the difference between the two and why GitHub takes a unique approach to blocking that relies on federated community management for content moderation.
---

Most social networks offer some form of user blocking, user muting, or both. Typically, each feature is roughly:

* **User Muting** - You don't see _the blocked user's_ content.
* **User blocking** - The blocked user doesn't see _your_ content.

### User muting

Muting is most useful when there's content you don't want to see or don't want to be notified about. You might mute someone who posts spoilers for your favorite show (or spoilers posted by any user), users or topics you don't want in your feed for various reasons, or mute an account that's bothering you, without being confrontational, as generally speaking the muted user doesn't ever know that they've been muted.

### User blocking (on most sites)

User blocking, at least on most sites, includes all the features of user muting (you can't see and don't get notifications for their content), but goes a step further and also prevents the blocked user from seeing _your_ content.

Because they can't see your content, the blocked user logically can't interact with your content. Blocked users are almost always able to figure out (or are explicitly told) that you've blocked them, thus making blocking more confrontational than muting.

Not to mention, in reality, the block only adds friction to the unwanted behavior, as the blocked user can simply log out or create a new (sock puppet) account to see or interact with your content.

### The problem with blocking and muting on most sites

Imagine a simpler time before social networks or even the internet. Now imagine one day, that an inventor comes along and hands everyone a megaphone. The megaphone allows anyone to shout anything they went, and when they do, anyone in earshot can hear it.

Now one day, one townsperson stands in the middle of the town's square shouting something terrible about you. The megaphone inventor is quick to give you special ear plugs so that you don’t have to hear it (muting), but other people, namely your friends and neighbors still do, and not only is someone shouting into a megaphone all day likely annoying to your friends and neighbors, the person with the megaphone is still spouting defamatory statements about you. Now you just don’t know what they're saying (and thus can’t defend yourself).[^1] 

Now if the inventor makes the shouter wear special ear plugs that prevents them from hearing what you say (blocking), they can no longer respond or interact with you directly, but they're still welcome to shout all they want in that town square for all others to hear, and in most cases, could probably remove the ear plugs any time they wanted - far from ideal.

### Platforms' role in policing digital town squares

If this type of disruptive behavior occurred in a real-world town square, the town would have police, a legal system, and centuries of legal tradition to amicably enforce societal norms, but as the types of conversations that traditionally occurred in town squares move online, platforms have been understandably reluctant or slow to police digital town squares themselves, at least not in the same way.

There's an ongoing debate as to the role platforms should play in policing online discourse. Different platforms have different purposes and constraints, but if I were that hypothetical megaphone inventor, I'd personally feel ethically compelled to ensure that my invention wasn't used as an instrument to harm others. After all, [the inventor is not required to invent the megaphone in the first place](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#10-be-purposeful-about-the-role-you-play), nor are they be obligated to amplify all voices or amplify all voices equally.

### User blocking on GitHub

At GitHub, we take a slightly different approach from most social networks. We don't offer user muting at all, and user blocking doesn't have the affect of hiding any content, neither yours nor the blocked user's (although it does prevent notifications). There's good reason for this distinction: GitHub is different from most social networks in two prominent ways:

1. **GitHub is a software development platform**, meaning users come to the site to be productive - to collaborate with others to create software - not (primarily) so that their content is seen by others. This means that we, as a platform, are able to make opinionated product decisions that explicitly optimize for code collaboration, including [limiting](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#7-offer-tiered-moderation-tools) disruptions to users' ability to collaboratively build software.
2. **GitHub doesn't have any common spaces** (timelines, newsfeeds, etc.) where you'll see content from users other than events from those you explicitly opt-in to following. Conversations exclusively happen in spaces governed by other users, users who have an incentive to keep conversations on-topic and respectful in order to support their project and grow a community around their code.

Extending the metaphor from earlier, imagine a town with no town's square, no common places to congregate. The disruptive townsperson can shout all they want in their living room or at a club house, but it's unlikely that many non-like-minded people will hear what they have to say. If they wander into the local cobbler or blacksmith and try shouting there, the owner can tell them to quiet down, or if necessary, kick them out.

On GitHub, blocking users[^2] "control" certain spaces, such as repositories they own, or issues or comments they author in other user's repositories, with the ability to limit the blocked user from interacting with content they control, regardless of its namespace.[^3]

### It's _complicated_

What may seem simple on the surface as "hide their post" or "don't let them comment", is [surprising complex when you look at all the facets](https://twitter.com/benbalter/status/1222956533794906113), but there are two aspects I'd specifically like to call out:

#### 1. Hiding the blocked user's content

If you block a user on GitHub, we continue to show you the blocked user's content under the belief that magically "disappearing" the content would be more disruptive to your ability to collaborate with others than if we continued to bring that context into ongoing conversations. This stems from the belief that users [are not inherently "good" or "bad"](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#2-focus-on-behaviors-not-users), and that they may make both constructive and disruptive contributions to projects, even if you may not want them to interact with you going forward.

Imagine that you find yourself viewing an issue or pull request where the blocked user is an active (and constructive at the time) participant, either before or after you blocked them. Perhaps they opened a detailed bug report to which other users offered reproduction steps or made a feature request which other contributors have :+1:'d. It'd be confusing if everyone else could see the blocked user's contributions, but you could not, not to mention, given the technical nature of _most_ discussions, you may still want to reference their contribution, regardless of your relationship with the author.

If the blocked user's posts are truly disruptive, repository owners can hide the blocked user's content _for all users_, not just you, such that their content within the repository is minimized by default for all users who view the page and require them to explicitly opt-in to view it, or if inherently inappropriate, can be deleted entirely to keep conversations constructive and on topic for all users.

#### 2. Protecting against maintainer abuse

While I'd hope that all maintainers would be both well intentioned and level-headed at all times, and that we could all trust maintainers to responsibly use moderation tools, sadly, that's not always the case. Unfortunately, in the heat of an interpersonal conflict, some maintainers take advantage of their privileged position to perform disruptive moderation actions such as vindictively or maliciously editing another user's comments.

While we primarily think of blocking on GitHub as user-to-user or project-to-user, the logical constraints must, as a result, also allow for user-to-maintainer blocks. If a contributor has blocked a maintainer, the maintainer can still minimize (hide) or delete the contributors comments (in the event that they are truly disruptive), but cannot edit, reply, or react to them, to avoid fanning the flames. Additionally, hiding and deleting create publicly-visible timeline entries [to rehabilitate the disruptive user and communicate community norms](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#8-moderate-transparently).

While it might be tempting to say that maintainers should have absolute control over their repositories, we've seen that even well-intentioned replies can escalate things to an all out flame warm, preferring anonymous moderation tools or forced cool-down periods to encourage all parties to seek the most constructive outcome.

### Putting it all together

GitHub has historically taken a different approach to user blocking and user muting than most other platforms, and can do so due to its unique structure and purpose. That's not to say that such an approach is without its complications, but I think the end result has allowed for a [largely federated moderation system](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#6-let-communities-opt-in-to-self-governance), where both contributors are protected and maintainrs can (and want to) keep conversations productive. 

It's definately not the right approach for all platforms, but wanted to share a bit more about how I think about user-to-user protections on GitHub.

---

[^1]: The ear plugs might work if everyone in the town wore them, thus nullifying the effects of the megaphone, but that's unlikely to happen (and isn't efficient in terms of allocating the externality).

[^2]: In this context, organizations can block users, preventing the blocked user from interacting with the organization's repositories, but the organization cannot open issues or comment in other user's repositories. Also to note, users cannot block organizations.

[^3]: For logical reasons, maintainers of projects are always granted _most_ content moderation privileges in projects they maintain, regardless of if the author of the content they are moderating has blocked the moderator.