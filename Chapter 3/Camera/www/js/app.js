var app = angular.module('starter', ['ionic', 'ngCordova']);

app.controller('CameraCtrl', function($scope, $cordovaCamera) {
  $scope.item = {
    data: "",
    imagePath: "Photo capture as Base64",
    destinationFILE_URI: false
  };

  $scope.clickToggle = function() {
    if ($scope.item.destinationFILE_URI)
      $scope.item.imagePath = "Photo capture as File URI";
    else
      $scope.item.imagePath = "Photo capture as Base64";
  }

  $scope.getPicture = function(sourceType) {
    var options = {
      quality : 50,
      allowEdit : true,
      correctOrientation: false,
      targetWidth: 640,
      targetHeight: 1080,
      destinationType: $scope.item.destinationFILE_URI ? Camera.DestinationType.FILE_URI : Camera.DestinationType.DATA_URL,
      sourceType : sourceType,
      encodingType: Camera.EncodingType.JPEG,
      saveToPhotoAlbum: false
    };

    $cordovaCamera.getPicture(options).then(function(imageData) {
      if ($scope.item.destinationFILE_URI) {
        $scope.item.data = imageData;
        $scope.item.imagePath = imageData;
      } else {
        $scope.item.imagePath = "Photo capture as Base64";
        $scope.item.data = "data:image/jpeg;base64," + imageData;
      }
      console.log(imageData);
    }, function(err) {
      alert('Unable to take picture');
    });
  }
})