---
title: Encourage proper voice, tone, and style by adding automated tests to your corporate blog
excerpt: A look at how GitHub uses automated testing (CI) to empower developers to write less-corporate blog posts.
---

I've written in the past about how you should treat [prose with the same respect that developers treat code](http://ben.balter.com/2013/09/16/treat-data-as-code/) and how [collaborative content allows you to bring the concept of continuous integration to your writing](http://ben.balter.com/2015/05/22/test-your-prose/). Having reviewed just about every blog post to grace the GitHub blog over the past few years, I'd like to show a bit of how we leverage automated testing at GitHub to empower developers to write [less-corporate blog posts](http://ben.balter.com/2015/07/20/write-corporate-blog-posts-as-a-human/).

Take this marketing speak as an example of a proposed blog post:

> Today, after months of effort, we're excited to announce our new wiz-bang feature...

There's a few, machine-detectable improvements we can easily call out without any human intervention.

### Don't use the word today

The first issue I'd call out if I were reviewing the post is that [it starts with the word "today"](http://ben.balter.com/2015/07/20/write-corporate-blog-posts-as-a-human/#dont-use-the-word-today).

> In practicality, when launching something new, the word "today" often takes the place of more valuable information, like how to actually use the darn thing. When you leave out "today", you're forced to actually describe what's changed.

Testing for this is relatively straightforward. You could use a test suite from just about any language, but since GitHub is primarily a Ruby shop, let's use Minitest as an example (with some plumbing left out for simplicity):

{% highlight ruby %}
class TodayTest < Blog::Test   
  def test_doesnt_start_with_today     
    msg = "Don't start posts with the word \"today\". See http://bit.ly/no-today.\n"
    each_line_of_prose do |file, line, text|       
      refute text =~ /^today/i, "#{msg} on line #{line} of #{file}"
    end   
  end
end
{% endhighlight %}

With that, you could wire up a service like [Travis CI](https://travisci.org) to fire on each commit, and provide the author with immediate feedback and a link to the appropriate internal documentation, all without requiring blocking human intervention.

### Don't tell users how excited you are

The next thing I'd notice if I were reviewing the post is that it focuses on the developer's excitement, not the users'.

> Your users don’t care how excited you are. They don’t care about how much effort you put in. They don’t care how hard it was to do. All they care about is one thing: how does it benefit me?

With a little regex, testing for "We're excited to announced..." type phrases is equally straightforward:

{% highlight ruby %}
class ExcitedTest < Blog::Test
  def test_dont_brag_about_being_excited
    msg =  "Don't tell users how excited we are. "
    msg << "Show them why *they* should be excited. "
    msg << "See https://bit.ly/you-vs-we."

    regex = /\bWe're( \w+)?(, \w+)? (excited|happy|pleased)\b/i

    posts.each do |filename|
      post = File.open(filename).read
      refute regex.match(post), msg
    end
  end
end
{% endhighlight %}

### Write for users, not for yourself

The last thing I'd notice is that the post is [written for the company, not for its users](http://ben.balter.com/2015/07/20/write-corporate-blog-posts-as-a-human/#write-for-users-not-for-yourself).

> Instead of telling your users... how much work it was for you to implement the new thing (written from your perspective), tell the user why your work matters to someone using your product (written from the user’s perspective). A simple rule of thumb is that there should be more use of the word “you” than of “we”.

That "simple rule of thumb" can be automated. While not as foolproof as a traditional unit test for code, we can count the "you"s in the post and the "we"s in the post, and suggest to the author that they should should rework things a bit:

{% highlight ruby %}
class YouWeTest < Blog::Test
  def test_more_you_than_we
    msg = 'The post should contain more "yous"s than "we"s. See https://bit.ly/you-vs-we.'
    posts.each do |filename|
      post = File.open(filename).read
      yous = post.scan(/\byou\b/i).count
      wes  = post.scan(/\bwe\b/i).count
      assert yous > wes, msg
    end
  end
end
{% endhighlight %}
