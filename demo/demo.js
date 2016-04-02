angular.module('Demo', ['ng-dragdrop'])

.controller('MyFirstController', function ($scope, $interval) {
  $scope.valueA = 1;
  $scope.valueB = 1;
  $interval(function() {
    $scope.valueA = Math.round(10*Math.random());
    $scope.valueB = Math.round(10*Math.random());
  }, 2000);
})

.controller('MySecondController', function ($scope) {
  $scope.dragged = [];
  $scope.onTypeADragged = function (value) {
    $scope.dragged.push({
      type: 'A',
      value: value
    })
  }

  $scope.onTypeBDragged = function (value) {
    $scope.dragged.push({
      type: 'B',
      value: value
    })
  }
});
