# Writing Guidance for Blog Posts

Writing for ben.balter.com. Match Ben's voice: direct, irreverent, opinionated, conversational, like a smart colleague over coffee, not a corporate memo.

This is the site's summary of Ben's `writing-style` skill, plus what's specific to this site. The skill is the full guide and wins where the two disagree, so load it when you have it (Claude Code does). This file is what agents without it work from, such as GitHub Copilot, and it's the only place in the repository for voice rules: the [`writing` agent](../../.github/agents/writing.md) points here instead of keeping its own copy. [`agent-guidance.test.ts`](agent-guidance.test.ts) checks both.

## Voice

- **Professional, not formal**: clarity and craft over strict convention
- **Direct**: say what you mean in as few words as possible
- **Opinionated**: take clear stances and back them up; don't hedge when you have a point
- **Conversational**: "you" and "your" to address the reader; "I" for personal experience
- **Irreverent**: corporate rituals, management dogma, hype, and Ben himself are fair game; aim up or at yourself, tie it to a point, and skip a joke that has to be forced
- **Engineering mindset**: apply software concepts to human problems ("communications debt", "O(n²) collaboration overhead")

## Opening Hooks

Never start with throat-clearing or definitions. Grab the reader immediately:

- Drop into a scene, present tense: "It's Thursday afternoon. Your direct report sits down and reads from a list." Never frame it with "Picture this" or "Imagine" (`AIPatterns.Aphorisms` flags them)
- State a provocative truth: "Here's a dirty secret about knowledge work..."
- Show a problem in action: concrete example of what goes wrong, then pivot to the solution
- Personal observation: "A number of years ago, I described..."

## Anti-AI Patterns to Avoid

These make writing feel machine-generated:

- **Em dashes** (`—`): banned. They read as the top AI tell. Use a comma, colon, parentheses, or split into two sentences. See Grammar and Mechanics below.
- **Excessive hedging**: "It's important to note that...", "It's worth mentioning...": state the point directly
- **Formulaic transitions**: "Furthermore", "Moreover", "Additionally", "That said": use natural transitions or restructure
- **Hollow summarization**: "In conclusion", "To summarize", "Overall": the content speaks for itself
- **Meta-commentary**: "Let's explore...", "Let's dive into...", "Let's take a look at...": just do it
- **Setup phrases**: "When it comes to...", "In terms of...", "In the context of...": get to the point
- **Numbered lists for everything**: use prose when it flows better
- **Identical paragraph lengths**: vary short (1–2 sentences) with longer (4–6 sentences)
- **Structural tells**: the shapes a linter can't catch. A steady rhythm of three parallel items, "It's not X, it's Y" where the contrast isn't earned, a colon signpost every few sentences ("The real problem: nobody owns it"), and labeling your own facts ("Here's what matters", "What surprised me most"). Once is fine. As a pattern, restructure.
- **Summary closers**: end on a test the reader can run, a callback to the opening, or one next step, then stop

**The coffee test**: read aloud. Does it sound like something you'd actually say to a colleague?
**The "anyone test"**: could this have been written by literally anyone? If there's no personality, rewrite it.

Many of these patterns are enforced mechanically by the `AIPatterns` [Vale](https://vale.sh) style (maintained in [benbalter/vale-styles](https://github.com/benbalter/vale-styles/tree/master/AIPatterns) and pulled in through `Packages` in [`.vale.ini`](../../.vale.ini)), which runs in CI via [`script/vale`](../../script/vale). Unambiguous AI tells (hedging openers, meta-commentary, "This ensures…", performative enthusiasm) are errors and block CI; transitions and setup phrases are warnings. Em dashes are flagged by the `AIPatterns.EmDash` rule (warning, being cleaned up retroactively). Run `vale <file> --minAlertLevel=suggestion` to see everything.

## Grammar and Mechanics

- **Em dashes** (`—`): banned, canonical rule. They read as the top AI tell. Use a comma, colon, parentheses, or two sentences instead. "Remote work, when done right, transforms teams." When you'd reach for one, a period usually reads better.
- **En dashes** (`–`): still fine for ranges and compound modifiers ("2013–2020", "manager–IC dynamic")
- **Oxford comma**: always. "issues, pull requests, and discussions"
- **Active voice**: "We deployed the feature" not "The feature was deployed"
- **Contractions**: use naturally (don't, won't, it's)
- **Sentence fragments** for emphasis. Like this.
- **Acronyms**: don't spell them out in posts. Add the term to the glossary in [`src/data/acronyms.yml`](../data/acronyms.yml) instead, and [`rehype-acronyms`](../lib/rehype-acronyms.ts) gives its first use a hover tooltip. It skips text inside links, so keep at least one mention of the acronym outside link text.

## Language Principles

Replace buzzwords with specific language:

| Instead of | Use |
|-----------|-----|
| leverage | use, apply, build on |
| synergy | collaboration, combined effect |
| seamless | smooth, integrated |
| robust | reliable, well-tested |
| resources (people) | people, engineers, the team |
| bandwidth | time, capacity |
| circle back | follow up |
| low-hanging fruit | easy wins |
| move the needle | the specific metric |

Cut ruthlessly: "It is important to note that" → delete. "in order to" → "to". "due to the fact that" → "because".

## Structure

1. **Opening**: hook immediately with a relatable problem, observation, or question
2. **Context**: why this matters, your experience with it
3. **Main argument**: thesis with examples, lists, evidence
4. **Counterpoints**: answer the strongest objection once, in the reader's own words, in an `:::objection[...]` callout, with a stance rather than a survey of both sides
5. **Practical advice**: concrete, actionable recommendations
6. **Conclusion**: one closing line that connects back to the opening or gives a next step, not a summary

### Headings, bold, and pull quotes

[`src/lib/post-structure.ts`](../lib/post-structure.ts) warns on these when `npm run validate-seo` runs:

- **Headings make a claim.** Write each H2 so someone who reads only the headings gets the advice. "Background", "Overview", and "Conclusion" are labels, not claims.
- **Never use bold as a heading.** A bold line standing in for a section title carries no structure, and screen readers can't navigate to it. Use a real `##` or `###`. Bold belongs on list lead-ins and the rare word that needs emphasis.
- **Pull quotes.** Mark three to five sentences that stand alone, the ones worth screenshotting, with the `:quote[...]` directive, at most one per section.

### TK placeholders

Mark anything still to come with **TK**, newsroom shorthand for "to come": a fact, quote, number, anecdote, or whole section you can't fill in yet. Never invent a stand-in instead. A visible gap beats a plausible guess.

- Write it as a standalone, uppercase `TK`, followed by what's needed: `TK: the best reaction from the night.` It's spelled wrong on purpose, so a search for it finds only placeholders.
- The dev server (`npm run dev`) highlights every TK in bright yellow ([`rehype-tk-highlight`](../lib/rehype-tk-highlight.ts)). Production builds don't, so a stray TK would ship as plain text.
- Resolve every TK before the post's branch merges, since merging publishes it: `grep -n '\bTK\b' src/content/posts/<post>.md` should come back empty.

### Footnotes

Use footnotes for asides, definitions, and tangential context that would break the flow: keep the punchline in the body and move the explainer down. On this site:

- **Name footnotes by topic** (`[^reset]`, `[^bisect]`), not by number. Put the definitions at the end of the file. The renderer numbers them in the order they're referenced.
- **Inside raw HTML** such as a `<figcaption>`, a footnote reference only renders if the Markdown sits on its own lines with a blank line before and after it:

  ```html
  <figcaption>

  The caption text, with a footnote.[^voices]

  </figcaption>
  ```

## SEO

- **Title**: under about 47 characters, keyword-rich, no Markdown formatting. The layout appends " | Ben Balter" (13 characters) to the `<title>`, and search results show roughly 60. Share cards (`og:title`, `twitter:title`) use the bare title.
- **Description**: any length, but optimize the first 150 characters after stripping Markdown. Keep Markdown links in the content; never remove them to hit a length target. Rewrite the plain text instead.
- **Headings**: H2 for main sections, H3 for subsections, never skip levels
- **Internal links**: use descriptive anchor text; link to related posts generously, as relative paths in a post (`/2022/03/17/why-async/`), with the link on the phrase it explains, not "as I wrote in…"

Key concepts to reference and link to when relevant:

- "showing your work": transparent decision-making
- "communications debt": like technical debt but for documentation
- "caremad": passionate about something enough to do something about it
- [Leaders show their work](https://ben.balter.com/2022/02/16/leaders-show-their-work/)
- [Rules of communicating at GitHub](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/)
- [Why async](https://ben.balter.com/2022/03/17/why-async/)

## File Naming

`YYYY-MM-DD-title-with-hyphens.md` (or `.mdx` for posts with Astro components)

## Linting

```bash
remark src/content/posts/my-post.md   # report-only check; does NOT modify the file
npm run lint-text                      # textlint grammar/style check
```

Never run `remark <file> -o`. The `-o` write-back is what adds excessive backslash escaping and breaks the build. Report-only remark leaves files untouched.
