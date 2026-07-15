/**
 * Boss selection rules for the WoW Tic Tac simulator.
 *
 * Defines king-move adjacency and validates whether a boss offer
 * is connected and attached to existing occupied territory.
 */

export const KING_NEIGHBORS: Readonly<Record<number, ReadonlySet<number>>> = {
  1: new Set([2, 4, 5]),
  2: new Set([1, 3, 4, 5, 6]),
  3: new Set([2, 5, 6]),
  4: new Set([1, 2, 5, 7, 8]),
  5: new Set([1, 2, 3, 4, 6, 7, 8, 9]),
  6: new Set([2, 3, 5, 8, 9]),
  7: new Set([4, 5, 8]),
  8: new Set([4, 5, 6, 7, 9]),
  9: new Set([5, 6, 8]),
};

export function areAdjacent(a: number, b: number): boolean {
  return KING_NEIGHBORS[a]?.has(b) ?? false;
}

export function isConnectedOffer(offer: Set<number>): boolean {
  if (offer.size !== 3) {
    return false;
  }

  const start = offer.values().next().value as number;
  const visited = new Set<number>();
  const stack = [start];

  while (stack.length > 0) {
    const square = stack.pop()!;

    if (visited.has(square)) {
      continue;
    }

    visited.add(square);

    for (const neighbor of KING_NEIGHBORS[square]) {
      if (offer.has(neighbor) && !visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  return visited.size === offer.size;
}

export function isLegalBossOffer(
  occupied: Set<number>,
  offer: Set<number>,
): boolean {
  if (offer.size !== 3) {
    return false;
  }

  for (const square of offer) {
    if (occupied.has(square)) {
      return false;
    }
  }

  // The opening offer must connect to itself because no territory exists yet.
  if (occupied.size === 0) {
    return isConnectedOffer(offer);
  }

  const allowed = new Set([...occupied, ...offer]);
  const visited = new Set<number>();
  const stack = [...occupied];

  while (stack.length > 0) {
    const square = stack.pop()!;

    if (visited.has(square)) {
      continue;
    }

    visited.add(square);

    for (const neighbor of KING_NEIGHBORS[square]) {
      if (allowed.has(neighbor) && !visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  return [...offer].every((square) => visited.has(square));
}
