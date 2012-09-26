jQuery(document).ready(function($){
	
	$('a[href^="{{ site.url }}/"]').each( function( id, link ) {
		
		$(link).attr( 'href', $(link).attr('href').replace( '{{ site.url }}/', '{{ site.url }}/#/' ) );
		
	});
});