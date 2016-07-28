---
title: Why you shouldn't write your own open source license
description:
---

The power and potential of open source comes not from the fact that code is published for others to see, but that others have the ability to use your code, to modify it, and to improve it. That possibility breaks down, however, when would-be contributors have the legal right, but not the practical means.

At their core, open source licenses are legal contracts between code contributors and code consumers. In exchange for me waiving my right to sue you if something goes wrong, you grant me the right to use and modify your code. The difference between open source licenses, and other intellectual property grants, however, like say, an author's license to a book publisher, is that open source licenses are heavily standardized, with about a dozen mainstream licenses and three primary licenses.

### A right isn't a right unless you know you can use it

The standardization of open source licenses is not a matter of convenience or group think. The MIT license isn't popular because it has a great marketing campaign. For open source to work, downstream users must be able to use the code you publish. When small businesses and individual developers need to hire a highly specialized (and costly) law firm to know what they can and can't do with your code, regardless of what the license says, those rights don't exist, at least not practically.

Developers and small business are familiar with the most common open source licenses, and can use software licensed under their terms freely and with little administrative overhead. In this sense, standardized open source licenses serve as a three or four letter proxy for those without formal legal training to know exactly what they can and can’t do with your code. And when those downstream users don't recognize the exact license flavor of variation, there are countless free or low-cost resources to help them do so.

### Why government agencies and enterprises feel the need to create their own license

Open source software licensing is rarely taught in law school. Even if it's taught in some schools today, the types of general counsels that are involved in software licensing decisions likely graduated twenty, thirty, or more years ago when it definitely wasn't taught, have other responsibilities on their plate, and in all likelihood aren't involved in the open source community enough to appreciate its history and context. Given that lens, it's not a totally unexpected reaction for in-house lawyers to look upon existing open source licenses incredulously and say "*that's not quite right, we should do X instead*".

At the same time, in house counsels primary goal is historically to minimize the organization's expose to legal risk. Absent a strong counter balance, this often creates legal frameworks that are optimized for the publishing organization legal posture, not for the code's widespread adoption or the diversity of its contributor base.

### Open source is nothing without adoption

When I make the case that open source publishers shouldn't create their own license, it's not a legal argument. Undoubtedly, developers have the legal right to license their code under any terms they'd like (or choose not to license their code entirely). My argument against creating your own open source license is one of practicality and self interest.

Open source is nothing without adoption. The reason you publish your code isn't to show others that you wrote it, but with the hope that they'll use it, they'll improve it, and they'll contribute back. If you make it too hard for them to do so, they never will.

### Open source should be optimized for code consumers, not for code publishers

I'd argue that open source should be optimized for code consumers, not for code publishers. There's two reasons for this:

First, lets assume for a second that there's some complexity inherent in open source, that all open source licenses share some legal ambiguity. Who should bear the burden of that complexity? You could push it on to code consumers, who are generally less sophisticated, and would have to go out and hire outside counsel before they could use your code (and thus are less likely to do so). At the same time, code publishers, at least those sophisticated enough to consider writing their own license, generally have in house lawyers that could absorb the complexity of a standardized license at little to no cost.

Second, even if code consumers are sophisticated enough to perform their own legal analysis, incuring such costs may make your open source project more expensive then its proprietary alternative, further reducing adoption among institutional consumers. Not to mention, it's far more efficient for the code publisher to preform that legal review once, and make a determination of risk, then for each downstream consumer to perform that same legal review anew.

### 

Unless absolutely required, avoid custom, modified, or non-standard terms, which will serve as a barrier to downstream use of your code. The open source community is just that, a community, and one with a strong tradition. Open source software is published so that others may use it, and doing so under a legal framework alien to the community, is the easiest way to make sure it’s not used. Optimize for the code’s reuse, not its publication.

http://ben.balter.com/2014/10/08/open-source-licensing-for-government-attorneys/
