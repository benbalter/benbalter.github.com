# Bootstrap
window.Application =
  Models: {}
  Collections: {}
  Views: {}
  router: {}
  tags: {}
  categories: {}
  url: '{{ site.url }}'
  name: '{{ site.name }}'
  disqus:
    name: '{{ site.disqus.shortname }}'
    api_key: '{{ site.disqus.api_key }}'
    count: '{{ site.disqus.count }}'
  twitter:
    count: '{{ site.twitter.count }}'
    username: '{{ site.twitter.username }}'

# Models

class Application.Models.Post extends Backbone.Model
  url: ->
    Application.url + "/" + @id + '.json'

  defaults:
    author: "Benjamin J. Balter"
    title: ""
    url: ""
    content: ""
    tags: []
    category: ""
    date: ""

class Application.Models.Page extends Backbone.Model
  url: ->
    Application.url + "/" + @id + '.json'

class Application.Models.Thread extends Backbone.Model
  url: ->
    url = 'https://disqus.com/api/3.0/threads/details.json?'
    url += 'thread=' + @id
    url += '&api_key=' + Application.disqus.api_key
    url += '&callback=?'
    url

  parse: (data) ->
    data.response

class Application.Models.Comment extends Backbone.Model

  initialize: ->
    @set 'thread', new Application.Models.Thread id: @get('thread')
    @get('thread').fetch success: =>
      @collection.trigger 'change'

class Application.Models.Tweet extends Backbone.Model

class Application.Models.Tag extends Backbone.Model

class Application.Models.Category extends Backbone.Model

# Collections

class Application.Collections.Comments extends Backbone.Collection
  model: Application.Models.Comment
  url: ->
    url = 'https://disqus.com/api/3.0/posts/list.json?'
    url += 'forum=' + Application.disqus.name
    url += '&limit=' + Application.disqus.count
    url += '&api_key=' + Application.disqus.api_key
    url += '&callback=?'
    url

  parse: (data) ->
    data.response

class Application.Collections.Tweets extends Backbone.Collection
  model: Application.Models.Tweet
  url: ->
    url = "https://api.twitter.com/1/statuses/user_timeline.json?include_rts=true"
    url += "&screen_name=" + Application.twitter.username
    url += "&count=" + Application.twitter.count
    url += "&callback=?"
    url

class Application.Collections.Posts extends Backbone.Collection
  model: Application.Models.Post
  url: ->
    Application.url + "/" + 'pages.json'

  comparator: (a, b) ->
    a = a.get 'date'
    b = b.get 'date'

    if a is b
      c = 1

    else if a > b
      c = -1

    else if a < b
      c = 1

    c

class Application.Collections.Pages extends Backbone.Collection
  model: Application.Models.Page
  url: ->
    Application.url + "/" + 'pages.json'

class Application.Collections.Tags extends Backbone.Collection
  model: Application.Models.Tag
  url: ->
    Application.url + "/tags.json"

  initialize: ->
    @fetch()

  parse: (tags) ->
    for tag in tags
      tag.posts = new Application.Collections.Posts tag.posts
    tags


class Application.Collections.Categories extends Backbone.Collection
  model: Application.Models.Category
  url: ->
    Application.url + "/categories.json"

  initialize: ->
    @fetch()

  parse: (tags) ->
    for tag in tags
      tag.posts = new Application.Collections.Posts tag.posts
    tags

# Views

class Application.Views.Post extends Backbone.View
  el: "#main"
  tagName: "article"
  class: "post"
  template: JST.post

  render: =>
    @$el.append @template @model.toJSON()

    if @model.get 'comments'
      @loadDisqus()

  loadDisqus: ->
    window.disqus_shortname = Application.disqus.name
    window.disqus_identifier = @model.get 'id'
    window.disqus_url = Application.url + '/' + @model.get 'id'
    window.disqus_title = @model.get('title') + " » " + Application.name

    if DISQUS?
      DISQUS.reset reload: true, config: ->
        @.page.identifier = disqus_identifier
        @.page.url = disqus_url
        @.page.title = disqus_title
    else
      dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true
      dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js'
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq)

class Application.Views.PostExcerpt extends Backbone.View
  el: ".posts"
  tagName: "article"
  class: "post"
  template: JST.post_excerpt

  initialize: ->
    @model.on 'change', @render

  render: =>
    model = @getExcerpted()
    @$el.append @template model.toJSON()

  getExcerpted: ->
    model = @model.clone()
    model.set 'content', @model.get('content').split("<!-- more -->")[0]
    model

class Application.Views.Page extends Backbone.View
  el: "#main"
  tagName: "article"
  class: "page"
  template: JST.page

  render: =>
    @$el.html @template @model.toJSON()
    if DISQUS?
      DISQUS.reset()
    @resume_resize()

  resume_resize: ->
    $('.page-resume .bar').height( $('.content').height() - 15)
    
class Application.Views.Single extends Backbone.View
  el: "#content"
  template: JST.single

  initialize: ->
    @model.on 'change', @render

  render: =>
    @$el.html @template @model.toJSON()

    if @model.get('layout') is "post"
      post = new Application.Views.Post( model: @model )
    else if @model.get('layout') is "page"
      post = new Application.Views.Page( model: @model )

    document.title = @model.get('title') + " » " + Application.name

    post.render()
    $.smoothScroll
      scrollTarget: ".title"
      offset: -60

    jQuery('#content').infinitescroll 'destroy'


class Application.Views.Index extends Backbone.View
  el: "#content"
  template: $("#index_layout").html()

  render: ->
    @$el.html @template
    @collection.sort()
    @collection.slice(0,10).forEach (post) ->
      post.fetch()
      view = new Application.Views.PostExcerpt( model: post )
    comments = new Application.Collections.Comments
    view = new Application.Views.CommentView collection: comments
    comments.fetch()
    tweets = new Application.Collections.Tweets
    view = new Application.Views.TweetView collection: tweets
    tweets.fetch()

class Application.Views.CommentView extends Backbone.View
  el: "#recentcomments"
  template: JST.recent_comments

  initialize: =>
    @collection.on 'change', @render

  render: =>
    @$el.html @template({ comments: @collection.toJSON() })

class Application.Views.TweetView extends Backbone.View
  el: "#tweets"
  template: JST.recent_tweets

  initialize: =>
    @collection.on 'all', @render

  render: =>
    @$el.html @template tweets: @collection.toJSON()

class Application.Views.Tag extends Backbone.View
  el: "#content"
  template: JST.tag

  render: ->
    @$el.html @template({ tag: @model.toJSON() })
    $.smoothScroll
      scrollTarget: ".title"
      offset: -60
    jQuery('#content').infinitescroll 'destroy'
    document.title = "Posts tagged '" + @model.get('id') + "'' » " + Application.name

class Application.Views.Category extends Backbone.View
  el: "#content"
  template: JST.category

  render: ->
    @$el.html @template({ category: @model.toJSON() })
    $.smoothScroll
      scrollTarget: ".title"
      offset: -60
    jQuery('#content').infinitescroll 'destroy'
    document.title = "Posts categorized '" + @model.get('id') + "'' » " + Application.name

# Router

class Router extends Backbone.Router
  routes:
    ":year/:month/:day/:slug/": "post"
    "tags/:tag/": "tag"
    "categories/:category/": "category"
    ":slug/": "page"
    "": "index"

  post: (year, month, day, slug) ->
    post = new Application.Models.Post id: year+"/"+month+"/"+day+"/"+slug
    Application.posts.add post
    view = new Application.Views.Single model: post
    post.fetch error: @redirect
    @setNav ''

  page: (id) ->
    page = new Application.Models.Page id: id
    Application.pages.add page
    view = new Application.Views.Single model: page
    page.fetch error: @redirect
    @setNav id.replace "/",""

  index: ->
    view = new Application.Views.Index collection: Application.posts
    Application.posts.fetch error: @redirect, success: ->
      view.render()
    @setNav 'home'

  tag: (tag) ->
    Application.tags = new Application.Collections.Tags
    Application.tags.on "reset", ->
      new Application.Views.Tag( model: Application.tags.get tag ).render()
    @setNav ''

  category: (category) ->
    Application.categories = new Application.Collections.Categories
    Application.categories.on "reset", ->
      new Application.Views.Category( model: Application.categories.get category ).render()
    @setNav ''

  redirect: ->
    document.location = Application.url + "/" + Backbone.history.fragment

  setNav: (id) ->
    $('.nav .active').removeClass 'active'
    $('.nav #' + id).addClass 'active' if id.length

# Init
Application.posts = new Application.Collections.Posts
Application.pages = new Application.Collections.Pages

Application.router = new Router()
Backbone.history.start pushState: true, silent: true

if window.is404? and window.is404
  window.is404 = null
  Backbone.history.fragment = ""
  Application.router.navigate document.location.pathname.replace("/",""), trigger: true, replace: true

jQuery(document).ready ->

  window.resume_resize = ->
    $('.page-resume .bar').height( $('.content').height() - 15)
 
  $(window).resize resume_resize
  resume_resize()

  $('a[href^="{{ site.url }}/"]').live 'click', (e) ->
    e.preventDefault()
    Application.router.navigate $(@).attr('href').replace( '{{ site.url }}/', '' ), trigger: true
    false

  if Backbone.history.fragment == ""
    jQuery('#content').infinitescroll
      navSelector: "nav.pagination"
      nextSelector: "nav.pagination #next"
      itemSelector: "article.post"
    