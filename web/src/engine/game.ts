/**
 * Game controller for the WoW Tic Tac simulator.
 *
 * Coordinates board state, boss selections, player actions,
 * round progression, and encounter phases.
 */

import { Board } from "./board";
export type GameMode = "boss-selection" | "raid-removal";

export class Game {
  readonly board = new Board();
  readonly raidRemovals = new Set<number>();

  mode: GameMode = "boss-selection";

  toggleSelection(square: number): void {
    if (this.mode !== "boss-selection") {
      return;
    }

    if (this.board.occupied.has(square)) {
      return;
    }

    if (this.board.currentSelection.has(square)) {
      this.board.currentSelection.delete(square);
    } else if (this.board.currentSelection.size < 3) {
      this.board.currentSelection.add(square);
    }
  }

  toggleRaidRemoval(square: number): void {
    if (this.mode !== "raid-removal") {
      return;
    }

    if (!this.board.currentSelection.has(square)) {
      return;
    }

    if (this.raidRemovals.has(square)) {
      this.raidRemovals.delete(square);
    } else if (this.raidRemovals.size < 2) {
      this.raidRemovals.add(square);
    }
  }

  confirmBossSelection(): void {
    if (this.board.currentSelection.size !== 3) {
      throw new Error("Select exactly 3 boss squares.");
    }

    this.mode = "raid-removal";
  }

  confirmRaidRemoval(): void {
    if (this.mode !== "raid-removal") {
      throw new Error("The game is not in raid-removal mode.");
    }

    if (this.raidRemovals.size !== 2) {
      throw new Error("Select exactly 2 squares to remove.");
    }

    const keptSquares = [...this.board.currentSelection].filter(
      (square) => !this.raidRemovals.has(square),
    );

    if (keptSquares.length !== 1) {
      throw new Error("Exactly 1 boss square must remain.");
    }

    this.board.addOccupied(keptSquares[0]);
    this.board.clearSelection();
    this.raidRemovals.clear();
    this.board.round += 1;
    this.mode = "boss-selection";
  }
}
