---
title: "N rules for communicating at GitHub"
excerpt: ""
---

### Prefer asynchronous communication

As @holman writes, *"Chat is inherently asycronous; tapping someone on the shoulder is inherently being a jerk."*

Knowledge workers, especially those in the technology industry are most productive when they have large blocks of uniterupted time. A two hour block is not fungible with four thirty minute blocks. Think about it practically: Developers store a large sections of the code base in their head when they work. Designers have a vision they're trying to express on paper or in CSS. Unlike the assembly line, when knowledge work is interrupted, intentional or not, whether a popup, a meeting, or a "hey, you got a sec?", there's a significant switching cost to get back to where you were. Think about it like needing to put on gym clothes, fill your water bottle, and grab your iPad before you head to the gym.

In practice, this means that you essentially *never* "walk over" to a coworker's desk, virtual or otherwise. Whenever possible, prefer issues and chat, to "just in time" communications. And there's an added bonus: Asycronous mediums enable a distributed workflow. There's no "you had to be there", when "there", is online.

### Don't underestimate high-fidelity mediums

High fidelity, synchronous mediums like meatspace, Hangouts, or even chat are extremely valuable, when used correctly. In many workplace cultures, synchronous meetings are the default workflow, and are often used to eitehr make or communicate decisions, two things that are better suited for asynchronous communications. What are the latest sales numbers? Create a blog post. Which design should we choose? Open a pull request. Reserve such high-fidelty mediums for things that can't be accomplished by lower fidelity means.

In practice, this can come in three primary forms: First, and most often, brainstorming. Help me flesh out this idea. What do you think about. How can we come up with ways to solve X? You can't "spitball" via a pull request. Second, feedback. Hey, I think you could have worded that comment better? Is everything going okay with Y? Feedback is inherently human, and it deserves a human face. Last, in a distributed company, you need a distributed water cooler. How's your son's softball team doing this season? Did you get a haircut? Check in often to ensure your coworkers are human (and you know them as such).

### Nobody gets fired for ~~buying IBM~~ opening an issue

Have a question? Open an issue. Have an idea? Open an issue. Notice something's a bit wonky? You guessed it, open an issue. Issues are cheap. They cost seconds to create, and even if duplicative, are closed just as easily. Issues start conversations, surface alternate points of view, and most importantly, crate permanent, searchable, and linkable records of internal discussions, even if the answer ultimately landed on was "wontfix".

In practice, there's are some nuances. For one, search before you open an issue. Opening an issue that's already been reported is a great way to find yourself embarrassed. At the same time, opening an issue comes with some expectations on your part. Whether technical or not, be sure to document what you'd expect, what happened, and give others enough context to get on the same page. Last, it goes without saying, issues are constructive criticism. Anything short of such is just complaining.

### Avoid drive-by opinions

Assume for a moment that you have a potential say in everything your company does. What issues can you contribute the most to? Have the most impact on? Affect your role most directly? Think twice before providing your opinion on issues fringe to your area of expertise, especially when you don't have the full context, or aren't willing to follow through yourself to do what's necessary.

In practice,

### CC teams, not team members

When in doubt, copy all relevant teams ("stakeholders" in biz speak). Note though, that doesn't mean copy individual team members. Whenever I'm getting mentioned by name on issues a lot (or am frequently mentioning the same colleague), that's a red flag that I'm creating a single point of failure. Humans tend to do silly things like get sick, sleep, or heck, even take a day off. Whenever possible, mention teams, not users, to distribute responsibility.

In practice, that means creating a lot of niche teams, but if people can freely associate, they will quickly fill. That also means, that when you're mentioned by name, it's your responsibility to CC the relevant team(s). The original poster will eventually get the hint.

### Don't ping, just ask

There's a stubborn chat anti-pattern, where all chat conversations sparked by a question must begin by the asker ralling an initial "PING". Not only is this rude (would you do that IRL?), but it defeats the purpose of chat: asycronisity. Don't ping your colleague's. Just ask the question. They'll know you have sometime to say, by virtue of the fact that you just said it, and can respond on their schedule, not yours.

In practice, most chat programs let you mention a user by name at the start of a message to trigger a notification on their end. Push them the question, not just the notification. But you can take that a step further. There's a good chance someone else in the room just saw your question, and is also able to answer it (because you've exposed it to the entire team). That's the beauty of distributed teams.

### Master the gentle bump

We're all busy. Sometimes things get past us. Sometimes we don't care about things, or want to give others space to weigh in. If a pull request has been open for a sufficient amount of time, and a relevant stakeholder was mentioned and hasn't weighed in (or has an action item that he or she hasn't completed), gently bump the thread. Yes, the entire thread. Public shaming goes a long way (or someone else will jump in for them).

In practice, there's a reason it's called the "gentle" bump, and not the obnoxious bump. Be sincere, explicit, and charming. "@benbalter, the gentlist of bumps on this. Have two minute to take a look at this error? :smile:". There's also an art to knowing your coworkers, how your organization works, and simply taking it upon yourself to hit that big green button. Often, that's a sign that you've just inherited a new responsibility, so merge wisely.

### Use checklists to make blockers explicit

In biz speak, we call them "action items". In GitHub speak, we call them task lists. The intent is the same: make it explicit what needs to be done, and who's responsible for doing what. Curating an up-to-date task list at the top of an issue is a great way to clear up long or complex issues, or to create meta-issues to track large projects.

In practice, link to relevant issues, describe the task, and who's responsible. If you use [the proper syntax](#), GitHub will render the task lists as checkable tasks, and various views will automatically show their completion.

### Issues are organization-wide todos

There's one simply rule for issues: don't close them until they're resolved. They're a placeholder for action the organization needs to take (or needs to decide not to take), whether a bug, a feature, or a blog post to be written, they exist to be organized, discussed, and assigned.

In practice, that may mean that issues stay open for months, even years, before they're closed. That's okay. Having a long tail of issues (if properly pruned and organized), is a halmark of a strong project.

### Pull requests are community property


### Surface work early for feedback

### Secrets, secrets, are no fun
(Email only for sensitive stuff)

### Be mindful of noise

### There's only one way to change something
