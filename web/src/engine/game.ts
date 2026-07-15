/**
 * Game controller for the WoW Tic Tac simulator.
 *
 * Coordinates board state, boss selections, player actions,
 * round progression, and encounter phases.
 */

import { Board } from "./board";
import { isLegalBossOffer } from "./rules";
import {
  chooseDangerousBossOffer,
  chooseRandomBossOffer,
} from "./boss";

export type GameMode =
  | "boss-selection"
  | "raid-removal"
  | "game-over";

export class Game {
  readonly board = new Board();
  readonly raidRemovals = new Set<number>();

  mode: GameMode = "boss-selection";
  message = "";

  toggleSelection(square: number): void {
    this.message = "";

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

  confirmBossSelection(): void {
    this.message = "";

    if (this.board.currentSelection.size !== 3) {
      throw new Error("Select exactly 3 boss squares.");
    }

    if (
      !isLegalBossOffer(
        this.board.occupied,
        this.board.currentSelection,
      )
    ) {
      throw new Error("That boss selection is not legal.");
    }

    this.mode = "raid-removal";
  }

  toggleRaidRemoval(square: number): void {
    this.message = "";

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

  confirmRaidRemoval(): void {
    this.message = "";

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


    console.log("Kept square:", keptSquares[0]);
    console.log("Occupied:", [...this.board.occupied].sort((a, b) => a - b));
    console.log("Winning lines:", this.board.winningLines());
    console.log("Has win:", this.board.hasWin());

    if (this.board.hasWin()) {
      this.board.clearSelection();
      this.raidRemovals.clear();
      this.mode = "game-over";
      return;
    }
    this.board.clearSelection();
    this.raidRemovals.clear();
    this.board.nextRound();
    this.mode = "boss-selection";
  }

  reset(): void {
    this.board.reset();
    this.raidRemovals.clear();
    this.mode = "boss-selection";
    this.message = "";
  }

  chooseRandomBossOffer(): void {
    if (this.mode !== "boss-selection") {
      return;
    }

    this.message = "";

    const offer = chooseRandomBossOffer(this.board.occupied);

    this.board.currentSelection.clear();

    for (const square of offer) {
      this.board.currentSelection.add(square);
    }
  }

  chooseDangerousBossOffer(): void {
    if (this.mode !== "boss-selection") {
      return;
    }

    this.message = "";

    const offer = chooseDangerousBossOffer(this.board.occupied);

    this.board.currentSelection.clear();

    for (const square of offer) {
      this.board.currentSelection.add(square);
    }
  }
}
