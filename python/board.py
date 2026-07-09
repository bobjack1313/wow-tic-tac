# board.py

class Board:
    GRID = [
        [7, 8, 9],
        [4, 5, 6],
        [1, 2, 3],
    ]

    WIN_LINES = [
        {7, 8, 9},
        {4, 5, 6},
        {1, 2, 3},
        {7, 4, 1},
        {8, 5, 2},
        {9, 6, 3},
        {7, 5, 3},
        {9, 5, 1},
    ]

    def __init__(self):
        self.occupied = set()
        self.current_selection = set()
        self.round = 1

    def next_round(self):
        self.round += 1

    def add_occupied(self, square: int):
        self._validate_square(square)
        self.occupied.add(square)

    def set_selection(self, squares):
        squares = set(squares)

        if len(squares) != 3:
            raise ValueError("Boss selection must contain exactly 3 squares.")

        for square in squares:
            self._validate_square(square)

        overlap = squares & self.occupied
        if overlap:
            raise ValueError(f"Selection includes occupied squares: {sorted(overlap)}")

        self.current_selection = squares

    def clear_selection(self):
        self.current_selection.clear()

    def is_occupied(self, square: int) -> bool:
        self._validate_square(square)
        return square in self.occupied

    def available_squares(self):
        return set(range(1, 10)) - self.occupied

    def display1(self):
        print("      7   8   9")
        print("    +---+---+---+")

        for row in self.GRID:
            markers = [self._marker_for(square) for square in row]
            print(f"    | {markers[0]} | {markers[1]} | {markers[2]} |")
            print("    +---+---+---+")

        print("      1   2   3")

        occupied = sorted(self.occupied)
        available = sorted(self.available_squares())

        print(f"\nOccupied: {occupied}")
        print(f"Available: {available}")

    def display(self):
        print("    +------+------+------+")

        for row in self.GRID:
            cells = [f"{square}  {self._marker_for(square)}" for square in row]
            print(f"    | {cells[0]:^3} | {cells[1]:^3} | {cells[2]:^3} |")
            print("    +------+------+------+")

        occupied = sorted(self.occupied)
        available = sorted(self.available_squares())

        print(f"\nOccupied: {occupied}")
        print(f"Available: {available}")

    def _marker_for(self, square: int) -> str:
        if square in self.current_selection:
            return "*"
        if square in self.occupied:
            return "O"
        return "_"

    def _validate_square(self, square: int):
        if square not in range(1, 10):
            raise ValueError(f"Invalid square: {square}. Must be 1-9.")

    def has_win(self) -> bool:
        return any(line <= self.occupied for line in self.WIN_LINES)

    def winning_lines(self):
        return [line for line in self.WIN_LINES if line <= self.occupied]

    def phase_label(self) -> str:
        if self.round in {1, 2}:
            return "Phase 1"
        if self.round in {3, 4}:
            return "Phase 2"
        return "Burn"

    def is_intermission_after_round(self) -> bool:
        return self.round in {2, 4}

