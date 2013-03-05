require.config({

    paths: {
        'jquery': 'vendor/jquery.min',
        'd3': '/components/d3/d3',
        'leaflet': '/components/leaflet/dist/leaflet',
        'topojson': 'vendor/topojson',
        'font': 'vendor/requirejs-plugins/src/font',
        'async': 'vendor/requirejs-plugins/src/async',
        'goog': 'vendor/requirejs-plugins/src/goog',
        'propertyParser': 'vendor/requirejs-plugins/src/propertyParser'
    },

    shim: {
        'jquery': { exports: '$' },
        'd3': { exports: 'd3' },
        'leaflet': { exports: 'L' },
        'topojson': { exports: 'topojson' }
    },

});

require(['jquery', 'd3', 'leaflet', 'topojson', 'app'], function ($, d3, L, topojson, app) {
    'use strict';
    app.init();
});