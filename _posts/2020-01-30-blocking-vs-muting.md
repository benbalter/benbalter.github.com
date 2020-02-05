---
title: Blocking vs muting
description:
---

Most social networks offer some form of user blocking, user muting, or both. Typically, each feature is roughly:

* **User Muting** - You don't see the blocked user's content.
* **User blocking** - The blocked user doesn't see your content.

### User muting

Muting is most useful when there's content you don't want to see or don't want to be notified about. You might mute someone who posts spoilers for your favorite show (or spoilers posted by any user), users or topics you don't want in your feed for various reasons, or mute an account that's bothering you, without being confrontational, as generally speaking, the muted user doesn't ever know that they're muted.

### User blocking (on most sites)

User blocking, at least on most sites, includes all the features of user muting (you can't see and don't get notifications for their content), but goes a step further and also prevents the blocked user from seeing _your_ content. Because of this, the blocked user can't interact with your content (since they can't see it), and generally are able to figure out (or are explicitly told) that you've blocked them, thus making it more confrontational than muting. Not to mention, in reality, the block only adds friction to the unwanted behavior, as the blocked user can simply log out or create a new account to see your content.

### The problem with blocking and muting on most sites

Imagine a simpler time before social networks or even the internet. Now imagine one day, that an inventor comes along and hands everyone a megaphone. The megaphone allows anyone to shout anything they went, and when they do, anyone in earshot can hear it.

Now one day, one townsperson stands in the middle of the town';s square shouting something terrible about you. The inventor is quick to give you special ear plugs so that you don’t have to hear it (muting), but other people, namely your friends and neighbors still do, and not only is someone shouting into a megaphone all day likely annoying to your friends and neighbors, the person with the megaphon is still spouting defamatory statements about you, but now you just don’t know what they're saying (and thus can’t defend yourself). The ear plugs might work if everyone in the town wore them, thus nullifying the effects of the megaphone, but that's unlikely to happen (and isn't efficient in terms of allocating the externality).

Now if the inventor makes the shouter wear special ear plugs that prevents them from hearing what you say (blocking), they can no longer respond or interact with you directly, but they're still welcome to shout all they want in that town square for all others to hear, and in most cases, could probably remove the ear plugs any time they wanted.

### Platforms' role in keeping the peace

If this type of disruptive behavior occurred in a real-world town square, the town would have police, a legal system, and centuries of legal tradition to amicably enforce societal norms, but as the types of conversations that traditionally occurred in town squares move online, platforms have been understandably reluctant or slow to police digital town squares themselves, at least not in the same way.

There's an ongoing debate as to the role platforms should play in policing online discourse, and different platforms have different purposes and constraints, but if I were that hypothetical megaphone inventor, I'd feel ethically compelled to ensure that my invention wasn't used as an instrument to harm others. After all, [the inventor is not required to invent the megaphone in the first place](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#10-be-purposeful-about-the-role-you-play), nor would they be obligated to amplify all voices or amplify all voices equally.

### User blocking on GitHub

At GitHub, we take a slightly different approach from most social networks. We don't offer user muting at all, and user blocking doesn't have the affect of hiding any content, neither yours nor the blocked user's, and there's good reason for this distinction. GitHub is different from most social networks in two ways:

1. GitHub is a software development platform, meaning users come to the site to be productive - to collaborate with others to create software - not (usually) so that their content is seen by others. This means that we are able to make opinionated product decisions that explicitly optimize for code collaboration, including by [limiting](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#7-offer-tiered-moderation-tools) disruptions to users' ability to collaboratively build software.
2. GitHub doesn't have any common spaces (timelines, newsfeeds, etc.) where you'll see content from users other than events from those you explicitly opt-in to following. Conversations exclusively happen in spaces governed by other users, users who have an incentive to keep conversations on-topic and respectful in order to support their project and grow a community around their code.

Extending the metaphor from earlier, imagine a town with no town's square, no common places to congregate. The disruptive townsperson can shout all they want in their living room or at a club house, but it's unlikely that many non-likeminded people will hear what they have to say. If they wander into the local cobbler or blacksmith and try shouting there, the owner can tell them to quiet down, or if necessary, kick them out.
