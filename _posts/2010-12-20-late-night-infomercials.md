---
author: Benjamin J. Balter
title: 'Late-Night Infomercials: Guaranteed to Extend the 4th Amendment or Your Money Back'
excerpt: "Online accounts may now be afforded greater protection following the Sixth Circuit's ruling in United States v. Warshak. The court, upholding a temporary injunction on e-mail searches extended the fourth amendment's warrant requirements to messages stored on third-party servers."
layout: post
categories:
  - Law
  - Technology
tags:
  - cloud computing
  - digital due process
  - privacy
post_format: [ ]
---
Despite some users' [lax approach to safeguarding their identities][1], online accounts may now be afforded greater protection following the Sixth Circuit's ruling in *[United States v. Warshak][2].* The court, which upheld a temporary injunction on a fraud investigation involving the all-too-familiar [late-night "Smilin' Bob" informercials][3], extended the fourth amendment's warrant requirements to messages stored on third-party servers. The Sixth Circuit wrote:

> "[T]he ISP is the functional equivalent of a post office or a telephone company… [T]he police may not storm the post office and intercept a letter, and they are likewise forbidden from using the phone system to make a clandestine recording of a telephone call—unless they get a warrant, that is." [^1]

Prior to the ruling, the government could ([and regularly did][5]) obtain e-mails stored on third-party hosts like Gmail, without first needing to obtain a search warrant. In its decision, the district court declared the 1986 Stored Communications Act (SCA) [2][^2] unconstitutional on the grounds that it allowed what was tantamount to a traditional search, but without the required showing of probable cause. The court noted, "*[g]iven the fundamental similarities between e-mail and traditional forms of communication, it would defy common sense to afford e-mails lesser Fourth Amendment protection.*" [3][^3]

The SCA, written long before GMail's all-you-can-eat storage was ever dreamed, required a warrant for any message stored on a third-party server for fewer than 180 days, but simply required a subpoena or court order for older messages or messages that had been previously downloaded by the user, thus denying the subject of the investigation both notice and the subsequent opportunity to contest the search itself. [^1][^4]

For the most part, [the decision makes sense][9]. As e-mail moves from download-and-delete [POP-based][10] messages stored solely on a user's computer to the nearly limitless [IMAP][11], [Exchange][12], or [Web-based][13] messaging that increasingly lives in the unseen cloud, neither opportunity to download nor time spent on server are very compelling standards to determine the level of privacy that should be afforded to a message or the showing of cause that should be required to compel a host to disclose its contents.

The decision, which [tips a circuit split][14] further in favor of extending the fourth amendment, should, at least in theory, lay the groundwork to grant such protections to other forms of information stored in the cloud.  Such information may include calendars or contacts on the more obvious end of the spectrum, but may arguable be construed to cover wholesale cloud services like AWS, Salesforce, Rackspace, and Azure, a possibility not to be taken lightly following the [WikiLeaks hosting scramble][15].

Surely the decision does not settle the issue outright, but it is the latest in a long march of much-needed rulings further blurring the legal distinctions between the world online and the world off, and as persuasively written as it is, is likely to prove influential as both law and technology continue to evolve side by side.


[^1]: *United States v. Warshak*, 08-3997, 2010 WL 5071766 (6th Cir. Dec. 14, 2010). [16]
[^2]: [18 U.S.C. 2703][17](b). 
[^3]: *Warshak*, 2010 WL 5071766. 
[^4]: *See generall*y [Obtaining Electronic Evidence][20], Federal Law Enforcement Training Center (July 2003)

 [1]: http://blogs.wsj.com/digits/2010/12/13/the-top-50-gawker-media-passwords/
 [2]: http://www.ca6.uscourts.gov/opinions.pdf/10a0377p-06.pdf
 [3]: http://blogs.forbes.com/kashmirhill/2010/12/15/your-email-now-warrants-greater-privacy-thanks-to-sex-pill-peddling-dude/
 [5]: http://www.google.com/transparencyreport/governmentrequests/

 [9]: http://ben.balter.com/2010/10/10/does-every-cloud-have-a-silver-lining/ "Does Every Cloud Have a Silver Lining?"
 [10]: http://en.wikipedia.org/wiki/Post_Office_Protocol
 [11]: http://en.wikipedia.org/wiki/Internet_Message_Access_Protocol
 [12]: http://en.wikipedia.org/wiki/Microsoft_Exchange_Server
 [13]: http://en.wikipedia.org/wiki/Webmail
 [14]: http://volokh.com/2010/12/14/sixth-circuit-rules-that-e-mail-protected-by-the-fourth-amendment-warrant-requirement/
 [15]: http://www.huffingtonpost.com/2010/12/01/wikileaks-website-loses-h_n_790526.html
 
 [17]: http://www.law.cornell.edu/uscode/18/usc_sec_18_00002703----000-.html
 
 
 [20]: http://docs.google.com/viewer?a=v&q=cache:IYzfdrim0owJ:www.fletc.gov/training/programs/legal-division/downloads-articles-and-faqs/downloads/other/obtaining_electronic.pdf/download+&hl=en&gl=us&pid=bl&srcid=ADGEESgpYeTPUFAijEyb4BnY4_wzFLwSJmRNv8yL2ZD8EkhQTjt7oXv9kELuYHG7A202xJ9_MGwvgVDwjviAEh0zW76gZQAbieBYwR6cnNUyD83txcScrGTU0qDUME590QPAMej6hmSy&sig=AHIEtbTf4jZconLMbkMO_hVK8xQ92bqZNQ