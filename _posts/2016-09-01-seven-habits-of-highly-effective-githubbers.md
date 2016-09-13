---
title: The seven habits of highly effective GitHubbers
description: GitHub has a unique work culture. Here are seven traits that I've observed in successful GitHubbers over the years and that I think make you more effective. YMMV.
---

I started at GitHub when it was just over a hundred employees. A few weeks ago, we passed 600. A lot has changed, including my role, but a lot has also remained the same. GitHub has a unique work culture, and as I recently struggled to explain that culture to my coworkers, I decided instead to document some of the common traits I've consistently seen in successful GitHubbers. There are likely more, but I couldn't pass up the title, so here are seven qualities that I think make GitHub employees more effective, and ultimately more successful:

### 1. Professional, but not formal

There's a difference between being professional and being formal. Being professional is defined by mastery of one's craft. Professionals are efficient. They're methodical. They're systematic. They're organized. Professionals cary out the task at hand without being overly distracted by personal or petty concerns. Formality is about a strict adherence to rule and convention, often at the cost of efficiency. Formalism is about stiffness. About being overly concerned with ceremony over substance. About a focus on outward appearance over actually shipping.

You can be professional without being formal. When you get a pull request, you can respond tactfully, helpfully, and display technical prowess, without beginning your response "Dear sir or madam, I am in receipt of your pull request dated 2nd of November, 2016...". You can use emoji, animated GIFs, and a human tone to express an idea, while still maintaining focus on the job to be done. Highly effective GitHubbers know the difference between professionalism and formality, are always professional, and are only formal when absolutely necessary.[^suit]

### 2. If you see something, say something

They say that once you've started, [the hardest part of software development is finding the problem, not solving it](https://en.wikipedia.org/wiki/Linus%27s_Law). At GitHub we have a strong tradition of "staff shipping" features for a day, a week, even a few months to get a better sense of how the feature performs within the context of a user's workflow. [We're among our most critical users](http://ben.balter.com/2016/08/22/ten-ways-to-make-a-product-great/#drink-your-own-champagne), the idea being, that when something goes awry, we can be among the first to notice. Whether it's a staff-only feature, or a feature that's been baked into the product for years, we'd much rather a fellow GitHubber find (and report) the problem, than subjecting a user to the experience.

[Issues are cheap](http://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#nobody-gets-fired-for-delbuying-ibmdel-opening-an-issue) and are easily closed if not in order. If you so something that looks wonky, even if you're not sure if it's a thing or not, open an issue and cc the relevant team. Best case scenario, they say thank you and close the issue. Worst case scenario, without writing a single line of code, you just made the product better (by exposing an otherwise, unknown issue). But you can take that idea a step further: [Borrowing a page from the Boy Scouts handbook](http://programmer.97things.oreilly.com/wiki/index.php/The_Boy_Scout_Rule), when fixing an unrelated bug or implementing a new feature, always leave the codebase better than you found it, regardless of who originally made the mess. Effective GitHubbers take ownership of the product as a whole and personally invest in its success whenever they see something that could be better.

### 3. Always be willing to help (but know when to say "no")

One of the things that I first noticed when I joined GitHub was that my fellow Hubbers were always willing to help. I could jump into any channel, née chatroom (we use chat for just about anything), ask a question about a topic with which I was unfamiliar, and within seconds, several Hubbers would drop what they were doing to help, not just to explain how to do whatever it was that I was trying to do, but to walk me through the process itself. Later, I recognized a similar and parallel long-standing tradition of over-documenting as you worked, to help future generations of Hubbers continue your efforts where you left off. That dedication to going out of your way to empower others to contribute was by-and-large the rule, not the exception.

To be fair though, "always be willing to help" is a bit of an overstatement. Effective GitHubbers also know when to say "no" to a request. At a certain point you'll realize that you are presented with more opportunities than you have time to act on. That means that you have to prioritize which asks of your time have the highest potential impact, and decline the rest. You quickly learn that Saying "no" to the lower-impact task allows you to tackle the higher impact one (and realize the same, when asking for others' time.) We're all experts at something: a part of the codebase, a process, a particular subject matter, or that thing that you did last week. Effective Hubbers take the time to share their knowledge to ensure that other Hubbers can be even more effective.

### 4. Curiosity and self-improvement

Curiosity is a core component of [the hacker way](http://ben.balter.com/2013/02/04/what-is-a-hacker/#the-hacker-way). For some, there’s a constant intellectual itch just begging to be scratched, be it with code, with policy, or with systems and process. For these people, the world is full of problems just waiting to be solved. Just as athletes seek delight in pushing their bodies past their physical limits, hackers seek the thrill of pushing themselves (and their tools) beyond what is known, what is solved, and what is possible.

At GitHub, there's a strong history of rewarding that curiosity. Most formally, we have a reading stipend, whereby GitHubbers are encouraged to constantly refine their craft (and learn new ones). Beyond that, there's a sense that if you see something you don't know or understand, you can (and should) take the time to understand it. That could be a new part of the application or an entirely new language or technology. The worst thing you can do, when you experience something unknown is to give up or consider yourself blocked. Effective GitHubbers nurture this curiosity and constantly strive to improve, both personally and professionally.

### 5. Contribute to the appreciation economy

It could be said that GitHub operates on somewhat of an appreciation economy. What I mean by that, is that appreciation (in the emotional sense) is the currency that makes many of the day-to-day interactions at GitHub possible. Likely influenced by [Rework](https://www.amazon.com/dp/B002MUAJ2A/?tag=benbalter-20), which suggests that in many cases, public recognition is going to be a more appropriate response to someone going above-and-beyond in the workplace than a pure monetary reward.[^rework] For a while, that took the form of company-wide "shoutout" every Friday (e.g., "shoutout to Ben for taking the time to help me learn X"), but as you can imagine, that didn't scale as the company grew to now 600 people.

Today, that appreciation economy often takes the form of the `.sparkles` or tongue-in-cheek roles ChatOps commands, posts to our internal Team blog, and a culture of going out of your way to give credit where credit is due, either on an in-progress issue, in private direct messages, or indirectly to a manager. Effective GitHubbers realize that they're more effective when they work together, and they make it known when others make an outstanding contribution, not only to recognize their coworkers efforts, but also to further a culture where others continue to do the same.

### 6. Ship early, ship often

If there's one phrase that epitomizes successful engineers at GitHub, it's "don't let perfect be the enemy of good", but that mantra can be extended to just about any craft. In everyday development, we make liberal use of what we call "feature flags", essentially a line of code that lets us ship features to a team, to all staff, or to a subset of users with the click of a button. Almost without exception, as a new feature is being developed, it's exposed to the team responsible for early feedback. After a round (or several) of improvements, its shipped to staff for further tire-kicking, and if things goes well, it's slowly rolled out to users.

There's two sides to this. First, lots of ideas don't make it past the pull request stage, past the team ship stage, or even the staff ship phase, but it's far preferable to learn that something isn't a good fit before it hits `master` than it is to learn once users have begin relying on it. At the same time, it's important to balance the optimization or polish versus the potential impact, to ensure you're always making forward progress. Even if a peer's code review reveals an internal script could be rewritten, your time may be better spent focusing elsewhere, even if you know it's not yet perfect (and may never be). Effective GitHubbers [surface work early for feedback](http://ben.balter.com/2014/11/06/rules-of-communicating-at-github/#surface-work-early-for-feedback), and consistently get small increments of features in hands of users as quickly as possible, as they strive towards perfection, not after they achieve it. In a single buzzword, *iterate*.

### 7. Honesty, integrity, and authenticity

All throughout GitHub lore we have phrases like "speak like a human" and "when in doubt, be classy". Granted no one's always perfect, these are more than mere buzzwords. Internally, there's a strong sense that action speaks louder than words. It's one thing to say you'll be transparent or collaborative, it's another thing to work in the open, provide opportunities to participate, and ultimately implement the feedback you receive. While here in the Beltway there may be a strong tradition of gushing "It's so great to see you!", even when you know it isn't, at GitHub, there's a strong premium placed on remaining true to GitHub's values (and thus a heavy price, at least in terms of trust, for hypocrisy and inconsistency).

Effective GitHubbers consistently do what they say they'll do. They're also willing to work past their own self-consciousness to have awkward conversations (often made more difficult by being remote), be they positive or negative. Everyone's better when things are in the open. Finally, when things aren't great, they don't gloss over the not-so-great, or put on a fake face.

---

[^suit]: Case in point, I wore a suit for the majority of my first three years at GitHub. I also used words like "heretofore" a lot. Even in our legal writing, we strive for human readability over tradition or obfuscation by legalese.

[^rework]: You should really read [Rework](https://www.amazon.com/dp/B002MUAJ2A/?tag=benbalter-20), but TL;DR: when you create a one-to-one relationship between doing something you love and formal compensation, you make doing that thing you love a means to an end as the more tangible financial value supplants the less tangible emotional or intellectual value you once derived from the activity.