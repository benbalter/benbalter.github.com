---
title: Octoversary
description: Reflecting on eight years of shipping at GitHub with a look at some of my most impactful ships.
---

Today marks my "Octoversary" - eight years to the day from when [I first became a GitHubber](http://web.archive.org/web/20140421210430/https://github.com/blog/1432-ben-balter-is-a-githubber). I've shipped a number of impactful things over the years. To reflect on the milestone, here are eight of my favorite ships, in roughly chronological order:

### 1. GeoJSON rendering

My first ship at GitHub was [GeoJSON rendering](https://github.blog/2014-02-05-diffable-more-customizable-maps/) (and later diffing). I still remember pitching @skalnik in the "cafe" at HQ2 during my onboarding week. The idea at the time was that it was a lot easier for government agencies to publish open data on GitHub (since it was readily understood and already public) than working through the legal, security, cultural, and public affairs blockers of open sourcing software. Not to mention, you get a visual output, making the value immediately apparent to even non-technical stakeholders (the "boss factor" as I called it). GeoJSON rendering became part of a broader "land-and-expand" strategy, lowering the barrier to entry for government agencies and the open data community more broadly to take their first step towards joining the open source community on GitHub. To date, about [27 million GeoJSON files have been uploaded to GitHub](https://github.com/search?q=extension%3Ageojson&type=Code), and every map has a link to contribute back to [Open Street Map](https://www.openstreetmap.org).

### 2. Government outreach

My first three years at GitHub were as GitHub's "Government Evangelist" (Née "Government bureaucat" before it got too confusing), leading the effort to make GitHub the premiere government platform for open source, open data, and of course, open government. The efforts [live on](https://government.github.com/community/) in what is now GitHub's Public Sector team, but during that time [more than 2,000 government organizations across over 75 countries joined the GitHub community](https://github.blog/2014-08-14-government-opens-up-10k-active-government-users-on-github/), a nine-fold increase. We made GitHub available on AWS GovCloud (our first FedRAMP compliant environment) so that US Federal agencies could use GitHub more securely, and were listed on GSA Schedule 70 so that agencies could more easily procure private repos for development with contractors and between agencies. A number of notable projects were open sourced on GitHub during that time, but my favorite has to be [the White House using GitHub for public comment on the US Open Data Policy](https://venturebeat.com/2013/05/09/white-house-drafts-official-open-data-policy-of-the-united-states-on-github/). 

### 3. GitHub Pages

Shortly after I joined GitHub, there were a number of features I wanted for [my personal site][https://ben.balter.com], which runs on GitHub Pages (namely then, updating to Jekyll 1.0). At the time, GitHub's internal repos were run like open source projects. Anyone in the company could submit a pull request, so I did just that. When no one responded, I learned that I had become the *de factor* Pages maintainer, [a role that became "official" a few years later](https://github.blog/2015-04-27-eight-lessons-learned-hacking-on-github-pages-for-six-months/). 

When I first saw the Pages source code, it was a ~100 line shell script. ~250 pull requests (plus many more from other contributors like @parkr) later, Pages is more robust, more secure, and more feature rich. The publishing experience for end-users went from twelve steps to two (commit a markdown file + enable GitHub Pages). You can now use plugins ([a number of which](https://rubygems.org/profiles/benbalter) I wrote, themes (both [gem-based](https://github.com/jekyll/jekyll/issues/4510) and [remote](https://github.com/benbalter/jekyll-remote-theme)), and [collections](https://github.com/jekyll/jekyll/issues/1941), and if anything goes wrong, you now get rich build feedback. Not to mention, we [brought worry-free HTTPS to millions of Pages sites](https://github.blog/2018-05-01-github-pages-custom-domains-https/). 

### 4. Blogging

It's no secret that [I’ve written a number of posts about GitHub’s culture and communication patterns](https://ben.balter.com/2021/02/01/what-to-read-before-starting-or-interviewing-at-github/) over the years. More than a hundred, to be exact. That's more than one a month on average for eight years straight. While they weren't all novel or insightful, [a few did gain some notoriety](https://ben.balter.com/2020/09/12/10-years/) within the community.

### 5. Open source licensing

As a side project, I had created [Licensee](https://github.com/licensee/licensee). The problem I was trying to solve was simple: given an open source project, how do I *know* under what license the project is distributed? Beyond what the project may claim in a README or package management file, how do I know that the text in the LICENSE file really is the text of the license. How do I know the author didn't add "by using this software, you promise to give me a puppy" to the terms? 

To encourage open source license adoption, We [launched choosealicense.com](https://github.blog/2013-07-15-choosing-an-open-source-license/) to demystify the confusing world of open source licensing, and added a license picker to the repo creation flow, a move that had [a noticeable impact on the number of open source projects on GitHub](https://github.blog/2015-03-09-open-source-license-usage-on-github-com/). Today, Licensee continues to power license detection on GitHub, making high-confidence license information available via the GitHub UI (and API), further demystifying open source licensing by telling you exactly what you can and can't do with the project, and standardizing the universe of open source licensing in the process.

### 6. Trust and Safety

In 2016, after surprising my team (and department head) at an offsite with a presentation on why my role should be eliminated, I moved to the Product organization, and after several rounds of pleading that I was a poor fit for the role, became the Product Manager for what eventually became Trust and Safety - ensuring developers didn't have to risk their privacy or personal safety to participate in the open source community.

In my five years on the amazing team, we had [a number of incredibly impactful ships](https://ben.balter.com/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/), including site-wide community guidelines, comment edit history, minimized comments, contributor badges, and the triage and maintainer roles. Not to mention, we closed dozens of abuse vectors, most visible of which were preventing namespace reuse attacks, and closing our largest account takeover vector, which was responsible for tens of thousands of compromised accounts each year.

### 7. Removing non-essential cookies

The now-ubiquitous cookie consent banners are universally accepted as a subpar user experience when compared to more customer-centric approaches to data collection. Rather than clutter GitHub with cookie consent banners to meet EU regulations, in December of 2020, [we decided to remove Google Analytics and other privacy-invasive cookies from GitHub.com](https://github.blog/2020-12-17-no-cookie-for-you/) and nearly a hundred other domains and subdomains. 

When a developer visits GitHub.com, the best experience is one where they don’t have to think about whether their privacy is at risk, trust GitHub to make the decision in their best interest due to GitHub's privacy-centric reputation, and can immediately begin interacting with the website to accomplish their desired task. Fortunately, GitHub is in a unique position, in that we do not rely on ad revenue or otherwise seek to monetize our customer’s information. As such, we were in a unique position to absorb that complexity on behalf of our customers, by simply limiting what data we collect and how we collect it, avoiding the need for the consent banners in the first place. It's what I believe the EU regulations intended in the first place, and I hope other privacy-centric companies follow suit.

### 8. PhotoDNA

My most recent ship, and arguably the most impactful, was ensuring that GitHub couldn't be used as a platform to further child abuse and violent extremism, by scanning uploaded images for evidence of child exploitation and extreme violence. To do this, we implemented Microsoft's industry-standard [PhotoDNA service](https://www.microsoft.com/en-us/photodna), which uses complex fingerprinting methods to detect, disrupt, and report the distribution of child exploitation material and other illegal content.

Two aspects of the 2+ year-long project uniquely stand out. First, it's rare even within Trust and Safety, to find such an elegant solution to a complex problem. This essentially set-it-and-forget-it feature from GitHub's standpoint has the potentially to make the world a tangibly better place (and can literally put someone in jail). Second, it arose organically, not as a means to a compliance end. When asked where the impetus for the project came about, whether, for example it was compliance driven, our team could proudly reply that were doing it because it was the right thing to do.

