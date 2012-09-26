var pageView = Backbone.View.extend({
  render: function( page ){
    var page = new Page({ id: page });
    page.fetch( { success: function( page ) { 
    	template = _.template( $('#pageTemplate').html() );
    	$('#content').html( template( page.toJSON() ) );
    } } );
  }
});
