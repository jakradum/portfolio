import { gameboard } from './tictactoe-functions';
import React, { useState } from 'react';
import { playGame} from './tictactoe-functions';

export const TicTacToe = () => {
  const gameboardArray = Object.values(gameboard);
  const [selectedCell, setSelectedCell] = useState('');
  const [render, setRender] = useState(0);
  const rerenderFn = () => {
    setRender(render + 1);
  };

  
  const createTable = () => {
    const gridSize = Math.sqrt(gameboardArray.length);
    const tableRows = [];
    for (let row = 0; row < gridSize; row++) {
      const tableColumns = [];
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col; // Calculate the index based on row and column
        const value = gameboardArray[index]; // Get the value from gameboardArray
        tableColumns.push(
          <td
            key={index}
            onClick={() => {
              setSelectedCell(playGame(index));
              rerenderFn();
            }}
            
          >
            {value}
          </td>
        );
      }
      tableRows.push(<tr key={row}>{tableColumns}</tr>);
    }

    return tableRows;
  };

  return (
    <div>
      <table>
        <tbody>{createTable()}</tbody>
      </table>
    </div>
  );
};

{
  /* <table className="ttt">
<tr>
  <td></td>
</tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
</tr>
<tr>
  <td></td>
  <td></td>
  <td></td>
</tr>
</table> */
}
