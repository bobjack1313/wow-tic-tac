import "./style.css";
import { Game } from "./engine/game";
import { renderBoard } from "./ui/boardView";
import { renderControlPanel } from "./ui/controlPanel";
// import { isLegalBossOffer } from "./engine/rules";

const game = new Game();

const app = document.querySelector<HTMLDivElement>("#app");

// console.assert(
//   isLegalBossOffer(
//     new Set([8, 9, 5, 3]),
//     new Set([7, 6, 2]),
//   ),
//   "Expected 7,6,2 to be legal through occupied territory.",
// );

// console.assert(
//   !isLegalBossOffer(
//     new Set([1]),
//     new Set([7, 9, 3]),
//   ),
//   "Expected 7,9,3 to be illegal from occupied square 1.",
// );

if (!app) {
  throw new Error("App container was not found.");
}

function render(): void {
  app.innerHTML = `
    <main class="app-shell">
      <h1>WoW Tic Tac</h1>
      <p>
        Round ${game.board.round} *** ${game.board.phaseLabel()}
      </p>

      <p>Mode: ${game.mode}</p>

      ${
        game.mode === "game-over"
          ? `
              <section class="game-over">
                <h2>Boss Wins</h2>
                <p>Winning line: ${game.board
                  .winningLines()
                  .map((line) => line.join("-"))
                  .join(", ")}</p>
              </section>
            `
          : ""
      }
      ${game.message ? `<p class="message">${game.message}</p>` : ""}

      ${renderBoard(game.board, game.raidRemovals)}

      ${renderControlPanel(game)}
    </main>
  `;

  document
    .querySelector<HTMLButtonElement>("#confirm-selection")
    ?.addEventListener("click", () => {
      try {
        game.confirmBossSelection();
        render();

      } catch (error) {
        game.message =
          error instanceof Error ? error.message : "Something went wrong.";

        render();
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

  document
    .querySelector<HTMLButtonElement>("#new-game")
    ?.addEventListener("click", () => {
      game.reset();
      render();
    });

  document
    .querySelector<HTMLButtonElement>("#random-offer")
    ?.addEventListener("click", () => {
      try {
        game.chooseRandomBossOffer();
        render();
      } catch (error) {
        game.message =
          error instanceof Error ? error.message : "Something went wrong.";

        render();
      }
    });

  document
    .querySelector<HTMLButtonElement>("#dangerous-offer")
    ?.addEventListener("click", () => {
      try {
        game.chooseDangerousBossOffer();
        render();
      } catch (error) {
        game.message =
          error instanceof Error ? error.message : "Something went wrong.";

        render();
      }
    });
}

render();
