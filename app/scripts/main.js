require.config({

  paths: {
    jquery: 'vendor/jquery.min',
    d3: '/components/d3/d3',
    leaflet: '/components/leaflet/dist/leaflet',
    waypoints: 'vendor/waypoints.min',
    topojson: 'vendor/topojson'
    // mustache: '/components/mustache/mustache'
  },

  shim: {
    'waypoints': ['jquery']
  }

});

var scripts = ['drawMap', 'education', 'surveys'];

require(scripts, function(drawMap, education, surveys) {
  // use app here
  drawMap;
  education;
  surveys;

});