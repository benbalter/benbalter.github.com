/* Collections */
var Pages = Backbone.Collection.extend({
	model: Page,
	url: 'pages.json'
});

var Posts = Backbone.Collection.extend({
	model: Post,
	url: 'posts.json'
});
