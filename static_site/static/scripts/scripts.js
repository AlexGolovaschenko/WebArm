var app = angular.module('Playground', []);


app.controller('PlaygroundControll', function($scope, $http, $interval) {

  requestData = function() {
    $http.get("http://localhost:8000/api-1/device").then(function (response) {
      $scope.DeviceData = response.data;
    });
  };

 // initial request
  requestData();

  // start requesting by interval
  $interval(function(){requestData();}, 1000);

});
