---
author: Benjamin J. Balter
title: >
  When all you have is a pair of bolt
  cutters...
excerpt: "A workflow management and version control system building on WordPress's existing core competencies. By treating documents as a custom post type, users can leverage the power of WordPress's extensive attachment, revision, taxonomy, and URL rewriting functionalities. "
layout: post
categories:
  - Technology
tags:
  - code
  - document management
  - google
  - gsoc
  - open source
  - plugin
  - wordpress
post_format: [ ]
---
[![Golden Hammer](http://imgs.xkcd.com/comics/golden_hammer.png){.aligncenter}][1]

My biggest gripe with [WordPress][2], the open-source [content management system][3] that silently works behind the scenes to power [more than 13%][4] of the Internet, is that it sets far too high a bar with which other applications must compete. I cannot count the number of times that I have used a proprietary or commercial system and silently thought to myself, "*WordPress can do this so much better*." [^1]

This ritual saw no deviation, when I sat down to setup [SharePoint][6] in support of my [law journal][7]‘s upcoming publication workflow. Like Alice stumbling down the rabbit hole, it quickly became apparent that in the counterintuitive world of Sharepoint, each step was going to be more and more alien than the last. And then it dawned on me: a corollary of [Uncle Ben's law][8], *with great power does not have to come great complexity*.

WordPress does many things right. It is an incredibly versatile tool, but like a body builder with a heart of gold, it is as friendly and approachable as it is powerful. WordPress has [more than eight years of rock-solid experience][9] storing, organizing, sorting, and searching all sorts of user-generated content. Its got a set of slick attachment functions to allow users to safely and securely upload and store their non-WordPress files in WordPress. For the past three years, it even has a proto-version control system in the form of its much-envied [post revisions][10]. [^2] And it does all this through an interface so dumb-simple that [even your grandparents could start their own site][12]. It seems like a no brainer then, to marry these tools to create a WordPress-based document management system.

Imagine a workflow management and version control system [building on WordPress's existing core competencies][13]. By treating documents as a custom post type, users can leverage the power of WordPress's extensive attachment, revision, taxonomy, and URL rewriting functionalities. Document permalinks can be routed through the traditional rewrite structure such that the latest revision of a file always remains at a static, authenticated URL, and users can toggle the visibility of documents (both internally and externally) as they currently do with post statuses and permissions. Similarly, file locking can extend WordPress's autosave functionality (as a ping), revision logs can extend WordPress's existing revision relationship and can be outputted as a traditional RSS feed, etc.

![][14]

As seen in the above wireframe, document revisions would be inextricably linked to the essential WordPress experience. If you know WordPress, you know document revisions. Why reinvent the wheel when you have the best wheel the world has ever seen, and a passionate global community dedicated to improving it? This approach would not simply be limited to traditional documents. Images, PDFs, code — anything the user wants to collaborate with others on, or have a secure revision history can be thrown at it. Academics, lawyers, government folks, the possibilities are endless.

To be fair, WordPress has been arguably overextended in some cases, [^3] but I do not believe that to be the case here. Sure any WordPress enthusiast may be guilty of the [bolt-cutter mentality][16] every now and then, but I believe, if anything, it is enterprise stakeholders' tendency to gravitate toward bloated, commercial systems that is more akin to Wolf Blitzer's boat house, and a big reason why is because with the exception of an unnamed [^4] content management system's poorly executed attempt at document management, no open-source alternatives exist.

I am working on submitting this idea as a proposed [Google Summer of Code][18] project, [^5] with the goal of giving WordPress parity with commercial and proprietary applications and hopefully injecting some open-source goodness into government and other enterprise environments, but before I do, I would love to hear your thoughts. [Get in touch][20], or [leave a comment below][21].

**Update (8/29)**: The final result of the project is an [Open Source Document Management and Version Control System][22] for WordPress. An overview of its top-level features including a screencast of a typical use case is available on the [WP Document Revisions][22] page.

[^1]: *See, e.g., *[Documentum][23], [Liferay][24], [Melange][25], and [Gawker's CMS][26]. 
[^2]: Nearly three years ago, at the time of the feature's inception, [WordPress founder Matt Mullenweg noted][28], "*With the power of modern computers, it's silly that we still use save and editing metaphors from the time when the most common method of storage was floppy disks… now we're taking that to another level by allowing you to view who made what changes when… through a super-easy interface, much like Wikipedia or a version control system.*" 
[^3]: *See, e.g., *WordPress as an [e-mail newsletter][30], [contact manager][31], [CRM][32], [task list][33], [invoice system][34],  [job bank][35], or [real estate directory][36]. 
[^4]: Let's just call it "Frupal" for the sake of discussion. 
[^5]: In hindsight, I probably shouldn't have ripped on Melange. *See supra note 1.* 

 [1]: http://xkcd.com/801/
 [2]: http://wordpress.org
 [3]: http://en.wikipedia.org/wiki/Content_management_system
 [4]: http://w3techs.com/technologies/overview/content_management/all
 [5]: #note-2020-1 "See, e.g., Documentum, Liferay, Melange, and Gawker's CMS."
 [6]: http://en.wikipedia.org/wiki/Microsoft_SharePoint
 [7]: http://pcjl.org
 [8]: http://www.youtube.com/watch?v=8DfztIIqbTI#t=1m3s
 [9]: http://core.trac.wordpress.org/browser/trunk?rev=3
 [10]: http://codex.wordpress.org/Revision_Management
 [11]: #note-2020-2 "Nearly three years ago, at the time of the feature's inception, WordPress founder Matt Mullenweg noted, "With the power of modern computers, it's silly that we still use save and editing metaphors from the time when the most common method of storage was floppy disks… now we're taking that to another level by allowing you to view who made what changes when… through a super-easy interface, much like Wikipedia or a version control system.""
 [12]: http://www.thegrandparentsblog.com/
 [13]: http://lists.automattic.com/pipermail/wp-hackers/2011-March/038727.html
 [14]: http://ben.balter.com/wp-content/uploads/2011/04/wireframe.png "WP Document Revisions Wireframe"
 [15]: #note-2020-3 "See, e.g., WordPress as an e-mail newsletter, contact manager, CRM, task list, invoice system,  job bank, or real estate directory."
 [16]: http://xkcd.com/801
 [17]: #note-2020-4 "Let's just call it "Frupal" for the sake of discussion."
 [18]: http://www.google-melange.com/gsoc/homepage/google/gsoc2011
 [19]: #note-2020-5 "In hindsight, I probably shouldn't have ripped on Melange. See supra note 1."
 [20]: http://ben.balter.com/contact/
 [21]: #comments
 [22]: http://ben.balter.com/2011/08/29/document-management-version-control-for-wordpress/
 [23]: http://www.emc.com/domains/documentum/index.htm
 [24]: http://www.liferay.com/
 [25]: http://code.google.com/p/soc/wiki/MelangeIntro
 [26]: http://www.mediaite.com/online/worse-than-previously-thought-gawker-content-management-system-hacked/
 
 [28]: http://wordpress.org/news/2008/07/wordpress-26-tyner/
 
 [30]: http://net.tutsplus.com/tutorials/wordpress/build-a-wordburner-email-newsletter-manager-using-wordpress-and-feedburner/
 [31]: http://publisherblog.automattic.com/2008/02/13/wp-contact-manager/
 [32]: http://slipfire.com/wp-crm/
 [33]: http://wordpress.org/extend/plugins/wp-task-manager/
 [34]: http://wordpress.org/extend/plugins/wp-invoice/
 [35]: http://wordpress.org/extend/plugins/job-manager/
 [36]: http://wordpress.org/extend/plugins/great-real-estate/