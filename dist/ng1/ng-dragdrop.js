(function() {


  var droppableOverClass = 'ng-droppable-over';
  function makeDraggable(element, data, onDragstart, onDragend, dragImage) {
    element.setAttribute('draggable', 'true');
    var dragstart = function(dragEvent) {
      dragEvent.dataTransfer.effectAllowed = 'move';
      dragEvent.dataTransfer.setData('text/json', JSON.stringify(data()));
      if (dragImage) dragEvent.dataTransfer.setDragImage(dragImage, 0, 0);
      onDragstart(data());
    };
    var dragend = function() { onDragend(data()); };
    element.addEventListener('dragstart', dragstart);
    element.addEventListener('dragend', dragend);
    return function() {
      element.removeEventListener('dragstart', dragstart);
      element.removeEventListener('dragend', dragend);
    };
  }
  function makeDroppable(element, onDrop) {
    var dragover = function(dragEvent) {
      dragEvent.preventDefault();
      dragEvent.dataTransfer.dropEffect = 'move';
      element.classList.add(droppableOverClass);
    };
    var dragenter = function() { element.classList.add(droppableOverClass); };
    var dragleaveAndend = function() {
      element.classList.remove(droppableOverClass);
    };
    var drop = function(dragEvent) {
      dragEvent.preventDefault();
      var data = JSON.parse(dragEvent.dataTransfer.getData('text/json'));
      element.classList.remove(droppableOverClass);
      onDrop(data);
    };
    element.addEventListener('drop', drop);
    element.addEventListener('dragover', dragover);
    element.addEventListener('dragleave', dragleaveAndend);
    element.addEventListener('dragenter', dragenter);
    return function() {
      element.removeEventListener('drop', drop);
      element.removeEventListener('dragover', dragover);
      element.removeEventListener('dragleave', dragleaveAndend);
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
      var ondragstart = function(data) {
        if ($attrs['ngDraggableDragstart']) {
          $scope.$eval($attrs['ngDraggableDragstart'], {$data: data});
        }
      };
      var ondragend = function() {
        if ($attrs['ngDraggableDragend']) {
          $scope.$eval($attrs['ngDraggableDragend']);
        }
      };
      var handler = makeDraggable($element[0], function() {
        return parsed($scope);
      }, ondragstart, ondragend, $attrs['ngDragImage']);
      $scope.$on('$destroy', handler);
    }
    NGDraggable.$inject = ['$element', '$scope', '$attrs', '$parse'];
    return NGDraggable;
  }());
  var NGDroppable = (function() {
    function NGDroppable($element, $scope, $attrs, $parse) {
      var callbacks = $parse($attrs['ngDroppable'])($scope);
      var onDrop = function(data) {
        for (var key in data) {
          if (callbacks[key]) {
            $scope.$eval(callbacks[key], {$data: data[key]});
          }
        }
        $scope.$apply();
      };
      $scope.$on('$destroy', makeDroppable($element[0], onDrop));
    }
    NGDroppable.$inject = ['$element', '$scope', '$attrs', '$parse'];
    return NGDroppable;
  }());


})();
