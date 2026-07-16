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

const stateFor = (square: number): string => {
  if (raidRemovals.has(square)) return "removed";
  if (board.currentSelection.has(square)) return "selected";
  if (board.occupied.has(square)) return "occupied";
  return "available";
};

export function renderBoard(
  board: Board,
  raidRemovals: ReadonlySet<number>,
): string {

  const markerFor = (square: number): string => {
    if (raidRemovals.has(square)) return "X";
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
                class="square ${stateFor(square)}"
                data-square="${square}"
              >
                <span class="square-number">${square}</span>
                <span class="square-marker">${markerFor(square)}</span>
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
