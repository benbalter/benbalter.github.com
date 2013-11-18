class GitHubSearch

  server: "https://api.github.com"
  repo: "benbalter/benbalter.github.com"
  language: "markdown"
  results: "#github-search-results"

  constructor: ->
    $("#github-search-form").submit (e) =>
      e.preventDefault()
      @getResults $("#github-search-q").val()

    if location.hash.length
      q = location.hash.split('#')[1]
      $("#github-search-q").val q
      $("#github-search-form").submit()

  getResults: (query) ->
    @query = location.hash = query
    $(@results).empty()
    @call()

  q: ->
    "#{@query}+repo:#{@repo}+language:#{@language}"

  url: ->
    "#{@server}/search/code?q=#{@q()}"

  call: =>
    $.ajax @url(),
      success: @success
      headers:
        accept: "application/vnd.github.v3.text-match+json"
      fail: @fail

  success: (data) =>
    if data.total_count == 0
      @$results.append "<li>No results found</li>"
    else
      @renderResults data.items

  fail: (data) ->
    console.log data

  renderResults: (results) =>
    $.each results, (id, result) =>
      formatted = @formatResult(result)
      $(@results).append formatted if formatted?

  formatResult: (result) ->
    url = @resultUrl result.path
    title = @resultTitle result.path
    return unless url? and title?
    output = "<li><a href=\"#{url}\">#{title}</a>"

    $.each result.text_matches, (id, result) =>
      fragment = result.fragment
      $.each result.matches, (id, match) =>
        result = @highlight fragment, match.indices[0], match.indices[1]
        output = output + "<pre>#{result}</pre>"

    output = output + "</li>"

  resultUrl: (path) ->
    @getResult(path).url if @getResult(path)?

  resultTitle: (path) ->
    @getResult(path).title if @getResult(path)?

  getResult: (path) ->
    window.github_results_index[path]

  highlight: (string, start, end) ->
    output = string.substr(0, start) + "<span class=\"result\">" + string.substr(start)
    output + string.substr(0, end) + "</span>" + string.substr(end)

$ ->
  new GitHubSearch
