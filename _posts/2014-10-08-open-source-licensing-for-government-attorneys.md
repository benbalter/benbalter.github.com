---
title: Everything a government attorney needs to know about open source software licensing
description: A high-level overview to highlight common legal issues government agencies may face when participating in the open source community
---

Government agencies can and should participate in the open source community. Open source software is [more than simply software for which the underlying human-readable code had been made available to the public](https://ben.balter.com/2012/10/15/open-source-is-not-a-verb/). Along with the code comes [an intellectual property license grant](http://opensource.org/osd), a legal framework which government agencies are embracing with increasing frequency. Here are some common legal issues to look out for:

*Note: this is an early draft. If you notice anything wonky, please [help improve it](https://github.com/benbalter
.github.com/edit/master/_posts/2014-10-08-open-source-licensing-for-government-attorneys.md).*

### Open source licenses generally

Open source licenses are a straight-forward intellectual property license with one unique feature: [they're standardized](http://opensource.org/licenses/category). The software industry has [adopted approximately fifteen mainstream](http://choosealicense.com/licenses/) and [three primary licenses](http://choosealicense.com/). While the wording and specific terms vary, most licenses have the following common clauses:

* An explicit grant to use, copy, modify, redistribute, sublicense, or sell the software.

* Disclaimer of implied warranties such as the warranties of merchantability or fitness for a particular purpose and other limitations on liability.

* A requirement that attribution to the author, the license name, or both be included in any redistributed software.

* Instructions on how to properly mark the code itself for distribution under the license.

Some licenses may also include:

* The requirement that any submissions contributed to the project by the public be licensed under the same terms as the project (a copyright grant from contributors to downstream consumers).

* A patent grant from contributors to downstream consumers.

* The requirement that any changes to the original software be described when distributed.

* Changing requirements depending on whether the software is distributed in its original, human-readable form, or its compiled (binary), machine-readable form.

#### Why standardized licenses

In order for open source to work, downstream users must be able to use the code free of legal restriction or ambiguity, and must be able to do so without the need to retain costly legal counsel. Most developers and software firms are familiar with the most common open source licenses and terms, and thus can use such software freely. As such use of a standardized license serves as a proxy for those without legal training to know precisely what they can and can't do with the software.

Unless absolutely required, avoid custom, modified, or non-standard terms, which will serve as a barrier to downstream use of the agency code. The open source community is just that, a community, and one with a strong tradition. Open source software is published so that others may use it, and doing so under a legal framework alien to the community, is the easiest way to make sure it's not used. Optimize for the code's reuse, not its publication.

#### Common licenses

Within the software industry, the canonical source for most main licenses, along with a brief overview of their terms can be found at [choosealicense.com](http://choosealicense.com). The three most popular licenses are the MIT, Apache, and GPL licenses:

* **[MIT](http://choosealicense.com/licenses/mit/)** - The most common license is the MIT license, which is a simple grant, copyright notice requirement, and disclaimer of warranty.

* **[Apache](http://choosealicense.com/licenses/apache-2.0/)** - The Apache license is functionally equivalent to the MIT license, but is more heavily lawyered and includes an explicit patent grant

* **[GPL](http://choosealicense.com/licenses/gpl-2.0/)** The GPL is the most commonly used copyleft license, with v2, v3, and "v2 or later" variants.

#### Copyleft

Some licenses, most notably the GPL family of licenses, are copyleft licenses, meaning the license uses copyright law to ensure the code remains open source. The WordPress and Drupal content management systems are both licensed under the GPL license.

Any work derived from copyleft-licensed code, if distributed, must be distributed under the same (or compatible terms). There are two threshold issues there:

* **Derivative work** - There are nuances within the particular license, but for most cases, if the new code depends on the original, copyleft-licensed code, such as a WordPress theme or a Drupal module, it is considered a derivative work subject to the copyleft requirements.

* **Distribution** - The copyleft requirements are not triggered unless the derivative work is distributed. Agencies are free to make derivative works and maintain that work as a closed-source project. When the underlying source code is published to the public, distribution is clear. Less clear is distribution to other business units within the same agency, or with other agency. Unless licensed under the AGPL license, using the code as part of a hosted service (e.g., a website) does not trigger that requirement.

When faced with copyleft restrictions, an agency should release code under the least-restrictive means available under the circumstances, which is often the copyleft license itself. While the government's particular code may not be subject to copyright (see below), the project as a whole is encumbered by upstream license restrictions, and thus the agency does not have the right to release the code under less-restrictive terms.

### Consuming open source software

There is nothing to legally bar agencies from using open source software on their servers or on their employees's computers. Three common concerns:

* For procurement purposes, open source software is treated as commercial, off the shelf software (COTS).

* The work of contributors does not trigger gift authority or Anti-Deficiency Act obligations, unless the work is performed specifically for the agency. Under a traditional open source workflow, project contributors publish their code publicly and license their work to the world. See accepting contributions from the public below.

* The software must still go through the agency's traditional approval process, such as security or privacy reviews, just as the agency would do before operationalizing a piece of commercial software

### Publishing open source software

The agency can and under the digital strategy and open data policy is encouraged to publish the agency's purpose-build software. This can arise under two arrangements:

#### Government-created code

Code created by government employees on government time is consider a government work, and thus is not subject to *domestic* copyright protection under 17 USC § 105.

The internet, and thus open source, however, is not bound by geographic lines. It is not uncommon for government created code to be used by foreign citizens. As such, the agency should make it explicit under what terms foreign citizens can use the code.

[Best practices suggest](https://github.com/project-open-data/project-open-data.github.io/pull/135#issuecomment-23299819) that [agencies release their code](https://github.com/cfpb/qu/pull/94) under [the Creative Commons Zero license](https://creativecommons.org/publicdomain/zero/1.0/), a public domain dedication and copyright disclaimer, to ensure all downstream users receive the same rights in the software. Where not possible, (e.g., a copyleft derivative work), prefer the least-restrictive terms possible.

#### Contractor created code

Under the FAR, by default, the government receives unlimited rights in any software developed under contract, and thus is free to publish the code as they see fit. Due to market forces and contracting tradition, many typical government IT contracts, however, contract away this right in favor of simple government purpose rights, with the contractor retaining the original copyright. If that's the case, the agency has several options:

* **Ask** - Government contractors are typically contractually prohibited from talking about their work. As a result, most, if not all, would prefer their work be open sourced. For typical web or mobile development contracts, there is often little proprietary IP in the purpose-built code, and thus contractors have an incentive to grant the agency additional rights on request.

* **Contractor licenses to agency** - Rather than granting copyright or broad redistribution rights, the contractor can license the code to the agency under an open source license of their choosing. Once in the agency's hands, the agency is free to redistribute the software under those same terms as they see fit. This may require a mod on the contract.

* **Contractor publishes** - The contractor, at the agency's request, can independently publish the code under an open source license. While the agency will not get "credit" for publishing the software, the obligation to maintain the software will shift to the contractor. Once open source, the agency can consume that software as they would any other open source software.

### Contributing to open source software

A central tenet of open source software is contributing downstream improvements to the upstream open source project. Agency-created code should be no exception. While there may be a business decision to prohibit government employees from contributing to community projects on government time, nothing should prohibit them legally.

Whether a contribution to the community-maintained project directly (e.g., contributing to WordPress or Drupal), or a derivative work (a plugin, theme, or module), agency contributions should be licensed under the terms of the parent project, using the project's standard workflow and distribution channels.

One thing to watch out for are contributor license agreements (CLAss) which may proscribe an explicit copyright grant (as opposed to a license), or the granting of additional rights beyond the copyright license, which may conflict with the contributor's obligations as a government employee.

### Accepting contributions from the public

Once published, there's a high probability a member of the public will submit a proposed improvement to the agency project. There are two potential issues:

* **Agency request** - As is common practice in the open source world, the agency may maintain a project roadmap and backlog of known bugs or potential enhancements, but should not directly instruct potential contributors to address a certain issue.

* **License** - The proposed change (often in the form of a "pull request") is licensed under the same terms as the project itself (e.g., MIT, GPL, or CC0) and thus is independent open source software.[^1] The agency is free to incorporate that code into the government project, just as it is free to use any other open source code.

### Open source community engagement platforms

The open source community uses several platforms for communicating project plans and sharing source code. These platforms may be project specific, such as [`wordpress.org`](http://wordpress.org) or [`drupal.org`](http://drupal.org) or can be general open source platforms such as [GitHub](https://github.com) or [RubyGems](https://rubygems.org).

When used for public engagement, the agency's use of such platforms is governed by OMB M-10–23. Agencies should review any terms of service (in many cases, there are custom, fed-friendly terms already negotiated), and ensure the agency itself establishes a formal presence on the platform.

For platforms like GitHub, per the terms of service, government employees should add their government email address to their existing account, if they have one, or should create a new personal (non-agency-specific account). The service automatically disambiguates between personal and professional contexts to make ownership and agency clear.

### See also

If you found this post helpful, there are two other resources you may be interested in reading:

* A more expansive post on [open source licensing geared towards open source project maintainers ](https://ben.balter.com/2017/11/28/everything-an-open-source-maintainer-might-need-to-know-about-open-source-licensing/)
* An overview of the best way to handle [copyright notices for open source projects](https://ben.balter.com/2015/06/03/copyright-notices-for-websites-and-open-source-projects/) in e.g., Licenses or the README, and

### Go forth and open source

This is a high-level overview intended to highlight common legal issues agencies may face when participating in the open source community, and should not be consider to be legal advice or specific to a particular matter.

Although this is my personal blog, agencies should feel free to contact [government@github.com](mailto:government@github.com) or post in the [github.com/government](https://github.com/government/welcome) peer group with any open-source related questions.

[^1]: The full mechanics of a pull request are beyond the scope of this post, but in short, a member of the public will fork the agency project, or make a copy in their personal account. In many cases, that is all downstream users do. The contributor may then modify the software, in their own personal copy, under the right to modify as granted in the open source license. Again, many downstream users will stop at this point as well, using the modified software for their own purposes. At both steps, the software is freely available to anyone in the world from the user's account and is licensed under the project terms. The upstream project is free to incorporate the downstream users changes as they wish. A contributor may also choose to contribute that code back to the original project, by explicitly asking the upstream project to incorporate their changes.
