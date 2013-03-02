define(['leaflet', 'jquery', 'topojson'], function (L, $, topojson) {
    'use strict';

    var init = function () {

        require(['asia'], function (asia) {

        // draw map centered on asia
            var map = L.map('map', {
                center: [18, 107],
                zoom: 4,
                scrollWheelZoom: false,
                worldCopyJump: true,
                inertiaMaxSpeed: 600
            });

            L.tileLayer('http://d.tiles.mapbox.com/v3/nikhils.map-rrpbmuxw/{z}/{x}/{y}.png', {
                attribution: 'Map by <a href="http://mapbox.com/">MapBox</a>; data from the World Bank'
            })
            .addTo(map);

        // map info box
            var info = L.control();

            info.onAdd = function () {
                this._div = L.DomUtil.create('div', 'infobox');
                this._div.innerHTML = '<p><h1>Asia at a glance</h1></p>' + '<p><h3>GDP per capita (PPP): </h3></p>' + '<p><h3>Total population: </h3></p>' + '<p><h3>Female population: </h3></p>' + '<p><h3>Area: </h3></p>';
                return this._div;
            };

            info.update = function (place) {
                var lookup = locale[place];
                this._div.innerHTML = '<p><h1>' + place + '</h1></p>' + '<p><h3>GDP per capita (PPP): </h3>' + currency(lookup.gdppc) + '</p>' + '<p><h3>Total population: </h3>' + addCommas(lookup.totalPop) + '</p>' + '<p><h3>Female population: </h3>' + percent(lookup.femalePop) + '</p>' + '<p><h3>Area: </h3>' + addCommas(lookup.area) + ' km<sup>2</sup></p>';
            };



            // center on country clicked in text
            var locale = asia.locales;

            var panMap = function (place) {
                var lookup = locale[place];
                map.panTo([lookup.lat, lookup.lon]);
                map.setZoom(5);
            };

            // scroll to and from map on click
            $('a[href^=#]').on('click', function (e) {

                var name = $(this).attr('href').substr(1);
                var pos = $('[id=' + name + ']').offset();
                var center = ($(window).height() - $('[id=' + name + ']').height()) / 2;

                if ($(this).attr('id') !== 'map') {

                    panMap($(this).html());
                    info.update($(this).html());
                    $('#map').append('<div id="return"><h2><a id=' + name + ' href=#' + $(this).attr('id') + '>Return to text</a></h2></<div>');
                    $('html,body').animate({ scrollTop: pos.top - center });
                    e.preventDefault();
                } else {
                    $('div#return').remove();
                    $('html,body').animate({ scrollTop: pos.top });
                    e.preventDefault();
                }
            });

            // do fun stuff when we mouse over a country
            function onEachFeature(feature, layer) {
                layer.on({
                    mouseover: mapHover,
                    mouseout: styleReset
                });
            }

            function mapHover(e) {
                var layer = e.target;
                layer.setStyle({
                    weight: 2,
                    color: '#666',
                    fillOpacity: 0.3
                });
                info.update(layer.feature.properties.name);
            }

            function styleReset(e) {
                countriesLayer.resetStyle(e.target);
            }

            // draw map overlay for asian countries
            var countriesLayer = L.geoJson(null, {
                style: {
                    color: '#666',
                    weight: 0,
                    fillOpacity: 0.1,
                },
                onEachFeature: onEachFeature
            });

            $.getJSON('./data/asia-topo.json', function (data) {
                var asiaGeojson = topojson.object(data, data.objects.asia);

                var featureCollection = {
                    'type': 'FeatureCollection',
                    'features': []
                };

               // retain necessary properties of topojson file
                for (var i = 0; i < asiaGeojson.geometries.length; i++) {
                    featureCollection.features.push({
                        'type' : 'Feature',
                        'geometry' : asiaGeojson.geometries[i],
                        'properties' : asiaGeojson.geometries[i].properties
                    });
                }
                countriesLayer.addData(featureCollection);

                info.addTo(map);
            });

            map.addLayer(countriesLayer);

            // format numbers
            function addCommas(x) {
                return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            function currency(x) {
                return x === 'N/A' ? 'N/A' : 'US$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }

            function percent(x) {
                return x === 'N/A' ? 'N/A' : x.toString() + '%';
            }

        });
    };
    return {init: init};
});