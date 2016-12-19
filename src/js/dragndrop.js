'use strict';

function setUpDraggables (inside) {
  const draggables = document.querySelectorAll('.draggable');
  Array.prototype.forEach.call(draggables, makeDraggable);
  const dropAnchorSensitives = document.querySelectorAll('.draggable--drop-anchor-sensitive');
  Array.prototype.forEach.call(dropAnchorSensitives, makeAnchorSensitive);
  const dropAnchorExclusives = document.querySelectorAll('.draggable--drop-anchor-exclusive');
  Array.prototype.forEach.call(dropAnchorExclusives, makeAnchorExclusive);
  Array.prototype.forEach.call(document.querySelectorAll('.drop-anchor'), v => v.style.zIndex = '998');
}

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
    });
  });
}

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

function makeAnchorSensitive (element) {
  const sensitive = sensitivizer(element);
  document.addEventListener('mouseup', sensitive);
}

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
      });
    }
  };
}

function areXYInsideRect (x, y, rect) {
  return y > rect.top && y < rect.bottom && x > rect.left && x < rect.right;
}

function getMaxElements (element) {
  const maxElementsClass = Array.prototype.reduce.call(element.classList,
    (a, v) => /drop-anchor--max-elements-[0-9]+/.test(v) ? v : a,
    'drop-anchor--max-elements-1');
  return parseInt(maxElementsClass.slice(26));
}

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
    console.warn('Warning: A draggable is both sensitive and exclusive to drop',
                 'anchors! Sensitiveness has priority over exclusiveness.');
  }
}
