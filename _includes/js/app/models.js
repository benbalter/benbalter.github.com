var Page = Backbone.Model.extend({

	url: function() {
	
		return this.id + '.json';
	
	}

});

var Post = Backbone.Model.extend({

	url: function() {
	
		return this.id + '.json';
	
	}

});