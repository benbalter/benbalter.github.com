---
title: User blocking vs. user muting
description: Most platforms offer some form of user blocking, user muting, or both. Here's a brief look at why GitHub has taken a bit of a unique approach to blocking that diverges from what you might see on other social networks and some of the special considerations that come as a result.
---

Most platforms offer some form of user blocking, user muting, or both. Here's a brief look at why GitHub has taken a bit of a unique approach to blocking that diverges from what you might see on other social networks and some of the special considerations that come as a result.

Typically, social networks offer at least two distinct user safety features which are roughly:

* **User muting** - You don't see *the blocked user's* content.
* **User blocking** - The blocked user doesn't see *your* content.

## User muting

Muting is most useful when there's content you don't want to see or don't want to be notified about. You might mute someone who posts spoilers for your favorite show (or spoilers posted by any user), users or topics you don't want in your feed for various reasons, or mute an account that's bothering you, without being confrontational, as generally speaking the muted user doesn't ever know that they've been muted.

## User blocking (on most sites)

User blocking, at least on most sites, includes all the features of user muting (you can't see and don't get notifications for their content), but goes a step further in that it also prevents the blocked user from seeing *your* content.

Because they can't see your content, the blocked user logically can't interact with your content (reply, down vote, etc.). Blocked users are almost always able to figure out (or are explicitly told) that you've blocked them, thus making blocking inherently more confrontational than muting. Not to mention, in reality, the block only adds friction to the unwanted behavior, as the blocked user can simply log out or create a new (sock puppet) account to see or interact with your content.

## The problem with blocking and muting on most sites

Imagine a simpler time before social networks or even the internet. Now imagine one day, that an inventor comes along and hands everyone a megaphone. The megaphone allows anyone to shout anything they went, and when they do, anyone in earshot can hear it.

The next day, one townsperson stands in the middle of the town's square and uses one of those megaphones to shout something terrible about you. The megaphone inventor is quick to give you ear plugs so that you don’t have to hear what they're saying (muting), but other people, namely your friends and neighbors still do, and not only is someone shouting into a megaphone all day likely disruptive to your friends' and neighbors' daily routines, the person with the megaphone is still saying terrible things about you - you just don’t know what they're saying (and thus can’t defend yourself).[^1]

Now if the inventor makes the person saying all those terrible things wear some sort of special ear plugs that prevents them from hearing what you say (blocking), they can no longer respond or interact with you directly, but they're still welcome to shout all they want in that town square for all others to hear, and in most cases, could probably remove the ear plugs any time they wanted - far from ideal.

## Platforms' role in policing digital town squares

If this type of disruptive behavior occurred in a real-world town square, the town would have police, a justice system, and centuries of legal tradition to amicably enforce well-understood societal norms, but as the types of conversations that traditionally occurred in town squares move online, platforms have been understandably reluctant or slow to police digital town squares themselves, at least not in the same way or with the same level of maturity.

There's an ongoing debate as to the role platforms should play in policing online discourse and how that decision might affect their bottom line. Different platforms have different purposes and constraints, but if I were that hypothetical megaphone inventor, at minimum, I'd personally feel ethically compelled to ensure that my invention wasn't used as an instrument to harm others. After all, the inventor is not required to invent the megaphone in the first place, [nor are they be obligated to amplify all voices or amplify all voices equally](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#10-be-purposeful-about-the-role-you-play).

## User blocking on GitHub

At GitHub, we've historically take a slightly different approach from most social networks. We don't offer user muting at all, and user blocking doesn't have the affect of hiding any content, neither yours nor the blocked user's (although it does prevent notifications). There's good reason for this distinction: GitHub is different from most social networks in two prominent ways:

1. **GitHub is a software development platform**, meaning users come to the site to be productive - to collaborate with others to create software - not (primarily) so that their content is seen by others. This means that we, as a platform, are able to make opinionated product decisions that explicitly optimize for code collaboration, including [limiting](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#7-offer-tiered-moderation-tools) disruptions to users' ability to collaboratively build software.
2. **GitHub doesn't have any common spaces** (timelines, newsfeeds, etc.) where you'll see content from users other than events from those you explicitly opt-in to follow. Conversations exclusively happen in spaces governed by other users, users who have an incentive to keep conversations on-topic, constructive, and respectful to support their project and grow a community around their code.

Extending the metaphor from earlier, imagine a town with no town's square, no common places to congregate. The disruptive townsperson can shout all they want in their living room or at a club house, but it's unlikely that many non-like-minded people will hear what they have to say. If they wander into the local cobbler or blacksmith's shop and try shouting there, the owner can tell them to quiet down, or if necessary, kick them out if they think it's sufficiently bad for business.

On GitHub, users[^2] "control" certain spaces, such as repositories they own, or issues or comments they author in other user's repositories, with the ability to limit blocked user from interacting with content they control, regardless of its namespace.[^3] In the real world, just as a proprietor has dominion over their shop, your front lawn is yours, as is your seat at a coffee shop or your table at a restaurant, albeit temporarily and more limited in scope.

## It's *complicated*

The megaphone metaphor illustrates an extreme. Not all disruptive behavior is malicious, intentional, or personal, nor is disruptive behavior always objectively disruptive, leaving [lots of gray area](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#7-offer-tiered-moderation-tools) between the absolutes. What may seem simple on the surface as "hide their post" or "don't let them comment", is [surprising complex when you look at all the facets](https://twitter.com/benbalter/status/1222956533794906113), but there are two aspects I'd specifically like to call out:

### 1. Hiding the blocked user's content

If you block a user on GitHub, we continue to show you the blocked user's content under the belief that magically "disappearing" the content would be more disruptive to your ability to collaborate with others than if we continued to show that content in the context of ongoing conversations. This stems from the belief that users [are not inherently "good" or "bad"](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#2-focus-on-behaviors-not-users), and that they may make both constructive and disruptive contributions to projects, even if you may not want them to interact with you (or your project) going forward.

Imagine that you find yourself viewing an issue or pull request where the blocked user is an active (and constructive at the time) participant, either before or after you blocked them. Perhaps they opened a detailed bug report to which other users offered reproduction steps or made a feature request which other contributors have :+1:'d. It'd be confusing if everyone else could see the blocked user's contributions, but you could not, not to mention, given the technical nature of *most* discussions on GitHub, you may still want to reference their contribution, regardless of your current relationship with the author.

If the blocked user's posts are truly disruptive, repository owners can hide the blocked user's content *for all users*, not just you, such that their content within the repository is minimized by default when a user views the page, requiring them to explicitly opt-in to view it, or if inherently inappropriate, can be edited or deleted entirely to keep conversations constructive, welcoming, and on topic for all users. Not to mention, when maintainers moderate content within their community, [they signal acceptable behavior to community members](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#8-moderate-transparently), reducing the likelihood that other users will be similarly disruptive in the future.

### 2. Protecting against maintainer abuse

While I'd like to believe that all maintainers would be both well intentioned and level-headed at all times and that we could all trust maintainers to use moderation tools responsibly, sadly, that's not always the case. Unfortunately, in the heat of an interpersonal conflict, some maintainers take advantage of their privileged position to perform destructive moderation actions such as vindictively or maliciously editing another user's comments to falsy attribute disparaging statements to the original author.

While we primarily think of blocking on GitHub as user-to-user or project-to-user, the logical constraints must, as a result of that potential risk, also account for user-to-maintainer blocks. If a contributor has blocked a maintainer, the maintainer can still minimize (hide), delete, or reply to the contributor's comments (if they are truly disruptive), but cannot edit or react to them, to avoid fanning the flames.

It might be tempting to say that maintainers should have absolute control over their repositories, but we've seen that even well-intentioned replies can escalate otherwise volatile situations into an all out flame war, instead preferring anonymous moderation tools or forced cool-down periods whenever possible to encourage all parties to seek the most constructive resolution.

## Putting it all together

GitHub has taken a different approach to user blocking and user muting than most other platforms and can do so due to its unique structure and purpose. That's not to say that such an approach is without its complications, but I think the result has largely allowed for a [federated moderation system](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#6-let-communities-opt-in-to-self-governance), where contributors are protected and maintainers can (and want to) keep conversations constructive to grow healthy and productive communities around their code.

It's definitely not the right approach for all platforms, and far from perfect even for our own, but I wanted to share a bit more about how I've historically thought about user-to-user protections on GitHub in hopes that it could help other platforms facing similar challenges to plot their own path. As always, [these views are my own](/fine-print/).

[^1]: The ear plugs might work if everyone in the town wore them, thus nullifying the effects of the megaphone, but that's unlikely to happen (and isn't efficient in terms of allocating the externality).

[^2]: In this context, organizations can block users, preventing the blocked user from interacting with the organization's repositories, but the organization cannot open issues or comment in other user's repositories. Also to note, users cannot block organizations.

[^3]: For logical reasons, maintainers of projects are always granted *most* content moderation privileges in projects they maintain, regardless of if the author of the content they are moderating has blocked the moderator.
