require.config({

    paths: {
        'jquery': 'vendor/jquery.min',
        'd3': '/components/d3/d3',
        'leaflet': '/components/leaflet/dist/leaflet',
        'topojson': 'vendor/topojson'
    },

    shim: {
        'waypoints': ['jquery'],
        'jquery': { exports: '$' },
        'd3': { exports: 'd3' },
        'leaflet': { exports: 'L' },
        'topojson': { exports: 'topojson' }
    }

});

var scripts = ['drawMap', 'education', 'surveys', 'sexRatio'];

require(scripts, function (drawMap, education, surveys, sexRatio) {
    'use strict';

    drawMap;
    education;
    surveys;
    sexRatio;

});