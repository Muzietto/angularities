var myModule = angular.module('Angello', []);

myModule.controller('MainCtrl', 
  function($scope, angelloModel, angelloHelper) {
    $scope.currentStory;
    $scope.currentType;
    $scope.currentStatus;
    $scope.statuses = angelloModel.getStatuses();
    $scope.statusesIndex = angelloHelper.buildIndex($scope.statuses, 'name');
    $scope.types = angelloModel.getTypes();
    $scope.typesIndex = angelloHelper.buildIndex($scope.types, 'name');
    $scope.stories = angelloModel.getStories();

    $scope.createStory = function() {
      $scope.stories.push({
        title:'New Story',
        description:'Description pending'
      });
    }

    $scope.setCurrentStory = function(story) {
      $scope.currentStory = story;
      $scope.currentStatus = $scope.statusesIndex[story.status];
      $scope.currentType = $scope.typesIndex[story.type];;    
    }
    $scope.setCurrentStoryStatus = function(status) {
      $scope.currentStory.status = status.name;
    }
    $scope.setCurrentStoryType = function(type) {
      $scope.currentStory.type = type.name;
    }
  });

// HELPERS
myModule.factory('angelloModel', function() {
  function getStatuses() {
    var result = [
      {name: 'Back Log'},
      {name: 'To Do'},
      {name: 'In Progress'},
      {name: 'Code Review'},
      {name: 'QA Review'},
      {name: 'Verified'},
      {name: 'Done'}
    ];
    return result;
  }
  function getTypes() {
    var result = [
      {name: 'Feature'},
      {name: 'Enhancement'},
      {name: 'Bug'},
      {name: 'Spike'}
    ];
    return result;
  }
  function getStories() {
    var result = [
      {title:'Story 00', description: 'Description pending', criteria: 'criteria pending', status: 'In Progress', type: 'Feature', reporter: 'Lukas', assignee: 'Brian'},
      {title:'Story 01', description: 'Description pending', criteria: 'criteria pending', status: 'QA Review', type: 'Enhancement', reporter: 'Lukas', assignee: 'Brian'},
      {title:'Story 02', description: 'Description pending', criteria: 'criteria pending', status: 'Verified', type: 'Bug', reporter: 'Lukas', assignee: 'Brian'},
      {title:'Story 03', description: 'Description pending', criteria: 'criteria pending', status: 'To Do', type: 'Bug', reporter: 'Lukas', assignee: 'Brian'},
      {title:'Story 04', description: 'Description pending', criteria: 'criteria pending', status: 'In Progress', type: 'Enhancement', reporter: 'Lukas', assignee: 'Brian'},
      {title:'Story 05', description: 'Description pending', criteria: 'criteria pending', status: 'Verified', type: 'Spike', reporter: 'Lukas', assignee: 'Brian'}
    ];
    return result;
  }
  
  return {
    getStatuses: getStatuses,
    getStories: getStories,
    getTypes: getTypes
  };
});

myModule.factory('angelloHelper', function() {
  function buildIndex(source,property) {
    var result = {};    
    for (var i = 0, len = source.length; i < len; i++) {
      result[source[i][property]] = source[i];
    }
    return result;
  }
  return {
    buildIndex: buildIndex
  };
});

