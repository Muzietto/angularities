
(function() {
  'user strint';

  angular.module('mainModuleForever', ['onebip.panel.dashboard'])
  .controller('MainController', function() {})
  .directive('menuLink', function () {
    return {
      restrict: 'E',
      replace: true, // 
      transclude: true,
      templateUrl: 'view/menuLink.html',
      scope: {
        path: '@'
      }
    };
  });
  
})();