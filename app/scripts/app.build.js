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
        propertyParser: 'vendor/requirejs-plugins/src/propertyParser',
        tipsy : 'vendor/jquery.tipsy'
    },
    shim: {
        'jquery': { exoprts: '$' },
        'd3': { exports: 'd3' },
        'leaflet': { exports: 'L' },
        'topojson': { exports: 'topojson' },
        'tipsy' : { deps: ['jquery'] }
    }
})