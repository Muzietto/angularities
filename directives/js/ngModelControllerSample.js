
angular.module('RadifyExample', [])
.controller('ColourPickerController', function($scope) {
  $scope.ctrl_background = '000';
  $scope.ctrl_foreground = 'F00';
})
.directive('colourPicker', function () {
  return {
    restrict: 'E',
    scope: {},
    require: 'ngModel',
    link: function(scope, element, attrs, ngModelCtrl) {

      // modelValue -> viewValue
      ngModelCtrl.$formatters.push(function(modelValue) {
        var colours = modelValue.split('');
        return { // return value becomes viewValue
          red: colours[0],
          green: colours[1],
          blue: colours[2]
        };
      });

      // viewValue -> modelValue
      ngModelCtrl.$parsers.push(function(viewValue) {
        var resultString = [viewValue.red, viewValue.green, viewValue.blue].join('');
        return '#' + resultString; // return value becomes modelValue
      });

      // viewValue -> isolated scope
      ngModelCtrl.$render = function() {
        scope.red = ngModelCtrl.$viewValue.red;
        scope.green = ngModelCtrl.$viewValue.green;
        scope.blue = ngModelCtrl.$viewValue.blue;
      };

      // watcher of the skyes
      scope.$watchGroup(['red', 'green', 'blue'], function(/*newValue,oldValue*/) {
        ngModelCtrl.$setViewValue({
          red: scope.red,
          green: scope.green,
          blue: scope.blue
        });
      });
    },
    templateUrl: 'views/colour-picker.html'
  }
});
