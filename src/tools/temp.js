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
  
  let gameOver = false;
  
  export const playGame = (index) => {
    if (gameOver) {
      return;
    }
    gameboard[index] = 'X';
  
    const computerMove = (function () {
      function updateEmpty() {
        let gameboardArray = Object.values(gameboard);
  
        function checkHWin(start) {
          if (start > 6) {
            return null;
          }
          let count = 0;
          for (let i = start; i < start + 3; i++) {
            if (gameboardArray[i] === gameboardArray[i + 1] && gameboardArray[i] !== '') {
              count++;
              if (count === 2) {
                gameOver = true;
                return gameboardArray[i]; // Return the winner ('X' or 'O')
              }
            } else {
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
                gameOver = true;
                return gameboardArray[i]; // Return the winner ('X' or 'O')
              }
            } else {
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
                gameOver = true;
                return gameboardArray[i]; // Return the winner ('X' or 'O')
              }
            } else {
              break;
            }
          }
          count = 0;
          for (let i = 2; i < 7; i += 2) {
            if (gameboardArray[i] === gameboardArray[i + 2] && gameboardArray[i] !== '') {
              count++;
              if (count === 2) {
                gameOver = true;
                return gameboardArray[i]; // Return the winner ('X' or 'O')
              }
            } else {
              break;
            }
          }
          return null;
        }
  
        const result = checkHWin(0) || checkVWin(0) || checkDiagWin() || (gameboardArray.includes('') ? null : 'tie');
        return { gameboardArray, result };
      }
  // MINIMAX
      function minimax(depth, isMaximizing) {
        const { gameboardArray, result } = updateEmpty();

         const scores = {
           'X': -1,
           'O': 1,
           'tie': 0,
         };

        if (isMaximizing) {
          let bestScore = -Infinity;
          let move;
          for (let i = 0; i < 9; i++) {
            if (gameboardArray[i] === '') {
              gameboardArray[i] = 'O';
              let score = minimax(depth + 1, false).score;
              gameboardArray[i] = '';
              if (score > bestScore) {
                bestScore = score;
                move = i;
              }
            }
          }
          return { score: bestScore, move };
        } else {
          let bestScore = Infinity;
          for (let i = 0; i < 9; i++) {
            if (gameboardArray[i] === '') {
              gameboardArray[i] = 'X';
              let score = minimax(depth + 1, true).score;
              gameboardArray[i] = '';
              bestScore = Math.min(score, bestScore);
            }
          }
          return { score: bestScore };
        }
      }
  
      let { move } = minimax(0, true);
      gameboard[move] = 'O';
  
      function compLogic() {
        console.log(gameboard);
      }
  
      if (gameOver) {
        return;
      } else {
        compLogic();
      }
      updateEmpty();
    })();
  };
  