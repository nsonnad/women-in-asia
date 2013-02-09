require.config({

  paths: {
    jquery: 'vendor/jquery.min',
    d3: '/components/d3/d3.min',
    leaflet: '/components/leaflet/dist/leaflet',
    waypoints: 'vendor/waypoints.min'
    // mustache: '/components/mustache/mustache'
  },

  shim: {
    'waypoints': ['jquery']
  }

});

var scripts = ['map', 'app', 'waypoint'];

require(scripts, function(map, app, waypoint) {
  // use app here
  map;
  app;
  waypoint;

});