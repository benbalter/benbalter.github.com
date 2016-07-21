---
title: Ten philosophies that make a great product
description: There are a handful of lessons I've learned over the years hacking on GitHub Pages that fundamentally inform by product philosophy.
---

I've been hacking on GitHub Pages as somewhat of a side project for the past three years, but this past January, I took on managing GitHub Pages full-time. I'd apparently been doing what others would call product management for a while (even though I didn't call it that), but as my first formal product management role, I'm realizing now that there were a handful of lessons I've learned over the years that have fundamentally informed by product philosophy:

### Absorb complexity on behalf of users

The internet's a complicated place, and most websites don't make it any better. Products should strive to be user-centric. Your job as a creator is to engineer simplicity, to leverage technology to reduce the cognitive burden of accomplishing whatever task your user is trying to accomplish (for which using the thing you built is just a necessary step along the way). Every time you add a toggle, dropdown, or text box, you're pushing complexity on your users, and you're adding another decision that they wouldn't have to make if they didn't use your product. Software should be hard to build and easy to use, not the other way around.

*Example*: When a GitHub Pages build fails, we have access to all sorts of diagnostic information: what permissions did the requesting user have, what version of each dependency were we using, when did the build process stop, what's the backtrace of the exception, it goes on. Instead of throwing the raw build output at the user and telling them to figure it out, we detect the underlying cause, if we can, and provide them with a short, but descriptive failure message, with links to the relevant documentation.

### Optimize for the ideal use case, not the most common

If a user can do something with the product, they will. That's a lot of unexpected uses, and as result, a lot of unanticipated feature requests. Regardless of how the product is actually being used, push users in the right direction. Encourage them to do the thing you want them to do. This means building features that support your ideal use case, not the most common, the one used by the loudest part of the user base, or the squeakiest wheel.

*Example*: GitHub Pages is used for all sorts of things, from automated status sites to local bakeries. It's intended to be used for user, organization, and project pages. Instead of investing in features to support features completely unrelated to activity on GitHub, we made it easier to publish metadata about your GitHub activity, such as a list of your organization's most popular open source projects.

### Build features 80% of users will use

[It's easy (and fun) to optimize for power users and solve for edge cases](http://ben.balter.com/2016/03/08/optimizing-for-power-users-and-edge-cases/). The real challenge, for any product, lies in genuinely nailing the out-of-box experience for 80% of users. As a geek, it’s always going to be more fun to develop the new wiz-bang feature that will allow the app to integrate with whatever’s currently on the top of Hacker News and as a project maintainer, it’s always going to feel better to ship code and mark an issue as resolved, than to close yet another issue as `wontfix`. At the same time, power users typically are the ones most invested in your product, and thus the most likely to be vocal. Adding a setting is easy. Burying that setting in the endless clutter of an “advanced” tab is even easier. Forego the temptation to inch your project one step closer to the inside of an airplane cockpit.

*Example*: GitHub Pages originally had five markup interpreters, each with their own ideosycracies. Data showed that ___ % of users used the default engine. Removing the other four engines allowed us to simplify the user experience and concentrate on more impactful features.

### Let the user make the change

Once you've added a feature, you've entered an implicit, but perpetual contract with the user, that you will continue to support that feature. Sometimes things need to change. It's not the direction you want to go any more. It's too hard to support. Only a small subset of users are actually using it. Whatever the reason, avoid the temptation to pull the rug out from under the user's feet. Explain *why* you're making the change, given them plenty advanced notice, provide an upgrade path, and let them take the corrective step, rather than taking it for them.

*Example*: In the case of GitHub Pages, when a user makes a change that breaks their site, it's frustrating, but they can do it on their own schedule (and know exactly what caused it). When global changes break that same site, it's just frustrating.

### Always provide an out

I don't remember the last time I read a user manual, physical, software, or otherwise. It'd be unfair to assume your user has read your documentation, especially not if it's changed since they first started using  your product. Instead, every time you communicate with your user, being it copy around a settings toggle, an error message, or blog post announcing a new feature, always provide a link to the relevant documentation in the form of a call to action. Any time you don't, your pushing your user into a dead end, that will likely result in both frustration and opening an issue or a support request. With every interaction, always provide the user with the next step.

*Example*: Every time you recieve a build failure or warning from GitHub, we have continuous integration tests to ensure not only that that email has a link to the relevant documentation, but that the link is still valid. Additionally, most Pages interfaces have either explicit or implicit links to their relevant docs.

### Drink your own champagne

There are few examples of great products that aren't used on a daily basis by the teams that develop them. On the one hand, why would you subject your users to an experience that you wouldn't subject yourself to. Would you eat at a restaurant that the chef refused to eat at? On the other hand, when you use a product day in and day out, every bug, every missing feature, every rough corner becomes a passive self-trolling, until you fix it. Not to mention, it provides an opportunity to test a feature in the wild, before you subject users to it. Dog fooding, as it's often called, or "drinking your own champagne" as I prefer, gives you an unparalleled sense of user empathy, a level of understanding no focus group or survey will ever provide.

*Example*: At GitHub, not only do many GitHubbers use GitHub Pages to host their own site or blog, but we actively encourage other teams to use GitHub Pages any time they can, and users undoubtedly benefit from that test best of diverse use cases. We added the [Jekyll SEO Tag](https://github.com/jekyll/jekyll-seo-tag) plugin to GitHub Pages a while back. The plugin automatically provides metadata for search engines to better index your site. When it was first whitelisted for GitHub Pages, we didn't announce it. Instead, we used it internally, for GitHub properties like `desktop.github.com`, to see how it performed in the wild, and then added it to the GitHub Pages Gem, for early adopted to experiment with.

### Be as lean as possible

If there's a less heavyweight solution, and you're not using it, you've over-engineered things. Look to existing tools (think open source), services (think APIs), and practices (think shared standards). Simpler applications are easier to scale, easier to maintain, and have fewer components that can break.

*Example*: For the first six years of its existence, GitHub Pages was a single, 100-line shell script, and the resulting sites would be served from two vanilla Nginx servers. It worked for nearly a million sites, but as things grew, when eventually needed to add additional complexity, but that complexity wasn't necessary at the onset.

### Iterate, iterate, iterate

If you are not embarrassed by the first version of your product, you’ve launched [too late](http://www.businessinsider.com/the-iterate-fast-and-release-often-philosophy-of-entrepreneurship-2009-11#ixzz2U7lGAS2A). It doesn't need to be perfect or complete. Publicly ship 0.1, not 1.0. Start small and ramp up to where you want things to be. Watch how customers receive things and adapt accordingly. Be transparent, manage expectations. Let your vision evolve.

*Example*: HTTPS support for GitHub Pages is one of our most requested features. Supporting HTTPS for more than a million sites is not a insignificant engineering task. While we're working to eventual support HTTPS for custom domains, we sequentially shipped changes at the network, load balancer, application, and router layers to support HTTPS for `*.github.io` sites, and hope to build upon those ships to support HTTPS for custom domains.

### Push logic to the edges

Avoid single points of failure, both in systems and in people. Foster communities. Push decisions to the edge. Put your faith in the crowd. Don't bake in <a href="http://en.wikipedia.org/wiki/Lock_(computer_science)">locks</a>. Avoid blockers. Automate wherever possible. Eliminate all humans.

*Example*:

### Share to the widest extent possible

Barriers to the free-flow of information just add friction and more often than not, you just end up shooting yourself in the foot. Make open the default. Open standards, open formats, open systems. Expose process. Prefer social and cultural norms to technical constraints. Don't lock it down unless you absolutely have to. Trust people.

*Example*: We had an internal implementation for gathering metadata about a GitHub Pages site at build time. As a result, users couldn't replicate that experience locally when previewing their site, despite that there was nothing proprietary about our approach. We created an open source plugin to replicate that experience, and eventually moved to using that implementation exclusively. As a result, users' local environments more closely represent their live site, and bugs can be surfaced and addressed as their discovered.
