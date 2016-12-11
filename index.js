'use strict';

const draggables = document.querySelectorAll('.draggable');
// draggables is an array-like object! Not a proper array object! Therefore, it
// does not have the array's methods, but applying them works.
Array.prototype.forEach.call(draggables, makeDraggable);

function makeDraggable (element) {
  /* Add necesseray eventListeners to make element draggable.
   * Basically, on mousedown, any mouse mouvement is captured and the element
   * is moved to the mouse position until mouseup happens.
   */

  element.addEventListener('mousedown', (event) => {
    const move = mover(event);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move);
    });
  });
}

function mover (baseEvent) {
  /* Higher order function that returns an eventListener function to be used to
   * move baseEvent.target where the mouse pointer is located.
   * layerX and layerY are used to keep the pointer where it was when the
   * baseEvent was triggered relative to the baseEvent.target's origin.
   */

  const layerX = baseEvent.layerX;
  const layerY = baseEvent.layerY;
  const element = baseEvent.target;
  return function (event) {
    element.style.top = (event.clientY - layerY) + 'px';
    element.style.left = (event.clientX - layerX) + 'px';
  };
}
