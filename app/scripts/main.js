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

require(['font!google,families:[Enriqueta:400,700]', 'jquery', 'd3', 'leaflet', 'topojson', 'app'], function (font, $, d3, L, topojson, app) {
    'use strict';
    $('#loader').remove();
    // $('#headline').hide().fadeIn(2500);
    // $('#container').removeClass('loading').addClass('loaded');
    app.init();
});