---
title: Copyright notices for websites and open source projects
excerpt: ""
---

The question's come up [several times](https://github.com/github/choosealicense.com/pull/264), as to what's the appropriate copyright notice for the footer of websites or in an open source project's license. In short, assuming your project's under active development, it should be `[year project started] - [current year], [project founder] and the [project name] contributors`.

In practice, there are three things to consider: the date, the copyright holder, and the need to have a copyright notice in the first place.

### Do you even need a copyright notice?

Technically, no.

The whole point of putting copyright on anything is because in *ye olden days* (before 1979), [it was a legal requirement that a publisher visually mark their work](https://en.wikipedia.org/wiki/Copyright_notice#Form_of_notice_for_visually_perceptible_copies) in order to secure their copyright under [the United States Copyright Act](https://en.wikipedia.org/wiki/Copyright_law_of_the_United_States). After the US became a signatory of [the Berne convention](https://en.wikipedia.org/wiki/Berne_Convention) (along with [167 other countries](https://en.wikipedia.org/wiki/List_of_parties_to_international_copyright_agreements)), that requirement was dropped, and copyright now automatically vests in the author at the time of publication, notice or no notice.

Today, explicit copyright notices in licenses, footers (or really in general), besides for being a great way for designers to fill empty space and to perpetuate internet lawyering, only serve to put a potential infringer on notice by providing a sniff test to counter the "Oh yeah, well I didn't know it was copyrighted" defense. It's a nice to have thing, but strictly speaking, isn't necessary.

### The date

If you chose to include a copyright notice, you'll see that the first half of any copyright notice (after either the word "Copyright" or "&copy;") is a year. Is it the current year? The year you first had the idea? As implied above, when you choose to include a copyright notice, it's traditionally the year of (first) publication.

For things like books, the year of publication is really easy to determine. If you write a book in 2014, and it hits the shelves in 2015, the title page will most likely reflect a copyright of 2015. That's the date the original work was reduced to a physical embodiment and publicly distributed. Thats the year it was "published". And if a revised addition comes out in 2016, correcting some typos or adding a new forward, the title page would likely include both 2015 and 2016.

#### When is a digital work "published"?

But when it comes to digital works, the idea of publication isn't quite the same. When is an open source project (or a website, as that's the most common means of publishing an open source project, e.g., via GitHub's web interface) "published"?

In this case, of a website like [choosealicense.com](http://choosealicense.com), to take a simple example, the site was "published" when the site launched in 2013. But only books, that are published yearly, or set editions, with open source, things are both never finished and constantly changing — both are signs of a healthy open source project.

If in 2014, someone submits a pull request to add some new content to the site (or in the case of software, to add a new feature to the project), that pull request would contain new content first "published" in 2014. In that case, a copyright notice like "Copyright 2013 - 2014" would be more appropriate.

#### So what date should you use?

There's precedent for this practice. If you ever look at the copyright page of a book, it will likely say copyright 2001, 2004, 2006-2007, etc., noting each year of publication. Here, the same legal theory is at play, with the digital project being unbridled from the confines of the physical world, and thus publishing a bit more frequently.

If you have a page that updates daily (think the front page of nytimes.com), then the current year is sufficient, because everything on that page was "published" that year, and thus received copyright that year (excluding the design and branding for a moment). If you have a page where some stuff was "published" in 2013, and some in 2014 (think our choosealicense.com example), then to really properly put a potential infringer on notice you'd want `[original publish date] - [last published date]`.  

###

Take for example, if on December 15, 2014 Ida Infringer copies choosealicense.com and starts selling *Open Source Licensing For Dummies*, but does so in a way that violates her license (e.g., she doesn't properly attribute the original work). On January 1st, 2015 the contributors of chooselicense.com take Ida to court to enforce our rights to have Ida attribute the work to us. We can't as easily say "judge, but it clearly says © 2014!" if the alleged infringement occurred prior to when we're explicitly claiming copyright (or if it's clear we're claiming a 2013 copyright in content that was authored in 2014). Again, the value here is really for that sniff test, but if you're going to do it, I'd argue that you should  accurately reflect (aka accurately notice) the true copyright.

### The copyright holder

As noted above, when an author creates an original work (be they a writer or developer), copyright automatically vests in the author. Think of that roughly like owning a building. If the author then want others to be able to use that work, they may choose to grant them a license. Think of that license roughly like renting out an apartment. The author retains ownership (the building), and the tenant has a lease saying they have the right to use it (a license).

When you use an open source project, you are analogous to the renter, but who's the landlord? If the project only has a single author, things are clear: the copyright holder is the project creator. When you have multiple contributors, all author code for the same contract, absent an explicit agreement to the contrary, they each still retain copyright to their own contribution.



Longer answer:

*(IANYL, so please consult your own legal counsel before making decisions regarding how you license your own projects.)*



### Who should be listed as the copyright holder

* Difference between copyright and license
* About how you retain copyright
* It should be the contributors (or contributors + maintainer) not just the maintainer
