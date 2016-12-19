'use strict';

const pictures = [
  'media/octocat.jpg',
  'media/roses.jpg',
  'media/futura.jpg',
  'media/hongkong.jpg'
];
let timer = launchTimer();

const difficultySelectionMenu = document.querySelector('#difficulty-selection-menu');
const difficultyChoices = document.querySelectorAll('#difficulty-selection-menu div div');
Array.prototype.forEach.call(difficultyChoices, (v, i) => {
  if (i < 3) {
    v.addEventListener('click', () => {
      difficultySelectionMenu.style.animation = 'slideUp 0.8s ease-in-out forwards';
      const choice = parseInt(v.attributes.value.value);
      initializeGame(pickRandomArrayElt(pictures), choice, timer);
    });
  } else {
    v.querySelector('p').addEventListener('click', () => {
      difficultySelectionMenu.style.animation = 'slideUp 0.8s ease-in-out forwards';
      initializeGame(
        pickRandomArrayElt(pictures),
        parseInt(v.querySelector('input[name="custom-difficulty"]').value),
        timer
      );
    });
  }
});

function pickRandomArrayElt (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function initializeGame (picture, puzzleSize, timer) {
  setUpGameBoard(picture, puzzleSize, timer);
  timer.reset();
}

function setUpGameBoard (picture, puzzleSize, timer) {
  setUpPuzzlePicture(picture);
  setUpPuzzleToolbox(picture, puzzleSize);
  setUpPuzzleBoard(puzzleSize);
  setUpDraggables();
  setUpWinCondition(puzzleSize, timer);
}

function launchTimer () {
  let timer = Timer();
  window.requestAnimationFrame(timer.timer);
  return timer;
}

function setUpWinCondition (puzzleSize, timer) {
  document.addEventListener('dropping', () => {
    if (checkCompleteness()) {
      const userTime = timer.reset();
      UISay(`Yeah! You completed the puzzle in ${userTime} seconds!`);

      const scores = [userTime].concat(
        Array.prototype.reduce.call(
          document.querySelectorAll('#scoreboard ol li'),
          (a, v) => a.concat([v.innerText]),
          []
        )
      );
      actualizeScoreboard(scores);
      resetBoard(pickRandomArrayElt(pictures), puzzleSize, timer);
    }
  })
}

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

function Timer () {
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

  const shuffledPieces = shuffleArray(getPieces(imgURL, puzzleSize));
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
  setUpDraggables();
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
