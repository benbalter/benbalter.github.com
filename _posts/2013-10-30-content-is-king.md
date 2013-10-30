---
title: "Jekyll: Where content is truly king"
layout: post
comments: true
excerpt: "By choosing a static architecture over a more complex one for government.github.com, technology became a given, and we were able to iterate on improving the content itself, "
---

GitHub recently launched [government.github.com](http://government.github.com), a site dedicated to showcasing the efforts of public servants and civic hackers which, despite its technical simplicity, was [more than six months in the making](https://github.com/github/government.github.com/commits/gh-pages), a relative snail's pace by any startup's standards. By [choosing a static architecture over a more complex one](http://developmentseed.org/blog/2012/07/27/build-cms-free-websites/), technology became a given, and rather than iterating on challenges to sharing information, we were able to iterate on improving the content itself, which in the end fundamentally shifted the site's focus and overall user experience.

![Initial commit of government.github.com, versus today](https://f.cloud.github.com/assets/282759/1363429/683a395e-382b-11e3-8e9b-677186b33e72.png){: style="width: 100%" .thumbnail }

Had we chosen to go the traditional WordPress, Rails, or really, any other route, we would have been distracted by and had been forced to dedicate a significant portion of our time to just getting things to work. Are the permissions right for this post? Is the SEO plugin working properly? Will it scale as expected on launch day? That's all just technical noise, noise not even remotely necessary in many cases.

Instead, [Jekyll](http://jekyllrb.com), the static site generator baked directly into [GitHub Pages](https://pages.github.com), introduced a level of zen-like simplicity, that allowed us to focus on one thing and one thing only: content. Are we solving for the right thing here? Can we word this better? Is this line absolutely necessary? We knew it was going to work, so we were able to move on to more important things.

But there was another major advantage. By treating the content as code, we suddenly empowered ourselves to utilize a more evolved editorial workflow. Forks, pull requests, a running list of issues... the content truly was an open source project in itself, and [as we close in on nearly 100 contributors](https://github.com/github/government.github.com/graphs/contributors), the content is only getting better each day.

Open source is about tackling shared challenges together; there's no reason the philosophy need be limited to just code, and with dumb-simple tools like Jekyll which not only empower such workflows, but also free you up to focus on what matters, there's no excuse for content not being king.
