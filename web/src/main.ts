import "./style.css";
import { Game } from "./engine/game";
import { renderBoard } from "./ui/boardView";

const game = new Game();

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App container was not found.");
}

function render(): void {
  app.innerHTML = `
    <main class="app-shell">
      <h1>WoW Tic Tac</h1>

      <p>Mode: ${game.mode}</p>

      ${renderBoard(game.board, game.raidRemovals)}

      <div>
        <button id="confirm-selection" type="button">
          Confirm Boss Selection
        </button>
      </div>

      ${game.mode === "raid-removal"
        ? `
            <button id="confirm-removals" type="button">
              Confirm Raid Removal
            </button>
          `
        : ""}
    </main>
  `;

  document
    .querySelector<HTMLButtonElement>("#confirm-selection")
    ?.addEventListener("click", () => {
      try {
        game.confirmBossSelection();
        render();
      } catch (error) {
        console.error(error);
      }
    });

  document.querySelectorAll<HTMLElement>(".square").forEach((element) => {
    element.addEventListener("click", () => {

      const square = Number(element.dataset.square);
      if (game.mode === "boss-selection") {
        game.toggleSelection(square);
      } else {
        game.toggleRaidRemoval(square);
      }

      render();
    });
  });

  document
    .querySelector<HTMLButtonElement>("#confirm-removals")
    ?.addEventListener("click", () => {
      try {
        game.confirmRaidRemoval();
        render();
      } catch (error) {
        console.error(error);
      }
    });

}

render();
