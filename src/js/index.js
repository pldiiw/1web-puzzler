'use strict';

const size = 1;
setUpPuzzlePicture('media/octocat.jpg');
setUpPuzzleToolbox('media/octocat.jpg', size);
setUpPuzzleBoard(size);
setUpDraggables();
let scores = [5, 6, 8, 15];
actualizeScoreboard(scores);
let t = timer();
window.requestAnimationFrame(t.timer);
document.addEventListener('dropping', () => {
  if (checkCompleteness()) {
    const ti = t.reset();
    scores = scores.concat([ti]);
    actualizeScoreboard(scores);
    UISay('Yeah! You completed the puzzle in ' + ti + ' seconds!');
    resetBoard('media/octocat.jpg', size);
    setUpDraggables();
    t.reset();
  }
})

function actualizeScoreboard (scores) {
  const scoreboardOl = document.querySelector('#scoreboard ol');
  const topScores = scores
    .sort((a, b) => a - b)
    .slice(0, 3)
    .map(v => {
      const li = document.createElement('li');
      li.innerText = v;
      return li;
    });

  if (scoreboardOl.children.length > 0) { removeAllChildren(scoreboardOl); }
  addChildren(scoreboardOl, topScores);
}

function removeAllChildren (element) {
  [...Array(element.children.length)].forEach(v => {
    element.removeChild(element.children[0]);
  });
}

function addChildren (element, children) {
  Array.prototype.forEach.call(children, v => {
    element.append(v);
  });
}

function timer () {
  const chrono = document.querySelector('#chrono p');
  let lap = window.performance.now();
  const _timer = () => {
    chrono.innerText = ((window.performance.now() - lap) / 1000).toFixed(2);
    window.requestAnimationFrame(_timer);
  };
  const _reset = () => {
    const previousLap = lap;
    lap = window.performance.now();
    return ((lap - previousLap) / 1000).toFixed(2);
  };
  return { timer: _timer, reset: _reset };
}

function UISay () {
  const messages = document.querySelector('#messages');

  Array.prototype.forEach.call(messages.children, (v, i) => {
    v.style.opacity -= 0.34;
    if (i > 1) {
      messages.removeChild(v);
    }
  });

  const msg = document.createElement('p');
  msg.innerText = Array.prototype.join.call(arguments, ' ');
  msg.style.opacity = 1;
  msg.style.position = 'relative';
  msg.style.animation = 'newMessage 0.8s';

  messages.insertBefore(msg, messages.children[0]);
}

function getPieces (imgURL, puzzleSize) {
  return [...Array(Math.pow(puzzleSize, 2))].map((v, i) => {
    const piece = document.createElement('div');
    piece.classList.add('w-100', 'h-100', 'draggable',
      'draggable--drop-anchor-exclusive', 'relative', `piece-${i}`);
    piece.style.backgroundImage = `url("${imgURL}")`;
    piece.style.backgroundSize = `${100 * puzzleSize}% ${100 * puzzleSize}%`;
    piece.style.backgroundRepeat = 'no-repeat';
    const row = Math.floor(i / puzzleSize);
    const col = i % puzzleSize;
    piece.style.backgroundPosition =
      `${100 / (puzzleSize - 1) * col}% ${100 / (puzzleSize - 1) * row}%`;

    return piece;
  });
}

function shuffleArray (arr) {
  if (arr.length > 0) {
    const n = Math.floor(Math.random() * arr.length);
    const elt = arr[n];
    const remainder = arr.slice(0, n).concat(arr.slice(n + 1));
    return [elt].concat(shuffleArray(remainder));
  } else {
    return [];
  }
}

function setUpPuzzleToolbox (imgURL, puzzleSize) {
  const puzzleToolbox = document.querySelector('#puzzle-toolbox');

  addDropAnchors(puzzleToolbox, puzzleSize);

  const shuffledPieces = shuffleArray(getPieces('media/octocat.jpg', puzzleSize));
  const dropAnchors = puzzleToolbox.querySelectorAll('.drop-anchor');
  Array.prototype.forEach.call(dropAnchors, (v, i) => v.append(shuffledPieces[i]));
}

function setUpPuzzleBoard (puzzleSize) {
  const puzzleBoard = document.querySelector('#puzzle-board');
  addDropAnchors(puzzleBoard, puzzleSize);
}

function setUpPuzzlePicture (imgURL) {
  const puzzlePicture = document.querySelector('#puzzle-picture');

  puzzlePicture.style.backgroundImage = `url("${imgURL}")`;
  puzzlePicture.style.backgroundSize = '100% 100%';
  puzzlePicture.style.backgroundRepeat = 'no-repeat';
}

function addDropAnchors (element, puzzleSize) {
  [...Array(puzzleSize)].forEach(() => {
    const row = document.createElement('div');
    row.classList.add('w-100');
    row.style.height = `calc(100% / ${puzzleSize})`;

    [...Array(puzzleSize)].forEach(() => {
      const dropAnchor = document.createElement('div');
      dropAnchor.classList.add('drop-anchor', 'h-100', 'fl', 'ba', 'b--black-50', 'bw1');
      dropAnchor.style.width = `calc(100% / ${puzzleSize})`;
      row.append(dropAnchor);
    });

    element.append(row);
  });
}

function checkCompleteness () {
  return Array.prototype.every.call(
    document.querySelectorAll('#puzzle-board .drop-anchor'),
    (v, i) => Array.prototype.includes.call(v.children[0].classList, `piece-${i}`)
  );
}

function resetBoard (imgURL, puzzleSize) {
  resetPuzzleToolbox(imgURL, puzzleSize);
  resetPuzzleBoard(puzzleSize);
  setUpPuzzlePicture(imgURL, puzzleSize);
}

function resetPuzzleBoard (puzzleSize) {
  removeAllChildren(document.querySelector('#puzzle-board'));
  setUpPuzzleBoard(puzzleSize);
}

function resetPuzzleToolbox (imgURL, puzzleSize) {
  removeAllChildren(document.querySelector('#puzzle-toolbox'));
  setUpPuzzleToolbox(imgURL, puzzleSize);
}

// TODO: Doc
// TODO: User choose difficulty
// TODO: Add pictures
