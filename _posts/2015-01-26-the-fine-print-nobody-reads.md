---
title: 'The fine print nobody reads: what to do so government can use your service'
description: Federal-compatible Terms of Service (TOS) agreements are special agreements negotiated between the federal government and vendors who offer free social media, mobile, business and other digital tools. These federal-compatible TOS agreements modify or remove problematic clauses in standard TOS agreements, and allow federal employees to legally use these tools. With nearly 2.75mm federal government employees, learn how to get your foot in the door to an increasingly interested market segment.
---

If you offer a service online, chances are, government agencies can't agree to your standard terms of service, at least not has posted. [More than 75 of the web's largest services][fed-negotiated-tos], including Twitter, Facebook, Google, and GitHub have negotiated custom terms of service agreements with the federal government allowing more than 2.7M government employees to use their service. If you're looking to enter the federal market, the following is a read out from a round table discussion at the recent [Collaborate][collaborate] conference in Washington, D.C.:

### Why federal agencies can't agree to your terms of service

Terms of service agreements are often called clickwrap or browserwrap agreements, meaning that by either clicking an "I agree" checkbox when they sign up, or simply by using a service with a terms of service (TOS) linked in the footer of each page, the user has said to agree to be bound by the document, essentially a contract between the service provider and the user. However, terms of service agreements, often written by large companies and agreed to most commonly by individuals contain several unfavorable clauses, that government agencies cannot agree to by force of law. Even if not illegal, the government may be able to pursue their own organizational preference by virtue of their superior bargaining position. Here are a few of the most commonly negotiated clauses:

* **The contracting parties** - Most terms of service agreements are written to bind an individual user, not their employer. Most government employees are not in a position to bind the federal government. Even if so, a service provider should prefer the agreement be executed on behalf of the employer, not the individual (who e.g., would presumably have deeper pockets in the event the relationship went south).

* **Forum selection** - If you're a California based start up, you'll likely want any dispute to be heard in California courts. As a matter of pure practicality, it's a lot easier to go to the courthouse downtown, than to hire a law firm across the country and fly out key witnesses. For government agencies based out of Washington, D.C., they'll likely prefer the parties agree that courts in DC would hear any potential dispute.

* **Choice of law** - Regardless of where the dispute is heard publicly, your standard terms of service may state that a particular state's law (likely either California or Delaware) will govern the relationship, but federal agencies will prefer federal law prevail (due to a little thing called the Supremacy Clause), and state/local agencies will likely prefer their local law.

* **Indemnification** - Indemnification requires the user, here the government agency, to cover the service provider for any loss arising out of the contract. Under the [Anti-Deficiency Act][anti-deficiency], such an agreement would be consider an unaccounted for allocation, meaning the government is essentially guaranteeing an unknown amount of federal funds for a potential dispute.

* **Dispute resolution** - Your terms of service might have an alternative dispute resolution clause, whereby you require a wronged party to first submit their claim to mediation or binding arbitration. As a small start up, this may allow you to save legal costs for many disputes (due to the relaxed rules), but for the government which knows the federal court system and has many attorneys on staff, they'd prefer to go straight to court.

* **Endorsement** - An agency is going to require that their use of your service not be used in promotional materials in a way that implies endorsement. But note, most amendments will allow you to carve out a logically necessary exception for public-facing profiles, which you can use and link to freely.

* **Security, records, etc.** - Government agencies have government-specific security, record keeping, and audit requirements. Even if your service does not meet all requirements today, the government may wish to contractually bind you to continue that discussion and to implement those controls as they may need in the future.

### How an agency signs up for a service

[Office of Management and Budget Memorandum M-13–10][omb-m-13-10] outlines a standard process for government agencies to sign up for social media services (with a definition of "social media" encompassing most web-based services). At a high level, the process looks something like this:

1. A staffer decides a service will further the agency's mission
2. The staffer checks [GSA's list of pre-negotiated TOS amendments][fed-negotiated-tos]
3. If the service has pre-negotiated a TOS amendment, the staffer submits the document to their agency's general counsel for review
4. If the service has not yet negotiated an agreement with the government, they reach out to the service directly to negotiate a custom amendment
5. If all goes well, the agency can use the service (and can create as many accounts as they'd like)

### A (slightly) smarter approach

If an agency reaches out to your service, chances are, you'll be asked to negotiate a one-off amendment that only governs the relationship between you and that particular agency, not the government as a whole. As a result, each time a new agency wants to use your service (there are thousands of them), you'll have to negotiate, print, sign, fax (yes fax), and countersign an amendment, a process that can take weeks to months each time.

Instead, there are two things you can do to streamline the process:

1. Start the discussion by using [GSA Standard TOS Amendment Template][model-amendment]. This boilerplate amendment bring many common TOS clauses to a place where the government can agree to then, and will provide a common framework between agencies, facilitating reuse.

2. Once an amendment is negotiated with a single agency, [reach out to GSA][fed-compat-tos] to get the signed amendment added to their list of social media providers. Beyond the practicalities of a standard starting point to each negotiation, being listed will provide you with greater visibility among government staffers.

### An even smarter approach

Even if you're using a common template, the time required to execute one-off agreements with each agency can quickly add up, especially as [government users head into the thousands][github-gov-list]. Instead, as the government's use of your service grows, you can use the [GSA Standard TOS Amendment Template][model-amendment] as a starting point, to create a standard terms of service amendment, applicable to all government users.

Unlike the negotiated amendment which is executed by each agency, the idea here is to [post this fed-friendly TOS along side your standard TOS][github-gov-tos], and to incorporate it into your standard TOS by reference, meaning a government agency could simply sign up and use your service, under the same clickwrap/browserwrap logic that would prevent them from using the service normally. Under this arrangement, a standard agency sign up flow might look like:

1. A staffer decides a service will further the agency's mission
2. Staffer sends the fed-friendly TOS amendment to their general counsel for review
3. If all goes well, agency begins using the service (with no intervention on your part)

### A few gotchas

No service is *required* to do business with the government. The choice of whether you offer your service to the government or not is a business decision, not a legal one. Compliance may be costly, but the exposure and userbase may be attractive, especially to a growing startup.

When negotiating with government entities at any level of government be sure to be sensitive as to which clauses are objected to because they are prohibited by force of law (e.g., indemnification and the anti-deficiencies act), and which are being objected to out of organizational preference (e.g., forum selection). Many large organizations (whether public or private), will ask for certain things as a matter of habit, before entering into any contract. While the government is often going to be in the superior bargaining position, you may be able to enforce your standard terms of service, especially at the state or local level.

Last, I've purposely avoided discussing procurement, which is a much larger issue worthy of its own post. Most social media services used by the government under this model are cost-free, or if offered under a freemium model, are used at the free-usage tier. If you do offer a paid service, be sure to account for the possibility that the agency might upgrade at some point during the relationship.

### Additional resources

* [How to Amend Your App's Terms of Service for Federal Agencies][zapier-howto]
* [Federal-Compatible Terms of Service Agreements][fed-compat-tos]
* [Negotiated Terms of Service Agreements][fed-negotiated-tos]
* [Model TOS template][model-amendment]
* [OMB Memorandum M-13–10 on Anti-deficiency Act Implications of Certain Online Terms of Service Agreements][omb-m-13-10]

*As always, as they say on the internet, [I am not your lawyer](https://ben.balter.com/fine-print/) (IANYL). The above is clearly a general discussion on the topic of federal terms of service agreements, and it should not be mistaken for legal advice. Heck, I don't even know what your startup does. Even if I did, I probably wouldn't understand it (but I'll take a beta invite if you've got one). I hope the above read out from the Collaborate round table was informative, but if you're a social media provider heading down this route, be sure to retain your own legal counsel before talking to the government.*

[anti-deficiency]: https://en.wikipedia.org/wiki/Antideficiency_Act
[collaborate]: https://collaborate.fosterly.com/
[fed-compat-tos]: https://www.digitalgov.gov/resources/federal-compatible-terms-of-service-agreements/
[fed-negotiated-tos]: https://www.digitalgov.gov/resources/negotiated-terms-of-service-agreements/
[github-gov-list]: https://government.github.com/community/#us-federal
[github-gov-tos]: https://help.github.com/articles/amendment-to-github-terms-of-service-applicable-to-government-users/
[model-amendment]: https://s3.amazonaws.com/digitalgov/_legacy-img/2014/01/model-amendment-to-tos-for-g.doc
[omb-m-13-10]: https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2013/m-13-10.pdf
[zapier-howto]: https://zapier.com/blog/federal-government-terms-of-service-amendment/

