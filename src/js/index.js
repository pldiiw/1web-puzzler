'use strict';

// Set images urls
const pictures = [
  'media/octocat.jpg',
  'media/roses.jpg',
  'media/futura.jpg',
  'media/hongkong.jpg'
];
// Start timer
let timer = launchTimer();

// Let user choose difficulty
const difficultySelectionMenu = document.querySelector('#difficulty-selection-menu');
const difficultyChoices = document.querySelectorAll('#difficulty-selection-menu div div');
Array.prototype.forEach.call(difficultyChoices, (v, i) => {
  // 3x3, 4x4 or 5x5
  if (i < 3) {
    v.addEventListener('click', () => {
      // hide menu
      difficultySelectionMenu.style.animation = 'slideUp 0.8s ease-in-out forwards';
      initializeGame(
        pickRandomArrayElt(pictures),
        parseInt(v.attributes.value.value),
        timer
      );
    });
  // custom size
  } else {
    v.querySelector('p').addEventListener('click', () => {
      // hide menu
      difficultySelectionMenu.style.animation = 'slideUp 0.8s ease-in-out forwards';
      initializeGame(
        pickRandomArrayElt(pictures),
        parseInt(v.querySelector('input[name="custom-difficulty"]').value),
        timer
      );
    });
  }
});

/**
 * Return a random element in an array.
 * @param {Array} arr - The array from which the element is randomly selected.
 */
function pickRandomArrayElt (arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Set everything's up to let user player the game.
 * @param {string} picture - The image the player will try to recreate.
 * @param {number} puzzleSize - Number of pieces per side.
 * @param {object} timer - The Timer object.
 */
function initializeGame (picture, puzzleSize, timer) {
  setUpGameBoard(picture, puzzleSize, timer);
  // The game is starting, reset time to 0.
  timer.reset();
}

/**
 * Call other procedures to get the game board ready and also the win condition
 * detection.
 * @param {string} picture - The image the player will try to recreate.
 * @param {number} puzzleSize - Number of pieces per side.
 * @param {object} timer - The Timer object.
 */
function setUpGameBoard (picture, puzzleSize, timer) {
  setUpPuzzlePicture(picture);
  setUpPuzzleToolbox(picture, puzzleSize);
  setUpPuzzleBoard(puzzleSize);
  setUpDraggables();
  setUpWinCondition(puzzleSize, timer);
}

/**
 * Create a Timer object, set its timer function to be called every frame and
 * return the object.
 */
function launchTimer () {
  let timer = Timer();
  window.requestAnimationFrame(timer.timer);
  return timer;
}

/**
 * Add an event listener so that everytime a draggable is dropped, tries to
 * get the register the score and reset the board with a new picture if the
 * puzzle is complete. Globals are dirty, but didn't have time to get this right
 * :(.
 * @param {number} puzzleSize - Number of pieces per side.
 * @param {object} timer - The Timer object.
 */
function setUpWinCondition (puzzleSize, timer) {
  document.addEventListener('dropping', () => {
    if (checkCompleteness()) {
      // Get user time and reset timer
      const userTime = timer.reset();
      // Congrats player
      uiSay(`Yeah! You completed the puzzle in ${userTime} seconds!`);

      // Retrieve other top scores and concatenate them with userTime.
      const scores = [userTime].concat(
        Array.prototype.reduce.call(
          document.querySelectorAll('#scoreboard ol li'),
          (a, v) => a.concat([v.innerText]),
          []
        )
      );
      actualizeScoreboard(scores);

      // New round!
      resetBoard(pickRandomArrayElt(pictures), puzzleSize, timer);
    }
  });
}

/**
 * Given a list of scores, it sort out the 3 best ones and replace the
 * scoreboard list with them.
 * @param {number[]} scores - The scores from which the scoreboard will be
 *                            set.
 */
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

/**
 * Remove all children from an element
 * @param {DOMNode} element
 */
function removeAllChildren (element) {
  [...Array(element.children.length)].forEach(v => {
    element.removeChild(element.children[0]);
  });
}

/**
 * Append all children to element
 * @param {DOMNode} element
 * @param {DOMNode[]} children
 */
function addChildren (element, children) {
  Array.prototype.forEach.call(children, v => {
    element.append(v);
  });
}

/**
 * The Timer object used to manage the chronometer
 */
function Timer () {
  const chrono = document.querySelector('#chrono p');
  // Last reset timestamp
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

/**
 * Add a message to the info board addressed to user.
 * @param {...string} arguments - Concatenated, they will be the message that
 *                                the user will see.
 */
function uiSay () {
  const messages = document.querySelector('#messages');

  Array.prototype.forEach.call(messages.children, (v, i) => {
    v.style.opacity -= 0.34; // Shade previous messages a bit
    // Maximum three messages can be displayed at the same time
    if (i > 1) {
      messages.removeChild(v);
    }
  });

  const msg = document.createElement('p');
  msg.innerText = Array.prototype.join.call(arguments, ' ');
  msg.style.opacity = 1;
  msg.style.position = 'relative';
  msg.style.animation = 'newMessage 0.8s';

  // Insert message atop the others
  messages.insertBefore(msg, messages.children[0]);
}

/**
 * Return an array of ready-to-be-inserted puzzle pieces made from picture.
 * @param {string} picture - The image that will be cropped onto the pieces.
 * @param {number} puzzleSize - Squared, it will be the number of pieces inside
 *                              the returned array.
 */
function getPieces (picture, puzzleSize) {
  return [...Array(Math.pow(puzzleSize, 2))].map((v, i) => {
    const piece = document.createElement('div');
    // The class piece-X is used to know which piece it is.
    piece.classList.add('w-100', 'h-100', 'draggable',
                        'draggable--drop-anchor-exclusive',
                        'relative', `piece-${i}`);
    piece.style.backgroundImage = `url("${picture}")`;
    piece.style.backgroundSize = `${100 * puzzleSize}% ${100 * puzzleSize}%`;
    piece.style.backgroundRepeat = 'no-repeat';
    const row = Math.floor(i / puzzleSize);
    const col = i % puzzleSize;
    piece.style.backgroundPosition =
      `${100 / (puzzleSize - 1) * col}% ${100 / (puzzleSize - 1) * row}%`;

    return piece;
  });
}

/**
 * Given an array, it will return a randomly rearranged version.
 * @param {Array} arr - The array to scramble.
 */
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

/**
 * The toolbox is the area from which the player will drag out the pieces.
 * @param {string} picture - The image the player will try to recreate.
 * @param {number} puzzleSize - Number of pieces per side.
 */
function setUpPuzzleToolbox (picture, puzzleSize) {
  const puzzleToolbox = document.querySelector('#puzzle-toolbox');

  addDropAnchors(puzzleToolbox, puzzleSize);

  const shuffledPieces = shuffleArray(getPieces(picture, puzzleSize));
  const dropAnchors = puzzleToolbox.querySelectorAll('.drop-anchor');
  // Put the scrambled pieces onto the puzzle toolbox
  Array.prototype.forEach.call(dropAnchors, (v, i) => v.append(shuffledPieces[i]));
}

/**
 * The puzzle board is the area where the player has to reconstruct the picture.
 * @param {number} puzzleSize - Number of pieces per side.
 */
function setUpPuzzleBoard (puzzleSize) {
  const puzzleBoard = document.querySelector('#puzzle-board');
  addDropAnchors(puzzleBoard, puzzleSize);
}

/**
 * The puzzle picture is the area where the player can refer to when he wants to
 * see what the picture looks like when put together back.
 * @param {string} picture - The image the player will try to recreate.
 */
function setUpPuzzlePicture (picture) {
  const puzzlePicture = document.querySelector('#puzzle-picture');
  puzzlePicture.style.backgroundImage = `url("${picture}")`;
  puzzlePicture.style.backgroundSize = '100% 100%';
  puzzlePicture.style.backgroundRepeat = 'no-repeat';
}

/**
 * Put the puzzle squares inside element.
 * @param {DOMNode} element - The element to put the puzzle squares inside.
 * @param {number} puzzleSize - The number of rows and columns the puzzle will
 *                              be composed of.
 */
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

/**
 * Verify if all pieces are put in the right order on the puzzle board. If so,
 * the puzzle is done.
 */
function checkCompleteness () {
  return Array.prototype.every.call(
    document.querySelectorAll('#puzzle-board .drop-anchor'),
    (v, i) => {
      return v.children.length > 0
        ? Array.prototype.includes.call(v.children[0].classList, `piece-${i}`)
        : false;
    }
  );
}

/**
 * Reset the entire game board with picture and puzzleSize.
 * @param {string} picture - The image the player will try to recreate.
 * @param {number} puzzleSize - Number of pieces per side.
 */
function resetBoard (picture, puzzleSize) {
  resetPuzzleToolbox(picture, puzzleSize);
  resetPuzzleBoard(puzzleSize);
  setUpPuzzlePicture(picture, puzzleSize);
  setUpDraggables();
}

/**
 * Reset the puzzle board: remove all children and re-set it up.
 * @param {number} puzzleSize - Number of pieces per side.
 */
function resetPuzzleBoard (puzzleSize) {
  removeAllChildren(document.querySelector('#puzzle-board'));
  setUpPuzzleBoard(puzzleSize);
}

/**
 * Reset the puzzle toolbox: remove all children and re-set it up.
 * @param {string} picture - The image the player will try to recreate.
 * @param {number} puzzleSize - Number of pieces per side.
 */
function resetPuzzleToolbox (picture, puzzleSize) {
  removeAllChildren(document.querySelector('#puzzle-toolbox'));
  setUpPuzzleToolbox(picture, puzzleSize);
}
