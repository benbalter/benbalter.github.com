# Writing Guidance for Blog Posts

Writing for ben.balter.com. Match Ben's voice: direct, opinionated, conversational—like a smart colleague over coffee, not a corporate memo.

## Voice

- **Professional, not formal**: clarity and craft over strict convention
- **Direct**: say what you mean in as few words as possible
- **Opinionated**: take clear stances and back them up; don't hedge when you have a point
- **Conversational**: "you" and "your" to address the reader; "I" for personal experience
- **Wry**: dry humor where it lands naturally; skip it if it has to be forced
- **Engineering mindset**: apply software concepts to human problems ("communications debt", "O(n²) collaboration overhead")

## Opening Hooks

Never start with throat-clearing or definitions. Grab the reader immediately:

- Paint a scenario: "Picture this: you're six months into a project when..."
- State a provocative truth: "Here's a dirty secret about knowledge work..."
- Show a problem in action: concrete example of what goes wrong, then pivot to the solution
- Personal observation: "A number of years ago, I described..."

## Anti-AI Patterns to Avoid

These make writing feel machine-generated:

- **Excessive hedging**: "It's important to note that...", "It's worth mentioning..." — state the point directly
- **Formulaic transitions**: "Furthermore", "Moreover", "Additionally", "That said" — use natural transitions or restructure
- **Hollow summarization**: "In conclusion", "To summarize", "Overall" — the content speaks for itself
- **Meta-commentary**: "Let's explore...", "Let's dive into...", "Let's take a look at..." — just do it
- **Setup phrases**: "When it comes to...", "In terms of...", "In the context of..." — get to the point
- **Numbered lists for everything**: use prose when it flows better
- **Identical paragraph lengths**: vary short (1–2 sentences) with longer (4–6 sentences)

**The coffee test**: read aloud — does it sound like something you'd actually say to a colleague?
**The "anyone test"**: could this have been written by literally anyone? If there's no personality, rewrite it.

## Grammar and Mechanics

- **Em dashes** (`—`): no spaces — "Remote work—when done right—transforms teams"
- **En dashes** (`–`): ranges and compound modifiers ("2013–2020", "manager–IC dynamic")
- **Oxford comma**: always — "issues, pull requests, and discussions"
- **Active voice**: "We deployed the feature" not "The feature was deployed"
- **Contractions**: use naturally (don't, won't, it's)
- **Sentence fragments** for emphasis. Like this.

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

1. **Opening**: hook immediately — relatable problem, observation, or question
2. **Context**: why this matters, your experience with it
3. **Main argument**: thesis with examples, lists, evidence
4. **Counterpoints**: acknowledge alternative perspectives
5. **Practical advice**: concrete, actionable recommendations
6. **Conclusion**: memorable takeaway; connect back to the opening

Use footnotes for asides, definitions, and tangential context that would break the flow.

## SEO

- **Title**: 50–60 characters, keyword-rich, no Markdown formatting
- **Description**: any length, but optimize the first 150 characters after stripping Markdown. Keep Markdown links in the content — never remove them to hit a length target. Rewrite the plain text instead.
- **Headings**: H2 for main sections, H3 for subsections, never skip levels
- **Internal links**: use descriptive anchor text; link to related posts generously

Key concepts to reference and link to when relevant:
- "showing your work" — transparent decision-making
- "communications debt" — like technical debt but for documentation
- "caremad" — passionate about something enough to do something about it
- [Leaders show their work](https://ben.balter.com/2022/02/16/leaders-show-their-work/)
- [Rules of communicating at GitHub](https://ben.balter.com/2014/11/06/rules-of-communicating-at-github/)
- [Why async](https://ben.balter.com/2022/03/17/why-async/)

## File Naming

`YYYY-MM-DD-title-with-hyphens.md` (or `.mdx` for posts with Astro components)

## Linting

```bash
remark src/content/posts/my-post.md -o && script/fix-lint
npm run lint-text    # textlint grammar/style check
```

Always run `script/fix-lint` after remark — remark adds excessive escaping that breaks the build.
