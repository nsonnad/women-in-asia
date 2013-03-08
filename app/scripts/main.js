require.config({

    paths: {
        'jquery': 'vendor/jquery.min',
        'd3': '/components/d3/d3',
        'leaflet': '/components/leaflet/dist/leaflet',
        'topojson': 'vendor/topojson',
        'font': 'vendor/requirejs-plugins/src/font',
        'async': 'vendor/requirejs-plugins/src/async',
        'goog': 'vendor/requirejs-plugins/src/goog',
        'propertyParser': 'vendor/requirejs-plugins/src/propertyParser',
        'tipsy' : 'vendor/jquery.tipsy'
    },

    shim: {
        'jquery': { exports: '$' },
        'd3': { exports: 'd3' },
        'leaflet': { exports: 'L' },
        'topojson': { exports: 'topojson' },
        'tipsy' : { deps: ['jquery'] }
    },

});

require(['font!google,families:[Enriqueta:400,700]', 'jquery', 'd3', 'leaflet', 'topojson', 'tipsy', 'app'], function (font, $, d3, L, topojson, tipsy, app) {
    'use strict';
    $('#loader').remove();
    $('#headlineWrap').fadeIn(2500, function () { $('#navWrap').fadeIn(1000); });
    $('#container1, #container2').removeClass('loading').addClass('loaded');
    app.init();
});