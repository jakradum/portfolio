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
export const playGame = (index) => {
  gameboard[index] = 'X';
  const computerMove = (function (index) {
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
              console.log('win');
              console.log(start);
            }
          } else if (count < 2) {
            break;
          }
        }
        checkHWin(start + 3);
      } // checkHWin ends here
      function checkVWin(start) {
        if (start > 2) {
          return;
        }
        let vcount = 0;

        for (let i = start; i < start + 7; i += 3) {
          if (gameboardArray[i] === gameboardArray[i + 3] && gameboardArray[i] !== '') {
            vcount++;
            if (vcount === 2) {
              console.log('vertical win');
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
              console.log('diag win');
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
              console.log('diag win 2');
            }
          } else if (count < 2) {
            break;
          }
        }
      }
      checkHWin(0);
      checkVWin(0);
      checkDiagWin();

      // console.log(gameboardArray);
    }

    updateEmpty();
    // computer move comes here
    updateEmpty();
  })();
};
