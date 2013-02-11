require.config({

  paths: {
    jquery: 'vendor/jquery.min',
    d3: '/components/d3/d3.min',
    leaflet: '/components/leaflet/dist/leaflet',
    waypoints: 'vendor/waypoints.min'
    // mustache: '/components/mustache/mustache'
  },

  shim: {
    'waypoints': ['jquery'],
    'scroll': ['jquery']
  }

});

var scripts = ['drawMap', 'app', 'waypoint', 'scroll'];

require(scripts, function(drawMap, app, waypoint, scroll) {
  // use app here
  drawMap;
  app;
  waypoint;
  scroll;

});