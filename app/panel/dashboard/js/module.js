
(function() {
'use strict';

  angular.module('onebip.panel.dashboard', [
    'onebip.panel.dashboard.directives',
    'onebip.panel.dashboard.services',
    'onebip.panel.dashboard.controllers',
    'ngRoute',
  ])
  .config(['$routeProvider', function ($routeProvider) {

    $routeProvider
      .when('/dashboard/configuration', {
        templateUrl: '/dashboard/views/configuration.html',
        controller: 'ConfigurationMain'
      });
  }]);

})();