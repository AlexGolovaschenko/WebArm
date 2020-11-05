var app = angular.module('Playground', []);


app.controller('PlaygroundControll', function($scope, $http, $interval) {

  requestData = function() {
    $http.get("http://bfcloud.space/api/v1/device").then(function (response) {
      $scope.DeviceData = response.data;
    });
    $http.get("http://bfcloud.space/api/v1/device/current-values").then(function (response) {
      $scope.Tags = response.data;
    });
  };

  // initial request
  requestData();

  // start requesting by interval
  $interval(function(){requestData();}, 1000);

});
