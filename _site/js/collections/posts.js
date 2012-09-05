var Posts = Backbone.Collection.extend({
	model: Post,
	url: 'posts.json'
});