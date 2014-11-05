---
title: "N rules for communicating at GitHub"
excerpt: "Asycronous communication through high-fidelity mediums like issues and chat illimate the indemic \"you had to be there\" aspect of most corporate workflows, and reduces the need for a dedicated management class to capture, collection, and shuttle information back and forth between business units."
---

At GitHub, we have a very specific way of working. For one, we use GitHub to build GitHub. Not just for code, but for things like Legal, Marketing, and internal policies. But it's not that the medium defines the workflow (although it helps), in fact, it's the other way around.

GitHub's communication style can be summed up in one word: asycronous. Much of this is defined by the workflows of the open source community, where many of us got our start, but part of it, as a distributed company, is out of necessity. Like open source, rarely are two people in the same place at the same time, working on the same thing at the same time. Yet as in the case of Wikipedia versus Encycleopedia Britanica, distributed workflows produce better results than their traditional counterparts, and I'd argue that life is better for those involved, as a result.

Asycronous communication through high-fidelity mediums like issues and chat illimate the indemic "you had to be there" aspect of most corporate workflows, and reduces the need for a dedicated management class to capture, collection, and shuttle information back and forth between business units.

It's more than just tools. In fact, I'd argue, it's primarily about culture. Here's ___ "rules", that I think embody the intangible in how we approach communication at GitHub.

### 1. Prefer asynchronous communication

As @holman writes, *"Chat is inherently asycronous; tapping someone on the shoulder is inherently being a jerk."*

Knowledge workers, especially those in the technology industry are most productive when they have large blocks of uninterrupted time. A two hour block is not fungible with four thirty minute blocks. Think about it practically: Developers store a large sections of the code base in their head when they work. Designers have a vision they're trying to express on paper or in CSS. Unlike say, working on an assembly line, when knowledge work is interrupted, intentional or not, whether a popup, a meeting, or a "hey, you got a sec?" drive by, there's a significant switching cost to get back to where you were. Think about it like needing to put on gym clothes, fill your water bottle, and grab your iPad before you head to the gym.

In practice, this means that you essentially *never* "walk over" to a coworker's desk, virtual or otherwise. Whenever possible, prefer issues and chat, to "just in time" communications. And there's an added bonus: Asycronous mediums necessitate a distributed workflow. There's no "you had to be there", when "there", is online and anytime.

### 2. Don't underestimate high-fidelity mediums

High fidelity, synchronous mediums like meatspace, Hangouts, or even chat are extremely valuable, when used correctly. In many workplace cultures, synchronous meetings are the default, and are often used to either make (or worse, communicate) decisions, two goals that are better achieved by non-evented means. What are the latest sales numbers? Create a blog post. Which design should we choose? Open a pull request and show me. Reserve such high-fidelty mediums for things that simply can't be accomplished by lower fidelity means.

In practice, this can come in three primary forms:

1. **Brainstorming** - Help me flesh out this idea. What do you think about. How can we come up with ways to solve X? You can't "spitball" via a pull request.

2. **Feedback** - Hey, I think you could have worded that comment better? Is everything going okay with Y? Feedback is inherently human, and as such, it deserves a human face.

3. **Small talk and gossip** - In a distributed company, you need a distributed water cooler. How's your son's softball team doing this season? Did you get a haircut? Check in often to ensure your coworkers are human (and you know them as such).

### 3. Nobody gets fired for ~~buying IBM~~ opening an issue

Have a question? Open an issue. Have an idea? Open an issue. Notice something's a bit wonky? You guessed it, open an issue. Issues are cheap. They cost seconds to create, and even if duplicative, are closed just as easily. Issues start conversations, surface alternate points of view, and most importantly, crate permanent, searchable, and linkable records of internal discussions, even if the answer ultimately landed on was "wontfix".

In practice, there's are some nuances. For one, search before you open an issue. Opening an issue that's already been reported is a great way to find yourself embarrassed among your colleagues. At the same time, opening an issue comes with some expectations on your part. Whether technical or not, be sure to document what you'd expect, what happened, and give others enough context to get on the same page. Last, it goes without saying, issues are constructive criticism. Anything short of such is just complaining.

### 4. Copy teams, not team members

When in doubt, copy all relevant teams ("stakeholders" in biz-speak). Note though, that doesn't mean copy individual team members. Whenever I'm getting mentioned by name on issues a lot (or am frequently mentioning the same colleague), that's a red flag that I'm setting us up for a single point of failure. Humans tend to do silly things like get sick, sleep at night, or heck, even take a day off every once in a while. Whenever possible, mention teams, not individuals, to distribute responsibility and situational awareness.

In practice, that means creating a lot of niche teams (we have teams for affinities as small as grammar nerds), but if people can freely associate, the teams will populate quickly. That also means, that when you're mentioned by name, it's your responsibility to CC the relevant team(s). OP will eventually take the hint.

### 5. Be mindful of noise

A comment on an issue may take 20 seconds to read, from the time the notification is recieved, the page loads, the reader gains the necessary context, and a decision is made as to what action, if any is necessary on their part. If there are 50 people subscribed to the thread or mentioned, you've just spent more than 15 minutes of company's collective time.

In practice, that means three things:

1. **Avoid drive-by opinions** - Assume for a moment that you have a potential say in everything your company does. What issues can you contribute the most to? Have the most impact on? Affect your role most directly? Think twice before providing your opinion on issues fringe to your area of expertise, especially when you don't have the full context, or aren't willing to follow through yourself to do what's necessary.

2. **Only comment if you have something to add to the discussion** - It's one thing to indicate that you've taken the time to review a proposed change and give it a thumbs up, but adding a vanilla :+1: to a thread that already has 10 :+1:'s, doesn't really do much to advane the project. Unless what you're posting moves the issue closer to resolution or the pull request closer to merge, don't hit the green button. Just don't do it.

3. **Always provide context** - Context switching costs are non-trivial. Curteous collaborators provide teammates with the necessary context to get up to speed on a discussion, and ecide what, if any action they need to take. This is especially important when ccing a team. In the same comment that brings them into the discussion, minimize the cognitive burden on their part, and make it clear exactly what is being asked of them.

### 6. Use checklists to make blockers explicit

In biz speak, we call them "action items". In GitHub speak, we call them task lists. The intent is the same: make it explicit what needs to be done, and who's responsible for doing what. Curating an up-to-date task list at the top of an issue is a great way to clear up long or complex issues, or to create meta-issues to track large projects.

In practice, link to relevant issues, describe the task, and who's responsible. If you use [the proper syntax](#), GitHub will render the task lists as checkable tasks, and various views will automatically show their completion.

### 7. Issues are organization-wide todos

There's one simply rule for issues: don't close them until they're resolved. They're a placeholder for action the organization needs to take (or needs to decide not to take), whether a bug, a feature, or a blog post to be written, they exist to be organized, discussed, and assigned.

In practice, that may mean two things:

1. Issue titles should contain at least one verb. A page from the [Getting Things Done](#) playbook, if issues are organizational todos, then issue titles (the thing todo), should contain at least one verb to ensure it's something the organization can act on.

2. Issues may stay open for months, even years, before they're closed. That's okay. Having a long tail of issues (if properly pruned and organized), is a halmark of a strong project.

### 8. Master the gentle bump

We're all busy. Sometimes things get past us. Sometimes we don't care about things, or want to give others space to weigh in. If a pull request has been open for a sufficient amount of time, and a relevant stakeholder was mentioned and hasn't weighed in (or has an action item that he or she hasn't completed), gently bump the thread. Yes, the entire thread. Public shaming goes a long way (or someone else will jump in for them).

In practice, there's a reason it's called the "gentle" bump, and not the obnoxious bump. Be sincere, explicit, and charming. "@benbalter, the gentlist of bumps on this. Have two minute to take a look at this error? :smile:". There's also an art to knowing your coworkers, how your organization works, and simply taking it upon yourself to hit that big green button. Often, that's a sign that you've just inherited a new responsibility, so merge wisely.

### 9. Keep discussions logically distinct

The great thing about issues and pull requests, in contrast to say, email, is that they can be broken apart when topics diverge. This keeps teams focused on :ship:ing one thing and only one thing at a time. Additionally, descrete topics minimize unecessary noise and optimzie for fast decision making by ensuring only the most releveant teams are involved.

In practice, that means discussions should have one purpose, defined by the title at the top of the page. When a concern not directly related to the threads purpose arises through the course of the discussion, as they often do, open a new issue and encourage participants to continue the discussion there, or if you see a teammate hijacking the dicussion, do the same on their behalf.

### 10. There's only one way to change something

Unless it's a minor typo, so irrefutable that no one would possibly question it or need to be notified of the change, the only way to change content is with a pull request. It doesn't matter if it's code, configuration, or internal policy.

In practice, this may mean submitting pull requests that you immediately self-merge, in order to notify your teammates of the change, or may mean having a longer discussion before merging, in order to justify the change to others. For 99% of changes, committing directly to `master` is not the appropriate choice.

### 11. Secrets, secrets, are no fun

Email is a terrible, terrible collaboration medium. There's no opt-in or opt-out mechanisms, no ability to link to or cross-reference discussions, and conversation history lives in a teammate's person inbox — when they leave so too does the context. Use email sparingly, and only when issues or chat, exposed to the company, would be inappropriate for the conversation. Put another way, email is for sensitive conversations.

In practice, that means email is typically reserved only for things like personel discussions, one-to-one feedback, and external communication. If you can have the conversation in a better medium, you should.

### 12. Don't ping, just ask

There's a stubborn chat anti-pattern, where all chat conversations sparked by a question must begin by the asker rallying an initial "PING". Not only is this rude (would you do that IRL?), but it defeats the purpose of chat: asycronisity. Don't ping your colleague's. Just ask the question. They'll know you have sometime to say, by virtue of the fact that you just said it, and can respond on their schedule, not yours.

In practice, most chat programs let you mention a user by name at the start of a message to trigger a notification on their end. Push them the question, not just the notification. But you can take that a step further. There's a good chance someone else in the room just saw your question, and is also able to answer it (because you've exposed it to the entire team). That's the beauty of distributed teams.

### Pull requests are community property


### Surface work early for feedback
