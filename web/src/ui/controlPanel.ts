/**
 * Control panel for the WoW Tic Tac simulator.
 *
 * Renders the game controls based on the current game state.
 */

import { Game } from "../engine/game";

export function renderControlPanel(game: Game): string {
  return `
    <div class="control-panel">
      <div class="control-panel-header">
        <h2>Controls</h2>
      </div>
      <div class="control-buttons">
        <button id="new-game" type="button">
          New Game
        </button>

        ${
          game.mode === "boss-selection"
            ? `
                <button id="random-offer" type="button">
                  Random Boss Offer
                </button>

              <button id="dangerous-offer" type="button">
                Dangerous Boss Offer
              </button>

                <button id="confirm-selection" type="button">
                  Confirm Boss Selection
                </button>
              `
            : game.mode === "raid-removal"
              ? `
                <button id="confirm-removals" type="button">
                  Confirm Raid Removal
                </button>
              `
              : ""
        }
      </div>
    </div>
  `;
}
