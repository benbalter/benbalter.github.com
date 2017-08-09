---
title: WP Document Revisions — Document Management and Version Control for WordPress
description: WP Document Revisions is a document management and version control plugin for the popular content management system, WordPress. Think of it as an open-source and more intuitive version of the popular Microsoft collaboration suite, Sharepoint.
redirect_from: 2011/08/29/document-management-version-control-for-wordpress/
---

[WP Document Revisions](http://wordpress.org/extend/plugins/wp-document-revisions/) is a [document management](http://en.wikipedia.org/wiki/Document_management_system) and [version control](http://en.wikipedia.org/wiki/Revision_control) plugin. Built for time-sensitive and mission-critical projects, teams can collaboratively edit files of any format — text documents, spreadsheets, images, sheet music… anything — all the while, seamlessly tracking the document's progress as it moves through your organization's existing workflow.

[![WP Document Revisions Screenshot](//ben.balter.com/wp-content/uploads/2011/07/wp-document-revisions-screen-shot-300x226.png){: .alignright}](//ben.balter.com/wp-content/uploads/2011/07/wp-document-revisions-screen-shot.png)

### WP Document Revisions is three things

1. A **document management system** (DMS), to track, store, and organize files of any format
2. A **collaboration tool** to empower teams to collaboratively draft, edit, and refine documents
3. A **file hosting solution** to publish and securely deliver files to a team, to clients, or to the public

<iframe width="560" height="315" src="http://www.youtube.com/embed/VpsTNSiJKis" frameborder="0" allowfullscreen="true" title="Video introduction to WP Document Revisions"></iframe>

**Powerful Collaboration Tools** - *With great power does not have to come great complexity.* Based on a simple philosophy of putting powerful but intuitive tools in the hands of managers and content creators, WP Document Revisions leverages many of the essential WordPress features that, for more than eight years, have been tested and proven across countless industries — posts, attachments, revisions, taxonomies, authentication, and permalinks — to make collaborating on the creation and publication of documents a natural endeavor. Think of it as an [open-source and more intuitive version](//ben.balter.com/2011/04/04/when-all-you-have-is-a-pair-of-bolt-cutters/) of the popular Microsoft collaboration suite, [Sharepoint.](https://products.office.com/en-US/sharepoint)

**Document History** - At each step of the authoring process, WP Document Revisions gives you an instant snapshot of your team's progress and the document's history. It even gives you the option to revert back to a previous revision — so don't fret if you make a mistake — or receive updates on changes to the document right in your favorite feed reader.

**Access Control** - Each document is given a persistent URL (e.g., yourcompany.com/documents/2011/08/TPS-Report.doc) which can be private (securely delivered only to members of your organization), password protected (available only to those you select such as clients or contractors), or public (published and hosted for the world to see). If you catch a typo and upload a new version, that URL will continue to point to the latest version, regardless of how many changes you make.

**Enterprise Security** - Worried about storing propriety or sensitive information? WP Document Revisions was built from the first line of code with government- and enterprise-grade security in mind. Each file is masked behind an anonymous 128-bit [MD5 hash](http://en.wikipedia.org/wiki/MD5) as soon as it touches the server, and requests for files are transparently routed through WordPress's time-tested URL rewriting, authentication, and permission systems (which can even [integrate with existing enterprise active directory](http://wordpress.org/extend/plugins/active-directory-integration/) or [LDAP servers](http://wordpress.org/extend/plugins/simple-ldap-login/)). Need more security? WP Document Revisions allows you to store documents in a folder above the `htdocs` or `public_html` [web root](http://httpd.apache.org/docs/2.0/mod/core.html#documentroot), further ensuring that only those you authorize have access to your work.

**Customization** - WP Document Revisions recognizes that no two teams are identical, and as a result, molds to your firm's needs, not the other way around. Need to track additional information associated with a document? Departments, editors, issues, sections, even arbitrary key-value pairs – whatever you can throw at it, it can handle. Development and customization costs are further minimized by its extensive plugin API, and the [WordPress Custom Taxonomy Generator](https://generatewp.com/taxonomy/) makes it easy for even the uninitiated to add custom taxonomies to documents. Need an audit trail to track check-ins and check-outs? User-level permissions based on the document's state or another custom taxonomy? Support for third-party encryption? Check out the [WP Document Revisions Code Cookbook](https://github.com/benbalter/WP-Document-Revisions-Code-Cookbook) for sample code. Looking for even more advanced control of your workflow? WP Document Revisions will detect the popular workflow plugin [Edit Flow](http://editflow.org/), if installed, and will automatically pull [Edit Flow's advanced workflow management tools](//ben.balter.com/2011/10/24/advanced-workflow-management-tools-for-wp-document-revisions/) into WP Document Revisions. Simply put, virtually every aspect of the plugin's functionality from workflow states to user-level permissions can be fully customized to your team's unique needs.

**Future Proof** - Switching costs a concern? WP Document Revisions is built with tomorrow's uncertainty in mind. Equally at home in an in-house server room as it is in the cloud, moving individual files or entire document repositories in and out of WP Document Revisions is a breeze (history and all). And since the software is open-source, you can easily add tools to automate the process of moving to or integrating with future third-party systems.

### The Vitals

* Support for any file type (docs, spreadsheets, images, PDFs — anything!)
* Securely stores unlimited revisions of your business's essential files
* Provides a full file history in the form of a revision log, accessible via RSS
* Helps you track and organize documents as they move through your organization's existing workflow
* Each file gets a permanent, authenticated URL that always points to the latest version
* Each revision gets its own unique url (e.g.,TPS-Report-revision-3.doc) accessible only to those you deem
* Files are intuitively checked out and locked to prevent revisions from colliding
* Toggle documents between public, private, and password protected with a single mouse click
* Runs in-house or in the cloud
* Secure: filenames are hashed on upload and files are only accessible through WordPress's proven authentication system
* Can move document upload folder to location outside of web root to further ensure government- and enterprise-grade security
* Documents and Revisions shortcodes, Recently Revised Documents widget
* Multisite and Windows (XAMPP) support
* French and Spanish language support (easily translated to your language)
* Integration with [Edit Flow](http://editflow.org/)

### Features Available via the [Code Cookbook](https://github.com/benbalter/WP-Document-Revisions-Code-Cookbook)

* **Audit Trail** - creates check in / check out audit trail for all documents
* **State Permissions** - allows setting user-level permissions based on a custom taxonomy such as workflow state or other document status
* **Third Party Encryption** - example of how to integrate at rest encryption using third-party tools
* **Rename Documents** - changes all references to "Documents" in the interface to any label of your choosing
* **State Change Notification** - how to use document api to allow users to receive notification whenever documents change workflow state
* **Bulk Import** - how to batch import a directory (or other list) of files as documents
* **Filetype Taxonomy** - Adds support to filter by filetype
* **Track Changes** - Auto-generates and appends revision summaries for changes to taxonomies, title, and visibility
* **Remove Workflow States** - Completely removes Workflow state taxonomy backend and UI
* **Change Tracker** - Auto-generates and appends revision summaries for changes to taxonomies, title, and visibility

### Translations

* French - [Hubert CAMPAN](http://omnimaki.com/)
* Spanish - TradiArt

### Links

* [Source Code](https://github.com/benbalter/WP-Document-Revisions/) (GitHub)
* [Development version](https://github.com/benbalter/WP-Document-Revisions/tree/develop) ([Build Status](http://travis-ci.org/#!/benbalter/WP-Document-Revisions))
* [Code Cookbook](https://github.com/benbalter/WP-Document-Revisions-Code-Cookbook)
* [User support forums](http://wordpress.org/tags/wp-document-revisions)
* [Submit a bug/feature request](https://github.com/benbalter/WP-Document-Revisions/issues)

Questions? Comments? Many may have already been addressed in [the WP Document Revisions FAQ](http://wordpress.org/extend/plugins/wp-document-revisions/faq/), or feel free to simply leave a reply below.

**Give it a try today:**: [Download WP Document Revisions][1] from the WordPress Plugin Repository

*WP Document Revisions was developed by a [law student and a business student](//ben.balter.com) with a [grant from Google](http://code.google.com/soc/), and in close coordination with and under the watchful eye of WordPress.org's lead developers.* [^1] *Special thanks to [Jon Cave](http://joncave.co.uk/), [Aaron Jorbin](http://aaron.jorb.in/), [Mitcho Erlewine](http://mitcho.com/), and [Andrew Nacin](http://andrewnacin.com/) for their guidance.*

**Update (6/12): Comments have been closed in favor of [expanded support and discussion options](https://github.com/benbalter/WP-Document-Revisions/wiki/Where-to-get-Support-or-Report-an-Issue). Additional documentation about the project can now be found in the [Project Wiki](https://github.com/benbalter/WP-Document-Revisions/wiki). If you are interested in joining the project at any level of technical expertise, please see [How to Contribute](https://github.com/benbalter/WP-Document-Revisions/wiki/How-to-Contribute).**

[^1]: Neither relationship should imply a formal endorsement.
