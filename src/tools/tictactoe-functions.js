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

export const playGame = async (index) => {
  let winningCells = [];
  let count = 0;
  if (winnerState) {
    console.log('win');
    return {winnerState, winningCells}
  }
  gameboard[index] = 'X'; // human move

  const computerMove = (function () {
    function updateEmpty(board, simulation = false) {
      let tempWinnerState;
      let gameboardArray = Object.values(board);
      function checkHWin(start) {
        if (start > 6) {
          return null;
        }
        let count = 0;
        for (let i = start; i < start + 3; i++) {
          if (gameboardArray[i] === gameboardArray[i + 1] && gameboardArray[i] !== '') {
            count++;
            if (count === 2) {
              simulation ? tempWinnerState = true : winnerState = true ;
              if (winnerState) {
                for(let j=start; j< start+3; j++){winningCells.push(j)}
                console.log(winningCells, 'start:', start);
              }
              return gameboardArray[i];
            }
          } else if (count < 2) {
            break;
          }
        }
        return checkHWin(start + 3);
      }

      function checkVWin(start) {
        if (start > 2) {
          return null;
        }
        let vcount = 0;
        for (let i = start; i < start + 7; i += 3) {
          if (gameboardArray[i] === gameboardArray[i + 3] && gameboardArray[i] !== '') {
            vcount++;
            if (vcount === 2) {
              simulation ? tempWinnerState = true : winnerState = true;
              if (winnerState) {
                for(let j=start; j< start+7; j+=3){winningCells.push(j)}
                console.log(winningCells, 'start:', start);
              }
              return gameboardArray[i];
            }
          } else if (vcount < 2) {
            break;
          }
        }
        return checkVWin(start + 1);
      }

      function checkDiagWin() {
        let count = 0;
        for (let i = 0; i < 9; i += 4) {
          if (gameboardArray[i] === gameboardArray[i + 4] && gameboardArray[i] !== '') {
            count++;
            if (count === 2) {
              simulation ? tempWinnerState = true : winnerState = true;
              if (winnerState) {
                winningCells = [0,4,8];
                console.log('diag1', winningCells);
              }
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
              simulation ? tempWinnerState = true : winnerState = true;
              if (winnerState) {
                winningCells = [2,4,6]
                console.log(winningCells);
              }
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
    function minimax(depth, isMaximising, board) {
      let { result, gameboardArray } = updateEmpty(board, true);
      count++;
      const scores = {
        X: -1,
        O: 1,
        tie: 0,
      };

      if (result !== null) {
        return { score: scores[result], move: null };
      }

      if (isMaximising) {
        let bestScore = -Infinity;
        let bestMove = null;
        for (let i = 0; i < gameboardArray.length; i++) {
          if (gameboardArray[i] === '') {
            board[i] = 'O';
            let { score } = minimax(depth + 1, false, board);
            board[i] = '';
            if (score > bestScore) {
              bestScore = score;
              bestMove = i;
            }
          }
        }
        return { score: bestScore, move: bestMove };
      } else {
        let bestScore = Infinity;
        let bestMove = null;
        for (let i = 0; i < gameboardArray.length; i++) {
          if (gameboardArray[i] === '') {
            board[i] = 'X';
            let { score } = minimax(depth + 1, true, board);
            board[i] = '';
            if (score < bestScore) {
              bestScore = score;
              bestMove = i;
            }
          }
        }
        return { score: bestScore, move: bestMove };
      }
    } // minimax ends

    let { result, gameboardArray } = updateEmpty(gameboard);

    if (winnerState) {
      return;
    } else {
      let boardCopy = { ...gameboard };

      
      let { move } = minimax(0, true, boardCopy);
      if (move !== null) {
        gameboard[move] = 'O';
      } else {
      }
    }

    updateEmpty(gameboard);
  })();
  console.log('count',count);
  return{ winnerState, winningCells }
};