var app = angular.module('starter', ['ionic'])

app.controller('MyCtrl', function($scope, $ionicScrollDelegate) {
  
  $scope.items = [];
  for (var i=1; i<=100; i++) {
    $scope.items.push({ id: i });
  }

});

app.directive('zoomOnScroll', function($ionicScrollDelegate) {
  return {
    link: function (scope, element, attrs) {
      ionic.DomUtil.ready(function() {

        var scrollContent = document.querySelector('.scroll-content'),
            windowHeight = $ionicScrollDelegate._instances[0].element.clientHeight,
            windowWidth = $ionicScrollDelegate._instances[0].element.clientWidth;

        $ionicScrollDelegate._instances[0].$element.bind('scroll', function(e) {
          
          function callback() {
            var scrollPosition = $ionicScrollDelegate.getScrollPosition().top,
                zoom = (-(scrollPosition*2 / windowHeight) + 1) * 100,
                offset = (windowWidth * ((zoom - 100) / 100)) / 2;

            if (zoom > 100) {
              scrollContent.style['background-size'] = zoom + '%';
              scrollContent.style['background-position-x'] = -offset + 'px';
            }
          }

          ionic.DomUtil.requestAnimationFrame(callback);
          
        });        
      });
    }
  };
});