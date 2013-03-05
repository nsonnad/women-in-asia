({
    appDir: '../',
    baseUrl: 'scripts',
    dir: '../../dist',
    modules: [
        {
            name: 'main',
        }
    ],
    paths: {
        jquery: 'vendor/jquery.min',
        d3: '../components/d3/d3.min',
        leaflet: '../components/leaflet/dist/leaflet',
        topojson: 'vendor/topojson',
        font: 'vendor/requirejs-plugins/src/font',
        async: 'vendor/requirejs-plugins/src/async',
        goog: 'vendor/requirejs-plugins/src/goog',
        propertyParser: 'vendor/requirejs-plugins/src/propertyParser'
    },
    shim: {
        'jquery': { exports: '$' },
        'd3': { exports: 'd3' },
        'leaflet': { exports: 'L' },
        'topojson': { exports: 'topojson' }
    }
})