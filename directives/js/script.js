
var directivesApp = angular.module('directiveSandbox', []);

directivesApp.controller('docsTemplateUrlDirectiveController', function($scope){
    $scope.customer = {
      name: 'Naomi',
      address: 'casa sua nello attributello'
    }
  })
  .directive('myCustomer', function(){
    return { templateUrl: 'html/my-customer.html'}
  })

directivesApp.controller('docsRestrictDirectiveController', function($scope){
    $scope.customer = {
      name: 'Naomi',
      address: 'casa sua nel tag'
    }
  })
  .directive('myCustomerTag', function(){
    return { 
      restrict: 'E',
      templateUrl: 'html/my-customer.html'
    }
  })

directivesApp.controller('docsIsolateScopeDirectiveController', function($scope){
    $scope.naomi = { name: 'Naomi', address: 'casa sua nella var' };
    $scope.igor = { name: 'Igor', address: 'casa mia nella var' };
  })
  .directive('myCustomerTagWithInfo', function(){
    return { 
      restrict: 'E',
      scope: {
        customer: '=instance'
      },
      templateUrl: 'html/my-customer.html'
    }
  })
  