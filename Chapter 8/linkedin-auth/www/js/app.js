var LINKEDIN = {};

var app = angular.module('starter', [
  'ionic', 
  'auth0',
  'angular-jwt',
  'firebase'
]);

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

app.config(function(authProvider, jwtInterceptorProvider, $httpProvider) {
  // Configure Auth0
  authProvider.init({
    domain: 'ionicebook.auth0.com',
    clientID: 'eVuc9hYlogywlBFmSA89QuO2bif6oC3J',
    loginState: 'login'
  });

  jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
    var idToken = LINKEDIN.token;
    var refreshToken = LINKEDIN.refreshToken;
    if (!idToken || !refreshToken) {
      return null;
    }
    if (jwtHelper.isTokenExpired(idToken)) {
      return auth.refreshIdToken(refreshToken).then(function(idToken) {
        LINKEDIN.token = idToken;
        return idToken;
      });
    } else {
      return idToken;
    }
  }

  $httpProvider.interceptors.push('jwtInterceptor');
});

app.controller('LoginCtrl', function($scope, $rootScope, auth) {
  $scope.login = function() {
    auth.signin({
      closable: false,
      // This asks for the refresh token
      // So that the user never has to log in again
      authParams: {
        scope: 'openid offline_access'
      }
    }, function(profile, idToken, accessToken, state, refreshToken) {
      LINKEDIN.profile = profile; 
      $scope.profile = profile;
      console.log('profile:');
      console.log(profile);
      LINKEDIN.token = idToken;
      LINKEDIN.refreshToken = refreshToken;
      auth.getToken({
        api: 'firebase'
      }).then(function(delegation) {
        console.log('delegation:');
        console.log(delegation);
      }, function(error) {
        console.log("There was an error logging in", error);
      })
    }, function(error) {
      console.log("There was an error logging in", error);
    });
  }
  
  $scope.logout = function() {
    auth.signout();
    LINKEDIN = {};
    $scope.profile = undefined;
  }
});