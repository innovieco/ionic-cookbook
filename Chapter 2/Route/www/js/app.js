var app = angular.module('starter', ['ionic'])

app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/app.html",
    controller: "AppCtrl"
  })
    .state('app.students', {
      url: "/students",
      views: {
        'students': {
          templateUrl: "templates/students.html",
          controller: 'StudentsCtrl'
        }
      }
    })
    .state('app.students.details', {
      url: "/details/:id/:age",
      views: {
        'details': {
          templateUrl: "templates/details.html",
          controller: 'StudentDetailsCtrl'
        }
      }
    })
    .state('app.classes', {
      url: "/classes",
      views: {
        'classes': {
          templateUrl: "templates/classes.html",
          controller: 'ClassesCtrl'
        }
      }
    })
    .state('app.classes.details', {
      url: "/details/:id"
    });

  $urlRouterProvider.otherwise("/app/students");
});

app.controller('AppCtrl', function($scope, $rootScope, $ionicLoading, $timeout) {

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

    if (toState.name == 'app.classes.details')
      return;

    $ionicLoading.show({
      template: '<b>Previous state:</b> ' + fromState.name + '<br/><b>Current state</b>: ' + toState.name,
      noBackdrop: true
    });

    $timeout(function() {
      $ionicLoading.hide();
    }, 1000);
  });

});

app.controller('StudentsCtrl', function($scope) {
  $scope.title = '<div class="round-icon"><i class="icon ion-person-stalker"></i></div>';
});

app.controller('StudentDetailsCtrl', function($scope, $stateParams) {
  $scope.id = $stateParams.id;
  $scope.age = $stateParams.age;
});

app.controller('ClassesCtrl', function($scope, $state) {
  $scope.title = '<div class="round-icon"><i class="icon ion-university"></i></div>';

  $scope.gotoStudents = function() {
    $state.go('app.students');
  }
});