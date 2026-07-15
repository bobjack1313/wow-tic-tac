/**
 * Board view for the WoW Tic Tac simulator.
 *
 * Responsible for rendering the current board state as HTML.
 *
 * This module contains no game logic. It only translates the
 * Board model into a visual representation for the browser.
 */

import { Board } from "../engine/board";

const GRID = [
  [7, 8, 9],
  [4, 5, 6],
  [1, 2, 3],
];

export function renderBoard(board: Board): string {
  const markerFor = (square: number): string => {
    if (board.currentSelection.has(square)) return "*";
    if (board.occupied.has(square)) return "O";
    return "_";
  };

  const rows = GRID.map(
    (row) => `
      <tr>
        ${row
          .map(
            (square) => `
              <td
                class="square"
                data-square="${square}"
              >
                <div class="number">${square}</div>
                <div class="marker">${markerFor(square)}</div>
              </td>
            `,
          )
          .join("")}
      </tr>
    `,
  ).join("");

  return `
    <table>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}
