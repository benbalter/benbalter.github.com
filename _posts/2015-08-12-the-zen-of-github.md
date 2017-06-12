---
title: The Zen of GitHub
description: Whether you call it taste, culture, or zen, there are underlying assumptions that members of an organization rely on to resolve ambiguity in pursuit of the organization's mission.
---

I've got a [broadside](https://en.wikipedia.org/wiki/Broadside_(printing)) hanging in my office which reads "ZEN" in bright red, hand-typeset lettering. It's what we call *the Zen of GitHub*. It's the first words displayed each time a GitHub server spins up, and it's the philosophy that has historically underpinned most major decisions at GitHub, both technical and otherwise. @kneath published [a great write up as to the how and why](http://warpspire.com/posts/taste) that GitHub Zen came to be. Speaking to the contrast between Apple and Microsoft, he wrote:

> \[A]n organization’s taste is defined by the process and style in which they make design decisions. What features belong in our product? Which prototype feels better? Do we need more iterations, or is this good enough? Are these questions answered by tools? By a process? By a person? Those answers are the essence of taste. In other words, an organization’s taste is the way the organization makes design decisions.

Kyle uses the term "taste". In government, we often call it "culture". Whatever you call it, it's the underlying assumptions that members of an organization fall back on on as they resolve ambiguity in pursuit of the organization's mission. Should we be iterative or precise? Process driven or outcome oriented? Do we serve end users or execs? Spoken or unspoken, these assumptions will undoubtedly shape [what the entirety of your organization's outputs are optimized for](http://ben.balter.com/2015/01/27/on-stickers-and-optimizing-for-happiness/), so why not write them down?

At GitHub, we did just that:

<div class="row">
<div class="col-sm-6" markdown="1">

> * Responsive is better than fast
> * It's not fully shipped until it's fast
> * Anything added dilutes everything else
> * Practicality beats purity
> * Approachable is better than simple
> * Mind your words, they are important
> * Speak like a human
> * Half measures are as bad as nothing at all
> * Encourage flow
> * Non-blocking is better than blocking
> * Favor focus over features
> * Avoid administrative distraction
> * Design for failure
> * Keep it logically awesome

</div>
<div class="col-sm-6">
  <pre id="zen"></pre>
</div>
</div>

These aren't mere words. There's [an API endpoint to retrieve random Zen](https://api.github.com/zen){: data-proofer-ignore="true" } upon request, and heck you, can even have [Ms. Mona Lisa Octocat read the Zen herself](https://api.github.com/octocat){: data-proofer-ignore="true" }, should you ever need it. Whether you've written them down or not, whether you've discussed them or not, whether you've realized them or not, every decision members of your organization make are bound by the constraints of these (often uspoken) [first principles](https://en.wikipedia.org/wiki/First_principle).

If you haven't already, I'd encourage you to spend a cycle documenting those assumptions that drive (or constrain) your organization's efforts. You'd be surprised how much less squishy culture becomes when culture has a URL.

<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>

<script>
$(function() {
  return $.get("https://api.github.com/octocat", function(data) {
    return $("#zen").html(data);
  });
});
</script>
