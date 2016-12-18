const size = 3;
setUpPuzzleToolbox('media/octocat.jpg', size);
setUpPuzzleBoard(size);
setUpPuzzlePicture('media/octocat.jpg');
actualizeScoreboard([4, 2, 9, 19, 5]);
UISay('new message.');
UISay('you', 'win!');
let t = timer();
window.requestAnimationFrame(t.timer);

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
  Array.prototype.forEach.call(element.children, v => {
    element.removeChild(v);
  });
}

function addChildren (element, children) {
  Array.prototype.forEach.call(children, v => {
    element.append(v);
  });
}

function timer () {
  const chrono = document.querySelector('#chrono');
  let lap = window.performance.now();
  const _timer = () => {
    chrono.innerText = ((window.performance.now() - lap) / 1000).toFixed(2);
    window.requestAnimationFrame(_timer);
  };
  const _reset = () => {
    const previousLap = lap;
    lap = window.performance.now();
    return lap - previousLap;
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
    piece.classList.add('w-100', 'h-100', `piece-${i}`);

    piece.style.backgroundImage = `url("${imgURL}")`;
    piece.style.backgroundSize = ''; // TODO
    piece.style.backgroundRepeat = 'no-repeat';
    const row = Math.floor(i / puzzleSize);
    const col = i % puzzleSize;
    piece.style.backgroundPosition = `${col * 50}% ${row * 50}%`;

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
  puzzlePicture.style.backgroundSize = '100% 100%'; // TODO
  puzzlePicture.style.backgroundRepeat = 'no-repeat';
}

function addDropAnchors (element, puzzleSize) {
  [...Array(puzzleSize)].forEach(() => {
    const row = document.createElement('div');
    row.classList.add('w-100', 'h-third');

    [...Array(puzzleSize)].forEach(() => {
      const dropAnchor = document.createElement('div');
      dropAnchor.classList.add('drop-anchor', 'w-third', 'h-100', 'fl', 'b--dashed');
      row.append(dropAnchor);
    });

    element.append(row);
  });
}

// TODO: Check pieces order for win condition
// TODO: Add time to scores when win and reset it
// TODO: Doc
// TODO: Styling
// TODO: Difficulty
// TODO: User choose difficulty
// TODO: Add pictures
// TODO: Reset puzzle board on win
// TODO: Merge with dragndrop prototype
