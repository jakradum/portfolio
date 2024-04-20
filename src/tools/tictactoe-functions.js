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
    let gameboardArray = Object.values(gameboard);
    let emptyCells = [];
    function updateEmpty(){
        gameboardArray = Object.values(gameboard);
        console.log(gameboardArray);
    }
    updateEmpty();
    const checkWinner = (
        function(){
        let xCount = 0;
        gameboardArray.forEach((v, i) => {
          if (v === 'X') {
            xCount++;
          }
        });
        console.log('x:', xCount);
        }
    )()
    gameboard[4] = 'O';
    updateEmpty();
  })();
};
