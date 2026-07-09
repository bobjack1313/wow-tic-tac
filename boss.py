# boss.py

from itertools import combinations
from rules import is_legal_boss_offer
import random

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

def score_offer(occupied: set[int], offer: set[int]) -> int:
    score = 0

    for leave in offer:
        next_board = occupied | {leave}

        if any(line <= next_board for line in WIN_LINES):
            score += 1000

        for line in WIN_LINES:
            owned_count = len(line & next_board)
            if owned_count == 2:
                score += 100

    if 5 in offer:
        score += 50

    return score

def generate_legal_boss_offers(occupied: set[int]) -> list[set[int]]:
    available = set(range(1, 10)) - occupied

    offers = []
    for combo in combinations(available, 3):
        offer = set(combo)
        if is_legal_boss_offer(occupied, offer):
            offers.append(offer)

    return offers

def print_legal_offers(occupied: set[int]):
    offers = generate_legal_boss_offers(occupied)

    print(f"\nLegal boss offers ({len(offers)}):")

    for offer in sorted(offers, key=lambda x: sorted(x)):
        print(sorted(offer))

def choose_first_legal_offer(occupied: set[int]) -> set[int]:
    offers = generate_legal_boss_offers(occupied)

    if not offers:
        raise ValueError("No legal boss offers available.")

    return sorted(offers, key=lambda offer: sorted(offer))[0]

def choose_best_offer(occupied: set[int]) -> set[int]:
    offers = generate_legal_boss_offers(occupied)

    if not offers:
        raise ValueError("No legal boss offers available.")

    return max(
        offers,
        key=lambda offer: (score_offer(occupied, offer), sorted(offer))
    )

def choose_random_offer(occupied: set[int]) -> set[int]:
    offers = generate_legal_boss_offers(occupied)

    if not offers:
        raise ValueError("No legal boss offers available.")

    return random.choice(offers)
