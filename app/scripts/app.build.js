({
    appDir: '../',
    baseUrl: "scripts",
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
        topojson: 'vendor/topojson'
    },
    shim: {
        'jquery': { exports: '$' },
        'd3': { exports: 'd3' },
        'leaflet': { exports: 'L' },
        'topojson': { exports: 'topojson' }
    }
})