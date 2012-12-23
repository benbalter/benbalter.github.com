relative_time = (c) ->
  b = c.split(" ")
  c = b[1] + " " + b[2] + ", " + b[5] + " " + b[3]
  a = Date.parse(c)
  b = (if arguments_.length > 1 then arguments_[1] else new Date)
  a = parseInt((b.getTime() - a) / 1e3, 10)
  a += b.getTimezoneOffset() * 60
  (if a < 60 then "less than a minute ago" else (if a < 120 then "about a minute ago" else (if a < 3600 then parseInt(a / 60, 10).toString() + " minutes ago" else (if a < 7200 then "about an hour ago" else (if a < 86400 then "about " + parseInt(a / 3600, 10).toString() + " hours ago" else (if a < 172800 then "1 day ago" else parseInt(a / 86400, 10).toString() + " days ago"))))))
  
jQuery(document).ready ($) ->
  $.getJSON "http://api.twitter.com/1/statuses/user_timeline.json?include_rts=true&screen_name={{ site.twitter.username }}&count={{ site.twitter.count }}&callback=?", (c) ->
    b = []
    a = 0

    while a < c.length
      e = c[a].user.screen_name
      f = c[a].text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, (d) ->
        "<a href=\"" + d + "\">" + d + "</a>"
      ).replace(/\B@([_a-z0-9]+)/g, (d) ->
        d.charAt(0) + "<a href=\"http://twitter.com/" + d.substring(1) + "\">" + d.substring(1) + "</a>"
      )
      b.push "<li><span class=\"status\">" + f + "</span> <a class=\"time\" href=\"http://twitter.com/" + e + "/statuses/" + c[a].id + "\">" + relative_time(c[a].created_at) + "</a></li>"
      a++
    document.getElementById("tweets").innerHTML = b.join("")