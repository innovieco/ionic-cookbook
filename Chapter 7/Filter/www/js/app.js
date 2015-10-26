var app = angular.module('starter', ['ionic', 'angular.filter'])

app.controller('MainCtrl', function($scope, $filter) {
  $scope.data = {
    lowercase: '',  
    uppercase: 'Resulted Upper Case'
  }

  $scope.$watch('data.lowercase', function(newVal, oldVal) {
    if (newVal != oldVal)
      $scope.data.uppercase = $filter('ucfirst')(newVal);
  });

  $scope.numberArray = [1,2,3,4,7,8,9];
  $scope.countryCodes = ["IN", "MX", "US", "GB", "FR"];
});

app.filter('languageName', function() {
  var codes = {
    "BR": "Brazil",
    "CA": "Canada",
    "CN": "China",
    "FR": "France",
    "DE": "Germany",
    "IN": "India",
    "IL": "Israel",
    "IT": "Italy",
    "MX": "Mexico",
    "US": "United States"
  }

  return function(input) {
    var output = codes[input] ? codes[input] : "Unknown";
    return output;
  }
});