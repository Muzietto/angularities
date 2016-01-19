
(function() {
  'use strict';
  
  angular.module('onebip.panel', ['ngRoute', 'onebip.panel.main'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {});
      
      $locationProvider.html5Mode(true);
    }]);

})();