---
title: How to add an "improve this content" button to your GitHub Pages site
description: If you host your site on GitHub or GitHub Pages, an edit button (and thus encouraging collaboration around your content) is simply a matter of linking to an easily predictable URL.
---

At the bottom of this page (and every other page on the site), you'll notice a subtle plea to help improve the page's content. That edit button is no dark magic. If you host your site on GitHub or GitHub Pages, collaborative content is simply a matter of linking to an easily predictable URL.

The difference between publishing with say, WordPress, and publishing using Jekyll and GitHub Pages is more than a choice of framework or platform. When you treat content as code, when you give prose the same respect that developers have for building mission-critical software, you suddenly unlock collaborative workflows whereby content can be transparently versioned, discussed, and improved. Like any other open source project, members of the public can see each line's history, how it came to be, and propose improvements for the author to review.

If your site's content is hosted on GitHub (either with Jekyll/GitHub Pages or something like [wordpress-github-sync](https://github.com/benbalter/wordpress-github-sync)), it's easy to provide readers with a link to submit changes. You simply need to add a vanilla HTML link to the following URL (if you're using another framework, you'll need to build the URL yourself):

```html
{% raw %}https://github.com/{{ site.github.repository_nwo }}/edit/{{ site.branch }}/{{ page.path }}{% endraw %}
```

Jekyll and GitHub will automatically fill in the path to your site's repository, as well as the path to the particular page. You'll want to either hard-code `{% raw %}{{ site.branch }}{% endraw %}` to either `master` or `gh-pages`, depending on your site's setup, or add something like the following to your site's `_config.yml` file:

```yaml
branch: master
```

Putting it all together, you'd get:

```html
{% raw %}Please <a href="https://github.com/{{ site.github.repository_nwo }}/edit/{{ site.branch }}/{{ page.path }}">help improve this article</a>.{% endraw %}
```

If a user clicks the link, they'll be prompted to login or signup for a GitHub account if they haven't already, and will be provided with a web-based editor to edit the page's content. From there, they simply click the big green "propose change" buttons, which will silently submit a pull request to your site on their behalf, no Git or GitHub knowledge necessary.

Give it a try by clicking the edit button below (suggested improvements to this post welcome), and I encourage you to follow these steps to add a "help improve this content" button to your own site.
