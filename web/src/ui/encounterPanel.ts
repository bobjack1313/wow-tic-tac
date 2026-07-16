/**
 * Encounter information panel.
 */

import { Game } from "../engine/game";

export function renderEncounterPanel(game: Game): string {
  return `
    <section class="encounter-panel">
      <h2>Encounter</h2>

      <p><strong>Round:</strong> ${game.board.round}</p>
      <p><strong>Phase:</strong> ${game.board.phaseLabel()}</p>
      <p><strong>Mode:</strong> ${game.mode}</p>

      ${
        game.mode === "boss-selection"
          ? "<p>Select three legal boss squares.</p>"
          : game.mode === "raid-removal"
            ? "<p>Select the two squares the raid removes.</p>"
            : "<p>The boss has won.</p>"
      }
    </section>
  `;
}
