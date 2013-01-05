#
#Client-side site search
#Heavily adapted, but inspired by:
#    - http://forrst.com/posts/Static_site_e_g_Jekyll_search_with_JQuery-zL9, and
#	- http://developmentseed.org/blog/2011/09/09/jekyll-github-pages/
#
jQuery(document).ready ($) ->

  # Main filtering logic
  findEntries = (q) ->
    matches = []
    rq = new RegExp(q, "im")
    $.each entries.posts, (k, post) ->
      if rq.test(post.title) or rq.test(post.url) or rq.test(post.description) or rq.test(post.content) or rq.test(post.tags) or rq.test(post.category)
        matches.push
          title: post.title
          url: post.url
          date: post.date


    $("body").addClass "search"
    content = $("#content")
    content.append "<h3>Search Results</h3>"
    if matches.length > 0
      content.append "<ul class=\"search-results\">"

      #matches found
      $.each matches, (key, match) ->
        content.append "<li><a href=\"" + match.url + "\">" + match.title + "</a></li>"

      content.append "</ul>"
    else

      #no matches
      content.append "<div class=\"no-search-results\">No matches found</div>"
    content.append "<a href=\"#\" id=\"back\">Back</a>"

  # Search form submit
  $("#search_form").live "submit", (e) ->
    e.preventDefault()
    query = $("#query").val()
    window.location.hash = "q=" + escape(query.replace(/\s/g, "+"))
    false


  # Process hashchange
  $(window).bind "hashchange", (e) ->

    # called when the part of the URL after the hash (#) changes
    query = window.location.hash # e.g. "#search=text"

    #if the hash contains search
    if /[#?]{1}q=(.*)/.test(query)

      #strip search from the hash
      query = window.location.hash.replace("+", " ").replace("#q=", "")

      # in case the user browsed to the search
      $("#query").val query
      if query
        # save state!
        oldhtml = $("#content").html()  if typeof oldhtml is "undefined"
        $("#content").html "<div id=\"loader\"></div>"
        $("#query").blur().attr "disabled", true
        if typeof entries is "undefined"

          # lazily load and parse the posts JSON feed
          $.getJSON "{{ site.url }}/posts.json", (data) ->
            entries = data
            findEntries query

        else

          # search the pre-loaded data
          findEntries query

        # disable the search bar until current search is complete
        $("#query").blur().attr "disabled", false
      _gaq.push ["_trackEvent", "Search", "Search", query]
    else

      # revert to original page, hide search results
      oldhtml = $("#content").html()  if typeof oldhtml is "undefined"
      $("body").removeClass "search"
      $("#content").html oldhtml
      $("#query").blur().attr("disabled", false).val ""
      _gaq.push ["_trackEvent", "Search", "Back", query]


  # called in case user browses "into" a search
  $(window).trigger "hashchange"
