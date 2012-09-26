{% include js/app/models.js %}
{% include js/app/collections.js %}
{% include js/app/views.js %}
{% include js/app/routes.js %}

$(function(){ 
	new AppRouter();
	Backbone.history.start({ pushState: false, silent: true });
	
});
