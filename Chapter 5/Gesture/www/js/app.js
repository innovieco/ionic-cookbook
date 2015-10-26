var app = angular.module('starter', ['ionic'])

app.controller('MainCtrl', function($scope) {
  $scope.pos = {
    x: 0,
    y: 0
  }
});

app.directive('draggable', function($ionicGesture) {
  return {
    link: function (scope, element, attrs) {
      var elementSize = 100;

      var x = Math.round((window.screen.width - elementSize) / 2, 0), 
          y = Math.round((window.screen.height - elementSize) / 2, 0);

      scope.pos.x = x;
      scope.pos.y = y;

      element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + x + 'px, ' + y + 'px, 0)';

      $ionicGesture.on('dragstart', function(ev) {
        console.log('dragstart: ');
        console.log(ev);
      }, element);

      $ionicGesture.on('dragend', function(ev) {
        console.log('dragend: ');
        console.log(ev);
        x += ev.gesture.deltaX;
        y += ev.gesture.deltaY;
      }, element);

      $ionicGesture.on('drag', function(ev) {
        console.log('drag: ');
        console.log(ev);

        scope.pos.x = Math.round(x + ev.gesture.deltaX, 0);
        scope.pos.y = Math.round(y + ev.gesture.deltaY, 0);
        scope.$digest();

        element[0].style[ionic.CSS.TRANSFORM] = 'translate3d(' + (x + ev.gesture.deltaX)+ 'px, ' + (y + ev.gesture.deltaY) + 'px, 0)';
      }, element);

    }
  }
});