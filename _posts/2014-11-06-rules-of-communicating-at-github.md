---
title: 15 rules for communicating at GitHub
description: Asynchronous communication through high-fidelity mediums like issues and chat eliminate the endemic 'you had to be there' aspect of most corporate workflows, and reduces the need for a dedicated management class to capture, collection, and shuttle information back and forth between business units.
redirect_from: "/2014/11/03/rules-of-communicating-at-github/"
---

At GitHub, we have a very specific way of working. For one, we use GitHub to build GitHub. Not just for code, but to collaborate on things like Legal, Marketing, and internal policies. But it's not that the medium defines the workflow (although it certainly helps), in fact, it's the other way around.

GitHub's communication style can be summed up in one word: [asynchronous](http://zachholman.com/posts/how-github-works-asynchronous/). Much of this is defined by the workflows of the open source community, where many of us got our start, but part of it, as a distributed company, is out of necessity. Like open source, rarely are two people in the same place at the same time, working on the same thing at the same time. Yet as in the case of Wikipedia versus Encyclopedia Britannica, distributed workflows produce better results than their traditional counterparts, and I'd argue that everyday quality of life is better for those involved, as a result.

[Asynchronous communication through high-fidelity mediums like issues and chat](http://zachholman.com/posts/github-communication/) eliminate the endemic "*you had to be there*" aspect of most corporate workflows, and [reduces the need for a dedicated management class to capture, collect, and shuttle information back and forth between business units](http://ben.balter.com/2012/12/16/deprecate-management/). You could have the best tools in the world, but without the necessary social norms, you're setting yourself up for failure.

Culture's inherently hard to define, but here's 15 "rules", that represent the intangible in how we approach communication at GitHub:

### 1. Prefer asynchronous communication

As @holman [writes](http://zachholman.com/posts/how-github-works/), *"Chat is inherently asynchronous; tapping someone on the shoulder is inherently being a jerk."* Knowledge workers, especially those in the technology industry [are most productive](https://en.wikipedia.org/wiki/Flow_(psychology)) when they have large blocks of uninterrupted time. A two hour block is not fungible with four thirty minute blocks. Think about it practically: Developers store large sections of the code base in their head when they work. Designers have a vision they're trying to express on paper or in CSS. Unlike say, working on an assembly line, when knowledge work is interrupted, intentional or not, whether a popup, a meeting, or a "hey, you got a sec?" drive by, there's a significant switching cost to get back to where you were. Think about it as the geek equivalent to needing to put on gym clothes, fill your water bottle, and grab your iPad before you head to the gym each time.

In practice, this means that you essentially *never* "walk over" to a coworker's desk, virtual or otherwise. Whenever possible, prefer issues and chat, to "just in time" communications. And there's an added bonus: Asynchronous mediums necessitate a distributed workflow. There's no "you had to be there", when "there", is online and anytime.

### 2. Don't underestimate high-fidelity mediums

High fidelity, synchronous mediums like meatspace, Hangouts, or chat are extremely valuable, when used correctly. In many workplace cultures, synchronous meetings are the default, and are often used to make (or worse, communicate) decisions, two goals that are better achieved by non-evented means. What are the latest sales numbers? Create a blog post. Which design should we choose? Open a pull request and show me. Reserve such high-fidelty mediums for things that simply can't be accomplished by lower fidelity means.

In practice, this can come in three primary forms:

1. **Brainstorming** - Help me flesh out this idea. What do you think about X? How can we come up with ways to solve X? You can't "spitball" via a pull request.

2. **Feedback** - Hey, I think you could have worded that comment better. Is everything going okay with Y? Feedback is inherently human, and as such, it deserves a human face.

3. **Small talk and gossip** - In a distributed company, you need a distributed water cooler. How's your son's softball team doing this season? Did you get a haircut? Check in often to ensure your coworkers are human (and you know them as such).

### 3. Nobody gets fired for <del>buying IBM</del> opening an issue

Have a question? Open an issue. Have an idea? Open an issue. Notice something's a bit wonky? You guessed it, open an issue. Issues are cheap. They cost seconds to create, and even if duplicative, are closed just as easily. Issues start conversations, surface alternate points of view, and most importantly, create permanent, searchable, and linkable records of internal discussions, even if the answer ultimately landed on is "wontfix".

In practice, there are some nuances:

1. **Search before you open an issue** - Opening an issue that's already been reported is a great way to find yourself embarrassed among your colleagues.

2. **Provide context** - Opening an issue comes with some expectations on your part. Whether technical or not, be sure to cross-reference other relevant issues, document what you'd expect, what happened, and most importantly, give others just enough context to get on the same page.

3. **Issues are constructive criticism** - Anything short of such is just complaining.

### 4. Copy teams, not team members

When you open an issue or pull request, you have an obligation to copy all relevant teams ("stakeholders" in biz-speak). Note though, that doesn't mean copy individual team members. Whenever I'm getting mentioned by name on issues a lot (or am frequently mentioning the same colleague), that's a red flag that I'm setting us up for a single point of failure. Humans tend to do silly things like get sick, sleep at night, or heck, even take a day off every once in a while. Whenever possible, [mention teams](https://github.com/blog/1121-introducing-team-mentions), not individuals, to distribute responsibility and situational awareness.

In practice, that means [creating a lot of niche teams](https://help.github.com/articles/creating-a-team/) (we have teams for affinities as small as Hubbers who play board games and Hubbers who are color blind), but if people can freely associate, the teams will populate quickly. That also means, that when you're mentioned by name, it's your responsibility to CC the relevant team(s). [OP](https://en.wikipedia.org/wiki/Internet_forum#Thread) will eventually take the hint.

### 5. Be mindful of noise

A comment on an issue may take 20 seconds to read, from the time the notification is received, the page loads, the reader gains the necessary context, and a decision is made as to what action, if any, is necessary on their part. If there are 50 people subscribed to the thread or mentioned, you've just spent more than 15 minutes of your company's collective time. Was it worth it?

In practice, that means three things:

1. **Avoid drive-by opinions** - Assume for a moment that you have a potential say in everything your company does. What issues can you contribute the most to? Have the most impact on? Affect your role most directly? Think twice before providing your opinion on issues fringe to your area of expertise, especially when you don't have the full context, or aren't willing to follow through yourself to do what's necessary.

2. **Only comment if you have something to add to the discussion** - It's one thing to indicate that you've taken the time to review a proposed change and give it a thumbs up, but adding a vanilla :+1: to a thread that already has 10 :+1:'s, doesn't really do much to advance the project. Unless what you're posting moves the issue closer to resolution or the pull request closer to merge, don't hit the green button. Just don't do it.

3. **Always provide context** - Context switching costs are non-trivial. Courteous collaborators provide teammates with the necessary context to get up to speed on a discussion, and decide what, if any action they need to take. Pull requests titled "a few edits" or "minor improvements" do the exact opposite. This is especially important when CCing a team. In the same comment that brings them into the discussion, minimize the cognitive burden by absorbing the complexity on their behalf, and make it explicit what is being asked of them.

### 6. Use checklists to make blockers explicit

In biz speak, we call them "action items". In GitHub speak, [we call them task lists](https://github.com/blog/1375%0A-task-lists-in-gfm-issues-pulls-comments). The intent is the same: make it explicit what needs to be done, and who's responsible for doing it. Curating an always-up-to-date task list at the top of an issue is a great way to clear up long or complex issues, or to create meta-issues for track large, multi-issue projects.

In practice, link each action item to the associated issue, describe the task, and [@mention](https://github.com/blog/821-mention-somebody-they-re-notified) the person who's responsible. If you use the proper syntax, GitHub will render the task lists as checkable tasks, and various views will automatically show their completion.

### 7. Issues are organization-wide todos

There's one simple rule for issues: don't close them until they're resolved. They're a placeholder for action the organization needs to take (or needs to decide not to take), whether a bug, a feature, or a blog post to be written, they exist to be organized, discussed, and assigned.

In practice, that may mean two things:

1. **Issue titles should contain at least one verb** - A page from the [Getting Things Done](https://en.wikipedia.org/wiki/Getting_Things_Done) playbook, if issues are organizational todos, then issue titles (the thing todo), should contain at least one verb to ensure it's something the organization can actually act on.

2. **Don't close issues prematurely** - Issues may stay open for months, even years, before they're closed. That's okay. Having a long tail of issues (if properly pruned and organized), is a hallmark of a strong project.

### 8. Master the gentle bump

We're all busy. Sometimes things get past us. Sometimes we don't care about things, or want to give others space to weigh in. If a pull request has been open for a sufficient amount of time, and a relevant stakeholder was mentioned but hasn't weighed in (or has an action item that he or she hasn't completed), gently bump the thread. Yes, the entire thread. Public shaming goes a long way (or someone else will jump in on their behalf).

In practice, there's a few reasons it's called the "gentle" bump:

1. **It's not the obnoxious bump** - Be sincere, explicit, and charming. "@benbalter, the gentlest of bumps on this. Have two minute to take a look at this error? :smile:". Your goal is to make sure that they are aware of the ask, not to trample their right to manage their own time.

2. **No news isn't good news** - If you've proposed an idea or change and haven't heard back despite repeated attempts to solicit feedback, it may be time to take the hint. If your colleagues aren't opinionated enough to even comment on the proposal, chances are, it's not the next big thing.

3. **An implicit promotion** - There's also an art to knowing your coworkers, how your organization works, and simply taking it upon yourself to hit that big green button. Often, that's a sign that you've just inherited a new responsibility, so merge wisely.

### 9. Keep discussions logically distinct

The great thing about issues and pull requests, in contrast to say, email, is that they can be bifurcated when topics diverge. This keeps teams focused on :ship:ing one thing and only one thing at a time. Additionally, discrete topics minimize unnecessary noise and optimize for fast decision making by ensuring only the most relevant teams are involved.

In practice, that means discussions should have one purpose, defined by the title at the top of the page. When a concern not directly related to the thread's purpose arises through the course of the discussion, as they often do, open a new issue and encourage participants to continue the discussion there, or if you see a teammate hijacking the discussion, do the same on their behalf. If the sub-task is a blocker, note it as such, and move on.

### 10. There's only one way to change something

Unless it's a minor typo, so irrefutable that no one would possibly question it or need to be notified of the change, the only way to change community content is with a pull request. It doesn't matter if it's code, configuration, or internal policy.

In practice, this may mean submitting pull requests that you immediately self-merge, in order to notify your teammates of the change, or may mean having a longer discussion before merging, in order to justify the change to others. For 99% of changes, committing directly to `master` is not the appropriate choice.

### 11. Secrets, secrets, are no fun

Email is a terrible, terrible collaboration medium, and an even worse mechanism for storing organizational knowledge. There's no opt-in or opt-out mechanisms, no ability to link to or cross-reference discussions, and conversation history lives in a teammate's personal inbox, so when they leave so too does the issue's context. Use email sparingly, and only when issues or chat, exposed to the company, would be inappropriate for the conversation. Put another way, email is for sensitive conversations.

In practice, that means email is typically reserved only for things like personnel discussions, one-to-one feedback, and external communication. The same goes for other mediums (like phone calls) that don't automatically capture and surface context. If you can have the conversation in a better medium, you should.

### 12. Surface work early for feedback

Code speaks louder than words. If you have an idea, time box a small amount of time, mock up a proof of concept or prototype, and spike out a work-in-progress pull request. This process replaces the role traditionally filled by meetings in many corporate cultures.

In practice, that means opening a pull request against the relevant project, and prepending "WIP:" to the title. Is this a good idea? A terrible one? The wrong approach? Get early feedback from your coworkers, and iterate openly (or scrap it). The final product will be better as a result.

### 13. If you can't diff it, don't use it

Pull requests, and thus diffs are at the core of our workflow. Whether the change is to code, configuration, or prose text, being able to see exactly what's proposed, on an extremely granular level, without the need to download special software or leave my browser is key. If I can't see what you're proposing, there's no way for us to have a serious discussion on its merits.

In practice, that means, as early as the drafting stage, preferring formats like Markdown and CSV over proprietary or binary formats like Word or Excel. Open formats not only allow for diffing, but also facilitate targeted discussions through line-by-line commenting. When that's not possible, e.g., when making tweaks to a site's design, provide before and after screenshots within the pull request body to minimize the burden on reviewers. Remember, you're asking others to take time out of their day to provide feedback on your proposed change. Optimize for their experience, not yours.

### 14. Pull requests are community property

As soon as you hit the big green "submit pull request" button, your code is no longer your baby. The bird has left the nest. You're still primarily responsible for its success, and for seeing that it's eventually merged into `master`, but that primarily involves facilitating a discussion that allows stakeholders to reach a general consensus, not advocating for "your" contribution.

In practice, that means, at minimum, that it's bad form to title a pull request "@benbalter's edits", but more broadly, it relegates you to the role of gracious host, answering questions, implementing suggestions, and ensuring that necessary teams are involved. At GitHub, we primarily use branch-to-branch pull requests within the same repository, so don't be surprised if someone else jumps in and politely pushes a commit or two.

### 15. Don't ping, just ask

There's a stubborn chat anti-pattern, where all chat conversations sparked by a question must begin by the asker rallying an initial "PING". Not only is this rude (would you do that IRL?), but it defeats the purpose of chat: asynchronicity. Ping servers, not colleagues. Just ask the question. They'll know you have something to say, by virtue of the fact that you just said it, and can respond on their schedule, not yours.

In practice, most chat programs let you mention a user by name at the start of a message to trigger a notification on their end. Push them the question, not just the notification. But you can take that a step further: There's a good chance someone else in the room just saw your question, and is able to answer it immediately (because you've exposed the question to the entire team, not an individual). That's the beauty of a distributed workflow.

### Bonus: Overcompensate for tone

It's often said that it's hard to capture tone via electronic communications, but that's a filthy lie. There's a reason GitHub's collaboration culture is built on a foundation of emoji and animated GIFs. It's not simply because [animated GIFs of puppies are adorable](http://giphy.com/gifs/puppies-cute-animals-asdfghjkl-6UZFwMYqCeXi8), but because a :trollface: is often the most efficient way to express sarcasm. Be sure to be human. As we say at GitHub, mind your words, they're important.

### Double bonus: If it has a URL, link to it

Simply put, if you reference something - be it prior issue, the pull request that implemented a feature, a line in a file, whatever — and [that thing has a URL](http://ben.balter.com/2015/11/12/why-urls/), it's your obligation to find that URL and make that reference a link. Even if the reader could theoretically search for it, you are infinitely more familiar with the thing you're referencing, and given a comment read by 5, 10, or 50 people, it's more efficient for you to look it up once, than for readers to look it up 50 times, even if it takes a few minutes to do so. Not to mention, on GitHub, linking to another issue or pull request creates a visible cross reference, meaning that just by commenting, you create an organic map of the organization's knowledge.

All that said, the first rule of GitHub, is that there are few hard-and-fast rules at GitHub. We often prefer cultural norms to administrative, policy, or technical constraints because they remain flexible over time as circumstances change. These 15 "rules" for how we communicate at GitHub aren't necessarily written rules, at least not in the GitHub sense, but are my best attempt to surface the current state of our communications culture.

Questions? Feedback? Comment below, or even better, [open an issue](https://github.com/benbalter/feedback).

**Edit (9/1/2016)**: Added the second bonus.
