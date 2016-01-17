'use strict';

angular.module('onebip.panel.dashboard.controllers', ['ui.bootstrap'])

.controller('StrategyMain', ['$scope', 'Session', function($scope, Session){
  $scope.token = Session.getToken();
}])

.controller('ConfigurationMain', [
  '$scope',
  '$http', 
  'DashboardFilterService', 
  'DashboardDataService', 
  function ($scope, $http, DashboardFilterService, DashboardDataService) {

    $scope.filter = DashboardFilterService;
    $scope.data = DashboardDataService;
    $scope.storage = $scope.filter.storage;
    $scope.countries = $scope.data.countries;

    $scope.availableCountries = [
      { name: 'Bosnia and Herzegovina', code: 'BA' },
      { name: 'Greece', code: 'GR' },
      { name: 'Iraq', code: 'IQ' }
    ];

    // listener for criteria.price
    $scope.$watch(
      function(scope){ return scope.filter.criteria.price; },
      function(newExpr,oldExpr){
        // user deletes criteria string from input || price filter removed
        if (newExpr === '') {
          newExpr = '== price';
        }
        try {

          var subPreds = newExpr.split('&&').reduce(function(acc,curr){ 
            return acc + ' && price ' + curr; 
          },'true');
          var pred = new Function('price','return (' + subPreds + ')');
          $scope.filter.predicates.price = pred;
          // run the filter
          $scope.filter.filterFunctions.price(pred);
        } catch(err) {
          // TODO - make a real logging to file
          //console.log('ConfigurationMain controller - error during application of price criteria: ' + err);
        }
      }
    );
    
    // create listeners for all categories with list-based filter
    [
      'connectivity',
      'credit_provider',
      'route',
      'context'
    ].forEach(function(category){
        $scope.$watch(
          function(scope){ return scope.filter.criteria[category]; },
          function(newStuff,oldStuff){
            var pred = function(item){
              return (newStuff.length === 0) || (newStuff.indexOf(item) !== -1);
            }
            $scope.filter.predicates[category] = pred;
            // run the filter
            $scope.filter.filterFunctions[category](pred);
          }
        );
    });

    $scope.getCountryData = function(country) {
      var countryCode = country.code

      if (!$scope.data.countries[countryCode]) {
        $scope.data.getCountryData(countryCode, function(){

          // callback applies current criteria to old+new data
          [
            'price',
            'connectivity',
            'credit_provider',
            'route',
            'context'
          ].forEach(function(category){
            $scope.filter.filterFunctions[category]($scope.filter.predicates[category]);
          });
        });
      }
    }

  }])
