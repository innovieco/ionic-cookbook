var app = angular.module('starter', ['ionic', 'firebase']);

app.run(function($ionicPlatform, $firebaseArray, $timeout) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.controller('FormCtrl', function($scope, $firebaseArray) {
  var ref = new Firebase('https://ionicebook.firebaseio.com/transactions/');
  $scope.transactions = $firebaseArray(ref);
  $scope.formData = {};
  $scope.data = {
    completed: false,
    currentSlide: 0
  };

  // If user changes slide, make notification disappear
  $scope.$watch('data.currentSlide', function(newVal, oldVal) {
    if ((newVal < 2) && (oldVal == 2))
      $scope.data.completed = false;
  })

  $scope.submit = function() {
    // Check if the form is "dirty" or not as user must fill out something
    if (angular.equals({}, $scope.formData)) {
      alert("Your form is empty");
    } else {
      // Add the entire $scope.formData object to Firebase and reset it
      $scope.transactions.$add($scope.formData).then(function(res) {
        $scope.formData = {};
        $scope.data.completed = true; // Mark "completed" to show the notification in view
      });
    }
  };
});
