---
title: Copyright notices for open source projects
description: What is the appropriate copyright notice for opens source projects? Who is the copyright holder? What year(s) should you put? Do you even need a copyright notice in the first place?
---

The question's come up several times, as to what's the appropriate copyright notice for the footer of documentation websites or in an open source project's license. In short, assuming your project's under active development, it should be:

`Copyright [year project started] - [current year], [project founder] and the [project name] contributors`.

In practice, there are three things to consider: the date, the copyright holder, and the need to have a copyright notice in the first place. Let's take a quick look at each.

### Do you even need a copyright notice

*No, not to get a copyright* - but notices *are* helpful for other reasons, and they are easy to add.

Historically, the primary point of putting copyright on anything is because in *ye olden days* (before 1979), [it was a legal requirement that a publisher visually mark their work](https://en.wikipedia.org/wiki/Copyright_notice#Form_of_notice_for_visually_perceptible_copies) in order to secure their copyright under [the United States Copyright Act](https://en.wikipedia.org/wiki/Copyright_law_of_the_United_States). After the US became a signatory of [the Berne convention](https://en.wikipedia.org/wiki/Berne_Convention) (along with [167 other countries](https://en.wikipedia.org/wiki/List_of_parties_to_international_copyright_agreements)), that requirement was dropped, and copyright now automatically vests in the author at the time of publication in the vast majority of countries, notice or no notice.

Today, explicit copyright notices in licenses, footers (or really in general), are not necessary for getting a copyright. They still have some uses, though. First, someone may want to use your work in ways not allowed by your license; notices help them determine who to ask for permission. Explicit notices can help you prove that you and your collaborators really are the copyright holders. They can serve to put a potential infringer on notice by providing an informal sniff test to counter the "*Oh yeah, well I didn't know it was copyrighted*" defense. For some users the copyright notice may suggest higher quality, as they expect that good software will include a notice. A notice may also help people determine when copyright might expire, but the date is ambiguous at best, and I'd suspect we'll have better ways to determine the date of publication 80+ years from now, if your code is still worth protecting. Git can track these things, but people may receive software outside of git or where the git history has not been retained.

Simply put, a notice isn't strictly necessary legally speaking. But a notice is nice to have, has some advantages, and is easy to do.

### The date

If you chose to include a copyright notice, you'll see that the first half of any copyright notice (after either the word "Copyright" or "©") is a year. Is it the current year? The year you first had the idea? The year year you hit publish? As implied above, when you choose to include a copyright notice, it's traditionally the year of (first) publication.

For things like books, the year of publication is really easy to determine. If you write a book in 2014, and it hits the shelves in 2015, the title page will most likely reflect a copyright date of 2015. That's the date the original work was reduced to a physical embodiment and publicly distributed. Thats the year it was "published", at least in the eyes of the law. And if a revised edition comes out in 2016, correcting some typos or adding a new forward, the title page would likely include both 2015 and 2016.

#### When is a digital work "published"

But when it comes to digital works, the idea of publication isn't quite the same. When is an open source project (or a website, as that's the most common means of publishing an open source project, e.g., via GitHub's web interface) "*published*"?

In this case, of a website like [choosealicense.com](http://choosealicense.com), to take a simple example, the site was "published" when the site launched in 2013. But unlike books, that are published yearly, in set editions, with open source, things are both never finished and constantly changing — the hallmark of a healthy open source project.

If in 2014, someone submits a pull request to add some new content to the site (or in the case of software, to add a new feature to the project), that pull request would contain new content first "published" in 2014. In that case, a copyright notice like "Copyright 2013 - 2014" would be more appropriate, as the project contains works of original authorship, first published in both 2013 and 2014.

#### So what date should you use

There's precedent for this practice. If you ever look at the copyright page of a book, it will likely say copyright 2001, 2004, 2006–2007, etc., noting each year of publication. Here, the same legal theory is at play, with the digital project being unbridled from the confines of the physical world, and thus publishing a bit more frequently, likely being "published", the year the project was started, and every year thereafter.

In terms of websites, if you have a page that updates daily (think the front page of `nytimes.com`), then the current year is sufficient, because everything on that page was "published" that year, and thus received copyright that year (excluding the design and branding elements for a moment). If you have a page where some content was "published" in 2013, and some in 2014 (think our `choosealicense.com` example), then to really properly put a potential infringer on notice (see the sniff-test rationale above) you'd want `[original publish date] - [last published date]`. Again, just like books, each year it was published, concatenating consecutive years.

### The copyright holder

As noted above, when an author creates an original work (be they a writer or developer), copyright automatically vests in the author. Think of that roughly like owning a building. If the author then want others to be able to use that work, they may choose to grant them a license. Think of that license roughly like renting out an apartment in that building. The author retains ownership (the building), and the tenant has a lease saying they have the right to use it (a license).

When you use an open source project, you are analogous to the renter, but who's the landlord (copyright holder)? If the project only has a single author, things are clear: the copyright holder is the project creator. When you have multiple contributors, all authoring code for the same project, absent an explicit agreement to the contrary, they each retain copyright to their own contribution.

#### So whose name should you use

Again, there's a precedence. Going back to our book example, if you look at the copyright page, it'll likely say `Copyright [year] [author]` (or the publisher, depending on their arangement). One contributor, one copyright holder.

But in the case of open source, there will likely be multiple contributors, each retaining their own copyright. You might write something like `Copyright [year] Alison, Ben, and Charlie`, but as the number of developers grow, things will quickly get out of hand. So lets simplify things and just write, `Copyright [year] the [project] contributors`.

#### The founder-contributor distinction

While there's nothing wrong with that copyright notice, if you want to be super technical, that statement doesn't accurately represent the distribution of contributions across most projects. Likely the project creator (the [BDFL](https://en.wikipedia.org/wiki/Benevolent_dictator_for_life)) with have started the project off with a bunch of commits, and may continue to be the largest contributor for some time. While legally the long tail of contributors technically retain copyright, their share of the total intellectual property might be 1% or less.

As a mater of practicality, as a project founder, you're fully entitled to take credit for the project, even as the project begins to garner contributions from other users. Think of it like many projects continuing to live in the founder's personal GitHub account, giving their name a prominent positions, despite others contributing. So if you want to be super technical, there's no reason you couldn't say `[project founder] and the [project name] contributors`. In either case, just putting the project founder or maintainer is strictly speaking wrong, assuming others have contributed.

### Putting it all together

Assuming your project's under active development, you should write `Copyright [year project started] - [current year], [project founder] and the [project name] contributors`. While not strictly necessary to obtain a copyright, if you're going to add a copyright notice, that'll accurately represent the years of publication and all copyright holders.

Of course there are many edge cases, and the above is a simplification of what goes into a copyright notice. Things like contributor license agreements (CLAs), contributing while on the clock (work for hire), or derivative works complicate copyright considerations. Heck, with open source almost always being developed within a version control system — a system designed to track and make known who made what change when — as @bkeepers [pointed out](https://github.com/benbalter/benbalter.github.com/issues/254#issuecomment-97044362), the copyright notice may be even more of an anachronism than it already is.

*As they say on the internet, IANYL, so, as always, [please consult your own legal counsel](https://ben.balter.com/fine-print/) before making decisions regarding how you license your own works. If you're looking for information about software copyright in government, here's [everything a government attorney needs to know about open source software licensing](https://ben.balter.com/2014/10/08/open-source-licensing-for-government-attorneys/).*
