let nextPlayer = 'X'; // 'X' or 'O'

// initialize the "Next Player" label
document.getElementById('next-lbl').innerText = nextPlayer;

// create the gameboard buttons and wire events
createGameBoard();

function createGameBoard() {
  // add a button "[ ]" to each cell c1..c9
  for (let i = 1; i <= 9; i++) {
    const td = document.getElementById(`c${i}`);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerText = '[ ]';
    td.appendChild(btn);
  }

  // assign click listeners to all 9 buttons
  const btns = document.querySelectorAll('#gameboard button');
  btns.forEach(btn => {
    btn.addEventListener('click', takeCell); // event passed automatically
  });
}

// respond to a click on any board button
function takeCell(event) {
  const btn = event.currentTarget;

  // fill with current player's symbol and disable the button
  btn.innerText = `[${nextPlayer}]`;
  btn.disabled = true; // clickable only once

  // switch player and update label
  nextPlayer = (nextPlayer === 'X') ? 'O' : 'X';
  document.getElementById('next-lbl').innerText = nextPlayer;

  // check for game over
  if (isGameOver()) {
    document.getElementById('game-over-lbl').innerHTML = '<h1>Game Over</h1>';
  }
}

// return true when all buttons are disabled
function isGameOver() {
  const btns = document.querySelectorAll('#gameboard button');
  return Array.from(btns).every(b => b.disabled);
}