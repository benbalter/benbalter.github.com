---
title: 'Explain like I''m five: Jekyll collections'
description: "Jekyll collections extend posts and pages to support non-dated but related content, like team members, products, or recipes."
tldr: "Jekyll collections extend the post and page model to support content that isn't dated but shares a relationship with other content, like team members, product listings, or recipes."
---

Collections are Jekyll's most powerful and simultaneously least understood feature. If you're not familiar with [Jekyll](http://jekyllrb.com/), Jekyll is a static site generator. Think of it like a content management system (CMS), [without all the complexity](https://web.archive.org/web/20150219154320/http://developmentseed.org/blog/2012/07/27/build-cms-free-websites/) and headache. No need to build a giant content-strangling Rube Goldberg machine to "manage" content, if all you're ultimately doing is putting out HTML, JavaScript, and CSS, the building blocks of the internet. As a result, Jekyll gets out of your way and [allows you to concentrate on what truly matters](/2012/10/01/welcome-to-the-post-cms-world/): your content.

## Posts and pages

Most Jekyll sites are organized around two types of content, posts and pages.

- **[Posts](http://jekyllrb.com/docs/posts/)** are organized reverse chronologically. You might use them for blog posts on a personal blog, or articles on a news site. You can recognize a post by its filename. Posts live in the `_posts` folder, and are always named in the form of `YYYY-MM-DD-post-title.md`. Because posts are dated, they're traditionally not updated regularly once published.

- **[Pages](http://jekyllrb.com/docs/pages/)** are documents that don't have a relationship with one another. They can live anywhere within the site's source directory and don't have a set naming pattern. If you have a personal blog, you might have an `index.html` page ([the site's main page which is used to list posts](/)), or [an about me page](/about/), to name two examples. Because pages aren't date specific, pages are often updated over time to maintain accuracy.

The problem is, not everything you might want to publish using Jekyll falls cleanly into those two categories of content. As I noted in [the original pitch](https://github.com/jekyll/jekyll/issues/1941), "If people are using blog posts for a non-blog post thing, Jekyll has already failed". That's where Jekyll's [collections](http://jekyllrb.com/docs/collections/) come in.

## Everything that's not a post or a page can be represented as a collection

Collections add another possibility beyond posts and pages. They bring Jekyll's zen-like simplicity to all sorts of items that aren't dated (as posts are) but have a set relationship with one another (hence the name, "collection"). If you're familiar with traditional CMSs, you can think of collections like [WordPress custom post types](http://codex.wordpress.org/Post_Types) or [Drupal custom content types](https://www.drupal.org/node/774728), except you don't need to program a specific class or learn any server languages, and the syntax used to specify them is easy to read.

What then, might you use collections for? Let's say you're making a site for a bakery and want to list the different cupcake varieties you sell. You might use a collection called "cupcakes". You'd create a `_cupcakes` folder, and would add `chocolate.md` or `vanilla.md` to it. And just like posts or pages, your list of cupcakes would be accessible as `site.cupcakes`.

You wouldn't want to use posts here, because cupcakes aren't chronological, and likely wouldn't want to just use a page here, because it's a notably different animal than a document that lists your location and hours. Each cupcake in the cupcakes collection is related to one another in the sense that they're all cupcakes.

## Collections in practice

But what if one day you decided to expand your offerings and sell cookies in addition to cupcakes? Introduce a "cookies" collection, adding `chocolate-chip.md` and `peanut-butter.md` to a `_cookies` directory, exposing the cookies as `site.cookies`. You'll notice the collections concept start to show its value here. Pages wouldn't make sense here, because you'd want to be able to list cupcakes and cookies separately, and besides both being baked goods, the one cookie doesn't really share a relationship with a cupcake, at least not in the same sense that cookies share with one another.

At this stage, you could choose to have a more generic collection `products`, which you could develop liquid layouts for, so that you and other developers could get the basic functionality needed to display all products, with specific includes for `cupcakes` and `cookies`.

Abstractly, because they're not outputted by default, you can think of collections somewhat like [Jekyll's `_data` folder support](http://jekyllrb.com/docs/datafiles/), but with the potential to generate content, and be placed into their own specific part of your Jekyll site, so a lot more robust. Like `_data` files, they can support arbitrary key/values through frontmatter, but they also support a full content body (like posts and pages), and can be broken out into separate files. If I wanted to break out my bakery's hours, I might have a `_data/hours.yml` file that looked something like this:

```yaml
monday: 9-5
tuesday: 9-5
wednesday: 9-5
thursday: 9-5
friday: 9-3
```

That makes sense, because my bakery's hours are a relatively small dataset. But trying to represent all my baked goods in that format (or worse posts), would quickly get out of hand. That type of information is better represented as individual Markdown files with front matter than as one giant YAML file that will quickly become unwieldy. Instead of creating the data plus pages (or a plugin) to display it, the site owner can use collections and focus on the content.

For a more concrete example, take a look at [the source](https://github.com/github/choosealicense.com) for [choosealicense.com](https://choosealicense.com), a site that helps explain open source licenses like the MIT or GPL license. There are pages like "about" and "terms of service", but the actual licenses live in [a licenses collection](https://github.com/github/choosealicense.com/tree/gh-pages/_licenses) and are displayed via [a licenses page](https://github.com/github/choosealicense.com/blob/gh-pages/licenses.html).

### Other use-cases

You can also output each document as its own page (more on that below) or filter collections with Liquid's `where` filter.

## Using collections

The examples above were a slight simplification. There's one other step. Before you can use a collection, you need to tell Jekyll about it. Going back to our bakery example above, I might have a `_config.yml` file that looks something like this:

```yaml
collections:
  - cupcakes
  - cookies
```

This tells Jekyll to look in the `_cupcakes` and `_cookies` folders for documents, and to read them into the appropriate collection, including [YAML front matter](http://jekyllrb.com/docs/frontmatter/), just as it would posts (but again, without the date, because collection documents aren't date specific).

By default, collections are read in (and exposed as `site.[collection]`, an alias per-collection), but not included in the final site; at least not individually like you might expect posts or pages to. If you wanted a page for each type of cupcake, you'd have to modify the `_config.yml` a bit:

```yaml
collections:
  cupcakes:
    output: true
    permalink: /cupcakes/:path/
```

That way, `_cupcakes/chocolate.md` is outputted as `cupcakes/chocolate/index.html` when the site is built and would be accessible as `example.com/cupcakes/chocolate/`. The other advantage is that, because the data is now structured and machine readable (rather than in plain text), you could also use the `jsonify` filter to output that same information as an API for use elsewhere.

## When to use a post, a page, or a collection

I like to think the decision looks roughly like this:

```console
+-------------------------------------+         +----------------+
| Can the things be logically grouped?|---No--->|    Use pages   |
+-------------------------------------+         +----------------+
                |
               Yes
                |
                V
+-------------------------------------+         +----------------+
|      Are they grouped by date?      |---No--->|Use a collection|
+-------------------------------------+         +----------------+
                |
               Yes
                |
                V
+-------------------------------------+
|            Use posts                |
+-------------------------------------+
```

So if you're not about to open a bakery (if you do, please send cookies), what might you use collections for? In short, any discrete group of "things" that can be logically grouped by a common theme (that's not their date). Here are a few examples:

- Listing employees on your company's "about" page (or a project's maintainers)
- Documenting methods in an open source project (or the projects that use it, or the plugins available)
- Organizing jobs on your résumé (or talks given, papers written)
- [Articles on a support site](https://github.com/blog/1939-how-github-uses-github-to-document-GitHub)
- Recipes on your personal blog (or restaurant reviews, or dishes on a menu)
- Students in a class (or courses being offered, or listing the faculty)
- Cheats, tips, tricks, and walkthroughs for games (by platform)
- Creating re-usable content snippets for your site such as testimonials, forms, sentences, buzzwords, or callouts
- And honestly just about anything else

If you're looking to dig in to collections, check out [the formal documentation](http://jekyllrb.com/docs/collections/) for a much more in-depth explanation.

Happy (organized and machine-readable) publishing!
