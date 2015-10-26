angular.module('starter', ['ionic', 'ngStorage'])

.run(function($ionicPlatform, $rootScope, $state, $localStorage) {
  $ionicPlatform.ready(function() {
    $rootScope.$storage = $localStorage.$default({
      seenIntro: false
    });

    if ($rootScope.$storage.seenIntro) {
      event.preventDefault();
      $state.go('app');
    } 
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('intro', {
    url: "/",
    templateUrl: "templates/intro.html",
    controller: 'IntroCtrl'
  })

  .state('app', {
    url: "/app",
    templateUrl: "templates/app.html"
  });

  $urlRouterProvider.otherwise('/');
})

.controller('IntroCtrl', function($scope, $rootScope) {
  $scope.slides = {
    currentSlide: 0
  };
  $scope.title = '<i class="icon ion-android-home"></i>';

  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
    if (index == 2)
      $rootScope.$storage.seenIntro = true;
  };
});
