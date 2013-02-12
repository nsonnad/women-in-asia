define(['leaflet', 'jquery', 'topojson'], function() {
	require(['asia'], function(asia) {

	// draw map centered on asia
	var map = L.map('map', {
		center: [18,107],
		zoom: 4,
		scrollWheelZoom: false,
		worldCopyJump: true,
		inertiaMaxSpeed: 600
	});

	L.tileLayer('http://d.tiles.mapbox.com/v3/nikhils.map-rrpbmuxw/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// map info UI
var info = L.control();

	info.onAdd = function(map) {
		this._div = L.DomUtil.create('div', 'infobox');
		return this._div;
		};

	info.update = function (place) {
		var lookup = locale[place];
    this._div.innerHTML = '<h4>Country details</h4>' + place + " " + lookup.gdppc + " " + lookup.totalPop;
};

info.addTo(map);

// scroll to map when clicking on country name, center on country clicked
// give info for that country
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

    panMap($(this).html());
    info.update($(this).html());
		});

// do fun stuff when we mouse over a country
	function onEachFeature(feature, layer) {
    layer.on({
        mouseover: mapHover,
        mouseout: styleReset
			})
  };

  function mapHover(e) {
   	layer = e.target;
   	layer.setStyle({
        weight: 2,
        color: '#666',
        fillOpacity: 0.3
    	});
   	info.update(layer.feature.properties.name)
   };

   function styleReset(e) {
    countriesLayer.resetStyle(e.target);
   }

   // draw layer for asian countries
	var countriesLayer = L.geoJson(null, {
        style: {
            color: '#666',
            weight: 0,
            fillOpacity: 0.1,
        },
        onEachFeature: onEachFeature
     });

	$.getJSON('../data/asia-topo.json', function (data) {
    var asia_geojson = topojson.object(data, data.objects.asia);
   
    var featureCollection = {
      "type": "FeatureCollection",
      "features": []
    };

   // retain necessary properties of topojson file
	   for (var i = 0; i < asia_geojson.geometries.length; i++) {
	      featureCollection.features.push({
	        "type":"Feature",
	        "geometry": asia_geojson.geometries[i],
	        "properties": asia_geojson.geometries[i].properties
	      	});
	      }	
	     countriesLayer.addData(featureCollection)
	     console.log(featureCollection)
		});

	map.addLayer(countriesLayer);

	});
});