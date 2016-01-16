'use strict';

angular.module('onebip.panel.dashboard.directives', [])

.directive('dashboardInputFilter', [function() {
  return {
    restrict: 'E',
    scope: {
      name: '=',
      criteria: '='
    },
    template: '<div>'+
      '<input data-ng-model="criteria[name]"/>'+
    '</div>',
    replace: true
  }
}])

.directive('dashboardSelectFilter', [function() {
  return {
    restrict: 'E',
    scope: {
      name: '=',
      criteria: '=',
      items: '='
    },
    template: '<div><select ui-select2 multiple="multiple" data-ng-model="criteria[name]" class="constraint-cell" data-ng-disabled="itemLoading || disabled">'+
      '<option ng-repeat="item in items" value="{{item.value}}">{{item.description}}</option>'+
    '</select><side-loader class="outloader text-info" spin-on="itemLoading" /></div>',
    replace: true
  }
}])
;
