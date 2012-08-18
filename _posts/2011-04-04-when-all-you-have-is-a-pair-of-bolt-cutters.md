---
id: 1196
author: Benjamin J. Balter
date: 2011-04-04 09:01:50
date_gmt: 2011-04-04 13:01:50
title: >
  When all you have is a pair of bolt
  cutters...
excerpt: "A workflow management and version control system building on WordPress's existing core competencies. By treating documents as a custom post type, users can leverage the power of WordPress’s extensive attachment, revision, taxonomy, and URL rewriting functionalities. "
status: publish
comment_status: open
ping_status: open
password:
name: >
  when-all-you-have-is-a-pair-of-bolt-cutters
to_ping:
pinged: |
  http://net.tutsplus.com/tutorials/wordpress/build-a-wordburner-email-newsletter-manager-using-wordpress-and-feedburner/
  http://slipfire.com/wp-crm/
  http://ben.balter.com/2011/08/29/document-management-version-control-for-wordpress/
modified: 2011-08-29 09:03:01
modified_gmt: 2011-08-29 13:03:01
content_filtered:
parent: 0
guid: http://ben.balter.com/?p=1196
menu_order: 0
type: post
mime_type:
comment_count: 20
ancestors: [ ]
filter: raw
layout: post
category:
  - Technology
post_tag:
  - code
  - document management
  - google
  - gsoc
  - open source
  - plugin
  - wordpress
post_format: [ ]
---
<p style="text-align: center;">
  <a href="http://xkcd.com/801/"><img class="aligncenter" title="Took me five tries to find the right one, but I managed to salvage our night out--if not the boat--in the end." src="http://imgs.xkcd.com/comics/golden_hammer.png" alt="Golden Hammer" width="592" height="224" /></a>
</p>

My biggest gripe with [WordPress][1], the open-source [content management system][2] that silently works behind the scenes to power [more than 13%][3] of the Internet, is that it sets far too high a bar with which other applications must compete. I cannot count the number of times that I have used a proprietary or commercial system and silently thought to myself, “*WordPress can do this so much better*.” <a class="simple-footnote" title="See, e.g., Documentum, Liferay, Melange, and Gawker&#8217;s CMS." id="return-note-2020-1" href="#note-2020-1"><sup>1</sup></a>

This ritual saw no deviation, when I sat down to setup [SharePoint][4] in support of my [law journal][5]‘s upcoming publication workflow. Like Alice stumbling down the rabbit hole, it quickly became apparent that in the counterintuitive world of Sharepoint, each step was going to be more and more alien than the last. And then it dawned on me: a corollary of [Uncle Ben’s law][6], *with great power does not have to come great complexity*.

<!--more-->WordPress does many things right. It is an incredibly versatile tool, but like a body builder with a heart of gold, it is as friendly and approachable as it is powerful. WordPress has 

[more than eight years of rock-solid experience][7] storing, organizing, sorting, and searching all sorts of user-generated content. Its got a set of slick attachment functions to allow users to safely and securely upload and store their non-WordPress files in WordPress. For the past three years, it even has a proto-version control system in the form of its much-envied [post revisions][8]. <a class="simple-footnote" title="Nearly three years ago, at the time of the feature&#8217;s inception, WordPress founder Matt Mullenweg noted, &#8220;With the power of modern computers, it’s silly that we still use save and editing metaphors from the time when the most common method of storage was floppy disks&#8230; now we’re taking that to another level by allowing you to view who made what changes when&#8230; through a super-easy interface, much like Wikipedia or a version control system.&#8220;" id="return-note-2020-2" href="#note-2020-2"><sup>2</sup></a> And it does all this through an interface so dumb-simple that [even your grandparents could start their own site][9]. It seems like a no brainer then, to marry these tools to create a WordPress-based document management system.

Imagine a workflow management and version control system [building on WordPress’s existing core competencies][10]. By treating documents as a custom post type, users can leverage the power of WordPress’s extensive attachment, revision, taxonomy, and URL rewriting functionalities. Document permalinks can be routed through the traditional rewrite structure such that the latest revision of a file always remains at a static, authenticated URL, and users can toggle the visibility of documents (both internally and externally) as they currently do with post statuses and permissions. Similarly, file locking can extend WordPress’s autosave functionality (as a ping), revision logs can extend WordPress’s existing revision relationship and can be outputted as a traditional RSS feed, etc.

<img class="aligncenter size-full wp-image-1202" style="border: 1px solid #ccc;" title="WP Document Revisions Wireframe" src="http://ben.balter.com/wp-content/uploads/2011/04/wireframe.png" alt="" width="640" height="308" />

As seen in the above wireframe, document revisions would be inextricably linked to the essential WordPress experience. If you know WordPress, you know document revisions. Why reinvent the wheel when you have the best wheel the world has ever seen, and a passionate global community dedicated to improving it? This approach would not simply be limited to traditional documents. Images, PDFs, code — anything the user wants to collaborate with others on, or have a secure revision history can be thrown at it. Academics, lawyers, government folks, the possibilities are endless.

To be fair, WordPress has been arguably overextended in some cases, <a class="simple-footnote" title="See, e.g., WordPress as an e-mail newsletter, contact manager, CRM, task list, invoice system,  job bank, or real estate directory." id="return-note-2020-3" href="#note-2020-3"><sup>3</sup></a> but I do not believe that to be the case here. Sure any WordPress enthusiast may be guilty of the [bolt-cutter mentality][11] every now and then, but I believe, if anything, it is enterprise stakeholders’ tendency to gravitate toward bloated, commercial systems that is more akin to Wolf Blitzer’s boat house, and a big reason why is because with the exception of an unnamed <a class="simple-footnote" title="Let&#8217;s just call it &#8220;Frupal&#8221; for the sake of discussion." id="return-note-2020-4" href="#note-2020-4"><sup>4</sup></a> content management system’s poorly executed attempt at document management, no open-source alternatives exist.

<del>I am working on submitting this idea as a proposed <a href="http://www.google-melange.com/gsoc/homepage/google/gsoc2011">Google Summer of Code</a> project</del>, <a class="simple-footnote" title="In hindsight, I probably shouldn&#8217;t have ripped on Melange. See supra note 1." id="return-note-2020-5" href="#note-2020-5"><sup>5</sup></a> with the goal of giving WordPress parity with commercial and proprietary applications and hopefully injecting some open-source goodness into government and other enterprise environments, but before I do, I would love to hear your thoughts. [Get in touch][12], or [leave a comment below][13].

**Update (8/29)**: The final result of the project is an [Open Source Document Management and Version Control System][14] for WordPress. An overview of its top-level features including a screencast of a typical use case is available on the [WP Document Revisions][14] page.

<div class="simple-footnotes">
  <p class="notes">
    Notes:
  </p>
  
  <ol>
    <li id="note-2020-1">
      <em>See, e.g., </em><a href="http://www.emc.com/domains/documentum/index.htm">Documentum</a>, <a href="http://www.liferay.com/">Liferay</a>, <a href="http://code.google.com/p/soc/wiki/MelangeIntro">Melange</a>, and <a href="http://www.mediaite.com/online/worse-than-previously-thought-gawker-content-management-system-hacked/">Gawker’s CMS</a>. <a href="#return-note-2020-1">↩</a>
    </li>
    <li id="note-2020-2">
      Nearly three years ago, at the time of the feature’s inception, <a href="http://wordpress.org/news/2008/07/wordpress-26-tyner/">WordPress founder Matt Mullenweg noted</a>, “<em>With the power of modern computers, it’s silly that we still use save and editing metaphors from the time when the most common method of storage was floppy disks… now we’re taking that to another level by allowing you to view who made what changes when… through a super-easy interface, much like Wikipedia or a version control system.</em>“ <a href="#return-note-2020-2">↩</a>
    </li>
    <li id="note-2020-3">
      <em>See, e.g., </em>WordPress as an <a href="http://net.tutsplus.com/tutorials/wordpress/build-a-wordburner-email-newsletter-manager-using-wordpress-and-feedburner/">e-mail newsletter</a>, <a href="http://publisherblog.automattic.com/2008/02/13/wp-contact-manager/">contact manager</a>, <a href="http://slipfire.com/wp-crm/">CRM</a>, <a href="http://wordpress.org/extend/plugins/wp-task-manager/">task list</a>, <a href="http://wordpress.org/extend/plugins/wp-invoice/">invoice system</a>,  <a href="http://wordpress.org/extend/plugins/job-manager/">job bank</a>, or <a href="http://wordpress.org/extend/plugins/great-real-estate/">real estate directory</a>. <a href="#return-note-2020-3">↩</a>
    </li>
    <li id="note-2020-4">
      Let’s just call it “Frupal” for the sake of discussion. <a href="#return-note-2020-4">↩</a>
    </li>
    <li id="note-2020-5">
      In hindsight, I probably shouldn’t have ripped on Melange. <em>See supra note 1.</em> <a href="#return-note-2020-5">↩</a>
    </li>
  </ol>
</div>

 [1]: http://wordpress.org
 [2]: http://en.wikipedia.org/wiki/Content_management_system
 [3]: http://w3techs.com/technologies/overview/content_management/all
 [4]: http://en.wikipedia.org/wiki/Microsoft_SharePoint
 [5]: http://pcjl.org
 [6]: http://www.youtube.com/watch?v=8DfztIIqbTI#t=1m3s
 [7]: http://core.trac.wordpress.org/browser/trunk?rev=3
 [8]: http://codex.wordpress.org/Revision_Management
 [9]: http://www.thegrandparentsblog.com/
 [10]: http://lists.automattic.com/pipermail/wp-hackers/2011-March/038727.html
 [11]: http://xkcd.com/801
 [12]: http://ben.balter.com/contact/
 [13]: #comments
 [14]: http://ben.balter.com/2011/08/29/document-management-version-control-for-wordpress/