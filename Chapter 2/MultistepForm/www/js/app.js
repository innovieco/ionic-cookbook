var app = angular.module('starter', ['ionic'])

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.backButton.previousTitleText(false).text('');
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $ionicConfigProvider.views.maxCache(0);

  $stateProvider
  .state('step1', {
    url: "/step1",
    data: {
      step: 1
    },
    templateUrl: "templates/step1.html",
    controller: 'Step1Ctrl'
  })
  .state('step2', {
    url: "/step2",
    data: {
      step: 2
    },
    templateUrl: "templates/step2.html",
    controller: 'Step2Ctrl'
  })
  .state('step3', {
    url: "/step3",
    data: {
      step: 3
    },
    templateUrl: "templates/step3.html",
    controller: 'Step3Ctrl'
  })
  .state('done', {
    url: "/done",
    data: {
      step: 4
    },
    templateUrl: "templates/done.html",
    controller: 'DoneCtrl'
  });

  $urlRouterProvider.otherwise("/step1");
});

app.controller('AppCtrl', function($scope, $rootScope, $ionicLoading, $timeout) {
  $scope.hideBackButton = false;
  $scope.data = {
    firstname: '',
    middlename: '',
    lastname: '',
    cell: '',
    email: '',
    comments: '',
    tos: false
  };

  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    if ((toState.name == 'done') || (toState.name == 'step1'))
      $scope.hideBackButton = true;
    else 
      $scope.hideBackButton = false;
  });

});

app.controller('Step1Ctrl', function($scope) {
  $scope.step1Submitted = false;

  $scope.submit = function() {
    $scope.step1Submitted = true;
  }
});

app.controller('Step1FormCtrl', function($scope, $rootScope, $state) {
  var validate = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (($scope.step1Form.$invalid) && (toState.data.step > fromState.data.step))
      event.preventDefault();
  });

  $scope.$on('$destroy', validate);
});

app.controller('Step2Ctrl', function($scope) {
  $scope.step2Submitted = false;

  $scope.submit = function() {
    $scope.step2Submitted = true;
  }
});

app.controller('Step2FormCtrl', function($scope, $rootScope, $state) {
  var validate = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (($scope.step2Form.$invalid) && (toState.data.step > fromState.data.step))
      event.preventDefault();
  });

  $scope.$on('$destroy', validate);
});

app.controller('Step3Ctrl', function($scope) {
  $scope.step3Submitted = false;

  $scope.submit = function() {
    $scope.step3Submitted = true;
  }
});

app.controller('Step3FormCtrl', function($scope, $rootScope, $timeout) {
  $timeout(function() {
    $scope.step3Form.tos.$setValidity('agree', $scope.data.tos);
  });

  $scope.checkTos = function() {
    $scope.step3Form.tos.$setValidity('agree', $scope.data.tos);
  }

  var validate = $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    if (($scope.step3Form.$invalid) && (toState.data.step > fromState.data.step))
      event.preventDefault();
  });

  $scope.$on('$destroy', validate);
});

app.controller('DoneCtrl', function($scope, $rootScope, $ionicHistory) {
  $scope.reset = function() {
    angular.copy({
      firstname: '',
      middlename: '',
      lastname: '',
      cell: '',
      email: '',
      comments: '',
      tos: false
    }, $scope.data);
  }

  var validate = $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
    $ionicHistory.clearHistory();
  });

  $scope.$on('$destroy', validate);

});