/**
 * Event log for the WoW Tic Tac simulator.
 *
 * Renders recent game actions with the newest entry first.
 */

import { Game } from "../engine/game";

export function renderEventLog(game: Game): string {
  const entries =
    game.eventLog.length > 0
      ? game.eventLog
          .map((entry) => `<li>${entry}</li>`)
          .join("")
      : "<li>No actions yet.</li>";

  return `
    <section class="event-log">
      <h2>Event Log</h2>
      <ul>
        ${entries}
      </ul>
    </section>
  `;
}
