
export const gameboard = {
  1: '',
  2: '',
  3: '',
  4: '',
  5: '',
  6: '',
  7: '',
  8: '',
  9: '',
};
export const playGame = (index) => {
     gameboard[index+1] = 'O';
     console.log(gameboard);
};