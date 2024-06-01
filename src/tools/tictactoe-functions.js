export const gameboard = {
  0: '',
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
};
let winnerState = false;
export const playGame = (index) => {
  if (winnerState) {
    console.log('win');
    return;
  }
  gameboard[index] = 'X';
  console.log('Human move:', index);
  const computerMove = (function () {
    function updateEmpty() {
      let gameboardArray = Object.values(gameboard);
      function checkHWin(start) {
        if (start > 6) {
          return;
        }
        let count = 0;
        for (let i = start; i < start + 3; i++) {
          if (gameboardArray[i] === gameboardArray[i + 1] && gameboardArray[i] !== '') {
            count++;
            if (count === 2) {
              console.log('Hwin');
              winnerState = true;
              return gameboardArray[i];
            }
          } else if (count < 2) {
            break;
          }
        }
        checkHWin(start + 3);
      }
      function checkVWin(start) {
        if (start > 2) {
          return;
        }
        let vcount = 0;

        for (let i = start; i < start + 7; i += 3) {
          if (gameboardArray[i] === gameboardArray[i + 3] && gameboardArray[i] !== '') {
            vcount++;
            if (vcount === 2) {
              console.log('Vwin');
              winnerState = true;
              return gameboardArray[i];
            }
          } else if (vcount < 2) {
            break;
          }
        }
        checkVWin(start + 1);
      }
      function checkDiagWin() {
        let count = 0;
        for (let i = 0; i < 9; i += 4) {
          if (gameboardArray[i] === gameboardArray[i + 4] && gameboardArray[i] !== '') {
            count++;
            if (count === 2) {
              console.log('Dwin 1');
              winnerState = true;
              return gameboardArray[i];
            }
          } else if (count < 2) {
            break;
          }
        }
        count = 0;
        for (let i = 2; i < 7; i += 2) {
          if (gameboardArray[i] === gameboardArray[i + 2] && gameboardArray[i] !== '') {
            count++;
            if (count === 2) {
              console.log('Dwin 2');
              winnerState = true;
              return gameboardArray[i];
            }
          } else if (count < 2) {
            break;
          }
        }
        return null;
      }
      const result = checkHWin(0) || checkVWin(0) || checkDiagWin() || (gameboardArray.includes('') ? null : 'tie');
      return { result, gameboardArray };
    }
    // Minimax starts here
    function minimax(depth, isMaximising) {
      let { result, gameboardArray } = updateEmpty();
      const scores = {
        X: -1,
        O: 1,
        tie: 0,
      };
      if (result !== null) {
        return { score: scores[result], move: null };
      }
      // maximiser loop
      if (isMaximising) {
        let bestScore = -Infinity;
        let bestMove;
        for (let i = 0; i < gameboardArray.length; i++) {
          if (gameboardArray[i] === '') {
            gameboard[i] = 'O';
            let { score } = minimax(depth + 1, false);
            gameboard[i] = '';
            if (score > bestScore) {
              bestScore = score;
              bestMove = i;
            }
          }
        }
        return { score: bestScore, move: bestMove };
      }

      // minimiser loop
      else {
        let bestScore = Infinity;
        let bestMove;
        for (let i = 0; i < gameboardArray.length; i++) {
          if (gameboardArray[i] === '') {
            gameboard[i] = 'X';
            let { score } = minimax(depth + 1, true);
            gameboard[i] = '';
            if (score < bestScore) {
              bestScore = score;
              bestMove = i;
            }
          }
        }
        return { score: bestScore, move: bestMove };
      }
    } // minimax ends
    if (winnerState) {
      return;
    } else {
      let { move } = minimax(0, true);
      gameboard[move] = 'O';
    }
    updateEmpty();
  })();
};
