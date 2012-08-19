---
author: Benjamin J. Balter
title: >
  When all you have is a pair of bolt
  cutters...
excerpt: "A workflow management and version control system building on WordPress's existing core competencies. By treating documents as a custom post type, users can leverage the power of WordPress’s extensive attachment, revision, taxonomy, and URL rewriting functionalities. "
layout: post
category:
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
[![Golden Hammer](http://wordpress.org)][2]

My biggest gripe with [WordPress](http://en.wikipedia.org/wiki/Content_management_system), the open-source [content management system](http://w3techs.com/technologies/overview/content_management/all) that silently works behind the scenes to power [more than 13%](#note-2020-1 "See, e.g., Documentum, Liferay, Melange, and Gawker’s CMS.") of the Internet, is that it sets far too high a bar with which other applications must compete. I cannot count the number of times that I have used a proprietary or commercial system and silently thought to myself, “*WordPress can do this so much better*.” [1](http://en.wikipedia.org/wiki/Microsoft_SharePoint)

This ritual saw no deviation, when I sat down to setup [SharePoint](http://pcjl.org) in support of my [law journal](http://www.youtube.com/watch?v=8DfztIIqbTI#t=1m3s)‘s upcoming publication workflow. Like Alice stumbling down the rabbit hole, it quickly became apparent that in the counterintuitive world of Sharepoint, each step was going to be more and more alien than the last. And then it dawned on me: a corollary of [Uncle Ben’s law](http://core.trac.wordpress.org/browser/trunk?rev=3), *with great power does not have to come great complexity*.

WordPress does many things right. It is an incredibly versatile tool, but like a body builder with a heart of gold, it is as friendly and approachable as it is powerful. WordPress has [more than eight years of rock-solid experience](http://codex.wordpress.org/Revision_Management) storing, organizing, sorting, and searching all sorts of user-generated content. Its got a set of slick attachment functions to allow users to safely and securely upload and store their non-WordPress files in WordPress. For the past three years, it even has a proto-version control system in the form of its much-envied [post revisions](#note-2020-2 "Nearly three years ago, at the time of the feature’s inception, WordPress founder Matt Mullenweg noted, “With the power of modern computers, it’s silly that we still use save and editing metaphors from the time when the most common method of storage was floppy disks… now we’re taking that to another level by allowing you to view who made what changes when… through a super-easy interface, much like Wikipedia or a version control system.“"). [2](http://www.thegrandparentsblog.com/) And it does all this through an interface so dumb-simple that [even your grandparents could start their own site](http://lists.automattic.com/pipermail/wp-hackers/2011-March/038727.html). It seems like a no brainer then, to marry these tools to create a WordPress-based document management system.

Imagine a workflow management and version control system [building on WordPress’s existing core competencies](http://ben.balter.com/wp-content/uploads/2011/04/wireframe.png "WP Document Revisions Wireframe"). By treating documents as a custom post type, users can leverage the power of WordPress’s extensive attachment, revision, taxonomy, and URL rewriting functionalities. Document permalinks can be routed through the traditional rewrite structure such that the latest revision of a file always remains at a static, authenticated URL, and users can toggle the visibility of documents (both internally and externally) as they currently do with post statuses and permissions. Similarly, file locking can extend WordPress’s autosave functionality (as a ping), revision logs can extend WordPress’s existing revision relationship and can be outputted as a traditional RSS feed, etc.

![][14]

As seen in the above wireframe, document revisions would be inextricably linked to the essential WordPress experience. If you know WordPress, you know document revisions. Why reinvent the wheel when you have the best wheel the world has ever seen, and a passionate global community dedicated to improving it? This approach would not simply be limited to traditional documents. Images, PDFs, code — anything the user wants to collaborate with others on, or have a secure revision history can be thrown at it. Academics, lawyers, government folks, the possibilities are endless.

To be fair, WordPress has been arguably overextended in some cases, [3](#note-2020-3 "See, e.g., WordPress as an e-mail newsletter, contact manager, CRM, task list, invoice system,  job bank, or real estate directory.") but I do not believe that to be the case here. Sure any WordPress enthusiast may be guilty of the [bolt-cutter mentality](http://xkcd.com/801) every now and then, but I believe, if anything, it is enterprise stakeholders’ tendency to gravitate toward bloated, commercial systems that is more akin to Wolf Blitzer’s boat house, and a big reason why is because with the exception of an unnamed [4](#note-2020-4 "Let’s just call it “Frupal” for the sake of discussion.") content management system’s poorly executed attempt at document management, no open-source alternatives exist.

I am working on submitting this idea as a proposed [Google Summer of Code](http://www.google-melange.com/gsoc/homepage/google/gsoc2011) project, [5](#note-2020-5 "In hindsight, I probably shouldn’t have ripped on Melange. See supra note 1.") with the goal of giving WordPress parity with commercial and proprietary applications and hopefully injecting some open-source goodness into government and other enterprise environments, but before I do, I would love to hear your thoughts. [Get in touch](http://ben.balter.com/contact/), or [leave a comment below](#comments).

**Update (8/29)**: The final result of the project is an [Open Source Document Management and Version Control System](http://ben.balter.com/2011/08/29/document-management-version-control-for-wordpress/) for WordPress. An overview of its top-level features including a screencast of a typical use case is available on the [WP Document Revisions](http://www.emc.com/domains/documentum/index.htm) page.

Notes:

1.  *See, e.g., *[Documentum](http://www.liferay.com/), [Liferay](http://code.google.com/p/soc/wiki/MelangeIntro), [Melange](http://www.mediaite.com/online/worse-than-previously-thought-gawker-content-management-system-hacked/), and [Gawker’s CMS](#return-note-2020-1). [↩](http://wordpress.org/news/2008/07/wordpress-26-tyner/)
2.  Nearly three years ago, at the time of the feature’s inception, [WordPress founder Matt Mullenweg noted](#return-note-2020-2), “*With the power of modern computers, it’s silly that we still use save and editing metaphors from the time when the most common method of storage was floppy disks… now we’re taking that to another level by allowing you to view who made what changes when… through a super-easy interface, much like Wikipedia or a version control system.*“ [↩](http://net.tutsplus.com/tutorials/wordpress/build-a-wordburner-email-newsletter-manager-using-wordpress-and-feedburner/)
3.  *See, e.g., *WordPress as an [e-mail newsletter](http://publisherblog.automattic.com/2008/02/13/wp-contact-manager/), [contact manager](http://slipfire.com/wp-crm/), [CRM](http://wordpress.org/extend/plugins/wp-task-manager/), [task list](http://wordpress.org/extend/plugins/wp-invoice/), [invoice system](http://wordpress.org/extend/plugins/job-manager/),  [job bank](http://wordpress.org/extend/plugins/great-real-estate/), or [real estate directory](#return-note-2020-3). [↩](#return-note-2020-4)
4.  Let’s just call it “Frupal” for the sake of discussion. [↩](#return-note-2020-5)
5.  In hindsight, I probably shouldn’t have ripped on Melange. *See supra note 1.* [↩]()

 []: http://xkcd.com/801/