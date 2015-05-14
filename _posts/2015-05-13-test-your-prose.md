---
title: "Prove your content"
excerpt: "There's another workflow that version-controlled, collaborative content enables: continuous integration for prose."
---

I've talked before about how we should treat [prose and data with the same respect that developers treat code](http://ben.balter.com/2013/09/16/treat-data-as-code/) and how [Jekyll forces you to do just that](http://ben.balter.com/2013/10/30/content-is-king/), but there's another workflow that version-controlled, collaborative content enables: continuous integration.

Continuous integration (CI) is the idea that for every change, whether proposed or realized, a standard battery of tests run, to confirm the change does what you intend that it does. In most developer tools, like GitHub, you get instant feedback, in the form of a green light, to let you know that that is the case, or a red light, in the even that something went awry, detailing exactly what doesn't match expectations.

When you treat content as code, you get the opportunity to co-opt best-of-breed developer workflows, and continuous integration is no exception. We've all been there. You make a simple change and end up breaking two or three other things. Links get out of date. Images move. Imagine if every time you made a change, all those things you consciously or subconsciously worried about were automatically checked. Are my links accurate? Did any of my images break? Does this darn thing actually render the way I want it to?

With CI services like like [Travis CI](https://travis-ci.org/), whether public or private, adding continuous integration to a repository of prose content, whether an entire website or a collection of HTML or Markdown files becomes trivial, especially when you use open source tools like [HTML Proofer](https://github.com/gjtorikian/html-proofer), or [Ra11y](https://github.com/benbalter/ra11y).

### Checking links and images

Let's say you have a Jekyll site, versioned on GitHub, and published on GitHub Pages, and you'd, like Travis to give your content a quick checkup, every time you make a change. First, you'll want to add the following to your site's `Gemfile`:

```ruby
group :test do
  gem 'html-proofer'
  gem 'rake'
end
```

After that, create a file called `Rakefile` in your site's root, and add the following:

```ruby
require 'html/proofer'
task :test do
  sh "bundle exec jekyll build"
  HTML::Proofer.new("./_site").run
end
```

Last, you'll want to configure Travis by adding a `.travis.yml` file with the following contents:

```yml
language: ruby
script: "rake test"
```

And head over to [travis-ci.org/profile](https://travis-ci.org/profile) to enable travis for your repository.

Now, each time you push, Travis is going to verify all sorts of things, like whether your images render and contain alt tags, whether your links are valid (including internal anchors), and whether all the javascript files you reference actually exist. You can also have it check things like whether [your page has a favicon](https://github.com/gjtorikian/html-proofer#favicon), or whether the [HTML is valid](https://github.com/gjtorikian/html-proofer#html).

You can see this in action [on this site](https://travis-ci.org/benbalter/benbalter.github.com). Each time I make a change (or someone proposes one), every link and image is checked to confirm nothing broke. You'll get something that looks like:

```
Running ["ScriptCheck", "LinkCheck", "ImageCheck"] checks on ./_site on *.html...
Checking 1187 external links...
Ran on 120 files!
HTML-Proofer finished successfully.
```

### Checking accessibility

Having accurate links and images is a great baseline (that sadly, as I've learned through my own continuous integration, many sites don't check), but what about checking the things you *can't* see? What about accesability?

In government, we call it §508. Outside the US It's often WCAG. Whatever you call it, it's the idea that your content should be available to everyone, regardless of how they access your site, and it's often one of the most overlooked aspects of web publishing.
