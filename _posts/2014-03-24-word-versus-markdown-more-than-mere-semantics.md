---
title: "Word versus Markdown: more than mere semantics"
layout: post
comments: true
excerpt: ""
---

Our default content publishing workflow is terribly broken. [We've all been trained to make paper](http://ben.balter.com/2012/10/19/we-ve-been-trained-to-make-paper/), yet today, content authored once is more commonly consumed in multiple formats, and rarely, if ever, does it embody physical form. Our go-to workflow remains relatively unchanged since it was conceived in the early 80s.

[![Screenshot of Microsoft Word 1.0](/wp-content/uploads/2014/word1.png){: .alignright style="width: 300px;"}](http://blogs.msdn.com/b/jensenh/archive/2005/10/03/476412.aspx)

I'm asked fairly regularly by government employees — knowledge workers who fire up a desktop word processor as the first step in any project — for an automated pipeline to convert Microsoft Word documents to [Markdown](http://guides.github.com/overviews/mastering-markdown/), the lingua franca of the internet, but it's not that simple.

[The internet is a fundamentally different animal than desktop](http://localhost:4000/2013/07/02/a-brief-history-of-the-internet/). You can't simply take a desktop format and put it online. Any technologist knows that posting a Word document or PDF online is [a poor user experience](http://ben.balter.com/2013/11/21/thats-not-how-the-internet-works/).

### Separating content from presentation



### Exposing author intent



Results of converting a [sample Word Document](https://github.com/benbalter/word-to-markdown/blob/master/test/fixtures/small-medium-large.docx?raw=true):

{: .table .table-striped style="width: 50%; margin-left: auto; margin-right: auto;"}
| Format   | Size        |   %   |
| -------- | ----------- | ----- |
| Word     | 33621 bytes | 100%  |
| HTML     | 1359 bytes  | 4.04% |
| Markdown | 80 bytes    | 0.24% |

That means that less than one quarter of one percent of the Word document is actually dedicated to storing content.

Take a look at how markdown represents an unordered list, for example:

~~~ markdown
* One
* Two
* Three
~~~

Now here's how Microsoft Word conveys the same exact information:

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

There's two things you'll notice there. First, the markup isn't semantic, meaning the presentation information is inextricably linked to the content, rending the authors intent indecernable. Second, there's a lot of proprietary metadata in there (everything that begins `mso`), useful only for parsing within Microsoft Word.
