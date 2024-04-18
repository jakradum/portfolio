import { gameboard } from "./tictactoe-functions";

export const TicTacToe = () => {
  const row1 = Object.values(gameboard).filter((v, i) => i < 3);
  const row2 = Object.values(gameboard).filter((v, i) => i > 2 && i < 6);
  const row3 = Object.values(gameboard).filter((v, i) => i > 5 && i < 9);

  return (
    <div>
      <table className="ttt">
        <tr>
          {row1.map((v, i) => {
            return <td key={i}>{v}</td>;
          })}
        </tr>
        <tr>
          {row2.map((v, i) => {
            return <td key={i}>{v}</td>;
          })}
        </tr>
        <tr>
          {row3.map((v, i) => {
            return <td key={i}>{v}</td>;
          })}
        </tr>
      </table>
    </div>
  );
};

{
  /* <table className="ttt">
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
<tr>
  <td></td>
  <td></td>
  <td></td>
</tr>
</table> */
}
