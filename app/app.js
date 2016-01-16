
(function() {
  'use strict';
  
  angular.module('angularities', ['ngRoute'])
    .config(function($routeProvider) {
      $routeProvider
        .when('/', { templateUrl: 'main.html' })
        .when('/dashboard', { templateUrl: 'app/panel/dashboard/views/configuration.html' });
    });

})();