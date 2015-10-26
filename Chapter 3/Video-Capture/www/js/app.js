var app = angular.module('starter', ['ionic', 'ngCordova']);

app.controller('VideoCtrl', function($scope, $cordovaCapture) {
  $scope.data = {
    videoPath: ""
  };

  $scope.captureVideo = $scope.captureVideo = function() {
    var options = { limit: 3, duration: 15 };

    $cordovaCapture.captureVideo(options).then(function(videoData) {
      // Success! Video data is here
      $scope.data.videoPath = "file:/" + videoData[0].fullPath;
    }, function(err) {
      // An error occurred. Show a message to the user
      console.log(err);
    });
  }
});

app.directive("cordovaVideo", function () {
  return {
    restrict: 'AEC',
    scope: {src: '='},
    // Using replace template doesn't work because the DOM didn't get re-evaluate
    // Therefore the src value doesn't get updated
    // replace: true,
    // template: "<video width=\"320\" height=\"240\" controls>"+
    //           "<source src=\"{{ src | trusted }}\" type=\"video/quicktime\">"+
    //           "</video>",
    link: function(scope, element, attrs) {
      scope.$watch('src', function(newVal, oldVal) {
        if (scope.src != "") {
          // Create a div object
          var div = document.createElement('div');
          div.innerHTML = "<video id=\"myCordovaVideo\" controls>"+
                          "<source src=\"" + scope.src + "\" type=\"video/quicktime\">"+
                          "</video>";
          
          // Delete previous video if exists
          var previousDiv = document.getElementById('myCordovaVideo');
          if (previousDiv)
            previousDiv.remove();

          // Append new <video> tag into the DOM
          element.append(div);
        }

      });
    }
  }
});