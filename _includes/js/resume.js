jQuery(document).ready( function($) {
	
	var resume_resize = function() {
		$('.resume .bar').height( $('.content').height() - 25);		
	}
	
	resume_resize();
	$(window).resize( resume_resize );

});