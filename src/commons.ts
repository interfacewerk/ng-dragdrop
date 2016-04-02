function makeDraggable(element: HTMLElement, data:() => Object) {
  element.setAttribute('draggable', 'true');

  var dragstart = (dragEvent:DragEvent) => {
    dragEvent.dataTransfer.effectAllowed = 'move';
    dragEvent.dataTransfer.setData('text/json', JSON.stringify(data()));
  };

  element.addEventListener('dragstart', dragstart);

  return () => {
    element.removeEventListener('dragstart', dragstart);
  }
}

function makeDroppable(element: HTMLElement, onDrop:(data:Object) => any) {
  var dragover = (dragEvent:DragEvent) => {
    dragEvent.preventDefault();
    dragEvent.dataTransfer.dropEffect = 'move';
  };

  var dragenter = () => {
    element.classList.add('gl-droppable-over');
  };

  var dragleaveAndend = () => {
    element.classList.remove('gl-droppable-over');
  };

  var drop = (dragEvent:DragEvent) => {
    dragEvent.preventDefault();
    let data : string = JSON.parse(dragEvent.dataTransfer.getData('text/json'));
    element.classList.remove('gl-droppable-over');
    onDrop(data);
  };

  element.addEventListener('drop', drop);
  element.addEventListener('dragover', dragover);
  element.addEventListener('dragleave', dragleaveAndend);
  element.addEventListener('dragend', dragleaveAndend);
  element.addEventListener('dragenter', dragenter);

  return () => {
    element.removeEventListener('drop', drop);
    element.removeEventListener('dragover', dragover);
    element.removeEventListener('dragleave', dragleaveAndend);
    element.removeEventListener('dragend', dragleaveAndend);
    element.removeEventListener('dragenter', dragenter);
  }
}
