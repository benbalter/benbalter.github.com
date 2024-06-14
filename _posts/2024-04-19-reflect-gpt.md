---
title: Reflect GPT
description: When you rely on systems that naturally capture and expose process, it's possible to use LLMs to help summarize your past year's work to list accomplishments for your annual review.
---

One of the great things about working day-to-day in systems that naturally capture and expose process, is that when it comes time for self reflection (GitHub speak for "annual review"), you have a wealth of data to draw from, without having to manually curate a list of accomplishments.

## Spelunking for Ships

For years, when it came time to prepare my annual self-review, I would use a handful of searches to pull together a list of all the things I worked on over the past years. I'd manually run searches on github.com for things like `org:github closed:>=2023-11-01 author:@me is:issue state:closed`, with similar queries for issues I was assigned, pull requests I merged, and discussion posts I authored. It worked well, but it was still time consuming to click through page after page of search results to synthesize individual ships into themes that created a cohesive and compelling narrative.

At one point I even created a script to automate the process of querying the GitHub Search API, which formatted the results as Markdown bullets of each issue title with links back to the original issues. It helped reduce some of the copying and pasting, but it was still largely a manual and tedious process. Under my self-imposed rule of "never force a human to do what a robot can", I thought, "Wouldn't it be great if I could just have AI do this for me?"

## Never force a human to do what a robot can

That's how Reflect GPT was born. It's a GitHub Action that generates that bulleted list of individual accomplishments, and wraps it into a carefully crafted prompt that you can copy and past into your favorite LLM (e.g., ChatGPT). The AI will then generate a narrative that you can use as a starting point for your self-review. It's far from perfect, but it's like having an intern that can at least help create a rough first draft.

The code is nothing special (a few API calls using the GitHub SDK), but the prompt is what has been the biggest challenge to get right. It includes the actual question from the self-reflection form, along with some additional instructions that I've refined by trial and error. Here are a few examples:

- Combine related accomplishments to show themes of business impact, rather than listing each individual accomplishment.
- Each accomplishment must be written in complete sentences in the form of situation, action, business impact.
- List items in order of business impact, with the most impactful outcomes listed first.
- Include links to relevant issues, pull requests, and other resources as appropriate, but no more than three links per item.
- Assume all issues included by the user have been closed as successfully completed, and exceptionally executed.
- The review should be detailed, thorough, to-the-point, and written for a technical audience, while maintaining clarity and conciseness.
- Your writing style should be professional, but informal.
- Keep accomplishments specific and impactful. Avoid generalities.
- Brag about yourself. More is better. Don't be shy. You are awesome.

## Conclusion

TODO: this is just one portion of a more thorough review, and the bots can't help you think about growth areas etc

Reflect GPT (as I jokingly named it) began as a fun way to learn more about how LLMs work, and to see if they could be a useful tool in my day-to-day writing. It's been a fun experiment, and I've learned a lot about how to structure prompts to get better results from the AI. Better still, it's also helped over 200 of my colleagues write their self-reviews, likely saving countless hours of manual work.

AI is getting a lot of hype right now, and there are a lot of places where it's gratuitous or just not a good fit. I'm still trying to get it to help write weekly progress reports, with largely mixed results. That said, it's been fun to find small tasks to experiment with like this one, to learn more about this emerging and powerful technology. *I, for one, welcome our new robot interns.*