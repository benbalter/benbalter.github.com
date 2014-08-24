---
title: "Word versus Markdown: more than mere semantics"
layout: post
comments: true
excerpt: "How we consume content has changed dramatically, over the past 30 years, yet, how we author content remains relatively unchanged. Markdown forces you to write for the web."
---

Our default content publishing workflow is terribly broken. [We've all been trained to make paper](http://ben.balter.com/2012/10/19/we-ve-been-trained-to-make-paper/), yet today, content authored once is more commonly consumed in multiple formats, and rarely, if ever, does it embody physical form. Put another way, our go-to content authoring workflow remains relatively unchanged since it was conceived in the early 80s.

[![Screenshot of Microsoft Word 1.0](/wp-content/uploads/2014/word1.png){: .alignright style="width: 300px;"}](http://blogs.msdn.com/b/jensenh/archive/2005/10/03/476412.aspx)

I'm asked regularly by government employees — knowledge workers who fire up a desktop word processor as the first step to any project — for an automated pipeline to convert Microsoft Word documents to [Markdown](http://guides.github.com/overviews/mastering-markdown/), the *lingua franca* of the internet, but as my recent foray into building [just such a converter](http://word-to-markdown.herokuapp.com/) proves, it's not that simple.

Markdown isn't just an alternative format. Markdown forces you to write for the web.

### In the beginning, there was paper

The first desktop word processors had a simple task: they were designed to make paper. We didn't have email or a vibrant internet sharing digital documents to worry about. The creators of the first desktop word processors simply mirrored the dominant workflow of the time: the typewriter. The final output — the sole embodiment — was physical, and all that mattered was what the document looked like.

Over the past three decades, however, how we consume content has changed dramatically, yet, how we author content remains relatively unchanged. Put another way, [the internet is a fundamentally different animal than the  desktop](http://ben.balter.com/2013/07/02/a-brief-history-of-the-internet/). You [can't simply take a desktop format and put it online](http://ben.balter.com/2013/11/21/thats-not-how-the-internet-works/), and "[converting](http://word-to-markdown.herokuapp.com/)" a document to Markdown doesn't do much to solve that.

### Separating content from presentation

Desktop formats are a shallow format — all they care about are looks. Desktop publishing software inextricably marries content and presentation. The information you input can only be consumed in one form, and that one form is defined by the medium, in most cases, paper, or more recently, their digital analog, faux margins and all.

When you blindly optimize for one thing — appearances — behind the scenes there's a lot that goes unattended and it becomes increasingly complex to perform even the most simple of tasks. Extracting your content becomes tantamount to finding a needle in a purpose-built, legacy haystack.

Put another way, in taking a look at this [sample Word Document](https://github.com/benbalter/word-to-markdown/blob/master/test/fixtures/small-medium-large.docx?raw=true), given the same content represented identically in various formats, as little as less than one quarter of one percent of the file is actually dedicated to storing content:

{: .table .table-striped style="width: 50%; margin-left: auto; margin-right: auto;"}
| Format   | Size        |   %   |
| -------- | ----------- | ----- |
| Word     | 33621 bytes | 100%  |
| HTML     | 1359 bytes  | 4.04% |
| Markdown | 80 bytes    | 0.24% |

### Exposing author intent

Once content and presentation are decoupled, content written for the web exposes author intent through semantic markup — markup which describes the relationship between elements, not simply their visual representation. It's not simply that a given line is bold or a larger font size, but memorialized in the document itself is that that given line is a heading, a heading which describes the content that follows.

Take a look at how markdown represents an unordered list, for example:

~~~ markdown
* One
* Two
* Three
~~~

Simplicity aside, the markup represents a grouping with three elements. We, as humans, can tell that those are three parts of a set, and a computer can as well. Now here's how Microsoft Word conveys the same exact information, at least when exported as HTML:

{% highlight html %}
<p class=MsoListParagraphCxSpFirst style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span
style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>�<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]>One</p>

<p class=MsoListParagraphCxSpMiddle style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span
style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>�<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]>Two</p>

<p class=MsoListParagraphCxSpLast style='text-indent:-.25in;mso-list:l0 level1 lfo1'><![if !supportLists]><span
style='font-family:Symbol;mso-fareast-font-family:Symbol;mso-bidi-font-family:
Symbol'><span style='mso-list:Ignore'>�<span style='font:7.0pt "Times New Roman"'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
</span></span></span><![endif]>Three</p>
{% endhighlight %}

There's two things you'll notice there. First, the markup isn't semantic, meaning the presentation information is intermingled with the content, rendering the author's intent indiscernible and using the content in any other context an increasingly difficult goal.

Second, there's a lot of proprietary metadata in there (everything that's orange or red), useful only for parsing within Microsoft Word. Again, rendering the content as alien anywhere other than its original context, paper.

### Jailbreaking content

There's a reason that content authored on the desktop is most commonly shared online as a PDF — a format designed to mimic the properties of paper as closely as possible. Once the content's in a paper-based format, it's stuck there forever.

If there's one thing I've learned trying to [convert Word documents to Markdown](http://word-to-markdown.herokuapp.com/), it's that Markdown is not an alternative to traditional desktop formats. It's an entirely different animal. It's both machine- and human-readable, but more importantly, it forces you to author content openly, semantically, and for an internet-based world.

Next time you begin a new project for which the internet, not paper is the primary output, think twice before firing up that desktop publishing platform. You'll gain more than mere semantics.
