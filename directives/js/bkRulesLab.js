
angular.module('bkRulesLab', [])
.controller('bkLabController', function($scope) {
  $scope.rule = { /* insert here an array of keys */ };
  $scope.key = 'payment_volume';
  $scope.value = 'GET IT FROM THE DIRECTIVES';
})
.directive('constraintPaymentVolume', function (/*Range*/) {
  return {
    restrict: 'E',
    replace: true,
    controller: function ($scope) {
      if (angular.isString($scope.rule.constraints.payment_volume)) {
        $scope.rule.constraints.payment_volume = Range.fromString($scope.rule.constraints.payment_volume);
      }
    },
    templateUrl: '../panel/bk/views/constraint/payment_volume.html'
  }
});