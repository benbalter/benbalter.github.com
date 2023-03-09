---
title: Intro to GitHub for non-technical roles
description: GitHub isn't just for software developers. If you're in a non-technical role, you can use GitHub to follow along, collaborate with your team, track your work, and share information. This brief guide includes everything you need to know to get started confidently with GitHub.
---

## What is GitHub?

If you're not a software developer, you can think of GitHub like Dropbox, Google Drive, or SharePoint, but for software development. It's primarily used by software developers to collaborate on software and track their progress, but can be used by anyone involved in the software development process.

## Repositories

Repositories are the most basic unit of GitHub. Each repository represents a real-world project, initiative, or team. Repositories contain issues, discussions, and pull requests (more on that in a moment), as well as "code", which for non-technical roles, is often text files in the form of Markdown (more on that too).

## Markdown

Markdown is how text is formatted on GitHub. If you wanted to format text in a text box that didn't support formatting, you might use `*`s to represent bullets, or wrap a word in `_` to emphasize it. That's Markdown. Markdown is plain text, with optional lightweight formatting that GitHub can render. It sounds like "coding", but you'll get the hang of it in no time. To get started, check out [the official GitHub docs](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax).

## Issues

Issues are how work is tracked on GitHub. You can think of them as "To Do" items (or "tickets" in some contexts). Issues describe the _problems_ you or your team want to solve, with the list of potential problems being referred to as team's "issue backlog". You can comment on issues, like you would a blog post, assign them to people, and close them when they have been completed. Issues can also be labeled for ease of discoverability and for tracking additional metadata.

## Discussions

Discussions are like issues, but don't have a specific outcome or sense of state (open or closed). You can use discussions to ask questions, collaborate on ideas, and share announcements. You can think of discussions like blog posts, an online forum, or a chat room for your repository.

## Pull requests

Pull requests are how you propose changes to a repository. If issues describe the problems, pull requests describe the proposed _solutions_. Others can also review your proposed changes and comment on, make suggested changes to, or "approve" your pull request. Pull requests modify files within the repository. Once approved, your pull requested is "merged" into the repository and your proposed changes are "live".

## Markdown files

Repositories contain files. These files can be anything, but are often text files in the form of Markdown. You can edit these files directly on GitHub, or you can clone the repository to your computer and edit them there (more on that below). You can also upload files directly to GitHub by dragging-and-dropping them. Generally file names are lower case and use hyphens instead of spaces. Files, as Markdown is generally how long-lived information is shared and stored (documentation, policy, procedures, etc.).

## Tracking changes

At the core of GitHub is a version control system called Git. Git tracks changes to files over time. You can think of it like tracked changes in Google Docs or Microsoft Word (or if you're into Sci Fi, a time machine for your files). You can see who made changes, when they were made, and what the changes were. You can also "roll back" changes to a previous version of a file.

## Commits

Git tracks changes as "commits". A commit is a snapshot of the file (or files) at a point in time. Each commit should have a brief, descriptive message describing the changes from the previous version, to help you and your colleagues understand what's going on.

## Branches

Branches are like parallel universes or alternate timelines for your files. You can make changes to a branch without affecting files on the "main" branch. Branches contain one or more commits, and when you're ready, you can merge your changes (commits) into the main branch to update the files there. You can think of branches as saving a copy of a file so that you can work on changes without affecting others' work, but in a way that makes it easier to merge any changes you make back in with the original when you're ready.

## GitHub flow

GitHub flow describes the process of making changes to a repository. The basic steps are:

1. Open an issue describing the problem you want to solve
2. Once there is agreement that the problem should be solved, decide on the best solution
3. Create a branch to work on the solution
4. Make changes to files on the branch
5. Commit those changes
6. Open a pull request "requesting" that those changes be merged back into the "main" branch
7. Your colleagues review your pull request and either approve them or suggest changes
8. Once approved, your pull request is "merged" and your changes are now "live" on the main branch

## Notifications

GitHub sends notifications to you when someone mentions you in a comment, assigns you to an issue, or requests your review on a pull request. You can also (and often should) "subscribe" to repositories to be notified about some or all activity. Likewise, you can unsubscribe from individual issues if you're not interested. By default you'll receive notifications via email, but you can also configure GitHub to use "web notifications", or even set up notifications in your Slack or Teams channel.

## @mentions

One of the most powerful GitHub features is @mentions. You can tag anyone into an issue or pull request by typing `@` followed by their GitHub login. They'll receive a notification and can respond. You can also use @mentions to tag teams, like `@github/eng` or `@github/eng-ops`. When @mentioning users or teams, it's best to provide context in the comment so they know why they are receiving the notification.

## Cross references

Another powerful GitHub feature is issue and pull request [cross references](https://ben.balter.com/2015/11/12/why-urls/). You can reference another issue or pull request in a comment by including its number (e.g., `This is related to #123`). When cross referenced, links are created between the two issues or pull requests, making it easier for others to discover and understand the context of the conversation.

## Desktop vs. web

Almost everything you'd want to do on GitHub you can do entirely through the web interface. You can view, create, edit, or delete files, browse and comment on issues, and merge pull requests. If you'd prefer to work on your desktop using your favorite desktop software, you can install [GitHub Desktop](https://desktop.github.com). GitHub desktop provides a visual interface for "pulling" (downloading) repositories onto your computer and interacting with GitHub.

## Advanced-ish topics

### Pushing and pulling

If you're using the web interface, you don't have to worry about pushing or pulling. If you're using the desktop client, you can think of pulling (in some cases called cloning) as downloading (pulling the files from GitHub) and pushing as uploading (pushing the files back to GitHub).

### Emoji and animated GIFs

In addition to Markdown you'll often see emoji and animated GIFs used heavily on issues and pull requests. You can think of emoji and animated GIFs as the facial expressions and body language of GitHub. They make it easier to convey emotion in written text. I like to describe the communication style on GitHub as "professional but informal", meaning don't be afraid to use emoji and animated GIFs to make your comments more expressive (while remaining appropriate, of course).

## Project boards

If individual tasks are tracked as issues, project boards are how you track the progress of a project as a whole. Project boards are a visual representation of what issues are on deck, what issues are in progress, and what issues have been completed (todo, doing, done).

### Checks

You _may_ see one or more status checks on your pull request. Checks are automated tests that run against your proposed changes to enforce certain rules (such as formatting, spelling, or style). If a check fails, you'll need to fix the problem before your pull request can be merged. You can click "details" next to a failed check to learn more.

### When to use an issue vs. a pull request vs. a discussion vs. a markdown file vs. a project board

Project work generally flows in this order:

* Discussions - Opened-ended conversation without a specific outcome or concept of "done". This is often the ideation or brainstorming stage.
* Issues - How problems are tracked, discussed, and prioritized.
* Pull requests - How solutions/changes are proposed and reviewed. Generally pull requests should tie back to the issue/problem they are solving.
* Markdown files - How long-lived information is shared and stored (documentation, policy, procedures, etc.). Markdown files are changed via pull request.

As a project proceeds in one or more repositories, high-level project progress is tracked on one or more project boards (which visually organizes the state of multiple issues).

## Putting it all together, editing a file on the web

1. Open the repository you want to edit
2. Navigate to the file you want to edit
3. Click the pencil icon to edit the file
4. Make your changes
5. Click "Commit changes" to save your changes
6. Describe your changes in the commit message
7. Name your branch
8. Click "Propose changes" to open a pull request
9. Describe your changes in the pull request, ideally referencing the issue you're solving (e.g., `Closes #123`)
10. Your colleagues review your pull request and either approve them or suggest changes
11. Once approved and checks pass, your pull request is "merged" and your changes are now "live" on the main branch
12. Celebrate your first contribution to GitHub!

### Glossary

If you come across a term or concept not covered here, be sure to check out [the official GitHub glossary](https://docs.github.com/en/get-started/quickstart/github-glossary).

Happy GitHubbing! 🎉

{% include_cached github-culture.html %}
