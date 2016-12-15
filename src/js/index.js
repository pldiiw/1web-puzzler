const gameBoard = document.querySelector('#game-board');
const puzzlePieces = gameBoard.querySelector('#puzzle-pieces');
const puzzleArea = gameBoard.querySelector('#puzzle-area');
const puzzleResolved = gameBoard.querySelector('#puzzle-resolved');
const puzzleSize = 3;

Array.prototype.forEach.call(gameBoard.children, addDropStops);

function addDropStops (element) {
  [...Array(puzzleSize)].forEach(() => {
    const d = document.createElement('div');
    d.classList.add('row', 'db');
    [...Array(puzzleSize)].forEach(() => {
      const dd = document.createElement('div');
      dd.classList.add('drop-stop', 'b--dashed', 'w30', 'h30', 'dib', 'ma1');
      d.append(dd);
    });
    element.append(d);
  });
}

const scoreboardOl = document.querySelector('#scoreboard ol');
const scores = [10, 20, 5, 7, 30];
const sortedScores = scores.sort((a, b) => a - b);
const firstScores = sortedScores.slice(0, 3);
firstScores.forEach(v => {
  const li = document.createElement('li');
  li.innerText = v;
  scoreboardOl.append(li);
});

const chrono = document.querySelector('#chrono');
let now = window.performance.now();
let before = now;
timer();

function timer () {
  before = now;
  now = window.performance.now();
  chrono.innerText = (now / 1000).toLocaleString('fr-FR',
    { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  window.requestAnimationFrame(timer);
}

Array.prototype.forEach.call(
  document.querySelectorAll('#puzzle-resolved .drop-stop'),
  (v, i) => {
    const piece = document.createElement('div');
    piece.classList.add('w30', 'h30');
    piece.style.backgroundImage =
      'url("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/06b68438623767.577cbf5c96aa4.jpg") ';
    piece.style.backgroundPosition =
      (30 * (i % puzzleSize))+ 'px ' + (30 * Math.floor(i/puzzleSize))+ 'px';
    v.append(piece);
  }
);
