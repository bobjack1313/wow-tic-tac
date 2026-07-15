/**
 * Boss move generation for the WoW Tic Tac simulator.
 */

import { isLegalBossOffer } from "./rules";

export function generateLegalBossOffers(
  occupied: ReadonlySet<number>,
): Set<number>[] {
  const available = Array.from({ length: 9 }, (_, index) => index + 1)
    .filter((square) => !occupied.has(square));

  const offers: Set<number>[] = [];

  for (let i = 0; i < available.length - 2; i++) {
    for (let j = i + 1; j < available.length - 1; j++) {
      for (let k = j + 1; k < available.length; k++) {
        const offer = new Set([
          available[i],
          available[j],
          available[k],
        ]);

        if (isLegalBossOffer(new Set(occupied), offer)) {
          offers.push(offer);
        }
      }
    }
  }

  return offers;
}

export function chooseRandomBossOffer(
  occupied: ReadonlySet<number>,
): Set<number> {
  const offers = generateLegalBossOffers(occupied);

  if (offers.length === 0) {
    throw new Error("No legal boss offers are available.");
  }

  return offers[Math.floor(Math.random() * offers.length)];
}

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

function scoreOffer(
  occupied: ReadonlySet<number>,
  offer: ReadonlySet<number>,
): number {
  let score = 0;

  for (const leave of offer) {
    const nextBoard = new Set(occupied);
    nextBoard.add(leave);

    for (const line of WIN_LINES) {
      const ownedCount = [...line].filter((square) =>
        nextBoard.has(square),
      ).length;

      if (ownedCount === 3) {
        score += 1_000;
      } else if (ownedCount === 2) {
        score += 100;
      }
    }
  }

  if (offer.has(5)) {
    score += 50;
  }

  return score;
}

export function chooseDangerousBossOffer(
  occupied: ReadonlySet<number>,
): Set<number> {
  const offers = generateLegalBossOffers(occupied);

  if (offers.length === 0) {
    throw new Error("No legal boss offers are available.");
  }

  return offers.reduce((best, offer) =>
    scoreOffer(occupied, offer) > scoreOffer(occupied, best)
      ? offer
      : best,
  );
}
