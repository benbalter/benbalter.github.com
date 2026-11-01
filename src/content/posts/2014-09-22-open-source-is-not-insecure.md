---
title: Open source is (not) insecure
description: Open source software isn't inherently less secure than proprietary alternatives. That myth stems from fear, uncertainty, and doubt (FUD).
tldr: "The idea that open source software is inherently less secure than its closed source or proprietary counterparts is untrue and stems from fear, uncertainty, and doubt (FUD). Decide whether to open source code based on industry best practices, not fear."
---

Spend any time in the enterprise IT world, and you'll quickly be led to believe that open source software is insecure, and only what you use when you can't afford "real" software. Both are false. This is a form of [FUD (fear, uncertainty, doubt)](https://en.wikipedia.org/wiki/Fear,_uncertainty_and_doubt), which has been historically encouraged [by those who sell open source's proprietary alternatives](https://en.wikipedia.org/wiki/Halloween_documents). When talking about the security of open source, there are two parallel conversations. Open source as a platform, and open source as a workflow.

## Open source as a platform

The first threshold issue is whether building or using open source software, even if your own particular code isn't published, is somehow inherently less secure. This argument has a few flavors:

### This one (high profile) open source project that (once) had a vulnerability

There's good software and there's bad software. How widely the code's shared has no direct impact on its quality (if anything, it helps, see [below](#anyone-can-see-where-the-vulnerabilities-are-and-fix-them)). An immature project is going to have bugs, whether proprietary or open source.

Often times, the reason open source software vulnerabilities make headlines, or seem to make headlines more often, is because it's so widely used. :quote[Your custom built software being hacked isn't newsworthy, but the CMS that powers a quarter of the internet is.]{#cms-quarter-of-internet} And because the code is open, vulnerabilities are discovered and patched more easily, meaning you may hear more often about open source software having unexploited vulnerabilities, while the only closed-sourced vulnerabilities you hear about are those which have already been exploited in the wild (and thus require immediate action).

### It's (not) made by a bunch of hobbyists

That's true of some projects, for sure. Plenty of fly-by-night software companies sell subpar, closed-source software. Again, quality is quality. Chances are, the project made in the developer's mom's basement isn't going up against the one made by the company that makes "enterprise-grade" solutions. Like anything else, [look to who's behind the software and who else uses it](/2014/06/02/how-to-identify-a-strong-open-source-project/). Major projects like Linux, WordPress, and Drupal are led by teams of professionals, relied on by thousands of for-profit businesses, and have "suits" supporting them, to ensure their success.

A distributed workflow has a real advantage. Lots of closed-source solutions, influenced by nine-to-five, Monday-to-Friday workflows, stringent release cycles, and press paralysis, [are forced to delay releases that patch critical vulnerabilities](https://web.archive.org/web/20140109214736/http://www.xconomy.com/boston/2008/03/07/delays-in-software-patch-pushed-security-firm-to-disclose-vmware-flaw/), often for years. Open source projects, guaranteed to have someone awake at any hour of the night, can turn around that same patch, [literally within hours of the vulnerability being reported](https://twitter.com/#!/nacin/status/9753986051604480).

## Open source as a workflow

The second form of open source FUD attacks open source as a workflow, meaning that publishing your software's source code somehow makes it less secure. Again, this argument comes in a few flavors.

### Anyone can (not) make changes

:::objection[Can't anyone just make changes to open source code?]
The idea that anyone can make changes is untrue. It's FUD at its best. Like with closed projects, only authorized maintainers can approve changes to open source projects. I suspect this misunderstanding stems from using Wikipedia as an analogy to describe open source to the uninitiated. Put plainly, it comes from a place of ignorance. You're not going to wake up one day and mysteriously, your code will be riddled with malware and backdoors.

Instead, open source often has better controls to ensure pedigree than its closed-source counterparts. Open source, by its nature, must use advanced version control systems, to facilitate discussions (two things often absent from closed-source software). Every change, no matter how small, whether by the project creator or a first-time contributor, must be publicly proposed, discussed, and stringently reviewed, the change history available for all to see.
:::

### Anyone can see where the vulnerabilities are (and fix them)

This is predicated, almost exclusively on the [(disproven to death) strategy of security through obscurity](https://en.wikipedia.org/wiki/Security_through_obscurity). It's a form of security theater. It's the idea of hiding a key under the welcome mat. It assumes that, if the bad guy doesn't know it's there, it's secure, right? Wrong. It's the same reason building blueprints can be available for public inspection (and city review), without increasing the chance of a break-in (and we end up with stronger, more fire resistant buildings as a result).

:quote[When everyone can see the inner workings (including those you want to keep out), you're forced to build inherently secure systems, rather than [systems that rely on smoke and mirrors](https://www.commlawblog.com/2010/01/articles/unlicensed-operations-and-emerging-technologies/fcc-changes-stance-on-open-source-security/).]{#smoke-and-mirrors-systems} As a result, statistically, [open source software actually produces more secure software than its closed-source counterparts](https://web.archive.org/web/20140902212926/http://www.infoworld.com/d/open-source-software/report-open-source-tops-proprietary-code-in-quality-187169).

### We (won't) reveal our secrets

Open or closed, industry-standard best practices dictate you shouldn't have secrets in your code. Passwords, tokens, server names, anything remotely secret (heck, anything that changes between development, staging, and production) belongs in the database, an environment variable, or a VCS-ignored configuration file, not distributed with the software itself.

For one, you've potentially got outside contractors or others in your code, which shouldn't be an access control mechanism in itself. For another, best practices once again dictate that such configurations aren't shared between environments, and are rolled often, something much harder if it requires a code change and deploy. Open sourcing your code forces you to keep application logic and system-specific configuration, secret or otherwise, separate.

Can open source be insecure? Sure. Is there insecure open source software? Plenty. But the idea that a language, platform, or workflow, based solely on its philosophy, is somehow inherently less secure is absurd. Done right, I'd argue open source is often more secure than closed source or proprietary alternatives. Either way, not all software must be closed source and the decision of whether a particular piece of software should be open or closed should be defined by industry-best practices, not by fear.
