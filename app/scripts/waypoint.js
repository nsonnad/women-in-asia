define(['jquery', 'waypoints'], function() {

	$('#map').waypoint(function() {
		$(window).mousewheel(function(event) {
        event.preventDefault();
    });
	});

});