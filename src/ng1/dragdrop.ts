angular.module('ng-dragdrop', [])

.directive('ngDroppable', () => {
  return {
    restrict: 'EA',
    scope: true,
    controller: NGDroppable
  };
})

.directive('ngDraggable', () => {
  return {
    restrict: 'EA',
    scope: true,
    controller: NGDraggable
  };
})

class NGDraggable {

	public static $inject = [
		'$element',
		'$scope',
		'$attrs',
		'$parse'
	];

	constructor(
		$element: ng.IRootElementService,
		$scope: ng.IScope,
		$attrs: ng.IAttributes,
		$parse: ng.IInterpolateService
	) {
		var parsed = $parse($attrs['ngDraggable']);
		var handler = makeDraggable($element[0], () => parsed($scope));

		$scope.$on('$destroy', handler);
	}

}


class NGDroppable {

	public static $inject = [
		'$element',
		'$scope',
		'$attrs',
		'$parse'
	];

	constructor(
		$element: ng.IRootElementService,
		$scope: ng.IScope,
		$attrs: ng.IAttributes,
		$parse: ng.IParseService
	) {
		var callbacks = $parse($attrs['ngDroppable'])($scope);
		$scope.$on('$destroy', makeDroppable($element[0], (data) => {
			for(var key in data) {
				if (callbacks[key]) {
					$scope.$eval(callbacks[key], {
            $data: data[key]
					});
				}
			}
      $scope.$apply();
		}));
	}

}
