require.config({
  paths: {
    loader: 'libs/backbone/loader',
    jQuery: 'libs/jquery/jquery',
    Underscore: 'libs/underscore/underscore',
    Backbone: 'libs/backbone/backbone',
    templates: '../templates'
  }

});

require([

  'app',
], function(App){

  App.initialize();

});
