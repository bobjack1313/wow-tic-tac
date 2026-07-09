# rules.py

KING_NEIGHBORS = {
    1: {2, 4, 5},
    2: {1, 3, 4, 5, 6},
    3: {2, 5, 6},
    4: {1, 2, 5, 7, 8},
    5: {1, 2, 3, 4, 6, 7, 8, 9},
    6: {2, 3, 5, 8, 9},
    7: {4, 5, 8},
    8: {4, 5, 6, 7, 9},
    9: {5, 6, 8},
}


def are_adjacent(a: int, b: int) -> bool:
    return b in KING_NEIGHBORS[a]

def is_connected_offer(offer: set[int]) -> bool:
    """Used only when no squares are occupied yet."""
    if len(offer) != 3:
        return False

    visited = set()
    stack = [next(iter(offer))]

    while stack:
        square = stack.pop()
        if square in visited:
            continue

        visited.add(square)

        for neighbor in KING_NEIGHBORS[square]:
            if neighbor in offer and neighbor not in visited:
                stack.append(neighbor)

    return visited == offer


def is_legal_boss_offer(occupied: set[int], offer: set[int]) -> bool:
    if len(offer) != 3:
        return False

    if offer & occupied:
        return False

    if not is_connected_offer(offer):
        return False

    if not occupied:
        return True

    return any(
        are_adjacent(square, owned)
        for square in offer
        for owned in occupied
    )
