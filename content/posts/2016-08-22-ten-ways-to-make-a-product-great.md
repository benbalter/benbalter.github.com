---
title: How to make a product great
description: When building a product, strive to absorb complexity on behalf of users,
  build features 80% of users will use, drink your champagne, optimize for the ideal
  use case, not the most common, let the user make the change, always provide an out,
  be as lean as possible, iterate, iterate, iterate, push logic to the edges, and
  be transparent.
date: '2016-08-22'
---

### Absorb complexity on behalf of users

The internet is a complicated place, and most sites don't make it any better. First and foremost, products should strive to be user-centric. Your job as a creator is to engineer simplicity in an otherwise complex system, to leverage technology to reduce the cognitive burden of accomplishing whatever task your user is trying to achieve (for which using the thing you built is just a necessary step). Every time you add a toggle, dropdown, or text box, you're pushing complexity on your users, and you're adding another decision that they wouldn't have to make if they didn't use your product. Software should be complicated to build and easy to use, not the other way around.

### Build features 80% of users will use

[It's easy (and fun) to optimize for power users and to solve for edge cases](https://ben.balter.com/2016/03/08/optimizing-for-power-users-and-edge-cases/). The real challenge for any product lies in genuinely nailing the out-of-box experience for 80% of users. As a geek, it will always be more fun to develop the new wiz-bang feature that will allow the app to integrate with whatever's currently on the top of Hacker News. As a project maintainer, it will always feel better to ship code and mark an issue as resolved than to close yet another issue as `wontfix`. At the same time, power users are typically the most invested in your product and, thus, the most likely to be vocal. Adding a setting is easy. Burying that setting in the endless clutter of an "advanced" tab is even easier. Forego the temptation to inch your project one step closer to the inside of an airplane cockpit.

### Drink your champagne

There are a few examples of great products that aren't used daily by the teams that develop them. On the one hand, why would you subject your users to an experience you don't deem worthy enough to satisfy your needs (or that you don't understand well enough because you don't experience the problem itself)? Would you eat at a restaurant that the chef refused to eat at? That didn't eat that type of food? When you use a product day in and day out, every bug, every missing feature, and every rough corner becomes a form of passive self-trolling, that is, until you fix it. It also allows you to test a feature in the wild before you subject users to them. Dogfooding, as it's often called, or "drinking your champagne," as I prefer, gives you an unparalleled sense of user empathy, a level of understanding no focus group or market survey will ever provide.

### Optimize for the ideal use case, not the most common

If a user can do something with the product, they will. That's a lot of unexpected uses and, as a result, many unanticipated feature requests. Regardless of how the product is used, push users in the right direction. Please encourage them to do the thing you want them to do. This means building features that support your ideal use case, not the most common, the one used by the loudest part of the user base, or the squeakiest wheel.

### Let the user make the change

Once you've added a feature, you've entered an implicit but perpetual contract with the user, requiring you to support that functionality perpetually. Sometimes things need to change. You want to refresh the design. It's not the direction you want to go anymore. It's too hard to support. Only a small subset of users is using it. Whatever the reason, avoid the temptation to pull the rug out from under the user's feet. Explain *why* you're making the change, give them plenty of advanced notice, provide an upgrade path, and let them take the corrective step rather than taking it for them (and thus risk breach of product contract).

### Always provide an out

I don't remember when I read a user manual, physical, software, or otherwise. It'd be unfair to assume your user has read your documentation, especially not if it's changed since they first started using your product six months, a year, or five years ago. Instead, whenever you communicate with your user, be it copy around a setting's toggle, an error message, or a blog post announcing a new feature, always provide a link to the relevant documentation as a call to action. Any time you don't, you're pushing your user into a dead end that will likely result in frustration and, ultimately, opening an issue or a support request. With every interaction, always provide the user with the next step as a URL.

### Be as lean as possible

If there's a less heavyweight solution, and you're not using it, you've overengineered things. Look to existing tools (think open source), services (think RESTful APIs), and practices (think shared standards) before rolling your own. More straightforward, less complex applications with fewer moving parts are more accessible to scale, easier to maintain, and have fewer potential points of failure. Not to mention, starting with a lightweight solution allows you to rely on the experience of others and individually validate any new assumptions early on, rather than baking them in via technical investment where late course correction is difficult or cost-prohibitive. Put another way, don't reinvent any wheel components unless you have to. Focus on your value add, which likely is your core competency.

### Iterate, iterate, iterate

If you are not embarrassed by the first version of your product, you've launched [too late](https://www.businessinsider.com/the-iterate-fast-and-release-often-philosophy-of-entrepreneurship-2009-11). It doesn't need to be perfect or complete. It shouldn't be. Release early, release often. To borrow a popular tech. Idiom: don't let perfection be the enemy of good (or validated learning). Ship what you can start small and ramp up where you want things. If you can ship a smaller iteration, do it. Suppose you can ship to a minor team of internal stakeholders before customers see it. Even better. Watch how customers receive things and adapt accordingly. Be transparent and manage expectations. Let your vision evolve. Whenever possible, you should publicly ship 0.1, not 1.0.

### Push logic to the edges

Regarding technology, centralized, heavyweight, or human-driven processes are rarely the correct answer. As you design systems, avoid engineering single points of failure, both online and off, which, more often than not, serve to create blockers. Instead, automate (or eliminate) everything possible. In other words, don't force a human to do what a computer can, or as I like to say, "eliminate all humans." When it can't be automated, decentralize authority and empower communities to be self-sufficient by pushing decisions to the edge. Put your faith in the crowd. Rather than creating an entire team to manage a workflow or task, foster ecosystems technically, legally, and culturally. Most importantly, both in computers and in people, don't bake in <a href="https://en.wikipedia.org/wiki/Lock_(computer_science)">locking operations</a>.

### Share to the broadest extent possible

Barriers to the free flow of information add friction, limit the marketplace of ideas, and, more often than not, by inevitably restricting your ability to communicate, you shoot yourself in the foot. This is true both internally and externally. Whenever possible, share information to the broadest extent possible. Make open the default. That means you should prefer open standards, formats, and systems over bespoke, custom-built, or one-off solutions. To facilitate this, I like social and cultural norms over technical constraints. Capture and expose process in everything you do. Don't lock it down unless you have to. Even better, encourage others to contribute.

### Conclusion

Great products are not built-in a vacuum. They're built by teams of people who are passionate about solving a problem, who are willing to absorb complexity on behalf of users, who are willing to drink their champagne, who are willing to optimize for the ideal use case, not the most common, who are willing to let the user make the change, who are willing to always provide an out, who are willing to be as lean as possible, who are willing to iterate, iterate, iterate, who are willing to push logic to the edges, and who are willing to be transparent. Great products are built by teams who are willing to share to the broadest extent possible. Great products are built by teams who are willing to do what it takes to make a product great.
