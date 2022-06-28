---
title: Using GitHub Pages to showcase your organization's open source efforts
description: GitHub is a great place to share your work with the world, but sometimes large organization wish to brand or showcase their open source efforts in ways that the standard profile page doesn't allow. That's where GitHub Pages comes in.
---

GitHub is a great place to share your work with the world, but sometimes large organizations prefer to brand or showcase their open source efforts in ways that the standard profile page doesn't allow. That's where [GitHub Pages](https://pages.github.com) comes in.

GitHub Pages is GitHub's static site hosting service. It's used primarily for two things: for documenting open source projects, both from a technical and marketing standpoint, and for providing a unified, fully customizable presence to showcase your efforts on GitHub. This post focuses on how to do the latter.

### Organization profile pages

Let's say you're the Consumer Financial Protection Bureau. You have a GitHub organization called @CFPB. If you navigate to [github.com/cfpb](https://github.com/cfpb) you'll see your organization's profile page. It'll have things like your organization's name, logo, location, and site, along with a list of your open source project's and a short description of each in order that they were last updated, but you generally can't tailor the look-and-feel to suit your organization's unique needs. If you want a more customized presence, you'll need to use GitHub Pages.

### How GitHub Pages works

GitHub pages is deceptively simple, but incredibly powerful service. To start using GitHub Pages, you'll want to create a new repository named `[your-organization].github.io`. In our CFPB example above, the repository would be [`cfpb/cfpb.github.io`](https://github.com/cfpb/cfpb.github.io). From there, any static files you commit (HTML, CSS, JavaScript, images, etc.) will be served as `your-organization.github.io` (or in the case of our example, [`cfpb.github.io`](http://cfpb.github.io)).

### Getting started with GitHub Pages

For a quick way to get started, and as an example, let's create a new file called `index.html` (you can do this from the `your-organization.github.io` repository by clicking the `+` sign) and add the following contents:

```html
<html>
  <head>
    <title>My awesome org</title>
  </head>

  <body>
    <h1>My awesome org</h1>
  </body>
</html>
```

Once you commit (save) the file, if you navigate to `your-org.github.io`, you should see the index file you just created, being served, just like any other site. You can add additional HTML files, CSS files, JavaScript files, images… any static files you want in this manner. The only thing GitHub Pages doesn't support are dynamic languages like PHP, Ruby, or Python. This allows you to add your organization's logo, color scheme, or any other content you'd like, including dynamic, client-side content like pulling in your organization's most recent Tweets.

### Templating with Jekyll

The true power of GitHub Pages comes from a built-in static site generator called [Jekyll](http://jekyllrb.com). If you just have a single page site with straightforward content, our index example above is likely sufficient, but if you'd like to have multiple pages, or if you'd like to support content that's a bit more dynamic, you'll likely want to leverage Jekyll to make things a bit easier to maintain.

Going back to our index example above, lets say you wanted to add a second page, "About us". You could copy and paste the index template into a second file, but if you'd like to change the header on both pages, you'd have to make the same page twice, and things can easily get out of sync.

Instead, we'll create a layout (sometimes called a template) that can be shared between both. Just like before, we'll create a new file called `_layouts/default.html` within our repository, with the following content:

```html
<html>
  <head>
    <title>My awesome org</title>
  </head>

  <body>
    {% raw %}{{ content }}{% endraw %}
  </body>
</html>
```

Notice how we swapped out the `<h1>My awesome org</h1>` for `{% raw %}{{ content }}{% endraw %}`? There's one more thing we have to do. We'll want to update the `index.html` with the following:

```html
---
layout: default
---

<h1>My awesome org</h1>
```

If you head back to `your-organization.github.io` the output should be identical. Those two changes instructed Jekyll to generate an `index.html` file by swapping the contents of `index.html` for the `{% raw %}{{ content }}{% endraw %}` line in the template and combining the two for the final output. If we want to add our "About us" page, it's as simple as creating an `about-us.html` file with this content:

```html
---
layout: default
---

<h1>About us</h1>
<p>Our awesome org is...</p>
```

### Markdown

Another big advantage of using Jekyll is the ability to work in [Markdown](https://guides.github.com/features/mastering-markdown/). Markdown is the *lingua franca* of open source. It's a way to describe the format and structure of content, without having to learn HTML. Markdown makes it easier for less-technical stakeholders to contribute directly to your site, separates content from presentation so that it can be used in multiple places or formats, and makes comparing changes between versions more natural.

Think of Markdown like how you would format a document if you were typing on a typewriter. If you wanted to format a numbered list, rather than wrapping each element in `<ul>`s and `<li>`s like you would in HTML, you simply write:

```markdown
1. item
2. item
3. item
```

The same goes for bullet points (unordered lists, in HTML):

```markdown
* item
* item
* item
```

And to create headings, you prefix the heading with a `# sign` like this:

```markdown
# Top level heading

### Sub heading

#### Sub sub heading
```

Jekyll will automatically convert Jekyll to HTML each time you push a change to your site. All you have to do is change the extension from `.html` to `.md`. In our above example, we could change our `index.html` to an `index.md` file with the following content:

```markdown
---
layout: default
---

# My awesome org
```

Again, the output should be identical. Need to include something in the page that you can't represent as Markdown? You can always use HTML within the Markdown file as well.

### Listing your organization's open source projects

GitHub Pages is great for showcasing your organization's open source efforts. Up until this point, we've created a branded web presence, but we haven't included information about our open source project's yet. You could, if you wanted, just list your open source projects. In our `index.md` file, we might add:

```html
---
layout: default
---

# My awesome org

* Project1
* Project2
* Project3
```

The problem with this approach, is that as you add more projects, you have to constantly update your GitHub Pages site. Luckily, GitHub Pages already knows a lot about your organization, including your organization's open source projects.

In addition to Markdown, Jekyll also supports a lightweight templating engine called [Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers). Liquid allows us to inject a bit of dynamic logic into the otherwise static site. If you're familiar with basic programatic concepts, it supports things like `while`, `if`, and `for` statements. To list all the open source project's in our organization's we might write:

```html{% raw %}
{% for repository in site.github.public_repositories %}
  * {{ repository.name }}
{% endfor %}
{% endraw %}
```

That should produce identical results to the hard-coded versions above, but in a way that updates as your organization's projects do. You could also include additional information in the same way, such as the project's descriptions or number of stars. You can see a full list of the organization metadata available to GitHub Pages in [this help article](https://help.github.com/articles/repository-metadata-on-github-pages/).

### Supercharging your organization's developer presence

In terms of availability and scalability, the simplicity of GitHub pages makes it extremely resilient for high-traffic sites. You can [read more about GitHub Pages architecture](http://GitHubengineering.com/rearchitecting-github-pages/), but in short, GitHub Pages is home to about three-quarters of a million sites, serves about a quarter of a million requests each minute, and completes about 20,000 builds each day. Your site is in good hands.

Your organization site is also in good company. [Lots of large organizations](https://github.com/showcases/open-source-organizations) like [Adobe](http://adobe.github.io), [Netflix](http://netflix.github.io), [SAP](http://sap.github.io), [IBM](http://ibm.github.io), and [Microsoft](http://microsoft.github.io) use GitHub Pages to showcase their open source efforts. It provides organizations with a branded developer presence to link to from their `/developer` or similar portals, instead of linking to their standard GitHub profile.

To get started, simply create an appropriately named repository within your organization and begin commuting files, or you can read more about using [GitHub Pages](https://help.github.com/categories/github-pages-basics/), [Jekyll](http://jekyllrb.com/docs/home/), and [Liquid](https://github.com/Shopify/liquid/wiki/Liquid-for-Designers). Of course, if you have any questions, you can always email <support@github.com>.
