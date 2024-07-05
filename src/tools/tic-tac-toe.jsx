import { gameboard } from './tictactoe-functions';
import React, { useState } from 'react';
import { playGame } from './tictactoe-functions';
import { ReloadIcon } from '../Components/refresh-svgrepo-com';
import { Logos } from '../Components/logos';

export const TicTacToe = () => {
  const [board, setBoard] = useState(Object.values(gameboard));
  const [winner, setWinner] = useState(false);
  const [winningCells, setWinningCells] = useState([]);
  const [render, setRender] = useState(0);
  const [winningPlayer, setWinningPlayer] = useState(null);
  const [simulations, setSimulations] = useState(0);

  const rerenderFn = () => {
    setRender(render + 1);
  };
  const handleRestart = () => {
    window.location.reload(); // Refresh the page
  };

  const handleClick = async (index) => {
    if (board[index] !== '' || winner) return;
    const { winnerState, winningCells: newWinningCells, count } = await playGame(index);
    setBoard(Object.values(gameboard)); // Update the board state
    setWinner(winnerState);
    setWinningCells(newWinningCells);
    setSimulations(prevSimulations => prevSimulations + count); // Update simulations
  
    if (winnerState) {
      const player = gameboard[index] === 'X' ? 'O' : 'X'; // Determine the winning player
      setWinningPlayer(player);
    }
  };

  const createTable = () => {
    const gridSize = Math.sqrt(board.length);
    const tableRows = [];
    for (let row = 0; row < gridSize; row++) {
      const tableColumns = [];
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col; // Calculate the index based on row and column
        const value = board[index]; // Get the value from board

        tableColumns.push(
          <td
            key={index}
            onClick={() => {
              handleClick(index);
              rerenderFn();
            }}
            className={winningCells.includes(index) ? 'win' : ''}
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
      <div className="flexbox">
        <h2>Tic Tac Toe</h2>
      </div>
      <div onClick={() => handleRestart()} className="flexbox tictactoe">
        <p>New Game</p>
        <ReloadIcon />
      </div>
      <table>
        <tbody>{createTable()}</tbody>
      </table>
      <div className="winner flexbox ">{winner ? ('O' ? 'Computer won' : 'You won') : ''}</div>
      {/* <details>
        <summary>Why you will never win this game</summary>
        <p>{simulations}</p>
      </details> */}
    </div>
  );
};
