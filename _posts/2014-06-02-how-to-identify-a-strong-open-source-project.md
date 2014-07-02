---
title: How to identify a strong open source project
layout: post
comments: true
excerpt: "Open source provides us with a handful of built in metrics to gauge a project's quality, even without reading a single line of code"
---

Not all open source projects are created equally. There are plenty of open source projects that haven't been touched in years. Heck, I probably even wrote a few of them. If you're going to rely on a community-contributed open source project for your own app, you'll want to ensure the code is up to your standards, and that the community will continue to support it throughout the lifecycle of your project.

While there's no litmus test for "good" open source, there are several common, language-agnostic indicators of a healthy open source project:

* **Update Frequency** - The most commonly cited metric, when was it last updated? A year ago? A week ago? an hour ago? You don't want to inherit a stale codebase. The last update isn't the only thing you should be looking at, though. How frequently is it updated? Is development occasional or continuous. Do commits occur on the weekends (suggesting a hobby) or during the week (suggesting a business). On GitHub, most of this is surfaced as [graphs](https://github.com/jekyll/jekyll/graphs).

* **Issues** — Issues are a good thing, really. If you find an open source project with no open issues that doesn't mean it's perfect. Far from it. In fact, it often means the exact opposite. A vibrant support community with heated discussions and an endless list of proposed features in the roadmap means you've got lots of eyes reviewing the code and driving its development. Open issues are great, closed issues are even better.

* **Forks, stars, downloads** - Each distribution platform provides its own metrics to describe popularity. On GitHub, watchers, stars, and forks are the strongest indicator of a project's popularity and use. On WordPress.org, for example, you can see the number of downloads a plugin's received, as well as its average user rating. These indicators show how much the project is used, which can be helpful, but be careful not to confuse adoptions with quality.

* **Documentation** - How is the project documented? Is it a simply written up in a readme or a dedicated documentation site? Documentation that glosses over technical assumptions (e.g., how to install, requirements, dependencies) often indicates more casually developed software. Dedicated marketing sites (e.g., [jekyllrb.com](https://jekyllrb.com)) show that the project maintainers are serious about getting their code into the hands of users (and thus are more likely to support it).

* **Organization or user** - Who's behind the project? If it's an individual, what's their day job? Are they an expert at whatever the thing does? Do they have a vested interest in maintaining it down the line? Being backed by a company or organization can be a good indicator of quality and stability, but, take a look at the author's other work. Do they understand open source or is this simply an effort to generate good will towards their brand? On GitHub, the owner's name precedes the project name in the URL. Simply drop the project name to see what else they're working on.

* **Who else uses it?** - There are lots of open source projects that can meet the above criteria, but if none of your peers are using the project (or haven't even heard of it), that could be a major red flag. Many companies [proudly showcase](https://github.com/showcases/projects-that-power-github) the open source projects they're built on, and Google searches can often reveal those that don't.

* **License** - Is the project properly licensed? Does it contain a license file or just a reference to a license in the readme? Do files contain the proper headings, where required? The strictness with which the software is licensed, as well as the type of licensed used can indicate how familiar the publisher is with open source, and how serious they are about ensuring they're providing you with unburdened intellectual property. Most importantly, make sure the license is compatible with your own project and goals.

* **The code itself** - Nothing beats a technical expert opening the hood and poking around. Did the developer follow the language's common conventions and design patterns? Did they use a framework or build everything from scratch? Did they use a package manager? Even if you're not a developer, ensure that everything's commented, comments are clear and free of misspellings, and that the project includes extensive tests. Bonus points for continuous integration like Travis CI which shows a commitment to releasing quality software.

When in doubt, software is written by humans, for humans. When in doubt, ask. Open an issue requesting information on the project purpose and status. Is it a fun hobby or will it be around in a year? Who else is using this? Should I base my business on this? Developers want you to use their software and will be glad to help.

There's good software and there's bad software. Luckily open source provides us with a handful of built in metrics to gauge a project's quality and longevity, even without reading a single line of code. Before bringing open source code into your next project, if you don't know the author, be sure to take a closer look.

Everyone has their own heuristics. How do you judge the quality of code?
