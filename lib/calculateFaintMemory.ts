import { Deck, CardType, RemovedCardEntry, CopiedCardEntry, ConvertedCardEntry } from "@/types";
import { getCardById } from "./data";

// Calculate Faint Memory points based on deck edits

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

      // Monster card acquisition: +80pt
      if (card.type === CardType.MONSTER) {
        points += 80;
      }

      // Forbidden card: +20pt (always saved)
      if (card.type === CardType.FORBIDDEN) {
        points += 20;
      }

      // Hirameki (including hidden hirameki) on shared/monster cards: +10pt (character cards are 0pt)
      if ((card.type === CardType.SHARED || card.type === CardType.MONSTER) &&
        (card.selectedHiramekiLevel > 0 || (card.selectedHiddenHiramekiId != null && card.selectedHiddenHiramekiId !== ''))) {
        points += 10;
      }
    }

    // God Hirameki: +20pt (uniformly applied after type-specific points)
    if (hasGodHirameki) {
      points += 20;
    }
  }

  // Points for removed cards
  // Calculate removal points based on sequential removal order across all cards
  let removalIndex = 0;
  for (const [cardId, entry] of deck.removedCards.entries()) {
    const removedCard = getCardById(cardId);
    const count = typeof entry === "number" ? entry : (entry.count ?? 0);
    // Check if card is character type by card data
    const isCharacter = removedCard?.type === CardType.CHARACTER;

    // Apply points for each removal of this card
    for (let i = 0; i < count; i++) {
      removalIndex++;

      // Base points based on removal sequence number
      let basePoints = 0;
      if (removalIndex === 1) {
        basePoints = 0;
      } else if (removalIndex === 2) {
        basePoints = 10;
      } else if (removalIndex === 3) {
        basePoints = 30;
      } else if (removalIndex === 4) {
        basePoints = 50;
      } else if (removalIndex >= 5) {
        basePoints = 70;
      }

      // Character card removal: base points + 20pt bonus
      if (isCharacter) {
        points += basePoints + 20;
      } else {
        points += basePoints;
      }
    }

    // Attribute points for removed cards (snapshot-based)
    const snapshot: RemovedCardEntry | null = typeof entry === "number" ? null : entry as RemovedCardEntry;
    if (snapshot && count > 0) {
      const cardType = snapshot.type;
      // Type acquisition points (per card)
      if (cardType === CardType.SHARED) {
        points += 20;
      } else if (cardType === CardType.MONSTER) {
        points += 80;
      } else if (cardType === CardType.FORBIDDEN) {
        points += 20;
      }
      // Hirameki (including hidden hirameki) points for shared/monster (per card)
      if ((cardType === CardType.SHARED || cardType === CardType.MONSTER) &&
        ((snapshot.selectedHiramekiLevel ?? 0) > 0 || (snapshot.selectedHiddenHiramekiId != null && snapshot.selectedHiddenHiramekiId !== ''))) {
        points += 10;
      }
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

      // Base points based on copy sequence number
      let basePoints = 0;
      if (copyIndex === 1) {
        basePoints = 0;
      } else if (copyIndex === 2) {
        basePoints = 10;
      } else if (copyIndex === 3) {
        basePoints = 30;
      } else if (copyIndex === 4) {
        basePoints = 50;
      } else if (copyIndex >= 5) {
        basePoints = 70;
      }

      points += basePoints;
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
        points += 80;
      } else if (cardType === CardType.FORBIDDEN) {
        points += 20;
      }
      // Hirameki (including hidden hirameki) points for shared/monster (one-time for all copies of this card)
      if ((cardType === CardType.SHARED || cardType === CardType.MONSTER) &&
        ((snapshot.selectedHiramekiLevel ?? 0) > 0 || (snapshot.selectedHiddenHiramekiId != null && snapshot.selectedHiddenHiramekiId !== ''))) {
        points += 10;
      }
      // God hirameki points (one-time for all copies of this card)
      if (snapshot.godHiramekiType && snapshot.godHiramekiEffectId && !snapshot.isBasicCard) {
        points += 20;
      }
    }
  }

  // Points for converted cards with original card attribute preservation
  for (const [originalId, entry] of deck.convertedCards.entries()) {
    // Check if entry is a snapshot (ConvertedCardEntry)
    const snapshot: ConvertedCardEntry | null = typeof entry === "string" ? null : entry as ConvertedCardEntry;

    // Exclusion conversions do not count as conversions for points
    const isExclusion = snapshot?.excluded ?? false;

    // 通常変換のみ: 変換行動の+10ptを加算（排除変換では加算しない）
    if (!isExclusion) {
      points += 10;
    }

    // 元カードの属性ポイントは排除変換でも通常変換でも加算
    if (snapshot) {
      // Preserve points from the ORIGINAL card state at conversion time
      const originalType = snapshot.originalType;

      // Add points for the ORIGINAL card type (preserved at conversion time)
      if (originalType === CardType.SHARED || originalType === CardType.FORBIDDEN) {
        points += 20;
      } else if (originalType === CardType.MONSTER) {
        points += 80;
      }
      // Note: CHARACTER type has no base type points
      if (originalType === CardType.SHARED || originalType === CardType.MONSTER) {
        // Hirameki (including hidden hirameki) points from original card
        if ((snapshot.selectedHiramekiLevel ?? 0) > 0 || (snapshot.selectedHiddenHiramekiId != null && snapshot.selectedHiddenHiramekiId !== '')) {
          points += 10;
        }
      }
      // God hirameki points from original card
      if (snapshot.godHiramekiType && snapshot.godHiramekiEffectId && !snapshot.isBasicCard) {
        points += 20;
      }
      // Note: Converted-to card points are already calculated in deck.cards loop above
      // We only need to preserve the original card's attribute points here
    }
  }

  return points;
}
