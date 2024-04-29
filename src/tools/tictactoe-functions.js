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
      function checkWin(start) {
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
        } checkWin(start + 3)
      } // checkWin ends here
      checkWin(0);
      // console.log(gameboardArray);
    }

    updateEmpty();
    // computer move comes here
    updateEmpty();
  })();
};
