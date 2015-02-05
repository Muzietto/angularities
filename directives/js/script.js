
angular.module('docsTemplateUrlDirective', [])
  .controller('Controller', function($scope){
    $scope.customer = {
      name: 'Naomi',
      address: 'casa sua nello attributello'
    }
  })
  .directive('myCustomer', function(){
    return { templateUrl: 'html/my-customer.html'}
  })
  
angular.module('docsRestrictDirective', [])
  .controller('Controller2', function($scope){
    $scope.customer = {
      name: 'Naomi',
      address: 'casa sua nel tag'
    }
  })
  .directive('myCustomer', function(){
    return { 
      restrict: 'E',
      templateUrl: 'html/my-customer.html'
    }
  })

  