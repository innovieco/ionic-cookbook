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

app.controller('EmailCtrl', function($scope, $ionicPlatform, $cordovaEmailComposer, Base64Icon) {
  $ionicPlatform.ready(function() {
    $cordovaEmailComposer.isAvailable().then(function() {
      // is available
      console.log('Email is available');
    }, function () {
      // not available
      alert('Email is not available');
    });
  });

  $scope.Base64Icon = Base64Icon;
  $scope.email = {
    to: 'youremail@gmail.com',
    // You can add cc or bcc field with array of emails
    // cc: 'someone@gmail.com',
    // bcc: ['test1@gmail.com', 'test2@gmail.com'],
    attachments: [
     'file://img/ionic.png',
     // file:// is basically your www/ folder
     // You can include any file such as PDF
     // 'file://README.pdf'
     "base64:icon.jpg//" + Base64Icon
     // Note that you must include file name for base64 such as icon.jpg
     // 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
    ],
    subject: 'Just testing Email Composer Cordova plugin',
    body: 'How are you? Nice greetings from <b>Ionic</b>',
    isHtml: true
  };

  $scope.send = function() {
    $cordovaEmailComposer.open($scope.email).then(null, function () {
      // Callback when user cancelled or sent email
      $scope.thankYou = true;
    });
  }
});
