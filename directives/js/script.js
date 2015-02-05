
angular.module('directives', [])
  .controller('Controller', ['$scope',  function($scope){
    $scope.customer = {
      name: 'Naomi',
      address: 'casa sua'
    }
  }])
  .directive('myCustomer', function(){
    return { templateUrl: 'html/my-customer.html'}
  })