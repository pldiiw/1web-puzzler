const gameBoard = document.querySelector('#game-board');
const puzzlePieces = gameBoard.querySelector('#puzzle-pieces');
const puzzleArea = gameBoard.querySelector('#puzzle-area');
const puzzleResolved = gameBoard.querySelector('#puzzle-resolved');
const puzzleSize = 3;

const pieces = [...Array(puzzleSize * puzzleSize)].map((v, i) => {
  const piece = document.createElement('div');
  piece.classList.add('w30', 'h30');
  piece.style.backgroundImage = 'url("media/octocat.jpg")';
  piece.style.backgroundSize = '90px 90px';
  piece.style.backgroundRepeat = 'no-repeat';
  const row = Math.floor(i / puzzleSize);
  const col = i % puzzleSize;
  piece.style.backgroundPosition = (col * 50) + '% ' + (row * 50) + '%';
  return piece;
});

Array.prototype.forEach.call(gameBoard.children, addDropStops);

function addDropStops (element) {
  [...Array(puzzleSize)].forEach(() => {
    const d = document.createElement('div');
    d.style.height = '30px';
    [...Array(puzzleSize)].forEach(() => {
      const dd = document.createElement('div');
      dd.classList.add('drop-stop', 'w30', 'h30', 'dib');
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
    v.append(pieces[i].cloneNode());
  }
);

function UISay () {
  const messages = document.querySelector('#messages');
  const msg = document.createElement('p');

  Array.prototype.forEach.call(messages.children, (v, i) => {
    v.style.opacity -= 0.34;
    if (i > 1) {
      messages.removeChild(v);
    }
  });
  msg.innerText = Array.prototype.join.call(arguments, ' ');
  msg.style.opacity = 1;
  messages.insertBefore(msg, messages.children[0]);
}

UISay('hello', 'you');
UISay('wow');
UISay('messaging board!');
UISay('messaging board!');
UISay('messaging board!');
UISay('messaging board!');
UISay('messaging board!');
UISay('messaging board!');

let a = pieces;
Array.prototype.forEach.call(document.querySelectorAll('#puzzle-pieces .drop-stop'), v => {
  const n = Math.floor(Math.random() * a.length);
  v.append(a[n].cloneNode());
  a.splice(n, 1);
});
