/**
 * Board state for the WoW Tic Tac simulator.
 *
 * Tracks:
 * - Permanent boss squares
 * - Current boss selection
 * - Round number
 * - Win detection
 */

const WIN_LINES: ReadonlyArray<ReadonlySet<number>> = [
  new Set([7, 8, 9]),
  new Set([4, 5, 6]),
  new Set([1, 2, 3]),
  new Set([7, 4, 1]),
  new Set([8, 5, 2]),
  new Set([9, 6, 3]),
  new Set([7, 5, 3]),
  new Set([9, 5, 1]),
];

export class Board {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  occupied = new Set<number>();
  currentSelection = new Set<number>();
  round = 1;

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  addOccupied(square: number): void {
    this.validateSquare(square);
    this.occupied.add(square);
  }

  setSelection(squares: number[]): void {
    const selection = new Set(squares);

    if (selection.size !== 3) {
      throw new Error("Boss selection must contain exactly 3 unique squares.");
    }

    for (const square of selection) {
      this.validateSquare(square);

      if (this.occupied.has(square)) {
        throw new Error(`Square ${square} is already occupied.`);
      }
    }

    this.currentSelection = selection;
  }

  clearSelection(): void {
    this.currentSelection.clear();
  }

  availableSquares(): number[] {
    return Array.from({ length: 9 }, (_, index) => index + 1)
      .filter((square) => !this.occupied.has(square));
  }

  winningLines(): number[][] {
    return WIN_LINES
      .filter((line) =>
        Array.from(line).every((square) => this.occupied.has(square)),
      )
      .map((line) => Array.from(line));
  }

  hasWin(): boolean {
    return this.winningLines().length > 0;
  }

  nextRound(): void {
    this.round += 1;
  }

  phaseLabel(): string {
    if (this.round <= 2) {
      return "Phase 1";
    }

    if (this.round <= 4) {
      return "Phase 2";
    }

    return "Burn";
  }

  reset(): void {
    this.occupied.clear();
    this.currentSelection.clear();
    this.round = 1;
  }

  // ---------------------------------------------------------------------------
  // Private Helpers
  // ---------------------------------------------------------------------------

  private validateSquare(square: number): void {
    if (!Number.isInteger(square) || square < 1 || square > 9) {
      throw new Error(`Invalid square: ${square}. Must be 1-9.`);
    }
  }

}
