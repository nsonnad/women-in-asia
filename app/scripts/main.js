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

var scripts = ['drawMap', 'education', 'surveys', 'sexRatio'];

require(scripts, function(drawMap, education, surveys, sexRatio) {
  // use app here
  drawMap;
  education;
  surveys;
  sexRatio;

});