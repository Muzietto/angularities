'use strict';

angular.module('onebip.panel.bk', [
  'onebip.panel.bk.constants',
  'onebip.panel.bk.services',
  'onebip.panel.bk.factories',
  'onebip.panel.bk.controllers',
  'onebip.panel.bk.directives',
  'onebip.panel.bk.filters',
  'onebip.panel.bk.simulator.controllers',
  'onebip.panel.bk.testsuite.controllers',
  'ngRoute',
  'selectize'
])
.config(['$routeProvider', function ($routeProvider) {

  $routeProvider
    .when('/bk', {
      templateUrl: '/lib/bk/views/index.html',
      controller: 'BkList',
      resolve: {
        ConstraintsFilterKeys: ['ConstraintsFilter', function (ConstraintsFilter) {
          return ConstraintsFilter.isReady();
        }]
      }
    })
    .when('/simulator', {
      templateUrl: '/lib/bk/views/simulator/index.html',
      controller: 'SimulatorMainCtrl',
      resolve: {
        ConstraintsFilterKeys: ['ConstraintsFilter', function (ConstraintsFilter) {
          return ConstraintsFilter.isReady();
        }]
      }
    })
    ;
}])
;
