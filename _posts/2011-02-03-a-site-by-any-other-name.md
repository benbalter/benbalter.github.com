---
author: Benjamin J. Balter
title: A Site By Any Other Name...
excerpt: |
  DHS recently began protecting America's shores from threats of a different kind: online copyright infringement. In the days before the Superbowl, the agency set out to enforce the "express written consent of the NFL" provision attached to most broadcasts by slamming the iron fist of the law down on six sports-streaming websites.
layout: post
categories:
  - Law
  - Technology
tags:
  - censorship
  - copyright
  - digital due process
  - domains
post_format: [ ]
---
![][1]Violating due process is one thing, but violating web standards… well that's another story.

The Department of Homeland Security (DHS) recently began protecting America's shores from threats of a different kind: online copyright infringement. In the days before the Superbowl, the agency set out to enforce the "express written consent of the NFL" provision attached to most broadcasts by slamming the iron fist of the law down on [six sports-streaming websites][2]. This is troubling on multiple levels. As the Vololkh Conspiracy's David Post [put it][3]:

> There's a good reason we don't generally allow agents of the State to march into judge's chambers and deprive people of their property without an adversary hearing, viz., they're likely to make errors that can be difficult to correct ex post.

And that's exactly what happened when the Feds [seized riojadirecta.org][4].However, the law in the area is a bit more nuanced than a single form can satisfy. Riojadirecta did not actually host any infringing content — it merely aggregated links to such content — potentially invoking the safe harbor provisions of the copyright act. [^1] Compounding the issue, Spanish Courts had found the Spanish-based site to be [perfectly legal][6], just a few months prior.

Seizures of this type are nothing new. Back in November, DHS [commandeered][7] some [80 bit torrent domains][8] (PDF) as part of the broader "[Operation In Our Sites][9]". One such site, dajaz1.com, a music blog dedicated to hip-hop, was claimed to have infringed on music copyrights, however it was later revealed that the [music in question was provided to the site by music industry executives][10]. Despite this revelation, DHS made no apparent move to look into the case or restore the domain, and [the site remains down][11] to this day.

Part of the problem may stem from law enforcement being out of touch with today's trends. Even the agent in charge of the investigation [referred to the infringing material as "a bit torrent,"][12] suggesting a sophomoric understand of just what exactly was being seized.

More worrisome, however, is the fact that the statute cited to authorize such seizures, 18 U.S.C. § 2323, provides no safeguard to prevent such errors from occurring [^2] nor does it [prohibit its expanded use][14]. [^3] As Sen. Ron Wyden (D-OR) [argued][16]:

> In contrast to ordinary copyright litigation, the domain name seizure process does not appear to give targeted websites an opportunity to defend themselves before sanctions are imposed… I worry that domain name seizures could function as a means for end-running the normal legal process in order to target websites that may prevail in full court. The new enforcement approach used by Operation In Our Sites is alarmingly unprecedented in the breadth of its potential reach.

Even looking beyond the due process issues and to the underlying copyright infringement, simply put, the government's efforts fail to solve the problem. In Riojadirecta's case, for example, the site [used Twitter][17] to [direct users to one of its five other domains][4] rending the seizure a moot point. The problem is that the government is not seizing the infringing material, but rather, an [alias for the network address][18] of a site that in many cases, only contains links to infringing material. It would be as if DHS seized my cell phone number because my friends could use it to call and find out the location of a weekly poker game — the game would still take place, I would just get a new phone number.

The most upsetting part, at least for the web developer in me, has to be [the seizure notice][19] itself. Putting text in images like that has to be up there with [using Comic Sans][20]. While I do not expect DHS to hire a legion of designers and developers to make an HTML5 seizure notice (although that would be awesome), some in-document text would go a long way to making the web a whole lot less ugly. [^4] Additionally, it looks like their policy has changed since the initial seizures, however, at least as late as November, DHS was [placing Google Analytics and Piwik tracking codes on its seized domains][22], arguably in violation of [OMB memorandum M-10-22][23] (PDF).

As seen in the recent [Wikileaks domain shell game][24], its clear that domain servers are the weak link in the online content-delivery chain. When the state can no longer seize something that represent the forefront of our ability to communicate with one another (decentralized information sharing) and replace it with a technology the web collectively deprecated with the rise of CSS1 (sites which rely on .GIFs to render text), legality and politics aside, the internet will undoubtedly be a better place.

Notes:

[^1]: 17 U.S.C. § 512(d). [25]
[^2]: The relevant provisions of § 2323 allow for the forfeiture of "(A) Any article, the making or trafficking of which is, prohibited under section 506 of title 17″ prohibiting "willful copyright infringement" and "(B) Any property used, or intended to be used, in any manner or part to commit or facilitate the commission of an offense referred to in subparagraph (A)." [26]
[^3]: As [Post noted back then][27], and even more relevant now in light of Egypt's recent flipping of its internet kill switch, "our ability to defend the principle of the single global Internet – the Internet where all of humanity has equal access to knowledge and ideas, the Internet that looks the same to, and allows free and unfettered communication between, users located in Shanghai and Seattle and Santiago, free of locally imposed censorship regimes – will be deeply compromised by [seizures of this kind], which would enshrine in U.S. law for the first time the contrary principle: that all countries have a right to insist on the removal of content, wherever located, from the global Internet in service of the exigencies of local law." (Quoting a [letter he authored][27] criticizing the Senate's Combating Online Infringements and Counterfeits Act). [28]
[^4]: Beyond being reminiscent of Geocities (and most of the 90s), text in images is not machine readable, a requirement of section 508 (codified at 29 U.S.C. § 794(d)) . That means that neither screen readers nor search engines can accurately parse the site's content. [29]

 [1]: http://ben.balter.com/wp-content/uploads/2011/02/IPRC_Seized_2010_11-300x225.gif "DHS Seizure Notice"
 [2]: http://itwel.com/atdhe-live-sports-streaming-website-seized-by-us-authorities.php
 [3]: http://volokh.com/2011/02/02/more-outrageous-domain-name-seizures-by-our-vigilant-dept-of-homeland-security/
 [4]: http://www.huffingtonpost.com/2011/02/02/rojadirecta-org-seized_n_817458.html
 [5]: #note-2020-1 "17 U.S.C. § 512(d)."
 [6]: http://torrentfreak.com/sports-streaming-torrent-links-site-victorious-in-court-100510/
 [7]: http://torrentfreak.com/u-s-government-seizes-bittorrent-search-engine-domain-and-more-101126/
 [8]: http://www.ice.gov/doclib/news/releases/2010/domain_names.pdf
 [9]: http://www.ice.gov/news/releases/1006/100630losangeles.htm
 [10]: http://www.nytimes.com/2010/12/20/business/media/20music.html?_r=1&ref=todayspaper
 [11]: http://dajaz1.com/
 [12]: http://arstechnica.com/tech-policy/news/2010/12/busting-bittorrent.ars
 [13]: #note-2020-2 "The relevant provisions of § 2323 allow for the forfeiture of "(A) Any article, the making or trafficking of which is, prohibited under section 506 of title 17″ prohibiting "willful copyright infringement" and "(B) Any property used, or intended to be used, in any manner or part to commit or facilitate the commission of an offense referred to in subparagraph (A).""
 [14]: http://www.copyhype.com/2011/02/can-google-be-seized-by-ice/
 [15]: #note-2020-3 "As Post noted back then, and even more relevant now in light of Egypt's recent flipping of its internet kill switch, "our ability to defend the principle of the single global Internet – the Internet where all of humanity has equal access to knowledge and ideas, the Internet that looks the same to, and allows free and unfettered communication between, users located in Shanghai and Seattle and Santiago, free of locally imposed censorship regimes – will be deeply compromised by [seizures of this kind], which would enshrine in U.S. law for the first time the contrary principle: that all countries have a right to insist on the removal of content, wherever located, from the global Internet in service of the exigencies of local law." (Quoting a letter he authored criticizing the Senate's Combating Online Infringements and Counterfeits Act)."
 [16]: http://arstechnica.com/tech-policy/news/2011/02/senator-us-domain-name-seizures-alarmingly-unprecedented.ars?utm_source=rss&utm_medium=rss&utm_campaign=rss
 [17]: http://twitter.com/#!/rojadirecta/status/32348722188779520
 [18]: http://en.wikipedia.org/wiki/Domain_name
 [19]: http://dajaz1.com/IPRC_Seized_2010_11.gif
 [20]: http://bancomicsans.com/
 [21]: #note-2020-4 "Beyond being reminiscent of Geocities (and most of the 90s), text in images is not machine readable, a requirement of section 508 (codified at 29 U.S.C. § 794(d)) . That means that neither screen readers nor search engines can accurately parse the site's content."
 [22]: http://qbit.cc/homeland-security-tracking-visits-to-seized-domains-using-google-analytics-and-piwik/
 [23]: http://www.whitehouse.gov/sites/default/files/omb/assets/memoranda_2010/m10-22.pdf
 [24]: http://gawker.com/#!5704966/wikileaks-loses-its-domain
 
 
 [27]: http://volokh.com/2010/12/01/copyright-enforcement-tail-wags-internet-dog-contd-or-what-the-hell-ever-happened-to-due-process/