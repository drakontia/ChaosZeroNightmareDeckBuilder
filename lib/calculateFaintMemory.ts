import { Deck, CardType, CardGrade, RemovedCardEntry, CopiedCardEntry, ConvertedCardEntry } from "@/types";
import { getCardById } from "./card";

// Calculate Faint Memory points based on deck edits

// Helper function to calculate monster card points based on grade
function getMonsterCardPoints(grade?: CardGrade): number {
  switch (grade) {
    case CardGrade.RARE:
      return 50;
    case CardGrade.LEGEND:
      return 80;
    case CardGrade.COMMON:
    default:
      return 20;
  }
}

export function calculateFaintMemory(deck: Deck | null | undefined): number {
  if (!deck || !Array.isArray(deck.cards)) return 0;
  let points = 0;
  // Points for cards in the deck
  const cards = deck.cards;
  for (const card of cards) {
    // Character cards: base cards do not add points.
    // Collect God Hirameki state once and handle uniformly for all types.
    const hasGodHirameki = (card.godHiramekiType && card.godHiramekiEffectId && !card.isBasicCard);

    // Non-character cards receive base acquisition and hirameki points
    if (card.type !== CardType.CHARACTER) {
      // Shared card acquisition: +20pt
      if (card.type === CardType.SHARED) {
        points += 20;
      }

      // Monster card acquisition: points based on grade (一般/20pt, 希少/50pt, 伝説/80pt)
      if (card.type === CardType.MONSTER) {
        points += getMonsterCardPoints(card.grade);
      }

      // Forbidden card: +20pt (always saved)
      if (card.type === CardType.FORBIDDEN) {
        points += 20;
      }
      // V2: Hirameki points for shared cards removed (shared cards no longer gain hirameki points)
    }

    // God Hirameki: +20pt (uniformly applied after type-specific points)
    if (hasGodHirameki) {
      points += 20;
    }
  }

  // Points for removed cards
  // V2 rule: Starting cards = 20pt each, others = 0pt
  // Attribute points (type/hirameki/god hirameki) are still calculated from snapshot
  for (const [cardId, entry] of deck.removedCards.entries()) {
    const count = typeof entry === "number" ? entry : (entry.count ?? 0);
    const cardData = getCardById(cardId);
    const isStartingCard = cardData?.isStartingCard ?? false;

    // V2: 開始カードのみ1枚につき20pt、その他は0pt
    if (isStartingCard) {
      points += count * 20;
    }

    // Attribute points for removed cards (snapshot-based)
    const snapshot: RemovedCardEntry | null = typeof entry === "number" ? null : entry as RemovedCardEntry;
    if (snapshot && count > 0) {
      const cardType = snapshot.type;
      // Type acquisition points (per card)
      if (cardType === CardType.SHARED) {
        points += 20;
      } else if (cardType === CardType.MONSTER) {
        points += getMonsterCardPoints(snapshot.grade);
      } else if (cardType === CardType.FORBIDDEN) {
        points += 20;
      }
      // V2: Hirameki points for shared cards removed (shared cards no longer gain hirameki points)
      // God hirameki points (per card)
      if (snapshot.godHiramekiType && snapshot.godHiramekiEffectId && !snapshot.isBasicCard) {
        points += 20;
      }
    }
  }

  // Points for copied cards
  // Calculate copy points based on sequential copy order across all cards
  let copyIndex = 0;
  for (const [cardId, entry] of deck.copiedCards.entries()) {
    const count = typeof entry === "number" ? entry : (entry.count ?? 0);
    // Apply points for each copy of this card
    for (let i = 0; i < count; i++) {
      copyIndex++;

      // V2: copy points 0/0/40 (1st, 2nd = 0pt, 3rd以降 = 40pt)
      if (copyIndex >= 3) {
        points += 40;
      }
    }

    // Attribute points for copied cards (snapshot-based)
    // ONLY add these if the original card is NOT currently in the deck
    // If original is in deck, its points are already counted in the deck.cards loop above
    const originalCardInDeck = deck.cards.some(c => c.id === cardId);

    const snapshot: CopiedCardEntry | null = typeof entry === "number" ? null : entry as CopiedCardEntry;
    if (snapshot && count > 0 && !originalCardInDeck) {
      const cardType = snapshot.type;
      // Type acquisition points (one-time for all copies of this card)
      if (cardType === CardType.SHARED) {
        points += 20;
      } else if (cardType === CardType.MONSTER) {
        points += getMonsterCardPoints(snapshot.grade);
      } else if (cardType === CardType.FORBIDDEN) {
        points += 20;
      }
      // V2: Hirameki points for shared cards removed (shared cards no longer gain hirameki points)
      // God hirameki points (one-time for all copies of this card)
      if (snapshot.godHiramekiType && snapshot.godHiramekiEffectId && !snapshot.isBasicCard) {
        points += 20;
      }
    }
  }

  // Points for converted cards (treated as removals in V2)
  for (const [originalId, entry] of deck.convertedCards.entries()) {
    const snapshot: ConvertedCardEntry | null = typeof entry === "string" ? null : entry as ConvertedCardEntry;
    const originalCard = getCardById(originalId);
    const isStartingCard = originalCard?.isStartingCard ?? false;

    // 変換も排除として計算: 開始カードなら1枚20pt、それ以外は0pt
    if (isStartingCard) {
      points += 20;
    }

    // 属性ポイントはスナップショットから従来通り加算
    if (snapshot) {
      const originalType = snapshot.originalType;
      if (originalType === CardType.SHARED || originalType === CardType.FORBIDDEN) {
        points += 20;
      } else if (originalType === CardType.MONSTER) {
        points += getMonsterCardPoints(snapshot.originalGrade);
      }
      // V2: Hirameki points for shared cards removed (shared cards no longer gain hirameki points)
      // God hirameki points
      if ((snapshot.godHiramekiType && snapshot.godHiramekiEffectId && !snapshot.isBasicCard)) {
        points += 20;
      }
    }
  }

  return points;
}
