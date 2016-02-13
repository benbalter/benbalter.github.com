---
title: How GitHub uses automated testing to empower developers to write less-corporate blog posts
description: 'Encourage proper voice, tone, and style by adding automated tests to your corporate blog.'
---

I've written in the past about how you should treat [prose with the same respect that developers treat code](http://ben.balter.com/2013/09/16/treat-data-as-code/), how [collaborative content allows you to bring the concept of continuous integration to your organization's writing](http://ben.balter.com/2015/05/22/test-your-prose/), and my colleague Zach Holman's got [a great write up about how GitHub embraces those concepts in its own writing](http://zachholman.com/posts/how-github-writes-blog-posts/). Today I'd like to show a bit of how we leverage automated testing at GitHub to empower developers to write [less-corporate blog posts](http://ben.balter.com/2015/07/20/write-corporate-blog-posts-as-a-human/) (and how you can too!). Take this marketing speak as an example of a blog post a developer might propose:

> Today, after months of effort, we're excited to announce our new wiz-bang feature...

Whereas traditionally a member of your company's marketing, copy, or editorial team may have needed to take the time to manually review the post before the author could get any feedback (a blocking and time-consuming operation), there are many machine-detectable improvements that an automated process could easily call out without requiring delay or human intervention, unblocking both the author and the editor to continue working unfettered. Let's take a look at a few examples of this idea and how you might implement them for your own team:

### Don't use the word today

If I were reviewing the post, the first issue I'd call out is that [it starts with the word "today"](http://ben.balter.com/2015/07/20/write-corporate-blog-posts-as-a-human/#dont-use-the-word-today).

> In practicality, when launching something new, the word "today" often takes the place of more valuable information, like how to actually use the darn thing. When you leave out "today", you're forced to actually describe what's changed.

Sure it takes 10 seconds for a human to see if a post begins with "today", but multiply that by hundreds of proposed posts each year, and you've engineered a process with a sizable human capital commitment, one that could be more efficiently outsourced to a machine.

Testing for use of the word "today" is relatively straightforward. You could use a test suite from just about any language, but since GitHub is primarily a Ruby shop, let's use Minitest as an example (with some plumbing left out for simplicity):

```ruby
class TodayTest &lt; Blog::Test
  def test_doesnt_start_with_today
    msg = "Don't start posts with the word \\"today\\". See <http://bit.ly/no-today.\n>"
    each_line_of_prose do |file, line, text|
      refute text =~ /^today/i, "#{msg} on line #{line} of #{file}"
    end
  end
end
```

With that, you could wire up a service like [Travis CI](https://travisci.org){: data-proofer-ignore="true" } to fire on each commit, and provide the author with immediate feedback and a link to the appropriate internal documentation, all without requiring blocking human intervention. Not to mention, that editor is now free to move to less-remedial, higher-value work like curating an editorial calendar or refining the voice guidelines themselves.

### Don't tell users how excited you are

The next thing I'd notice if I were reviewing the post is that it focuses on the developer's excitement, not why the user should be excited.

> Your users don’t care how excited you are. They don’t care about how much effort you put in. They don’t care how hard it was to do. All they care about is one thing: how does it benefit me?

With a little regex, testing for "We're excited to announced..."-type phrases is equally straightforward:

```ruby
class ExcitedTest &lt; Blog::Test
  def test_dont_brag_about_being_excited
    msg =  "Don't tell users how excited we are. "
    msg &lt;&lt; "Show them why *they* should be excited. "
    msg &lt;&lt; "See <https://bit.ly/you-vs-we.>"

    regex = /\bWe're( \w+)?(, \w+)? (excited|happy|pleased)\b/i

    posts.each do |filename|
      post = File.open(filename).read
      refute regex.match(post), msg
    end

  end
end
```

### Write for users, not for yourself

The last thing I'd notice from our example post is that the post is [written for the company, not for its users](http://ben.balter.com/2015/07/20/write-corporate-blog-posts-as-a-human/#write-for-users-not-for-yourself).

> Instead of telling your users... how much work it was for you to implement the new thing (written from your perspective), tell the user why your work matters to someone using your product (written from the user’s perspective). A simple rule of thumb is that there should be more use of the word “you” than of “we”.

Once again, that "simple rule of thumb" can be automated. While not as foolproof as a traditional software unit test where inputs and outputs are controlled, we can count the "you"s in the post and the "we"s in the post, and suggest to the author that perhaps they should should rework things a bit:

```ruby
class YouWeTest &lt; Blog::Test
  def test_more_you_than_we
    msg = 'The post should contain more "yous"s than "we"s. See <https://bit.ly/you-vs-we.>'
    posts.each do |filename|
      post = File.open(filename).read
      yous = post.scan(/\\byou\\b/i).count
      wes  = post.scan(/\\bwe\\b/i).count
      assert yous > wes, msg
    end
  end
end
```

### Not all automated testing is created equal

At GitHub we use automated testing (CI) on just about every repository, code or othwerise, but tests against our blog posts are different in two distinct ways:

First, unlike software tests where [pull requests are not mergable unless the build passes](https://github.com/blog/2051-protected-branches-and-required-status-checks), when working with prose, failing tests are considered suggestions, not requirements, suggestions that the post author is free to ignore along with the advice of the blog team. As [Zach Holman wrote](http://zachholman.com/posts/how-github-writes-blog-posts/):

> Think of this process like a syntax linter for your words: breaking the build isn't necessarily bad, per se, but it might give you suggestions you might want to incorporate. It gives you immediate feedback without requiring a lot of additional overhead by our blog editors.

Second, also unlike software tests, which run the test suite against the entire software project, blog posts are not necessarily interrelated, nor do we need to enforce style retroactively across all files. As a result, blog tests are only run on those posts which the pull requests changes (e.g., the proposed post). If you're using Git, you can get a list of changed files with the `git diff` command. If we were to pipe it into the helper method implied above, you'd get something like:

```ruby
def posts
  `git diff -z --name-only --diff-filter=ACMRTUXB origin/master _posts/*`.split("\\0")
end
```

### The smart way and the hard way

When engineering workflows, for any given problem there is often two solutions: a heavy-weight, human-driven process, and a light-weight, machine-driven tool. Both workflows produce significantly similar outcomes, but one requires significantly less upkeep and time.

While changing organizational culture and unlearning the corporate speak anti-patterns that surround us may seem like a daunting task, by leveraging concepts that have been proven in the open source worlds for decades, you can empower your organization's humans to be more, well, human.

*Have a favorite test you use in your own writing? Drop it in the comments below.*
