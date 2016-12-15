'use strict';

// .draggable
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
    element.classList.add('dragging');
    const move = mover(event);
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move);
      element.classList.remove('dragging');
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
  const parentRect = element.parentElement.getBoundingClientRect();
  return function (event) {
    element.style.top = (event.clientY - layerY - parentRect.top) + 'px';
    element.style.left = (event.clientX - layerX - parentRect.left) + 'px';
  };
}

// .draggable--drop-anchor-sensitive
const dropAnchorSensitives = document.querySelectorAll('.draggable--drop-anchor-sensitive');
Array.prototype.forEach.call(dropAnchorSensitives, makeAnchorSensitive);

function makeAnchorSensitive (element) {
  const bound = bounder(element);
  document.addEventListener('mouseup', bound);
}

function bounder (element) {
  return function (event) {
    if (element.classList.contains('dragging')) {
      const dropAnchors = document.querySelectorAll('.drop-anchor');
      const availableDropAnchors = Array.prototype.filter.call(dropAnchors,
        v => v.childElementCount === 0
      );
      Array.prototype.forEach.call(availableDropAnchors,
        (dropAnchor) => {
          const dropAnchorBoundaries = dropAnchor.getBoundingClientRect();

          if (isXYInsideRect(event.clientX, event.clientY, dropAnchorBoundaries)) {
            dropAnchor.appendChild(element);
            element.style.top = '0px';
            element.style.left = '0px';
          }
      });
    }
  };
}

function isXYInsideRect (x, y, rect) {
  return y > rect.top && y < rect.bottom && x > rect.left && x < rect.right;
}

// .draggable--drop-anchor-exclusive
const dropAnchorExclusives = document.querySelectorAll('.draggable--drop-anchor-exclusive');
Array.prototype.forEach.call(dropAnchorExclusives, makeAnchorExclusive);

function makeAnchorExclusive (element) {
  const bound = bounder(element);
  document.addEventListener('mouseup', (event) => {
    bound(event);
    if (element.classList.contains('dragging')) {
      element.style.top = '0px';
      element.style.left = '0px';
    }
  });
}
