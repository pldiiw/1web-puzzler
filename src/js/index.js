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

const scoreboardList = document.querySelector('#scoreboard ol');
