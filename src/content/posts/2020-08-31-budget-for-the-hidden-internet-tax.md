---
title: Budget for the hidden "internet tax"
description: Trust and safety is a cost of doing business on the internet. If you're building a platform, budget for abuse protection before someone gets hurt.
tldr: Abuse looks like an edge case until someone gets hurt, and by then you're doing damage control. Treat trust and safety like security, a cost of doing business on the internet, and build the basics (blocking, reporting, moderation, guidelines, audit trails, and consent) before you need them.
redirect_from:
  - /2020/08/31/trust-and-safety-is-not-a-product-edge-case/
  - /2020/08/31/trust-and-safety-features-to-build-into-your-product-before-someone-gets-hurt/
writtenAtGitHub: true
---

My colleague Kat (@katmeister) once wrote about [her experience with online harassment](https://www.tinykat.cafe/on-all-that-fuckery) (content warning: racist, sexist, transphobic, hateful language, and online abuse). It's well worth reading to understand how people (most of whom don't look like me) experience the internet every day, but one line in particular stuck with me:

> it's always an "edge case" until someone's personal safety is threatened.

It's uncomfortable to acknowledge the darker corners of the internet, especially when most startup business models chase rapid growth built on the internet's ability to connect like-minded strangers. We don't like to admit it out loud, but the same internet that connects the best parts of humanity sometimes brings out the worst of it. It's tempting to write off abuse and harassment as a "tomorrow" problem (or a "we're different"[^arpanet] problem), especially in a growing startup or a crowded, competitive industry. More often than not, "tomorrow" arrives once it's too late, and you find yourself in the middle of urgent damage control.

The industry calls this all-too-often underappreciated work "trust and safety," or sometimes "platform health" or "community integrity." It's the work of making your platform a safe place for your users to interact, free from abuse, harassment, and other unwanted behavior. Too often, it's treated as a cost center, a "nice to have," or a "nice to have later" feature, rather than a core part of the product. It's a cost of doing business on the internet, a hidden "internet tax" you'll pay whether you budget for it or not.

## It's always an "edge case" until someone's personal safety is threatened

When I joined GitHub's Community and Safety team back in 2016, I distinctly remember a conversation with one of the team's then-engineers as I was onboarding. We were discussing a potential user safety feature, and ever the vigilant Product Manager, I crunched the numbers to see how prevalent the problem was. Instances where the feature would likely be useful were in the range of single digits to hundreds of users. On a platform with 30 million developers at the time, I'd rarely prioritize an issue that affected fewer than a thousand users, in favor of the team focusing on more impactful work. I quickly wrote off the problem as an "[edge case](https://en.wikipedia.org/wiki/Edge_case)." I was quickly corrected.

### Abuse isn't a bug, so don't triage it like one

The go-to heuristic in bug triage is to favor high-visibility bugs. For Product Management generally, it's low-lift and high-impact. To this day, I'll still decry a feature [if it serves less than 80% of users](/2016/03/08/optimizing-for-power-users-and-edge-cases/). But abuse vectors are different from bugs or feature requests. "Number of people affected" or "how much money they pay us" doesn't capture the magnitude and nature of the risk they present to your customers and your business (or, in Kat's case, your employees). Unlike a bug that breaks an experience or a feature that adds a new one, a single exploitation of a single abuse vector can have profound real-world effects on its target.

At best, abuse and harassment is disruptive and diminishes the user experience, which is why it's tempting to treat abuse like you would a bug, technical debt, or a feature request. But when you start talking about [doxing](https://en.wikipedia.org/wiki/Doxing), stalking, and [swatting](https://en.wikipedia.org/wiki/Swatting), it quickly goes from affecting mental health and wellbeing to threatening physical safety. I, for one, wouldn't want a platform I build to be used as a vehicle to harm others, even once, but it goes beyond "doing the right thing." In the near term, users who have (or watch others have) bad experiences stop using your product.[^1] In the long term, as an unattended community turns toxic, [it directly affects](https://www.businessinsider.com/disney-ceo-bob-iger-abandons-twitter-deal-over-abuse-problem-2019-9) the [business's value](https://nymag.com/intelligencer/2018/04/dan-mccomas-reddit-product-svp-and-imzy-founder-interview.html) in the form of reputational harm.

As I've moved from trust and safety toward product security, I'm starting to see just how differently we treat product security and user safety. If you knew of a security vulnerability in your product, you wouldn't deprioritize it because it had only been exploited "a few" times. Ideally, you'd fix it before anyone used it even once, and if you couldn't, it would become a p0 priority the moment you discovered the first exploit. :quote[Why would we protect our users' data with more care than we protect our users themselves?]{#protect-users-not-just-data}

## Build these seven features before someone gets hurt

If you're building a product or a platform and want to take on abuse and harassment *before* someone gets hurt, here are seven trust and safety features to build in early:

### Blocking or muting

When a user experiences abuse or harassment, they need basic tools to limit their continued exposure to the unwanted behavior. On most platforms, user muting prevents you from seeing or getting notifications for another user's activity. User blocking includes everything muting does, and goes a step further: it also prevents the blocked user from seeing your content. Because they can't see your content, the blocked user logically can't interact with it either. I've [written about the shortfalls of user blocking and muting](/2020/02/06/blocking-vs-muting/), but at minimum, you'll want some way for a user experiencing abuse, harassment, or other unwanted content to limit its impact on their experience.

### Reporting

Once a user has limited their exposure to the abuse or harassment, you'll want some way for them to report it to you so you can respond. Reports could be per-account, but ideally, they're tied to the content in question and as frictionless as possible. The user may have just had an upsetting or unsettling experience, and the last thing you want is to add to it with an endless maze of forms and captchas. Collect as much metadata as you can automatically, so the reporting user doesn't have to, and attach it to the report. More mature abuse reporting systems also tell the reporting user how their report was resolved.

### Hiding content

You'll want some way to hide existing content. Ideally, you can hide both specific pieces of content and all content from a specific user, so others can't see it. The moderation can be temporary (for example, a spam flag) or permanent (for example, deleting the content), and either transparent or a [shadow ban](https://en.wikipedia.org/wiki/Shadow_banning) that keeps the actor from shifting tactics. Going a step further, for minor infractions or gray areas, you can reduce the visibility or discoverability of the objectionable content.

### Preventing new content

Beyond hiding existing content, you'll also want some way to prevent new content. This often means preventing the user from logging in entirely, for ongoing or egregious violations of your Terms of Service or Community Guidelines where continued use of the platform isn't warranted.

### Community guidelines

Your Terms of Service sets a baseline for acceptable behavior that generally hovers somewhere around "don't do anything illegal." To have the policy means to respond to abuse and harassment on your platform, you should also set community guidelines beyond those bare minimums, with "golden rule" expectations like don't be a bully and don't threaten other users. If a report of abuse or harassment comes in and your hands are tied, for fear of looking reactive or biased, that helps neither you nor the reporting user. As I've [said before](/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#10-be-purposeful-about-the-role-you-play), platforms should be mindful of the role they play as the builders and maintainers of digital town squares.

### Auditability

When you receive a report of abuse or harassment, your content moderation team (you have one, right?) needs an audit trail detailed enough to recreate the incident and apply your platform's policy accurately and fairly. That means any potentially harmful or destructive action should leave an immutable record that captures, retains, and exposes all relevant information. Just as important is recording what action, if any, the moderation team took and why, to build an ongoing "[rap sheet](https://en.wikipedia.org/wiki/Criminal_record)" for the account in case of later infractions.

### User consent

Many negative interactions happen [when well-intentioned features assume implicit consent among those involved](/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#9-always-seek-user-consent). Platforms let their users down when one user's disruptive behavior can hurt another user without any action on that user's part. Give users the information they need to make an informed decision to opt in to every activity on your platform. The easiest way to do that is to set safe defaults with a bias toward privacy, and to ask permission before any potentially disruptive interaction. There's much more to say here. See [Consensual Software: How to prioritize user safety](https://medium.com/consensual-software/consensual-software-how-to-prioritize-user-safety-369f5a4dee8) to learn more about user consent in software.

### Also necessary: Internal education, consulting, shared services, and expertise

Building one-off tools or writing policies will never be enough. You also need a team with deep, platform-specific expertise. That team builds shared systems, teaches feature teams the risks and remediations, reviews features for potential abuse vectors early in the product lifecycle, sets policy and moderates content with care and context, and drives a safety-centric product and engineering culture more broadly. :quote[Trust and safety only succeeds in the long run when it's part of the company's DNA, with widespread executive and grassroots support.]{#trust-safety-company-dna}

## Blocking and reporting are only the start

Many platforms do implement basic trust and safety features like blocking or reporting, but trust and safety is much, much more than adding a blocking function to your product and moving on to the next revenue-generating feature.[^2] Trust and safety is a specialized, adversarial field, and it takes ongoing investment to stay one step ahead of those who want to use your platform to harm others. Think automated flagging, sentiment analysis, [sockpuppet](https://en.wikipedia.org/wiki/Sockpuppet_(Internet)) correlation, [brigade](https://www.merriam-webster.com/words-at-play/brigading-online-poll-meaning) prevention, anomaly detection, moderator tools, reputation scores, identity verification, minimizing in-product bias, and detailed platform policy and playbooks. The list goes on.

And that's *only* targeted harassment. It doesn't touch broader trust and safety concerns like privacy, spam, inauthentic behavior, faked signals of trust, intentionally misleading content, impersonation, phishing, illegal content,[^3] malware, financial fraud, resource abuse, moderator safety, or account security, each with its own nuanced considerations and countermeasures, and each a threat to your users, your community, and ultimately your business.

:quote[The challenge is taking trust and safety seriously while it's still a hypothetical risk, not after someone has been hurt and it's a painfully known problem.]{#hypothetical-risk-seriously} Without action now, and an ongoing commitment to back it up, your product can (and given a non-zero number of people on the internet with malicious intent, most likely will) be exploited to cause irreparable harm to your users and your community, eroding trust in your platform and its value. If this can happen to someone like Kat, who spends her days building welcoming communities, on a platform that had invested in trust and safety for some time, it can happen on yours. Budget for it before someone gets hurt.

[^arpanet]: All platforms eventually become vehicles for abuse. Even ARPANET, the precursor to the internet, [had spam](https://en.wikipedia.org/wiki/History_of_email_spam#The_%22first_spam_email%22_in_1978). If you don't think your platform has abuse today, chances are it does, and you don't know it yet.

[^1]: A [study by the Anti-Defamation League](https://www.wired.com/story/severe-online-harassment-2018-adl-survey/) found that 1 in 3 Americans, and half of those 18–29 years old, experience severe online harassment. 38% withdrew from the platform after the experience. GitHub's [open source survey](https://github.com/github/open-source-survey) found that 20% of users who experienced *or witnessed* negative interactions stopped contributing as a result.

[^2]: I'd argue that when you look at the competitive advantage healthy, welcoming communities give platforms (see, for example, the 2020 scramble to acquire TikTok), trust and safety *is* a revenue-generating exercise. It's just hard to quantify, since it affects growth metrics indirectly and is most visible when it's absent.

[^3]: For example, child sexual abuse material (CSAM) or terrorist and violent extremist content (TVEC).
