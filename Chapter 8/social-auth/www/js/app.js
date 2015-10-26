var app = angular.module("starter", ["ionic", "firebase"]);

// do all the things ionic needs to get going
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

// create a custom Auth factory to handle $firebaseAuth
app.factory('Auth', function($firebaseAuth, $timeout){
  var ref = new Firebase('https://ionicebook.firebaseio.com');
  var auth = $firebaseAuth(ref);

  return {
    // helper method to login with multiple providers
    login: function (provider, options) {
      var result;
      if (options)
        result = auth.$authWithOAuthPopup(provider, {scope: options});
      else
        result = auth.$authWithOAuthPopup(provider);
      return result;
    },
    // wrapping the unauth function
    logout: function () {
      auth.$unauth();
    },
    // wrap the $onAuth function with $timeout so it processes
    // in the digest loop.
    onAuth: function (callback) {
      auth.$onAuth(function(authData) {
        $timeout(function() {
          callback(authData);
        });
      });
    }
  };
});

app.controller("LoginCtrl", function($scope, Auth) {
  // Initially set no user to be logged in
  $scope.user = null;

  // Assign permission request per provider
  $scope.providerConf = [
    {
      name: "facebook",
      options: "email,user_likes,publish_actions,user_about_me,read_stream"
    },
    {
      name: "twitter"
      // Twitter has no permission object so we don't have to pass the options string
    },
    {
      name: "google",
      options: "profile,email,openid"
    },
  ];

  // Calls $authWithOAuthPopup on $firebaseAuth
  // This will be processed by the InAppBrowser plugin on mobile
  // We can add the user to $scope here or in the $onAuth fn
  $scope.login = function scopeLogin(providerObj) {

    Auth.login(providerObj.name, providerObj.options)
    .then(function(authData){
      console.log('We are logged in ' + providerObj.name);
    })
    .catch(function(error) {
      console.error(error);
    });
  };

  // Logs a user out
  $scope.logout = Auth.logout;

  // detect changes in authentication state
  // when a user logs in, set them to $scope
  Auth.onAuth(function(authData) {
    $scope.user = authData;
    console.log(authData);
    if ($scope.user) {
      switch ($scope.user.provider) {
        case "facebook":
          $scope.user.avatar = authData.facebook.cachedUserProfile.picture.data.url;
          $scope.user.name = authData.facebook.displayName;
          $scope.user.email = authData.facebook.email;
          break;
        case "twitter":
          $scope.user.avatar = authData.twitter.cachedUserProfile.profile_image_url;
          $scope.user.name = authData.twitter.displayName;
          $scope.user.email = authData.twitter.cachedUserProfile.description;
          break;
        case "google":
          $scope.user.avatar = authData.google.cachedUserProfile.picture;
          $scope.user.name = authData.google.displayName;
          $scope.user.email = authData.google.email;
          break;
      }
    }
  });
});
