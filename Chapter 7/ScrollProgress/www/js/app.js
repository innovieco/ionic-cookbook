var app = angular.module('starter', ['ionic'])

app.controller('MyCtrl', function($scope, $ionicScrollDelegate) {
  
  $scope.items = [];
  for (var i=1; i<=100; i++) {
    $scope.items.push({ id: i });
  }

});

app.directive('scrollProgress', function($ionicScrollDelegate) {
  return {
    template: '<div class="progress" style=\'{{percentage}}\'></div>',
    link: function (scope, element, attrs) {
      scope.percentage = '0%';

      ionic.DomUtil.ready(function() {
        var windowHeight = $ionicScrollDelegate._instances[0].element.clientHeight,
            scrollHeight = $ionicScrollDelegate._instances[0].element.querySelector('div.scroll').clientHeight,
            delta = scrollHeight - windowHeight;

        $ionicScrollDelegate._instances[0].$element.bind('scroll', function(e) {
          var scrollPosition = $ionicScrollDelegate.getScrollPosition().top;
          scope.percentage = 'width: ' + (scrollPosition / delta * 100) + '%'; 
          scope.$digest();
        });        
      });
    }
  };
});