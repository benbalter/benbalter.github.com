---
title: Moderating a controversial pull request
description: If you're about to open a controversial (or wide-reaching) issue or pull request, there are a handful of steps you can take to set yourself up for success.
---

Pull requests are a great way to collaborate. Propose a specific change, get detailed, concrete feedback from everyone it affects, reach a general consensus, merge. At least that's how it's supposed to work, but sometimes, if you're not careful, things can go a bit off the rails.

Depending on how you use pull requests within your own organization — be it a company or an open source project — there's a good chance you've seen it before: one commenter leaves a critical drive-by opinion, never to be heard from again. Another raises a tangentially related pet issue that derails the entire discussion. A third will disagree with just about everything you propose, just on principle. And a fourth, probably means well, but due to the limitations of the internet, comes off as abrasive. The conversation quickly devolves into a debate of semantics, and things go nowhere fast.

It doesn't have to be that way. If you're about to open a controversial (or wide-reaching) pull request, there are a handful of steps you can take to encourage a more productive discussion:

### Lay out the ground rules upfront

First and foremost, lay out the ground rules up front. This can either be in the body of the issue itself, or someplace more global, like the repository's `README` or `CONTRIBUTING` file. If the conversation is occurring within a finite group, e.g., a company or an open source project, it may make sense to curate those rules alongside other organization-wide policy documents, and to seek to integrate them within your organization's culture more broadly.

#### Keep it civil

Although often less of a concern for pull requests within an organization, the broader internet is a scary place. Make it clear that participants need to keep it classy, and link out to your [Code of Conduct](http://contributor-covenant.org/) or similar guidelines, if you can.

#### No place for the peanut gallery

Let everyone know that this isn't an opportunity for the peanut gallery to air the grievances or deliver drive-by opinions, in which they leave an opinion and immediately disappear. In most cases, if the commenter doesn't care about the issue enough to open a pull request, or can't propose an alternative, they probably shouldn't be commenting.

My colleague @stephbwills introduced me to the ["Sliding Scale of Giving a Fuck"](http://blog.capwatkins.com/the-sliding-scale-of-giving-a-fuck). Make it clear, that if you're not at least a `5/10`, or don't have a unique viewpoint to add, it's probably best that you don't comment. But, be careful, keeping the riff-raff at bay can inadvertently raise the barrier for non-technical contributors, so be sure to go out of your way to make the discussion inclusive.

### Assign roles

When it's everyone's responsibility, it's no one's responsibility. Before you kick off the discussion, make responsibilities known. Specifically, you'll want a *moderator* and a *decider*.

#### Assign a moderator

Designate a moderator from the onset. This person will be responsible for enforcing all the social norms described above and for keeping the conversation moving. If someone raises an unrelated tangent, they open up an new issue to keep the discussion on track. If the thread gets long, they summarize where the current consensus is. Part crossing guard, part social worker, and part bailiff, their responsible for the discussion being productive, respectful, and fair.

#### Make the decider known

The decider is the one who has to make the tough calls any time the discussion comes to a stalemate or when the designated timeframe comes to a close. The decider may be the same person as the moderator, but often times its advantageous (and logical) for the decider to be distinct. If the moderator is a crossing guard, the decider is the umpire, judge, and referee, calling balls and strikes, roughing the passer, and deciding on the final disposition.

### Describe how you want feedback

Make it clear how people should provide feedback. Should they post long-winded, general comments? Directed questions by quoting specific passages? Comment in line on the particular section? Submit a pull request with the suggested improvements? Whatever you do, for your own sanity, choose *one* means of discussion, rather than two or three, and prefer targeted suggestions, to general critiques.

### Set a timeline

Let everyone involved know how long you're going to allow for discussion (and make sure it's tantamount to the subject matter). Is this a 24-hour discussion? A week's worth? A month? Are there milestones or checkpoints along the way to make certain decisions or roll out certain aspects? The timeframe should be long enough such that relevant stakeholders are on notice and can participate, even if they're away for their keyboard at any given moment, but not so long as to inject undue delay into the process.

Pull requests and issues are great tools to facilitate decisions, especially among distributed teams, but depending on the subject matter, the internet's comments section can quickly live up to its reputation. By laying out ground rules up front, assigning key roles, and setting expectations, you can set yourself up for successes. What tips do you have for keeping things on track? Leave a comment below.

*A big hat tip to my former colleague @cameronmcefee, who's most excellent execution of a potentially-controversial discussion inspired me to write this post.*
