---
title: "Hacking GitHub: 12 simple tools to help introduce open source to the uninitiated"
excerpt: "12 simple apps to introduce open source to the uninitiated, lower the barrier to entry for atypical GitHub users to get started, and to show the power of adding smart tools to the edge of an otherwise dumb platform."
---

GitHub's a great platform for collaborating on many different things. It follows the [dumb core, smart edge](http://ben.balter.com/2013/11/21/thats-not-how-the-internet-works/#dumb-core-smart-edge) architecture that makes the internet what it is today. Git doesn't care if you're versioning source code, data, or proposed legislation. But sometimes it's harder to see how these dumb, non-use-case-specific tools might fit into one's existing workflow, especially for the GitHub uninitiated.

Often, when [explaining the potential of open source to government agencies](http://ben.balter.com/2014/10/15/what-does-a-government-evangelist-do/), these points of potential friction are exposed. *"Can our lawyers use it? They're used to Microsof Word?" "I need to send this to my boss and he's never going to use GitHub, can you send it as a PDF?" "We love it, but is there any way to simplify the interface for our non-technical stakeholders?"*

Code speaks louder than words. It's almost always faster to build out the requested feature with less than a hundred lines of glue code, rather than explaining that it's possible to implement via the API. And that's exactly what I do most often.

Here's 12 simple apps that I've built to introduce open source to the uninitiated, lower the barrier to entry for atypical GitHub users to get started, and to show the power of adding smart tools to the edge of an otherwise dumb platform. If you find any of them useful, I'd love your help making them even better.

### Working with legacy formats

* [**Word to Markdown**](https://github.com/benbalter/word-to-markdown) - A Ruby gem to liberate content from the jail that is Word documents

* [**Markdown to PDF**](https://github.com/benbalter/markdown-to-pdf) - On demand generation of enterprise-grade PDFs from GitHub-hosted markdown files

### User-friendly interfaces

* [**Comment Card**](https://github.com/benbalter/comment-card) - A simple interface for non-technical users — both authenticated and pseudonymous — to provide feedback for your GitHub-hosted project

* [**Problem Child**](https://github.com/benbalter/problem_child) - Allows authenticated or anonymous users to fill out a standard web form to create GitHub issues.

* [**Redliner**](https://github.com/benbalter/redliner) - A tool for facilitating the redlining of documents by the GitHub uninitiated.

### GitHub as a data store

* [**GitHub Forms**](https://github.com/benbalter/github-forms) - A RESTful API for submitting standard HTML form data to a GitHub-hosted CSV.

* [**WordPress-GitHub Sync**](https://github.com/benbalter/wordpress-github-sync) - A WordPress plugin to sync content with a GitHub repository (or Jekyll site)

* [**Change Agent**](https://github.com/benbalter/change_agent) - A Git-backed key-value store, for tracking changes to documents and other files over time

### Authentication

* [**Jekyll Auth**](https://github.com/benbalter/jekyll-auth) - A simple way to use GitHub OAuth to serve a protected Jekyll (GitHub Pages) site to your GitHub organization

* [**Add to Org**](https://github.com/benbalter/add-to-org) - A simple Oauth App to automatically add users to an organization based on preset criteria

### Web interfaces for command-line tasks

* [**GitHub Uploader**](https://github.com/benbalter/github-uploader) - A simple app to enable drag-and-drop uploading of binary and other assets to GitHub Repositories

* [**Copy to**](https://github.com/benbalter/copy-to) - A quick-and-dirty Heroku app to simulate running `git clone`, `git remote add`, and `git push` locally.
