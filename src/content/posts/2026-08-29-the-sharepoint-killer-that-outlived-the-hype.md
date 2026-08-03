---
title: The SharePoint killer that outlived the hype
description: Fifteen years ago I claimed WordPress could do SharePoint better than SharePoint. Here's the honest report card on what held up, what didn't, and the one thing I got embarrassingly wrong.
---

Fifteen years ago, I wrote a sentence I've never fully lived down: [WordPress can do SharePoint better than SharePoint](https://ben.balter.com/2011/04/04/when-all-you-have-is-a-pair-of-bolt-cutters/). Then I spent a summer proving it, and [WP Document Revisions](https://ben.balter.com/2011/08/29/wp-document-revisions-document-management-version-control-wordpress/)—an open-source document management and version control plugin—shipped on August 29, 2011.

It's my first real open source project, and today it turns 15. It still runs. So does SharePoint. Time is the only honest grader of a prediction, and fifteen years is a big enough sample size to actually grade this one. Let's.

## The bet

The wager wasn't really about documents. It was about where to build.

The obvious move in 2011 was a bespoke stack—write your own storage, your own permissions, your own revision history, your own everything. Instead I bet on WordPress's existing core: treat a document as a custom post type and inherit attachments, revisions, taxonomies, authentication, and URL rewriting that had already survived eight years and millions of sites. Why rebuild the wheel, I argued at the time, when you've got the best wheel the world has ever built and a global community filing the rough edges off it?

The meta-bet, the one underneath all the specifics: boring, battle-tested infrastructure beats novel. Here's how the specifics graded out.

## The report card

**"WordPress beats SharePoint in the enterprise."** *Miss on the scoreboard, win on the instinct.* SharePoint didn't just survive—it got absorbed into Microsoft 365 and is bigger now than it was when I took my swing at it. WP Document Revisions never dethroned anyone; it found a niche and served it well. But the reason I threw the punch—build on proven infrastructure instead of a bespoke enterprise stack—is exactly the instinct that aged well everywhere else in my career. I lost the fight I picked and kept the lesson that made me pick it.

**"If you know WordPress, you know document revisions."** *Mixed.* Familiarity as a moat was a good idea for about five years. Then WordPress reinvented its own editor with Gutenberg, and the whole world moved to real-time collaboration—Google Docs, then Notion. The check-out-and-lock model I shipped, where you claim a file so nobody clobbers your edits, was the right metaphor for 2011 and the dated part by 2020. I optimized for "feels like the tool you already use," and the tool everyone already used changed underneath me.

**"This injects open source into government and enterprise."** *Right direction, wrong vehicle.* Open source in government exploded over the next decade—[18F](https://en.wikipedia.org/wiki/18F), source-code policies, [WhiteHouse.gov running on WordPress](https://ben.balter.com/2017/12/16/whitehouse-gov-goes-open-source/). I got to live most of it firsthand. Almost none of it happened through this plugin. The prediction about the tide was correct; the prediction that my little boat would be the one riding it was not.

**"Future-proof, low switching costs."** *Win, and the one I'm proudest of.* The claim was that your data stays portable and the thing keeps working. It's fifteen years later, the plugin still installs, and your files are still just files you can walk away with. Durability was the promise, and durability is the one thing software almost never delivers. This did.

**"Enterprise-grade security."** *The embarrassing miss.* I masked every uploaded file behind a 128-bit MD5 hash and called it government-grade. Two problems. MD5 has been cryptographically broken for years—you do not want it anywhere near the word "security" in 2026. And hashing a *filename* was never real security in the first place; it's obscurity wearing a security costume. The actual protection came from routing requests through WordPress's authentication, which was fine. The part I bragged about was the part that didn't matter. Own it: I shipped a marketing claim my own threat model didn't support.

**"No open-source alternative exists."** *Partial credit.* The general-purpose gap I pointed at got filled—[Nextcloud](https://nextcloud.com/) and friends did the "self-hosted document collaboration" job at scale. The specific WordPress-native niche stayed small but real, which is roughly where a first-time maintainer's project should land.

## What fifteen years actually taught me

Tally it up and the plugin lost the war it declared. SharePoint's fine. Google Docs won collaboration. My security pitch aged like milk.

And it was still one of the best bets I ever made—because the scoreboard was never the point. Writing PHP for this thing is a straight line to everything after it: government work, GitHub, a career built on [showing your work](https://ben.balter.com/2022/02/16/leaders-show-their-work/) in public. A side project nobody asked me to build compounded for fifteen years into things I couldn't have predicted and can't now imagine giving back.

The one durable lesson isn't "documents" and it isn't "WordPress." It's the meta-bet: reach for the boring, proven platform over the exciting new one. The instinct that told me to build on eight years of somebody else's battle-tested code instead of my own clever stack is the instinct that's paid off in every job since. Novel is a tax you pay forever. Proven is a discount that compounds.

I was wrong that WordPress would kill SharePoint. I was right that betting on unglamorous, well-worn tools ages better than betting on the new hotness. Fifteen years is long enough to say which of those two claims was worth making. Happy birthday to the plugin that got the loud prediction wrong and the quiet one right.
