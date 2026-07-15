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
      ${renderBoard(game.board)}

      <button id="confirm-selection" type="button">
        Confirm Boss Selection
      </button>
    </main>
  `;

  document
    .querySelector<HTMLButtonElement>("#confirm-selection")
    ?.addEventListener("click", () => {
      try {
        const selection = game.confirmBossSelection();
        console.log("Confirmed boss selection:", selection);
      } catch (error) {
        console.error(error);
      }
    });

  document.querySelectorAll<HTMLElement>(".square").forEach((element) => {
    element.addEventListener("click", () => {
      const square = Number(element.dataset.square);

      game.toggleSelection(square);
      render();
    });
  });
}

render();
