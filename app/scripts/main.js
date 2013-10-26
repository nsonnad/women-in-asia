require.config({

    paths: {
        'jquery': '../bower_components/jquery/jquery.min',
        'd3': '../bower_components/d3/d3',
        'leaflet': '../bower_components/leaflet-dist/leaflet',
        'topojson': '../bower_components/topojson/topojson',
        'font': '../bower_components/requirejs-plugins/src/font',
        'text': '../bower_components/requirejs-plugins/lib/text',
        'json': '../bower_components/requirejs-plugins/src/json',
        'async': '../bower_components/requirejs-plugins/src/async',
        'goog': '../bower_components/requirejs-plugins/src/goog',
        'propertyParser': '../bower_components/requirejs-plugins/src/propertyParser',
        'tipsy' : '../bower_components/tipsy/src/javascripts/jquery.tipsy'
    },

    shim: {
        'jquery': { exports: '$' },
        'd3': { exports: 'd3' },
        'leaflet': { exports: 'L' },
        'topojson': { exports: 'topojson' },
        'tipsy' : { deps: ['jquery'] }
    },

});

require(['font!google,families:[Enriqueta:400,700]', 'jquery', 'd3', 'leaflet', 'app'], function (font, $, d3, L, app) {
    'use strict';
    app.init();
});