---
id: 2243
author: 1
date: 2012-02-28 10:09:34
date_gmt: 2012-02-28 15:09:34
title: >
  GitHub for Journalism — What WordPress
  Post Forking could do to Editorial
  Workflows
excerpt:
status: publish
comment_status: open
ping_status: open
password:
name: >
  github-for-journalism-what-wordpress-post-forking-could-do-to-editorial-workflows
to_ping:
pinged: |
  http://ben.balter.com/2011/08/29/wp-document-revisions-document-management-version-control-wordpress/
  http://ben.balter.com/2012/02/27/open-source-alternatives-to-proprietary-enterprise-software/#comment-10052
  http://ben.balter.com/2012/02/27/open-source-alternatives-to-proprietary-enterprise-software/
  http://wpdevel.wordpress.com/2012/03/16/no-gsoc-2012/
modified: 2012-06-13 19:45:29
modified_gmt: 2012-06-13 23:45:29
content_filtered:
parent: 0
guid: http://ben.balter.com/?p=2243
menu_order: 0
type: post
mime_type:
comment_count: 79
ancestors: [ ]
filter: raw
category:
  - Technology
post_tag:
  - code
  - collaboration
  - github
  - gsoc
  - journalism
  - open source
  - plugin
  - wordpress
  - workflow
post_format: [ ]
---
Wired Magazine recently took a turn for the meta. In addition to publishing [their recent story featuring the popular version control site GitHub][1] on Wired.com as they would normally, they also [published it on GitHub itself under a creative commons license][2], allowing readers to fork and contribute to the story as they saw fit. In [reflecting after the fact][3], the Wired team said something that stood out to me:

> At Wired offices, you hear the question over and over again as we work on stories like the one you’re reading now: “Are you out of the story? I want to go in.” We have a version control problem. We publish Wired.com on WordPress. It’s a decent publishing tool, but when two people change a story at the same time, one of them doesn’t get her changes onto the final story.
> 
> We published our GitHub story on GitHub because it was meta-cool. But we also did it to see if GitHub might actually help us solve our problem.

Spoiler alert: it didn’t. GitHub’s great for a lot of things, source code chief among them, but it’s not for the faint of heart. There’s a great deal of command line, and general geekery involved that raise the barriers to entry just high enough to keep it out of everyday newsrooms and editorial workflows. <a class="simple-footnote" title="Having recently given this a try — using GitHub to curate a collaboratively edited list of open-source alternatives to proprietary software — I know first-hand how off-putting GitHub can be to non-technical users." id="return-note-2020-1" href="#note-2020-1"><sup>1</sup></a>

<div style="border: 1px solid black; padding: 10px; margin-bottom: 20px;">
  <strong>The Pitch:</strong><em> What if we could re-imagine WordPress’s ease-of-use and intuitively dumb-simple workflow to introduce a layer of GitHub’s collaborative fork-and-merge horsepower under the hood? </em>
</div>

<!--more-->Users would have the ability to “clone” an existing post, make any changes they want, and then merge those change back into the original before publishing.There are four distinct use cases where this feature may come into play:

*   Collaborative editing (by resolving two users’ conflicted saves  – Wired’s example)
*   Saving draft changes of already-published content
*   Scheduling pending changes to already-published content
*   Allowing users without edit or publish capabilities to edit and submit changes to content (similar to GitHub’s pull request system)

I’d imagine the workflow would go something like this:

1.  User without the ability to edit an existing post has changes to make
2.  User “forks” the post, making any change they deem necessary
3.  When done, user attempts to merge changes back into the original
4.  Post goes into standard WordPress “pending review” workflow
5.  Editor is presented with diff (using the built-in diff engine), and can automatically accept changes (if there are no conflicts), or manually merge the two if necessary
6.  Post is re-published with updated content, revision logs merged to reflect history

In a nutshell:

*   Extends WordPress’s existing revision system
*   Clone existing posts, edit, and “republish”
*   Schedule changes to posts, including taxonomies and metadata
*   Pending changes diff view, front-end preview of changes
*   Using WordPress’s pending-review system, integrates with existing plugins for notifications, management, etc.
*   Ability to store “commit messages” with each post revision to explain to others what changes were made and why
*   Automatically merges (non-conflicted) changes (based on existing diff engine) 
    1.  One sided changes – one overwrites the other
    2.  Two sided non-conflict changes – automatically merge
    3.  Conflicted changes – note conflicts in fork and prepare for re-merge

Post forking may make for a killer plugin <a class="simple-footnote" title="Full disclosure: two plugins, Revisionary and Duplicate Post exist, but they don&#8217;t take the idea nearly as far as the above proposes, nor do they do it in &#8220;the WordPress way&#8221;. I&#8217;d hope that even if the idea started as a plugin, it would eventually be incorporated as core functionality." id="return-note-2020-2" href="#note-2020-2"><sup>2</sup></a> or piece of core functionality… and imagine if it could integrate with other collaboration tools like [Edit Flow][4], or [WP Document Revisions][5]? As in Wired’s example, it has the potential to fundamentally change newsrooms and other editorial workflows. All of a sudden, any content becomes either publicly or privately collaborative. Pretty cool, huh? While it may be a bit ahead of it’s time from a human standpoint, from a technical standpoint, the technology’s there — it’s nothing new — just a matter of building it, and hopefully solving the dreaded “are you out yet?” problem.

Thoughts? Would you use this? What else would you like to see it do? [Drop me a line][6], or let me know in the [comments below][7]?

**Update (3/5): **The plan right now is to submit this as a [Google Summer of Code][8] project, so if all goes well, look for the above-outlined functionality in a WordPress install near you towards the end of the summer. In the mean time, the continued thoughts/feedback is very greatly appreciated.

**Update (3/27): **It looks like [WordPress isn’t participating in GSoC this year][9]. Filing this idea under “someday”.

**Update (6/13): **Stay tuned. This may yet become a reality after all. ETA end of summer-ish.

<div class="simple-footnotes">
  <p class="notes">
    Notes:
  </p>
  
  <ol>
    <li id="note-2020-1">
      Having recently given this a try — using GitHub to curate <a href="http://ben.balter.com/2012/02/27/open-source-alternatives-to-proprietary-enterprise-software/">a collaboratively edited list of open-source alternatives to proprietary software</a> — I know first-hand how off-putting GitHub can be to non-technical users. <a href="#return-note-2020-1">↩</a>
    </li>
    <li id="note-2020-2">
      Full disclosure: two plugins, <a href="http://wordpress.org/extend/plugins/revisionary/">Revisionary</a> and <a href="http://wordpress.org/extend/plugins/duplicate-post/">Duplicate Post</a> exist, but they don’t take the idea nearly as far as the above proposes, nor do they do it in “the WordPress way”. I’d hope that even if the idea started as a plugin, it would eventually be incorporated as core functionality. <a href="#return-note-2020-2">↩</a>
    </li>
  </ol>
</div>

 [1]: http://www.wired.com/wiredenterprise/2012/02/github/all/1
 [2]: https://github.com/WiredEnterprise/Lord-of-the-Files
 [3]: http://www.wired.com/wiredenterprise/2012/02/github-revisited/?utm_source=feedburner&utm_medium=feed&utm_campaign=Feed%3A+wired%2Findex+%28Wired%3A+Index+3+%28Top+Stories+2%29%29
 [4]: http://editflow.org/
 [5]: http://ben.balter.com/2011/08/29/wp-document-revisions-document-management-version-control-wordpress/
 [6]: http://ben.balter.com/contact/
 [7]: #comments
 [8]: http://ben.balter.com/tag/gsoc/
 [9]: http://wpdevel.wordpress.com/2012/03/16/no-gsoc-2012/