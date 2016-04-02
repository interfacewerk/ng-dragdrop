(function() {


  function makeDraggable(element, data) {
    element.setAttribute('draggable', 'true');
    var dragstart = function(dragEvent) {
      dragEvent.dataTransfer.effectAllowed = 'move';
      dragEvent.dataTransfer.setData('text/json', JSON.stringify(data()));
    };
    element.addEventListener('dragstart', dragstart);
    return function() { element.removeEventListener('dragstart', dragstart); };
  }
  function makeDroppable(element, onDrop) {
    var dragover = function(dragEvent) {
      dragEvent.preventDefault();
      dragEvent.dataTransfer.dropEffect = 'move';
    };
    var dragenter = function() { element.classList.add('gl-droppable-over'); };
    var dragleaveAndend = function() {
      element.classList.remove('gl-droppable-over');
    };
    var drop = function(dragEvent) {
      dragEvent.preventDefault();
      var data = JSON.parse(dragEvent.dataTransfer.getData('text/json'));
      element.classList.remove('gl-droppable-over');
      onDrop(data);
    };
    element.addEventListener('drop', drop);
    element.addEventListener('dragover', dragover);
    element.addEventListener('dragleave dragend', dragleaveAndend);
    element.addEventListener('dragenter', dragenter);
    return function() {
      element.removeEventListener('drop', drop);
      element.removeEventListener('dragover', dragover);
      element.removeEventListener('dragleave dragend', dragleaveAndend);
      element.removeEventListener('dragenter', dragenter);
    };
  }
  angular.module('ng-dragdrop', [])
      .directive(
          'ngDroppable',
          function() {
            return {restrict: 'EA', scope: true, controller: NGDroppable};
          })
      .directive('ngDraggable', function() {
        return {restrict: 'EA', scope: true, controller: NGDraggable};
      });
  var NGDraggable = (function() {
    function NGDraggable($element, $scope, $attrs, $parse) {
      var parsed = $parse($attrs['ngDraggable']);
      var handler =
          makeDraggable($element[0], function() { return parsed($scope); });
      $scope.$on('$destroy', handler);
    }
    NGDraggable.$inject = ['$element', '$scope', '$attrs', '$parse'];
    return NGDraggable;
  }());
  var NGDroppable = (function() {
    function NGDroppable($element, $scope, $attrs, $parse) {
      var callbacks = $parse($attrs['ngDroppable'])($scope);
      $scope.$on('$destroy', makeDroppable($element[0], function(data) {
                   for (var key in data) {
                     if (callbacks[key]) {
                       $scope.$eval(callbacks[key], {$data: data[key]});
                     }
                   }
                   $scope.$apply();
                 }));
    }
    NGDroppable.$inject = ['$element', '$scope', '$attrs', '$parse'];
    return NGDroppable;
  }());


})();
