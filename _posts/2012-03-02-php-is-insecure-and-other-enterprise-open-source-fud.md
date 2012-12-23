---
author: Benjamin J. Balter
title: >
  PHP is Insecure (and Other Enterprise
  Open-Source F.U.D.)
excerpt:
layout: post
categories:
  - Technology
tags:
  - code
  - enterprise
  - fud
  - government
  - microsoft
  - open source
  - php
  - security
  - security though obscurity
  - wordpress
post_format: [ ]
---
PHP (and the open-source software it powers) often gets a bad rap in many government and enterprise circles, the brunt of such anecdotal cries as "it's inherently insecure" or "X proprietary product is much safer." The truth is, much of this unfortunate stereotype is the result of carefully crafted [fear, uncertainty, and doubt (FUD)][1]. An established disinformation tactic historically used by big names in software for decades, one of the most notorious instances of FUD being the leaked Microsoft "[Halloween Documents][2]" that outlined the software firm's strategy to paint open-source, for example, as more costly or under-supported.

So is PHP secure? In a word: **yes**. In my mind, PHP's ill-deserved reputation can be traced to three key causes (beyond mere proprietary propaganda):

1.  **It was** - More than a decade ago, there was a legitimate argument to be made for PHP being insecure. It used to be that PHP shipped with a poorly thought out setting toggled on by default (that any coder worth their weight in Mountain Dew would toggle off) called `register_globals`. The setting allowed poorly written code to be short-circuited by passing certain parameters in the URL. [^1] The default was flipped to off in 2000, and removed completely in 2009. End. Of. Story.
2.  **It's ubiquitous** - Combine the traffic of Facebook, Wikipedia, and the White House, and you'll have a good chunk of the Web's traffic, not to mention probably a good chunk of the web's attacks as a result. Saying that makes PHP insecure would logically render Microsoft Windows, the target of most viruses, equally insecure and unusable. It's just a matter of numbers.
3.  **It's Forgiving** – PHP is a very forgiving programming language, meaning it has a very gentle learning curve and is the first web language of choice for many budding developers. Naturally, inexperienced coders learning to code are going to write inexperienced and thus insecure code. Does that mean it's insecure? No. Bad code is bad code in any language. Again, it's a numbers game.

It's next to impossible to say a given language is "insecure." That'd be like saying English, as a language, is less trustworthy. It just doesn't make sense. In fact, most research supports the idea that the opposite is the case, that [open-source produces better quality code than its closed-source counterparts][4]. Think about it [this way][5]:

> Someone – let's call him Bob – wants to secure a room. But in Bob's universe, there are no locks. So Bob invents one, and installs it. And realizes he has a huge advantage over would-be intruders. Only Bob knows how the lock works. So no one else knows how to pick it. Bob sets about keeping his lock design a secret.
> 
> Alice also needs to secure a room, and she also invents a lock.  Unlike Bob, though, Alice publishes her design – not the set-up for a particular key, of course, but the details of the overall mechanism.
> 
> Bob thinks Alice is nuts. Why tell people how your lock works? They'll just pick it more easily.
> 
> Fine, says Alice, good luck keeping your design a secret. It's going to get out, no matter what you do. And frankly, Bob, your lock probably isn't all that great. Okay, neither is mine. Not yet. But now that it's published, people will suggest improvements. Students will do Ph.D. dissertations on making it better. Companies will compete to develop stronger versions. And long after your design has leaked, and instructions for picking it are all over the Internet, my vastly improved lock will be far more secure. Even though everybody will know how it works.

Put another way, unlike many of its commercial counterparts for which obfuscation is a security staple, open source relies on inherently sound security practices to ensure that whatever you want to remain private, remains private.

Last, because open-source projects like PHP are almost always monitored 24/7 by the prying eyes of countless developers scattered around the globe, if a vulnerability does arise, [it's often addressed in hours][6], and you're not left waiting days or [months as in some commercial products][7] for a patch from on high.

Is there insecure PHP code out there? No doubt. I've seen it. Does that mean all PHP is insecure? Far from it. Next time someone you know says something to the contrary, subtly mention in passing that you're really surprised to hear that the company behind their favorite piece of commercial software recently announced they were sunsetting the project, and see how they handle a taste of their own FUD.

Notes:

1.  In simplified terms, if I have the variable $logged\_in in my page to store whether a user is logged in or not, and I don't first set it to false before checking, a visitor could go to mysite.com?logged\_in=true, and the page would erroneously think I was logged in. 

 [1]: http://en.wikipedia.org/wiki/Fear,_uncertainty_and_doubt
 [2]: https://en.wikipedia.org/wiki/Halloween_documents
 [3]: #note-2020-1 "In simplified terms, if I have the variable $logged_in in my page to store whether a user is logged in or not, and I don't first set it to false before checking, a visitor could go to mysite.com?logged_in=true, and the page would erroneously think I was logged in."
 [4]: https://www.infoworld.com/d/open-source-software/report-open-source-tops-proprietary-code-in-quality-187169
 [5]: http://www.commlawblog.com/2010/01/articles/unlicensed-operations-and-emer/fcc-changes-stance-on-opensource-security/
 [6]: https://twitter.com/#!/nacin/status/9753986051604480
 [7]: http://www.xconomy.com/boston/2008/03/07/delays-in-software-patch-pushed-security-firm-to-disclose-vmware-flaw/