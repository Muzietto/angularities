
(function() {
  'use strict';
  
  angular.module('onebip.panel', ['ngRoute', 'onebip.panel.main'])
    .config(function($routeProvider) {
      $routeProvider
        .when('/', { templateUrl: 'main.html' });
    });

})();