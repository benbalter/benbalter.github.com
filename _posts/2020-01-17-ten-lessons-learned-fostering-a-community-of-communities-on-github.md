---
title: 10 lessons learned fostering a community of communities at GitHub
description: Lessons learned implementing a trust and safety framework for empowering open source maintainers to grow strong, semi-independent communities around shared technical challenges on GitHub.
---

In 2016, twelve GitHubbers met in a small conference room in Toronto. GitHub's Community and Safety team had just been formed a few months prior, and Hubbers from across the company - engineering, product, legal, support, and social impact - huddled together over poutine to discuss how we could ensure our platform could avoid the toxic fate that was beginning to befall other social networks at the time.

[Extreme Post It Notes](https://www.amazon.com/Post-Extreme-Resistant-Engineered-Conditions/dp/B0797HV8JW?tag=benbalter07-20) in hand, we developed a framework for empowering open source maintainers to grow strong, semi-independent communities around shared problems, and laid out an ambitious three-year product roadmap to get there. Looking back at the experience, I wanted to share some of the lessons learned implementing that roadmap these past three years, in case they are helpful for others who are just starting to establish or want to level up the trust and safety efforts of their own platform:

### 1. Online communities are offline communities, just online

Think about an in-person community you’re part of. It could be the neighborhood or town you live in, the congregation at your place of worship, or your local bowling league. Communities are about groups of people coming together to solve a shared challenge (having a nice place to live, practicing one’s beliefs, or socializing).

Each community has its leaders (elected officials, clergy, team captains) and some form of codified ideals (legal code, religious teachings, league regulations). When you move that community online, the social norms that build a sense of comradeship also follow.

Open source communities are no different from those offline communities. While we might hope that all contributions would remain constructive, just as offline communities might have a neighborhood watch, online communities require community moderation tools to correct their members’ behavior when it deviates from established norms.

### 2. Focus on behaviors, not users

Traditional trust and safety jargon often relies on "malicious users", "bad actors", or other pejorative terms that label users as either "good" or "bad". Once a user has been identified as a spammer or a fraudster, they're shown the ban hammer and never heard from again.

While this distinction may make sense in security or spam contexts in which the relationship between user and platform is closer to attacker and defender, it often doesn't make sense in the context of content moderation. Yes, some users will harbor genuine ill-will, but how do we distinguish repeat offenders from a user who posts a heated comment out of [hanger](https://www.humana.com/learning-center/health-and-wellbeing/healthy-living/hangry)?

We originally used the tongue-in-cheek "jerkface" persona to describe all such users who posted disruptive content, until we realized that the label reduced our own empathy for such users. Instead, we shifted to focusing on _behaviors_. We started asking how we could discourage this disruptive behavior or encourage that constructive behavior and suddenly the conversation became very different. Rather than classification and privilege revocation, we started thinking in terms of friction and rehabilitation.

### 3. Intervene before, during, and after disruptive behavior

As a platform, your biggest lever is your ability to intervene in otherwise organic human interactions. In the context of disruptive behavior, that intervention could come before, during, or after the disruptive act:

|         | Before                   | During             | After                     |
| :------ | :----------------------- | :----------------- | :------------------------ |
| Goal    | Encourage good behavior  | Introduce Friction | Minimize impact           |
| Type    | User-to-community        | User-to-product    | User-to-user              |
| Example | Code of conduct adoption | User blocking      | Hiding disruptive content |
{: .table }

Most platforms begin their user safety efforts by focus on during-the-act interventions. These are things like a blocked user not being able to DM or @mention the blocking user that seek to add friction (defined as how easy or hard it is to do something) to creating potentially disruptive content.

Should that fail and a user post something disruptive, your next line of defense is to minimize the impact the content can have on others after the fact. This could be a shadow ban, down voting, requiring opt-in to view the content, or a moderator's ability to delete it entirely.

Even more impactful (and most challenging) would be to prevent that content from being created in the first place by encouraging good behavior from the onset. This involves encouraging community leaders to establish and document community norms and providing the tools to (often aggressively) communicate those norms to new community members.

Defense in depth is a time-tested concept within the security community and the same principles apply to content moderation. You can't solely offer safeguards like user blocking or muting and expect an overall-welcoming community absent additional before- and after-the-fact product interventions.

### 4. Encourage good "online citizenship"

Just as offline communities might have model citizens that volunteer to organize the local canned food drive, online communities should encourage users to be good online citizens. Initially, we thought that a user's behavior could fall into one of two categories, destructive or constructive, and saw our role as pushing users from the former to the latter.

There will always be users who exhibit disruptive behavior, intentionally or otherwise, and it's never going to be possible to push users to exhibit constructive behavior 100% of the time, meaning the balance would fall closer to disruptive than constructive, making it a losing fight.

Instead, we introduced a third category of inclusive behavior which established the ultimate goal of good online citizenship. Disruptive behaviors undermine community collaboration and individual productivity. These are your trolls, spammers, and bullies. Constructive behavior comprises the bulk of contributors and moderators that share content and interact with others. Inclusive behaviors go a step beyond that to foster an open and welcoming environment and make participation in a community a productive, collaborative experience for others.

If through friction and product interventions we could get some disruptive users to exhibit constructive behavior, and other generally constructive users to exhibit inclusive behavior then we had a fighting chance at creating a community where the peak of the apex of the contribution bell curve hovered above constructive with a long tail on each side.

### 5. Establish tiered expectations

Site-wide documents like a platform's Terms of Service or Community Guidelines establish a base line for acceptable user behavior. These documents encompass "don't do anything illegal" along with "golden-rule"-type expectations like don't be a bully or don't threaten other users. Deviations from these expectations are generally handled by a platform's Trust and Safety or support teams.

Individual communities should be empowered and encourage to establish heightened community norms beyond those base line expectations. In the GitHub context this can be as mundane as spelling out how to contribute or as sophisticated as a formal code of conduct with specific reporting and review procedures. Some communities might encourage water cooler talk to create a sense of comradery, others might strictly police off-topic posts. Beyond that, communities might be purposeful about being welcoming of new members, while others might be more forward in challenging each others' ideas. 

Each community can establish their own norms above and beyond the site-wide expectations to make the platform their own and to create a sense of ownership and shared responsibility to keep the community strong and self-sustaining.

### 6. Let communities opt-in to self governance

Alongside tiered expectations, tiered reporting is the idea that when a user witnesses or experiences disruptive behavior, that they should be able to report it to the community maintainer, or if necessary, to site admins for review and moderation. Generally the distinction between the two should mirror tiered expectations of site-wide and community expectations, but in practice, it's not always that cut-and-dry.

For one, sometimes disputes can occur between maintainers and community members. In those cases, it's especially important that you have safeguards to prevent maintainers from abusing moderation tools at the user's expense and that the user can appeal to a non-interested party, in most cases, a site-wide staff or volunteer admin.

For another, not all communities have the resources or maturity to respond appropriately to flagged content (or have the appetite or willingness to do so). Making sure that as communities grow and mature they get access to increasingly sophisticated tools and can opt-in to take on additional responsibility ensures disruptive content is appropriately moderated at any level of maturity without overwhelming community moderators at community inception.

### 7. Offer tiered moderation tools

Tiered moderation is the idea that whomever is responding to that report, be it a community moderator or a member of the platform's Trust and Safety team, that they have a suite of increasingly punitive tools at their disposal to respond proportionally to the disruptive behavior with the necessary context to make an informed choice.

When a user's behavior strays from the community's established norms, moderators should be able to respond proportionally to the infraction in hopes of rehabilitating the user (or giving them the time to cool off and self-rehabilitate). Could it have been an honest mistake? Perhaps a public warning is the best response. Are they a repeat offender? Perhaps it's time to respond more aggressively or even permanently part ways.

At GitHub, those tools range from a simple warning to a full-out ban. In increasing order, you can warn the comment author, minimize the comment, escalate the report, edit the comment, temporarily limit interactions (forced cool down), permanently lock the conversation, temporarily block the user, delete the comment, or permanently block the user.

### 8. Moderate transparently

Regardless of who moderates the content or what action they take, with few exceptions, moderation should be transparent to the reported user, the reporting user, and to those that interact with the disruptive content. At GitHub, for example, this may take the form of anonymous timeline entries when a comment is deleted or sending a notification with links to the offending post and governing documents whenever a user is blocked.

Beyond providing the opportunity for the author to ideally recognize how their behavior strayed from community norms and bring it back in line with expectations, it subtly communicates to others what behavior is acceptable and what is not and signals to those potentially affected by disruptive behavior that the community actively enforces its standards of behavior. Finally, transparent moderation can create a sense of fairness of process among those involved, discouraging moderators from abusing their powers, and making moderation actions less likely to devolve into interpersonal disputes.

### 9. Always seek user consent

Many negative interactions occur when well-intentioned features assume implicit consent among those involved. While I'd like to believe that all interactions on the internet are welcomed and positive, the reality is that platforms let their users down when one user's disruptive behavior is able to negatively impact another user without any action (or an unintentional action) on their part. This is why you must often approve followers or friends before they can interact with you or are given additional privileges like access to private content. 

Users should be given the information necessary to make an informed decision to _opt-in_ to engage in every activity on your platform. This can be a user-to-user interaction, such as messaging another user, or a user-to-platform interaction, such as sharing or publishing personal or activity information. The easiest way to do this is to establish safe defaults with a bias towards privacy and ask for permission prior to any potentially disruptive interaction.

There's much more to be said here. See [Consensual Software: How to prioritize user safety](https://medium.com/consensual-software/consensual-software-how-to-prioritize-user-safety-369f5a4dee8) to learn more about user consent in software.

### 10. Be purposeful about the role you play

Few social platforms begin life as political platforms. Facebook began as a way to connect classmates. Twitter was for telling the world what you ate for lunch that day. Yet today, these platforms are anything but apolitical. While private corporations aren't strictly bound by the First Amendment, as many of those conversations core to free speech protections — the types of conversations that used to occur in small pubs and town square — move online and to for-profit platform, we as builders have an obligation to shape and govern the online society we’re helping to create.

I like to think of online platforms as handing each user a giant megaphone to amplify their voice and reach. If one user stands in that digital town square and starts shouting something mean-spirited or untruthful about you, the platform might give you ear plugs so that you don't have to hear it, but other users, namely your friends and neighbors still do, and now you just don't know about it (and thus can't defend yourself). Instead, platforms should push those conversations into self-moderated spaces, or if necessary, take back the megaphone entirely. Extending the metaphor, the user could say those things all they want in their living room or at a club house, but couldn't do the same on your front lawn. 

Platforms are under no obligation to amplify all users' voices, or to do so equally, and should be mindful of the role they play in doing so. Often times this choice can come at the expense of revenue or engagement, and thus is best viewed not solely as a business decision, but as a moral and ethical one as well.

### Community management at GitHub today

When GitHub's Community and Safety team was first formed, we spent the first two years or so, tackling technical debt around existing safeguards and closing known abuse vectors in the then eight year old platform. From there, we spent about a year adding friction to discourage disruptive behavior, and are now _just_ turning the corner where we can proactively create the spaces where good online citizenship can flourish and thrive.

I'm proud to say that just over three years after we first gathered in that Toronto conference room, we actually closed out that three-year roadmap [last year](https://github.blog/changelog/2019-12-11-report-disruptive-content-to-open-source-maintainers/) (something that _never_ happens in Product Management). Over those three years, we launched [opensource.guide](https://opensource.guide), the site-wide [community guidelines](https://help.github.com/en/github/site-policy/github-community-guidelines), [contributor badges](https://github.blog/2017-07-25-making-it-easier-to-grow-communities-on-github/), [minimized comments](https://help.github.com/en/github/building-a-strong-community/managing-disruptive-comments), [comment edit history](https://help.github.com/en/github/building-a-strong-community/tracking-changes-in-a-comment), [temporary interaction limits](https://help.github.com/en/github/building-a-strong-community/limiting-interactions-in-your-repository), [community profiles](https://help.github.com/en/github/building-a-strong-community/about-community-profiles-for-public-repositories), [community health](https://help.github.com/en/github/building-a-strong-community/adding-a-code-of-conduct-to-your-project) [file templates](https://help.github.com/en/github/building-a-strong-community/adding-a-license-to-a-repository), [temporary blocks and blocking notificaitons](https://help.github.com/en/github/building-a-strong-community/blocking-a-user-from-your-organization#blocking-a-user-in-a-comment), [contributor flagged content](https://help.github.com/en/github/building-a-strong-community/reporting-abuse-or-spam#reporting-a-comment), and [tiered reporting](https://help.github.com/en/github/building-a-strong-community/managing-reported-content-in-your-organizations-repository) to create [a suite of tools for building strong communities](https://help.github.com/en/github/building-a-strong-community), along with countless behind-the-scenes staff moderation and user safety and privacy tools - some 500 ships in total.

### I'm just the messenger

This all took a village and then some. There were countless managers, engineers, lawyers, designers, analysts, doc writers, data scientists, policy folks, and more over the years that I won't mention by name because many don't talk about their work publicly, but that undeniably deserve credit for their contributions and efforts. 

Due to the often proprietary nature of social networks and potentially adversarial nature of trust and safety we don't, as an industry, always talk openly about our efforts or how we go about solving shared problems. In hopes that what I learned could help other platforms starting down the same path, I wanted to share how I've thought about federated community management at GitHub over the years. YMMV.

_And of course, as always, these thoughts are [my own](/fine-print/)._