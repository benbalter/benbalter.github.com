---
title: Seven trust and safety features to build into your product before someone gets hurt
description: 
---

I've [written before](#) about the importance of investing in trust and safety. If you're building a product and want to proactively take on abuse and harassment _before_ someone gets hurt, here are seven trust and safety features to build into your product early on:

### 1. Blocking or muting

When a user experiences abuse or harassment, they need basic tools to minimize their continued exposure to the unwanted behavior. On most platforms, user muting is a feature that prevents you from seeing or receiving notifications for the activity of another user. User blocking includes all the features of user muting, but goes a step further in that it also prevents the blocked user from seeing your content. Because they can’t see your content, the blocked user logically can’t interact with your content either. I've [written before about the shortfalls of user blocking and muting](https://ben.balter.com/2020/02/06/blocking-vs-muting/), but at minimum, you'll want some way for a user experiencing abuse, harassment, or other unwanted content to be able to minimize the impact on their experience.

### 2. Reporting

Once a user has taken steps to minimize their exposure to the abuse or harassment, you'll want some mechanism for them to report the abuse to you to escalate a response. This could be per-account, but ideally, it should be associated with the content in question, and as frictionless as possible. The user may have just had an upsetting or unsettling experience, and the last thing you want to do is add to it with an endless maze of forms as captchas. Collect as much metadata as you can automatically to absorb the complexity on behalf of the reporting user, and associate it with the report. More mature abuse reporting systems also provide the reporting user with transparency as to the resolution of their report.

### 3. Hiding content

You'll want some way to hide existing content. Ideally, you'd have the ability to hide both specific pieces of content and all content from a specific user, preventing their content from being seen by others. The moderation can be transparent, or in the form of a [shadow ban](https://en.wikipedia.org/wiki/Shadow_banning) to prevent the actor from shifting tactics. 

### 4. Preventing new content

Beyond hiding existing content, you'll also want some way to prevent the creation of new content. This is often done by preventing the user from logging in entirely and can be used in the event of an ongoing or egregious violation of your Terms of Service or Community Guidelines where continued use of the platform isn't warranted.

### 5. Community guidelines

Your Terms of Service establishes a baseline for acceptable behavior that generally hovers somewhere around “don’t do anything illegal”. To ensure you have the policy means to respond to abuse and harassment on your platform, you should also establish heightened community guidelines beyond those bare minimums, that establishes “golden-rule”-type expectations like don’t be a bully or don’t threaten other users. It doesn't do you or the reporting user any good if a report of abuse or harassment comes in, and there's nothing you can do about it because your hands are tied for fear of looking reactive or biased. As I've [said before](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#10-be-purposeful-about-the-role-you-play), platforms should be mindful of the role they play as the builders and maintainers of digital town squares.

### 6. Auditability

When you receive a report of abuse or harassment, you'll want to ensure your content moderation team (you have one, right?) has the necessary audit trail available to them to recreate the incident sufficiently to accurately and fairly apply your platform's policy. That means that any potentially harmful or destructive action should establish an immutable record that captures, retains, and exposes all relevant information. Equally important is capturing what action, if any, the moderation team took, and why to build an ongoing "[rap sheet](https://en.wikipedia.org/wiki/Criminal_record)" for the account in the event of subsequent infractions.

### 7. User consent

Many negative interactions occur [when well-intentioned features assume implicit consent among those involved](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/#9-always-seek-user-consent). Platforms let their users down when one user’s disruptive behavior is able to negatively impact another user without any action on their part. Users should be given the information necessary to make an informed decision to opt-in to engage in every activity on your platform. The easiest way to do this is to establish safe defaults with a bias towards privacy and ask for permission prior to any potentially disruptive interaction. There's much more to be said here. See [Consensual Software: How to prioritize user safety](https://medium.com/consensual-software/consensual-software-how-to-prioritize-user-safety-369f5a4dee8) to learn more about user consent in software.

### Also necessary: Internal education, consulting, shared services, and expertise

Just building tools or establishing policies will never be enough. Equally important is cultivating a team with deep, platform-specific, subject-matter expertise that can build shared systems, educate feature teams as to the risks and remediations, consult on features for potential abuse vectors early in the product lifecycle, and drive a safety-centric product and engineering culture more broadly. Trust and safety is only truly successful in the long-run when it's part of the company's DNA and enjoys widespread executive and grassroots support. 
