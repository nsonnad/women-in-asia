require.config({

  paths: {
    jquery: 'vendor/jquery.min',
    d3: '/components/d3/d3.min',
    leaflet: '/components/leaflet/dist/leaflet',
    waypoints: 'vendor/waypoints.min',
    topojson: 'vendor/topojson'
    // mustache: '/components/mustache/mustache'
  },

  shim: {
    'waypoints': ['jquery']
  }

});

var scripts = ['drawMap', 'app', 'waypoint', 'education'];

require(scripts, function(drawMap, app, waypoint, education) {
  // use app here
  drawMap;
  app;
  waypoint;
  education;

});