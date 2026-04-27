---
title: Inclusive communication for distributed teams
description: "Inclusive communication goes beyond scheduling — it means ditching cultural idioms, expanding acronyms, writing accessibly, and choosing words that work for a global audience."
tldr: "Distributed teams are diverse teams. Small choices — unambiguous dates, expanded acronyms, plain language over cultural idioms, accessible formatting — make the difference between communication that includes everyone and communication that quietly excludes."
---

You're on a video call when a colleague says "let's punt on this decision." Half the team nods. The other half — based in Berlin, São Paulo, and Tokyo — has no idea what just happened. Nobody asks, because nobody wants to look like they don't get it. That's how exclusion works: quietly, one idiom at a time.

Inclusive communication isn't a single practice. It's a collection of small, deliberate choices that add up to whether your distributed team actually feels like one team.

## Schedule with a global audience in mind

Time zones are one of the harder parts of distributed work, but scheduling doesn't have to be exclusionary. A few practices that go a long way:

- Write numeric dates in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) (YYYY-MM-DD) or other unambiguous formats. Write "June 5" instead of "6/5," which could mean June 5 or the 6th of May depending on where you're from.
- When referring to a time, always include the time zone — "3 PM ET" takes two seconds to type and saves real confusion. Better yet, include multiple zones: "3 PM ET / 9 PM UTC+1."
- Avoid location-specific language like "tomorrow," "this afternoon," or "in the spring."
- Be mindful of holidays, weekends, and working hours across time zones.
- Consider "speedy meetings" — end 5 minutes early or start 5 minutes late to allow time to be human between calls. Be strict about it.
- Meetings should start and end on time. If you finish early, use the remainder for informal conversation.

<a href="https://xkcd.com/1179/"><img src="https://imgs.xkcd.com/comics/iso_8601_2x.png" alt="xkcd comic describing ISO 8601 as the one true date format" /></a>

## Ditch the cultural idioms

Phrases like "drop the ball" or "punt on this decision" are deeply rooted in American sports culture. To someone who didn't grow up watching baseball or football, they're meaningless. Instead of "we hit a home run," say "we exceeded our goals." Instead of "let's touch base," say "let's check in."

I once had a German coworker who would "cosplay" as American when communicating. Instead of saying a pull request was "fine," he'd describe it as "awesome" or "amazing." He'd picked up on the unwritten rule that Americans inflate adjectives — and overcorrected. What reads as enthusiastic to one person might feel excessive to another; what seems like directness might come across as rudeness. Language carries cultural baggage in every direction.

## Expand your acronyms

Acronyms are an unintentional form of exclusion. Even if you think everyone knows what API stands for, it takes seconds to write "Application Programming Interface (API)" the first time. That small effort makes your writing accessible to anyone encountering the term for the first time.

At GitHub, we had a "glossary" repo with associated ChatOps. Encounter an unknown acronym, and ChatOps could explain it — or at least add it to the glossary for others once you learned what it meant. If your team doesn't have something like this, consider building one. The cost is trivial; the signal it sends about inclusion isn't.

## Consider neurodiversity

Some people interpret language literally. Sarcasm, implied meanings, and subtle hints don't always translate well — especially in writing, where tone is impossible to hear. "It would be *great* if someone could look at this" might be a passive-aggressive nudge or a genuine compliment depending on who's reading it. Be explicit about what you need: "Could someone review this PR by Thursday?"

## Write for accessibility

Screen readers rely on proper document structure to help users navigate content. When you use semantic Markdown — headings for hierarchy, lists for enumeration, emphasis for actual emphasis — you make your writing usable for assistive technologies, not just prettier.

Give images alt text. Write descriptive link text ("read the deployment guide") rather than "click here." Run a document through a screen reader at least once — five minutes of listening will reveal which "headings" are just bold text, which images lack alt text, and which links are meaningless without visual context.

---

None of this is hard. Expanding an acronym, dropping a sports idiom, adding a time zone — each takes seconds. But those seconds compound. They're the difference between a team where everyone participates and one where half the team quietly opts out because the communication wasn't built for them.
