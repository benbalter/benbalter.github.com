---
title: Twelve tips for growing communities around your open source project
description:
---

The superficial promise of open source is that if you publish your code, others will make it better. Strictly speaking, that's not the case. To reap the benefits of open source, maintainers must seek to grow communities around their project, a step often overlooked when "publishing" code.

When it comes to growing communities, there's nothing unique about online communities. Online communities are offline communities, just online. Like your bowling league, place of worship, or neighborhood, there are members, leaders, and rules (be they written or unspoken).

Beyond establishing and enforcing such norms, maintainers seeking to grow communities need to attract members and encourage them to become leaders. My colleague @mikemcquaid describes this process as a [contributor funnel](https://speakerdeck.com/mikemcquaid/the-open-source-contributor-funnel). Similar to prospects traveling down a sales funnel, maintainers must market their project to attract users, provide opportunities for those users to contribute, and encourage repeat contributors to take on maintaining the project.

At GitHub, we've created [`opensource.guide`](https://opensource.guide) to memorialize some of those community-building best practices, and have started prompting users to adopt them via [the community profile](https://github.com/blog/2380-new-community-tools). Beyond that, here are twelve tips for growing communities around your open source project:

### 1. Solve a shared problem

The first step to growing a community is to solve a shared problem. If you open source a library that only connects to one server in your data center on Tuesdays when there's a full moon, it's unlikely that another developer would use the software, let alone see the need to improve or contribute.

Ideally when you're initially architecting the application, but at least before open sourcing, you should abstract your project's logic to the point that it can be widely used beyond your own, specific use case. A library that makes any MySQL database into an API is significantly more likely to thrive as an open source project than an application that wraps your specific database and exposes an API.

It's a win-win. You'll get more modular, more robust code (and potential community improvements), and the open source community will gain a library that can be used for problems beyond the one you're trying to solve.

### 2. Choose a (widely adopted) open source license

Open source software isn't open source without an open source license. It's simply "published code". Open source licenses grant developers the right to use and more importantly, to modify your code. They tell downstream consumers what they can and can't do with your code, and give them the confidence to use your software, without fear of legal repercussion, not to mention, it (often) clarifies under what conditions third-party developers contribute.

While it may be tempting to author your own open source license, [don't](http://ben.balter.com/2016/08/01/why-you-shouldnt-write-your-own-open-source-license/). The difference between open source licenses, and other intellectual property grants, like say, an author’s license to a book publisher, however, is that open source licenses are heavily standardized, with about a dozen mainstream licenses and three primary licenses representing the vast majority of open source projects.

It shouldn't require a team of lawyers to participate in the open source community, either as a contributor or as a consumer. Standardized open source licenses serve as a three or four letter proxy for those with and without formal legal training to know exactly what they can and can’t do with your code, and thus, make it more likely your code will be used and contributed to.

### 3. Link to the GitHub repository from your project's distribution channel(s)

If you're developing a WordPress plugin, Drupal module, Chrome extension, or mobile app, it's vital that users know that your project is open source, and that they're invited to contribute (the first step of the contributor funnel). Regardless of how you distribute your code, if it's distributed any way other than GitHub or a package manager, link back to the repository from that distribution mechanism (WordPress.org, drupal.org, the Google Play or App store, etc.).

Imagine this: You're a software developer using a Chrome extension you found via a Google search and installed via Chrome. You find a bug. You could simply uninstall the extension and find an alternative, or if the extension is open source and the repository readily available, can engage the maintainer, open an issue, and potentially submit the fix yourself.

Links from where the users install the project, or expect support from other projects, to your repository can go a long way to driving users to preferred feedback channels and gives them the opportunity to discover and contribute to your open source project.

### 4. Publish technical documentation

In my mind, there are three types of documentation: marketing materials (why you should use the project), end-user documentation (how to use the project), and technical documentation (how the project works or how to implement it). Most projects tackle the first two but neglect the last beyond obvious or common use cases. The goal should be to transfer project knowledge from the maintainer's head(s) to potential contributors.

The last two are the difference between documenting anticipated functionality versus method or function level documentation. It could be in-line, auto-generated, or hand curated, but the idea is that you're lowering the cognitive burden to expand your project beyond what was originally anticipated, both technically and in terms of desired functionality.

In my experience expanded technical documentation is a positive feedback loop, in that it forces crisper, more purpose built code and leaves less room for ambiguity (not to mention, it helps onboard new users to your project).

### 5. Document how to contribute



### 6. Clarify support v. development

### 7. Welcome new contributors

### 8. Set up automated tests

### 9. Enforce WP code standards

### 10. Deploy to WordPress.org

### 11. Adopt a code of conduct

### 12. Find someone to adopt it
