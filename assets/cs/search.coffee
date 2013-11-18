class GitHubSearch

  server: "https://api.github.com"
  repo: "benbalter/benbalter.github.com"
  language: "markdown"
  results: "#github-search-results"

  constructor: ->
    $("#github-search-form").submit (e) =>
      e.preventDefault()
      @getResults $("#github-search-q").val()

  getResults: (query) ->
    @query = query
    @call()

  q: ->
    "#{@query}+repo:#{@repo}+language:#{@language}"

  url: ->
    "#{@server}/search/code?q=#{@q()}"

  call: ->
    $.getJSON(@url(), @success).fail(@fail)

  success: (data) =>
    if data.total_count == 0
      @$results.append "<li>No results found</li>"
    else
      @renderResults data.items

  fail: (data) ->
    console.log data

  renderResults: (results) =>
    $.each results, (id,result) =>
      url = @resultUrl result.path
      title = @resultTitle result.path
      $(@results).append "<li><a href=\"#{url}\">#{title}</a></li>" if title? and url?

  resultUrl: (path) ->
    @getResult(path).url if @getResult(path)?

  resultTitle: (path) ->
    @getResult(path).title if @getResult(path)?

  getResult: (path) ->
    window.github_results_index[path]

$ ->
  new GitHubSearch
