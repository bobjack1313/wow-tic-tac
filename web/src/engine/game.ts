/**
 * Game controller for the WoW Tic Tac simulator.
 *
 * Coordinates board state, boss selections, player actions,
 * round progression, and encounter phases.
 */

import { Board } from "./board";

export class Game {
    readonly board = new Board();

    toggleSelection(square: number): void {
        if (this.board.occupied.has(square)) {
            return;
        }

        if (this.board.currentSelection.has(square)) {
            this.board.currentSelection.delete(square);
        } else if (this.board.currentSelection.size < 3) {
            this.board.currentSelection.add(square);
        }
    }
}
