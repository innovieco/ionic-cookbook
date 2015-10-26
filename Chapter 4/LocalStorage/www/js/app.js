var app = angular.module('starter', ['ionic', 'ngStorage']);

app.controller('MainCtrl', function($scope, $ionicPopup, $ionicListDelegate, $localStorage) {
  $scope.$storage = $localStorage.$default({
    items: [
      { label: 'First todo item' },
      { label: 'Second todo item' },
      { label: 'Third todo item' },
      { label: 'Fourth todo item' },
      { label: 'Fifth todo item' }
    ]
  });
  
  $scope.edit = function(index) {
    $scope.editItem = {label: $scope.$storage.items[index].label};
    var itemPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="editItem.label">',
      title: 'Edit Todo',
      scope: $scope,
      buttons: [
        { text: 'Cancel' },
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.editItem.label) {
              e.preventDefault();
            } else {
              $scope.$storage.items[index].label = $scope.editItem.label;
              return $scope.editItem;
            }
          }
        }
      ]
    });
    itemPopup.then(function(res) {
      $ionicListDelegate.closeOptionButtons();
    });
  };
  
  $scope.moveItem = function(item, fromIndex, toIndex) {
    $scope.$storage.items.splice(fromIndex, 1);
    $scope.$storage.items.splice(toIndex, 0, item);
  };
  
  $scope.onItemDelete = function(item) {
    $scope.$storage.items.splice($scope.$storage.items.indexOf(item), 1);
  };

  $scope.addItem = function() {
    $scope.$storage.items.push({label: $scope.data.item});
    $scope.data.item = '';
  }
});
