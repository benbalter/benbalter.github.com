---
title: "Introducing Post Forking for WordPress"
description: "WordPress Post Forking allows users to "fork" or create an alternate version of content and in doing so, sets out to foster a more collaborative approach to WordPress content curation."
author: "Benjamin J. Balter"
layout: post
comments: true
category: Technology
tags: WordPress, journalism, post forking, collaboration, workflow
published: false

---

*WordPress sets out to democratize publishing, and today the CMS gains an important new feature to that end: Post Forking.* WordPress Post Forking allows users to "fork" or create an alternate version of content and in doing so, sets out to foster a more collaborative approach to WordPress content curation. This can be used, for example, to allow external users (such as visitors to your site) or internal users (such as other authors) with the ability to submit proposed revisions. It can even be used on smaller or single-author sites to enable post authors to edit published posts without their changes appearing immediately. If you're familiar with Git, or other decentralized version control systems, you're already familiar with WordPress post forking. 
### How might you use it?

*   Allowing users without edit or publish post capabilities to edit and submit changes to content (similar to [GitHub’s pull request system][1])
*   Collaborative editing (by resolving two users’ conflicted saves – [Wired’s example][2])
*   Saving draft changes of already-published content
*   Scheduling pending changes to already-published content

### Why this plugin?

*   <a href="http://ben.balter.com/2012/02/28/github-for-journalism-what-wordpress-post-forking-could-do-to-editorial-workflows/" rel="">GitHub for Journalism — What WordPress Post Forking could do to Editorial Workflows</a>

### How does it work? When a user without the 

`edit_post` capability attempts to edit a given post, WordPress will automatically create a "fork" or alternate version of the post which they can freely edit. The edit screen will look just like the standard post editing interface that they are used to. When they're done, they simply click "submit for review." At this point, the fork goes into the standard WordPress moderation queue (just like any time an author without the `publish_post` capability submits a post), where an editor can review, and potentially approve the changes for publishing. If the changes can be automatically merged, the original post will be updated, otherwise, the editor will be presented with the ability to resolve the conflicting changes. All this is done using WordPress's built-in custom post type, revision, and diff functionality, so it should look familiar to most WordPress users. <h3 style="text-align:left;">
  Interested?
</h3>

**[Download the plugin from the WordPress plugin repository][3], or [fork the project on GitHub][4], or for more information, visit the <a href="https://github.com/benbalter/post-forking/wiki" rel="">Post Forking project wiki</a>. ** *This version constitutes an initial release designed to showcase the plugin's core functionality and is intended to be improved upon with additional features and refinements as the project evolves. Please consider <a href="https://github.com/benbalter/post-forking/wiki/How-to-Contribute" rel="">contributing your time</a> to help improve the project.* 
####

 [1]: https://help.github.com/articles/using-pull-requests
 [2]: http://www.wired.com/wiredenterprise/2012/02/github-revisited/
 [3]: http://wordpress.org/extend/plugins/post-forking/
 [4]: https://github.com/benbalter/post-forking
