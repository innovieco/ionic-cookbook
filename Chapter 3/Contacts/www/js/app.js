var app = angular.module('starter', ['ionic', 'ngCordova']);

app.run(function($ionicPlatform) {
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

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.find', {
      url: "/find",
      views: {
        'find-tab': {
          templateUrl: "templates/find.html"
        }
      }
    })
    .state('tabs.add', {
      url: "/add",
      views: {
        'add-tab': {
          templateUrl: "templates/add.html"
        }
      }
    });

  $urlRouterProvider.otherwise("/tab/find");
});

app.controller('ContactCtrl', function($scope, $cordovaContacts) {
  $scope.contactFind = {
    "name": {
      "givenName": "Not",
      "familyName": "Available"
    },
    "phoneNumbers": [
      {
        "value": "Not Available",
        "type": ""
      }
    ],
    "emails": [
      {
        "value": "Not Available"
      }
    ]
  };

  $scope.contactSave = {
    "name": {
      "givenName": "Student",
      "familyName": "Ionic"
    },
    "phoneNumbers": [
      {
        "value": "(408) 100-2000",
        "type": "mobile"
      }
    ],
    "emails": [
      {
        "value": "youremail@example.com"
      }
    ]
  };

  $scope.pickContact = function() {
    $cordovaContacts.pickContact().then(function(result) {
      // Contact picked success
      console.log(result);
      $scope.contactFind = result;
    }, function(err) {
      // Contact picked error
      alert('There is an error picking contact. Please see console.log');
      console.log(err);
    });
  };

  $scope.addContact = function() {
    $cordovaContacts.save($scope.contactSave).then(function(result) {
      // Contact saved success
      alert('The contact information has been saved');
      console.log(result);
    }, function(err) {
      // Contact saved error
      alert('There is an error saving contact. Please see console.log');
      console.log(err);
    });
  };

});
