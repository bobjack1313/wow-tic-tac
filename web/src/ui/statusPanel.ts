/**
 * Status panel for the WoW Tic Tac simulator.
 *
 * Displays the current round, phase, mode, occupied squares,
 * and available squares.
 */

import { Game } from "../engine/game";

export function renderStatusPanel(game: Game): string {
  const occupied = [...game.board.occupied].sort((a, b) => a - b);
  const available = game.board.availableSquares();

  return `
    <section class="status-panel">
      <div>
        <strong>Round</strong>
        <span>${game.board.round}</span>
      </div>

      <div>
        <strong>Phase</strong>
        <span>${game.board.phaseLabel()}</span>
      </div>

      <div>
        <strong>Mode</strong>
        <span>${game.mode}</span>
      </div>

      <div>
        <strong>Occupied</strong>
        <span>${occupied.length > 0 ? occupied.join(", ") : "None"}</span>
      </div>

      <div>
        <strong>Available</strong>
        <span>${available.join(", ")}</span>
      </div>
    </section>
  `;
}
