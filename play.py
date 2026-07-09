# play.py

from board import Board
from rules import is_legal_boss_offer
from boss import choose_best_offer, choose_random_offer, print_legal_offers

def parse_squares(prompt: str, expected_count: int) -> set[int]:
    raw = input(prompt).replace(",", " ").split()

    if len(raw) == 1 and raw[0].lower() in {"q", "quit", "exit"}:
        raise KeyboardInterrupt

    try:
        squares = {int(value) for value in raw}
    except ValueError:
        raise ValueError("Input must be numbers only.")

    if any(square not in range(1, 10) for square in squares):
        raise ValueError("Squares must be between 1 and 9.")

    if len(squares) != expected_count:
        raise ValueError(f"Expected {expected_count} unique squares.")

    return squares

def read_squares(prompt: str, expected_count: int) -> set[int]:
    while True:
        try:
            return parse_squares(prompt, expected_count)
        except ValueError as error:
            print(f"Error: {error}")

def main():
    board = Board()

    while not board.has_win():
        print(f"\nRound {board.round} - {board.phase_label()}")

        board.display()

        # from boss import print_legal_offers
        # print_legal_offers(board.occupied)

        if board.round == 1:
            mode = input("Opening mode: manual or random? (m/R): ").strip().lower()

            if mode in {"", "r", "random"}:
                offer = choose_random_offer(board.occupied)
                print(f"Boss random opener: {sorted(offer)}")
            else:
                print_legal_offers(board.occupied)

                while True:
                    offer = read_squares("Boss selects 3 squares: ", 3)

                    if is_legal_boss_offer(board.occupied, offer):
                        break

                    print("Illegal boss offer.")
        else:
            auto = input("Auto-select boss offer? (y/N): ").strip().lower()

            if auto == "y":
                offer = choose_best_offer(board.occupied)
                print(f"Boss auto-selects: {sorted(offer)}")
            else:
                print_legal_offers(board.occupied)

                while True:
                    offer = read_squares("Boss selects 3 squares: ", 3)

                    if is_legal_boss_offer(board.occupied, offer):
                        break

                    print("Illegal boss offer.")

        board.set_selection(offer)
        board.display()

        while True:
            removed = read_squares("Remove 2 squares: ", 2)

            if removed <= offer:
                break

            print("You can only remove squares from the boss selection.")

        kept = next(iter(offer - removed))
        board.add_occupied(kept)
        board.clear_selection()

        print(f"\nBoss keeps: {kept}")
        print("Board after round:")
        board.display()

        if board.has_win():
            print("\nBoss wins.")
            board.display()
            print("Winning line:", board.winning_lines())

            print("\nRun summary:")
            print(f"Lost on round: {board.round}")
            print(f"Completed safe rounds: {board.round - 1}")
            print(f"Front lane safe: {sorted({1, 2, 3} - board.occupied)} / [1, 2, 3]")
            print(f"Left lane safe: {sorted({1, 4, 7} - board.occupied)} / [1, 4, 7]")
            print(f"Center safe: {5 not in board.occupied}")

            break

        if board.is_intermission_after_round():
            print("\n=== Intermission ===")

        board.next_round()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nExiting simulator.")

