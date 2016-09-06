var droppableOverClass = 'ng-droppable-over';

function makeDraggable(element: HTMLElement, data:() => Object, onDragstart: (data: Object) => any, onDragend: (data: Object) => any, dragImage?: string) {
  element.setAttribute('draggable', 'true');

  var dragstart = (dragEvent:DragEvent) => {
    dragEvent.dataTransfer.effectAllowed = 'move';
    dragEvent.dataTransfer.setData('text/json', JSON.stringify(data()));
    if (dragImage && dragEvent.dataTransfer['setDragImage']) dragEvent.dataTransfer['setDragImage'](dragImage, 0, 0);
		onDragstart(data());
  };

  var dragend = () => {
    onDragend(data());
  }

  element.addEventListener('dragstart', dragstart);
  element.addEventListener('dragend', dragend);

  return () => {
    element.removeEventListener('dragstart', dragstart);
    element.removeEventListener('dragend', dragend);
  }
}

function makeDroppable(element: HTMLElement, onDrop:(data:Object) => any) {
  var dragover = (dragEvent:DragEvent) => {
    dragEvent.preventDefault();
    dragEvent.dataTransfer.dropEffect = 'move';
    element.classList.add(droppableOverClass);
  };

  var dragenter = () => {
    element.classList.add(droppableOverClass);
  };

  var dragleaveAndend = () => {
    element.classList.remove(droppableOverClass);
  };

  var drop = (dragEvent:DragEvent) => {
    dragEvent.preventDefault();
    let data : string = JSON.parse(dragEvent.dataTransfer.getData('text/json'));
    element.classList.remove(droppableOverClass);
    onDrop(data);
  };
  element.addEventListener('drop', drop);
  element.addEventListener('dragover', dragover);
  element.addEventListener('dragleave', dragleaveAndend);
  element.addEventListener('dragenter', dragenter);

  return () => {
    element.removeEventListener('drop', drop);
    element.removeEventListener('dragover', dragover);
    element.removeEventListener('dragleave', dragleaveAndend);
    element.removeEventListener('dragenter', dragenter);
  }
}
