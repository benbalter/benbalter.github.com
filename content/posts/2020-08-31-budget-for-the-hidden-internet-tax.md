---
title: Budget for the hidden "internet tax"
description: Trust and safety (abuse protection) is a critical part of your product, and it's a cost of doing business on the internet. It's a hidden "internet tax" that you'll need to pay, whether you want to or not.
---

It's uncomfortable to acknowledge the darker corners of the internet, especially when most startup business models have a rapid growth focus that are built on the internet's ability to connect like-minded strangers. We don't like to admit it out loud, but just as the internet is often an amazing place in connecting the best parts of humanity, the internet is sometimes a terrible place in also bringing out the worst of it. It's truly tempting to forgo abuse and harassment as a "tomorrow" problem (or a "we're different"[^arpanet] problem), especially in a growing startup or a highly competitive industry.

The industry often refers to this type of all-too-frequently underappreciated work as "trust and safety" or sometimes "platform health" or "community integrity". It's the work of ensuring that your platform is a safe place for your users to interact, free from abuse, harassment, and other unwanted behavior. Unfortunately, it's often seen as a cost center, a "nice to have", or a "nice to have later" feature, rather than a core part of the product. The reality is that trust and safety is a critical part of your product, and it's a cost of doing business on the internet. It's a hidden "internet tax" that you'll need to pay, whether you want to or not.

### It's always an "edge case" until someone's personal safety is threatened[^edge-case-until]

When I joined GitHub's Community and Safety team back in 2016, I distinctly remember a conversation I had with one of the team's then-engineers as I was onboarding. We were discussing a potential user safety feature, and ever the vigilant Product Manager, I crunched the numbers to see how prevalent the problem was. Instances where the feature would likely be useful was in the range of single digits to hundreds of users. On a platform with 30 million developers at the time, if an issue affected less than a thousand users, I'd rarely prioritize it, in favor of the team focusing on more impactful work. I quickly wrote off the problem as an "[edge case](https://en.wikipedia.org/wiki/Edge_case)". I was quickly corrected.

#### A prioritization problem

The go-to heuristic in bug triage is to favor high-visibility bugs. For Product Management generally, it's low-lift and high-impact. To this day, I will often still decry a feature [if it serves less than 80% of users](https://ben.balter.com/2016/03/08/optimizing-for-power-users-and-edge-cases/). But abuse vectors are fundamentally different from bugs or feature requests in that "number of people affected" or "how much money they pay us" doesn't properly capture the magnitude and nature of the risk it presents to both your customers and your business. Unlike a bug that breaks an experience or a feature that enables new ones, a single exploitation of a single abuse vector can have profound real-world affects on its target.

At best, abuse and harassment is disruptive and diminishes the user experience, which is why it might be tempting to treat abuse like you would a bug, technical debt, or a feature request. But when you start talking about [doxing](https://en.wikipedia.org/wiki/Doxing), stalking, and [swatting](https://en.wikipedia.org/wiki/Swatting), it quickly goes from affecting mental health and wellbeing to threatening physical safety. I, for one, wouldn't want a platform I build to be used as a vehicle to harm others, even in a single instance, but it goes beyond "doing the right thing". In the near term, users who have (or observe others having) bad experiences stop using your product,[^1] and in the long term, as an unattended community turns toxic, [it directly affects](https://www.businessinsider.com/disney-ceo-bob-iger-abandons-twitter-deal-over-abuse-problem-2019-9) the [business's value](https://nymag.com/intelligencer/2018/04/dan-mccomas-reddit-product-svp-and-imzy-founder-interview.html) in the form of reputational harm.

As I've transitioned from trust and safety towards product security, I'm starting to see just how differently we treat product security from user safety. If you knew of a security vulnerability in your product, you wouldn't deprioritize it because it had only been exploited "a few" times. Ideally, you'd remediate it before it's used even once, and in the event you weren't able to do so, almost without question, it becomes a p0 priority as soon as you discover the first instance of it's exploitation. Why would we protect our users' data with better care than we'd seek to protect our users themselves?

### Features to build

If you're building a product or a platform and want to proactively take on abuse and harassment *before* someone gets hurt, here are seven trust and safety features to build into your product early on:

#### Blocking or muting

When a user experiences abuse or harassment, they need basic tools to minimize their continued exposure to the unwanted behavior. On most platforms, user muting is a feature that prevents you from seeing or receiving notifications for the activity of another user. User blocking includes all the features of user muting, but goes a step further in that it also prevents the blocked user from seeing your content. Because they can’t see your content, the blocked user logically can’t interact with your content either. I've [written before about the shortfalls of user blocking and muting](https://ben.balter.com/2020/02/06/blocking-vs-muting/), but at minimum, you'll want some way for a user experiencing abuse, harassment, or other unwanted content to be able to minimize the impact on their experience.

#### Reporting

Once a user has taken steps to minimize their exposure to the abuse or harassment, you'll want some mechanism for them to report the abuse to you to escalate a response. This could be per-account, but ideally, it should be associated with the content in question, and as frictionless as possible. The user may have just had an upsetting or unsettling experience, and the last thing you want to do is add to it with an endless maze of forms as captchas. Collect as much metadata as you can automatically to absorb the complexity on behalf of the reporting user, and associate it with the report. More mature abuse reporting systems also provide the reporting user with transparency as to the resolution of their report.

#### Hiding content

You'll want some way to hide existing content. Ideally, you'd have the ability to hide both specific pieces of content and all content from a specific user, preventing their content from being seen by others. The moderation can be temporary (for example, a spam flag) or permanent (for example, deleting the content) and transparent or in the form of a [shadow ban](https://en.wikipedia.org/wiki/Shadow_banning) to prevent the actor from shifting tactics. Going a step further, for minor infractions or gray areas, you can reduce the visibility or discoverability of the objectionable content.

#### Preventing new content

Beyond hiding existing content, you'll also want some way to prevent the creation of new content. This is often done by preventing the user from logging in entirely and can be used if an ongoing or egregious violation of your Terms of Service or Community Guidelines where continued use of the platform isn't warranted.

#### Community guidelines

Your Terms of Service establishes a baseline for acceptable behavior that generally hovers somewhere around “don’t do anything illegal”. To ensure you have the policy means to respond to abuse and harassment on your platform, you should also establish heightened community guidelines beyond those bare minimums, that establishes “golden-rule”-type expectations like don’t be a bully or don’t threaten other users. It doesn't do you or the reporting user any good if a report of abuse or harassment comes in, and there's nothing you can do about it because your hands are tied for fear of looking reactive or biased. As I've [said before](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#10-be-purposeful-about-the-role-you-play), platforms should be mindful of the role they play as the builders and maintainers of digital town squares.

#### Auditability

When you receive a report of abuse or harassment, you'll want to ensure your content moderation team (you have one, right?) has the necessary audit trail available to them to recreate the incident sufficiently to accurately and fairly apply your platform's policy. That means that any potentially harmful or destructive action should establish an immutable record that captures, retains, and exposes all relevant information. Equally important is capturing what action, if any, the moderation team took, and why they took that action, to build an ongoing "[rap sheet](https://en.wikipedia.org/wiki/Criminal_record)" for the account if subsequent infractions.

#### User consent

Many negative interactions occur [when well-intentioned features assume implicit consent among those involved](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#9-always-seek-user-consent). Platforms let their users down when one user’s disruptive behavior is able to negatively impact another user without any action on their part. Users should be given the information necessary to make an informed decision to opt-in to engage in every activity on your platform. The easiest way to do this is to establish safe defaults with a bias towards privacy and ask for permission prior to any potentially disruptive interaction. There's much more to be said here. See [Consensual Software: How to prioritize user safety](https://medium.com/consensual-software/consensual-software-how-to-prioritize-user-safety-369f5a4dee8){ data-proofer-ignore="true" } to learn more about user consent in software.

#### Also necessary: Internal education, consulting, shared services, and expertise

Just building one-off tools or establishing policies will never be enough. Equally important is cultivating a team with deep, platform-specific, subject-matter expertise that can build shared systems, educate feature teams as to the risks and remediations, consult on features for potential abuse vectors early in the product lifecycle, thoughtfully and contextually set policy and moderate content, and drive a safety-centric product and engineering culture more broadly. Trust and safety is only truly successful in the long-run when it's part of the company's DNA and enjoys widespread executive and grassroots support.

### Conclusion

These features, while essential to ensure the safety of your users and your platform, are [just the start](https://ben.balter.com/2020/08/31/trust-and-safety-is-not-a-product-edge-case/#beyond-blocking). Trust and safety is a highly specialized, adversarial space, and it requires a baseline of ongoing investment to stay one step ahead of those who wish to use your platform to do harm to others. Looking to invest further in building a strong, welcoming community around your product? Take a look at some [lessons learned](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/) fostering a community of communities at GitHub, which I hope can be adapted to the community building nuances of your own platform.

[^arpanet]: All platforms eventually become vehicles for abuse. Even ARPANET, the precursor to the internet [had spam](https://en.wikipedia.org/wiki/History_of_email_spam#The_%22first_spam_email%22_in_1978){ data-proofer-ignore=true }. If you don't think your platform has abuse today, chances are it does, and you don't know it yet.

[^edge-case-until]: I can't take credit for that statement. A former colleague [wrote about her experience with online harassment](https://www.tinykat.cafe/on-all-that-fuckery) while at GitHub (content warning: racist, sexist, transphobic, hateful language, and online abuse). The post is well worth reading to better understand how people (most of whom don't look like me) can often experience the internet.
