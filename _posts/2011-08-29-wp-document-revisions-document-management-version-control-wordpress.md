---
id: 1627
author: 1
date: 2011-08-29 09:01:17
date_gmt: 2011-08-29 13:01:17
title: 'WP Document Revisions -- Document Management & Version Control for WordPress'
excerpt: >
  WP Document Revisions is a document
  management and version control plugin
  for the popular content management
  system, WordPress. Think of it as an
  open-source and more intuitive version
  of the popular Microsoft collaboration
  suite, Sharepoint.
status: publish
comment_status: closed
ping_status: open
password:
name: >
  wp-document-revisions-document-management-version-control-wordpress
to_ping:
pinged: |
  http://ben.balter.com/2011/04/04/when-all-you-have-is-a-pair-of-bolt-cutters/
  http://ben.balter.com/2011/10/24/advanced-workflow-management-tools-for-wp-document-revisions/
  http://themergency.com/generators/wordpress-custom-taxonomy/
modified: 2012-06-03 13:44:36
modified_gmt: 2012-06-03 17:44:36
content_filtered:
parent: 0
guid: http://ben.balter.com/?p=1627
menu_order: 0
type: post
mime_type:
comment_count: 263
ancestors: [ ]
filter: raw
category:
  - Business
  - Law
  - Technology
post_tag:
  - code
  - collaboration
  - document management
  - enterprise
  - file hosting
  - government
  - gsoc
  - open source
  - plugin
  - sharepoint
  - version control
  - wordpress
  - workflow
post_format: [ ]
---
[WP Document Revisions][1] is a [document management][2] and [version control][3] plugin. Built for time-sensitive and mission-critical projects, teams can collaboratively edit files of any format — text documents, spreadsheets, images, sheet music… anything — all the while, seamlessly tracking the document’s progress as it moves through your organization’s existing workflow.

**WP Document Revisions is three things:**

1.  [<img class="alignright" title="WP Document Revisions Screen Shot" src="http://ben.balter.com/wp-content/uploads/2011/07/wp-document-revisions-screen-shot-300x226.png" alt="" width="300" height="226" />][4]A **document management system** (DMS), to track, store, and organize files of any format
2.  A **collaboration tool** to empower teams to collaboratively draft, edit, and refine documents
3.  A **file hosting solution** to publish and securely deliver files to a team, to clients, or to the public

<!--more-->

<span class='embed-youtube' style='text-align:center; display: block;'></span>

**Powerful Collaboration Tools** - *With great power does not have to come great complexity.* Based on a simple philosophy of putting powerful but intuitive tools in the hands of managers and content creators, WP Document Revisions leverages many of the essential WordPress features that, for more than eight years, have been tested and proven across countless industries — posts, attachments, revisions, taxonomies, authentication, and permalinks — to make collaborating on the creation and publication of documents a natural endeavor. Think of it as an [open-source and more intuitive version][5] of the popular Microsoft collaboration suite, [Sharepoint.][6]

**Document History** - At each step of the authoring process, WP Document Revisions gives you an instant snapshot of your team’s progress and the document’s history. It even gives you the option to revert back to a previous revision — so don’t fret if you make a mistake — or receive updates on changes to the document right in your favorite feed reader.

**Access Control** - Each document is given a persistent URL (e.g., yourcompany.com/documents/2011/08/TPS-Report.doc) which can be private (securely delivered only to members of your organization), password protected (available only to those you select such as clients or contractors), or public (published and hosted for the world to see). If you catch a typo and upload a new version, that URL will continue to point to the latest version, regardless of how many changes you make.

**Enterprise Security** - Worried about storing propriety or sensitive information? WP Document Revisions was built from the first line of code with government- and enterprise-grade security in mind. Each file is masked behind an anonymous 128-bit [MD5 hash][7] as soon as it touches the server, and requests for files are transparently routed through WordPress’s time-tested URL rewriting, authentication, and permission systems (which can even [integrate with existing enterprise active directory][8] or [LDAP servers][9]). Need more security? WP Document Revisions allows you to store documents in a folder above the `htdocs` or `public_html` [web root][10], further ensuring that only those you authorize have access to your work.

**Customization** - WP Document Revisions recognizes that no two teams are identical, and as a result, molds to your firm’s needs, not the other way around. Need to track additional information associated with a document? Departments, editors, issues, sections, even arbitrary key-value pairs – whatever you can throw at it, it can handle. Development and customization costs are further minimized by its extensive plugin API, and the [WordPress Custom Taxonomy Generator][11] makes it easy for even the uninitiated to add custom taxonomies to documents. Need an audit trail to track check-ins and check-outs? User-level permissions based on the document’s state or another custom taxonomy? Support for third-party encryption? Check out the [WP Document Revisions Code Cookbook][12] for sample code. Looking for even more advanced control of your workflow? WP Document Revisions will detect the popular workflow plugin [Edit Flow][13], if installed, and will automatically pull [Edit Flow’s advanced workflow management tools][14] into WP Document Revisions. Simply put, virtually every aspect of the plugin’s functionality from workflow states to user-level permissions can be fully customized to your team’s unique needs.

**Future Proof** - Switching costs a concern? WP Document Revisions is built with tomorrow’s uncertainty in mind. Equally at home in an in-house server room as it is in the cloud, moving individual files or entire document repositories in and out of WP Document Revisions is a breeze (history and all). And since the software is open-source, you can easily add tools to automate the process of moving to or integrating with future third-party systems.

**The Vitals:**

*   Support for any file type (docs, spreadsheets, images, PDFs — anything!)
*   Securely stores unlimited revisions of your business’s essential files
*   Provides a full file history in the form of a revision log, accessible via RSS
*   Helps you track and organize documents as they move through your organization’s existing workflow
*   Each file gets a permanent, authenticated URL that always points to the latest version
*   Each revision gets its own unique url (e.g.,TPS-Report-revision-3.doc) accessible only to those you deem
*   Files are intuitively checked out and locked to prevent revisions from colliding
*   Toggle documents between public, private, and password protected with a single mouse click
*   Runs in-house or in the cloud
*   Secure: filenames are hashed on upload and files are only accessible through WordPress’s proven authentication system
*   Can move document upload folder to location outside of web root to further ensure government- and enterprise-grade security
*   Documents and Revisions shortcodes, Recently Revised Documents widget
*   Multisite and Windows (XAMPP) support
*   French and Spanish language support (easily translated to your language)
*   Integration with [Edit Flow][13]

**Features Available via the [Code Cookbook][12]:**

*   **Audit Trail** - creates check in / check out audit trail for all documents
*   **State Permissions** - allows setting user-level permissions based on a custom taxonomy such as workflow state or other document status
*   **Third Party Encryption** - example of how to integrate at rest encryption using third-party tools
*   **Rename Documents** - changes all references to “Documents” in the interface to any label of your choosing
*   **State Change Notification** - how to use document api to allow users to receive notification whenever documents change workflow state
*   **Bulk Import** - how to batch import a directory (or other list) of files as documents
*   **Filetype Taxonomy** - Adds support to filter by filetype
*   **Track Changes** - Auto-generates and appends revision summaries for changes to taxonomies, title, and visibility
*   **Remove Workflow States** - Completely removes Workflow state taxonomy backend and UI
*   **Change Tracker** - Auto-generates and appends revision summaries for changes to taxonomies, title, and visibility

**Translations:**

*   French - [Hubert CAMPAN][15]
*   Spanish - [TradiArt][16]

<div>
  <strong>Links</strong>:
</div>

<div>
  <ul>
    <li>
      <a href="https://github.com/benbalter/WP-Document-Revisions/">Source Code</a> (GitHub)
    </li>
    <li>
      <a href="https://github.com/benbalter/WP-Document-Revisions/tree/develop">Development version</a> (<a href="http://travis-ci.org/#!/benbalter/WP-Document-Revisions">Build Status</a>)
    </li>
    <li>
      <a href="https://github.com/benbalter/WP-Document-Revisions-Code-Cookbook">Code Cookbook</a>
    </li>
    <li>
      <a href="http://translations.benbalter.com/projects/wp-document-revisions/">Translations</a> (GlotPres)
    </li>
    <li>
      <a href="http://wordpress.org/tags/wp-document-revisions">User support forums</a>
    </li>
    <li>
      <a href="https://github.com/benbalter/WP-Document-Revisions/issues">Submit a bug/feature request</a><a href="http://ben.balter.com/wp-content/uploads/2011/08/wp-document-revisions.png"><br /> </a>
    </li>
  </ul>
</div>

Questions? Comments? Many may have already been addressed in [the WP Document Revisions FAQ][17], or feel free to simply leave a reply below.

<div style="border: 2px solid #ccc; background: #eee; padding: 10px; text-align: center; margin-bottom: 20px;">
  <strong>Give it a try today.</strong><br /> <a href="http://wordpress.org/extend/plugins/wp-document-revisions/">Download WP Document Revisions</a> from the WordPress Plugin Repository
</div>

*WP Document Revisions was developed by a [law student and a business student][18] with a [grant from Google][19], and in close coordination with and under the watchful eye of WordPress.org’s lead developers.* <a class="simple-footnote" title=" Neither relationship should imply a formal endorsement." id="return-note-2020-1" href="#note-2020-1"><sup>1</sup></a> *Special thanks to [Jon Cave][20], [Aaron Jorbin][21], [Mitcho Erlewine][22], and [Andrew Nacin][23] for their guidance.*

**Update (6/12): Comments have been closed in favor of [expanded support and discussion options][24]. Additional documentation about the project can now be found in the [Project Wiki][25]. If you are interested in joining the project at any level of technical expertise, please see [How to Contribute][26].**

<div class="simple-footnotes">
  <p class="notes">
    Notes:
  </p>
  
  <ol>
    <li id="note-2020-1">
       Neither relationship should imply a formal endorsement. <a href="#return-note-2020-1">↩</a>
    </li>
  </ol>
</div>

 [1]: http://wordpress.org/extend/plugins/wp-document-revisions/
 [2]: http://en.wikipedia.org/wiki/Document_management_system
 [3]: http://en.wikipedia.org/wiki/Revision_control
 [4]: http://ben.balter.com/wp-content/uploads/2011/07/wp-document-revisions-screen-shot.png
 [5]: http://ben.balter.com/2011/04/04/when-all-you-have-is-a-pair-of-bolt-cutters/
 [6]: http://sharepoint.microsoft.com/en-us/Pages/default.aspx
 [7]: http://en.wikipedia.org/wiki/MD5
 [8]: http://wordpress.org/extend/plugins/active-directory-integration/
 [9]: http://wordpress.org/extend/plugins/simple-ldap-login/
 [10]: http://httpd.apache.org/docs/2.0/mod/core.html#documentroot
 [11]: http://themergency.com/generators/wordpress-custom-taxonomy/
 [12]: https://github.com/benbalter/WP-Document-Revisions-Code-Cookbook
 [13]: http://editflow.org/
 [14]: http://ben.balter.com/2011/10/24/advanced-workflow-management-tools-for-wp-document-revisions/
 [15]: http://omnimaki.com/
 [16]: http://www.tradiart.com/
 [17]: http://wordpress.org/extend/plugins/wp-document-revisions/faq/
 [18]: http://ben.balter.com
 [19]: http://code.google.com/soc/
 [20]: http://joncave.co.uk/
 [21]: http://aaron.jorb.in/
 [22]: http://mitcho.com/
 [23]: http://andrewnacin.com/
 [24]: https://github.com/benbalter/WP-Document-Revisions/wiki/Where-to-get-Support-or-Report-an-Issue
 [25]: https://github.com/benbalter/WP-Document-Revisions/wiki
 [26]: https://github.com/benbalter/WP-Document-Revisions/wiki/How-to-Contribute