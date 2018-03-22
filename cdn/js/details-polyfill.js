$(document).ready(function() {
	
	if (!('open' in document.createElement('details'))) {
		$("details").addClass('html5_details').each(function() {
			$(this).find("summary").show().click(function() {
				$(this).siblings().toggle();
				$(this).parent('details').toggleClass('open');
			});
			var opened = $(this).attr("open");
			if(opened==undefined) {
				$(this).children().hide();
				$(this).children("summary").show();
			}
		});
	}
});