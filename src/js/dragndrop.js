'use strict';

// Custom event that will be called everytime a draggable is dropped
const droppingEvent = new CustomEvent('dropping');

/**
 * Take every element that have a class recognized by the script and apply
 * them the corresponding behaviour.
 * The classes that are recognized by the script are:
 *   .draggable - An element having that class can be dragged all over the
 *                place.
 *   .drop-anchor - A drop anchor is a kind of stop where when a draggable with
 *                  the right classes is dropped onto, this one is tied to the
 *                  drop anchor.
 *   .draggable--drop-anchor-sensitive - Requires the draggable class. An
 *                                       element with this class will react when
 *                                       dropped onto a drop anchor.
 *   .draggable--drop-anchor-exclusive - Requires the draggable class. Cannot be
 *                                       used with the
 *                                       draggable--drop-anchor-sensitive class
 *                                       (no effect if so). The draggable will
 *                                       only stay at the position it is
 *                                       released when it is dropped onto a drop
 *                                       anchor, otherwise it will return to its
 *                                       original position.
 *   .drop-anchor-max-elements-X - Where X is an integer. Requires the
 *                                 drop-anchor class. A drop anchor with a such
 *                                 class will only accept to tie a draggable to
 *                                 itself if it does not have more than X
 *                                 children.
 */
function setUpDraggables () {
  const draggables = document.querySelectorAll('.draggable');
  Array.prototype.forEach.call(draggables, makeDraggable);
  const dropAnchorSensitives = document.querySelectorAll('.draggable--drop-anchor-sensitive');
  Array.prototype.forEach.call(dropAnchorSensitives, makeAnchorSensitive);
  const dropAnchorExclusives = document.querySelectorAll('.draggable--drop-anchor-exclusive');
  Array.prototype.forEach.call(dropAnchorExclusives, makeAnchorExclusive);
  Array.prototype.forEach.call(document.querySelectorAll('.drop-anchor'), v => { v.style.zIndex = '998'; });
}

/**
 * Make the element an object you can drag and drop.
 * @param {DOMNode} element
 */
function makeDraggable (element) {
  element.style.zIndex = '999';
  element.addEventListener('mousedown', (event) => {
    element.classList.add('dragging');
    element.style.zIndex = '1000';
    const drag = dragger(event);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', drag);
      element.classList.remove('dragging');
      element.style.zIndex = '999';
      document.dispatchEvent(droppingEvent);
    });
  });
}

/**
 * Higher-order function that return the event listener to be used on mouse
 * movement.
 * @param {DOMEvent} baseEvent - The mouse down event triggered when the
 *                               draggable was starting to be dragged.
 */
function dragger (baseEvent) {
  const layerX = baseEvent.layerX;
  const layerY = baseEvent.layerY;
  const element = baseEvent.target;
  const parentRect = element.parentElement.getBoundingClientRect();
  return function (event) {
    element.style.top = (event.clientY - layerY - parentRect.top) + 'px';
    element.style.left = (event.clientX - layerX - parentRect.left) + 'px';
  };
}

/**
 * Make element match the drop anchor sensitive behaviour.
 * @param {DOMNode} element
 */
function makeAnchorSensitive (element) {
  const sensitive = sensitivizer(element);
  document.addEventListener('mouseup', sensitive);
}

/**
 * Higher-order function that return the event listener to be used on mouse
 * up, when the sensitive draggable is dropped.
 * @param {DOMNode} element - The draggable to make sensitive.
 */
function sensitivizer (element) {
  return function (event) {
    if (element.classList.contains('dragging')) {
      const dropAnchors = document.querySelectorAll('.drop-anchor');
      const availableDropAnchors = Array.prototype.filter.call(
        dropAnchors,
        v => v.childElementCount < getMaxElements(v)
      );
      Array.prototype.forEach.call(availableDropAnchors,
        (dropAnchor) => {
          const dropAnchorBoundaries = dropAnchor.getBoundingClientRect();
          if (areXYInsideRect(event.clientX, event.clientY, dropAnchorBoundaries)) {
            dropAnchor.appendChild(element);
            element.style.top = '0px';
            element.style.left = '0px';
          }
        }
      );
    }
  };
}

/**
 * Check if x and y are inside rect.
 * @param {number} x
 * @param {number} y
 * @param {DOMRect} rect
 */
function areXYInsideRect (x, y, rect) {
  return y > rect.top && y < rect.bottom && x > rect.left && x < rect.right;
}

/**
 * Return the maximum elements a drop-anchor can contain.
 * @param {DOMNode} element - The drop anchor to examine.
 */
function getMaxElements (element) {
  const maxElementsClass = Array.prototype.reduce.call(element.classList,
    (a, v) => /drop-anchor--max-elements-[0-9]+/.test(v) ? v : a,
    'drop-anchor--max-elements-1');
  return parseInt(maxElementsClass.slice(26));
}

/**
 * Make element match the drop anchor exclusive behaviour.
 * @param {DOMNode} element
 */
function makeAnchorExclusive (element) {
  if (!element.classList.contains('draggable--drop-anchor-sensitive')) {
    const sensitive = sensitivizer(element);
    document.addEventListener('mouseup', (event) => {
      sensitive(event);
      if (element.classList.contains('dragging')) {
        element.style.top = '0px';
        element.style.left = '0px';
      }
    });
  } else {
    // Warn if the element is already sensitive.
    console.warn('Warning: A draggable is both sensitive and exclusive to drop',
                 'anchors! Sensitiveness has priority over exclusiveness.');
  }
}
