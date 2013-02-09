define(['leaflet'], function () {

	var map = L.map('map', {
		center: [18,110],
		zoom: 4,
		scrollWheelZoom: false,
		worldCopyJump: true
	});

	L.tileLayer('http://d.tiles.mapbox.com/v3/nikhils.map-rrpbmuxw/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);


});