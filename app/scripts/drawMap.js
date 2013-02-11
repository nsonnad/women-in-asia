define(['leaflet', 'jquery'], function() {
	require(['asia'], function(asia) {

	// draw map centered on asia
	var map = L.map('map', {
		center: [18,107],
		zoom: 4,
		scrollWheelZoom: false,
		worldCopyJump: true,
		inertiaMaxSpeed: 1000
	});

	L.tileLayer('http://d.tiles.mapbox.com/v3/nikhils.map-rrpbmuxw/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// pan to map when clicking on country name,
// center on country clicked
	var locale = asia.locales;

	var panMap = function(place) {
		var lookup = locale[place];
		map.panTo([lookup.lat, lookup.lon]);
		map.setZoom(5)
	};

	$('a[href^=#]').click(function(e){

    var name = $(this).attr('href').substr(1);
    var pos = $('[id='+name+']').offset();
    var center = ($(window).height() - $('[id='+name+']').height()) / 2

    $('body').animate({ scrollTop: pos.top - center });
    e.preventDefault();

    panMap($(this).html())

		});
	});
});