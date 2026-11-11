import { act } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vite-plus/test";

import { useDeckBuilderStore } from "@/hooks/useDeckBuilderStore";
import { CHARACTERS } from "@/lib/characters";
import { calculateFaintMemory } from "@/lib/calculateFaintMemory";
import { getCardInfo } from "@/lib/deck-utils";
import { decodeDeckShare, encodeDeckShare } from "@/lib/deck-share";
import { SEASON5_MEMORY_CARDS, SEASON5_SHARED_CARDS } from "@/lib/cards/season5-cards";
import {
  CardCategory,
  CardStatus,
  CardType,
  type Deck,
  type DeckCard,
} from "@/types";

function toDeckCard(index: number): DeckCard {
  const card = SEASON5_MEMORY_CARDS[index];
  return {
    ...card,
    deckId: `memory-${index}`,
    selectedHiramekiLevel: 0,
    selectedMemoryLevel: 1,
    godHiramekiType: null,
    godHiramekiEffectId: null,
    selectedHiddenHiramekiId: null,
  };
}

function createDeck(card: DeckCard): Deck {
  return {
    character: CHARACTERS[0],
    equipment: {
      weapon: { item: null, refinement: null, godHammerEquipmentId: null },
      armor: { item: null, refinement: null, godHammerEquipmentId: null },
      pendant: { item: null, refinement: null, godHammerEquipmentId: null },
    },
    cards: [card],
    egoLevel: 0,
    hasPotential: false,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    selectedMutationCoreId: null,
    removedCards: new Map(),
    copiedCards: new Map(),
    convertedCards: new Map(),
  };
}

describe("Season 5 shared and memory cards", () => {
  beforeEach(() => {
    act(() => useDeckBuilderStore.getState().reset());
  });

  it("registers ten ordinary shared cards", () => {
    expect(SEASON5_SHARED_CARDS).toHaveLength(10);
    expect(SEASON5_SHARED_CARDS.every((card) => card.type === CardType.SHARED)).toBe(true);
  });

  it("registers 40 memory choices with four levels and the required status", () => {
    expect(SEASON5_MEMORY_CARDS).toHaveLength(40);
    expect(new Set(SEASON5_MEMORY_CARDS.map((card) => card.id)).size).toBe(40);

    for (const card of SEASON5_MEMORY_CARDS) {
      expect(card.type).toBe(CardType.SHARED);
      expect(card.category).toBe(CardCategory.UPGRADE);
      expect(card.isMemoryCard).toBe(true);
      expect(card.statuses).toEqual([CardStatus.MEMORY, CardStatus.PREMIERE]);
      expect(card.memoryLevelVariations?.map(({ level }) => level)).toEqual([1, 2, 3, 4]);
    }
  });

  it("does not award Faint Memory points for a memory card", () => {
    expect(calculateFaintMemory(createDeck(toDeckCard(0)))).toBe(0);
  });

  it("uses the selected level's cost and description", () => {
    const card = { ...toDeckCard(0), selectedMemoryLevel: 4 as const };
    const info = getCardInfo(card);

    expect(info.cost).toBe(0);
    expect(info.description).toBe(card.memoryLevelVariations?.[3].description);
  });

  it("rejects a second memory card and copying an existing memory card", () => {
    const first = toDeckCard(0);
    const second = toDeckCard(1);
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(first);
      useDeckBuilderStore.getState().addCard(second);
      useDeckBuilderStore.getState().copyCard(first.deckId);
    });

    const memoryCards =
      useDeckBuilderStore.getState().deck?.cards.filter((card) => card.isMemoryCard) ?? [];
    expect(memoryCards).toHaveLength(1);
  });

  it("rejects restoring a memory card when another is already active", () => {
    const first = toDeckCard(0);
    const second = toDeckCard(1);
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(first);
      useDeckBuilderStore.getState().removeCard(first.deckId);
      useDeckBuilderStore.getState().addCard(second);
      useDeckBuilderStore.getState().restoreCard(first);
    });

    const memoryCards =
      useDeckBuilderStore.getState().deck?.cards.filter((card) => card.isMemoryCard) ?? [];
    expect(memoryCards).toHaveLength(1);
    expect(memoryCards[0].id).toBe(second.id);
  });

  it("rejects shared links containing multiple memory cards", () => {
    const deck = createDeck(toDeckCard(0));
    deck.cards.push(toDeckCard(1));

    expect(decodeDeckShare(encodeDeckShare(deck))).toBeNull();
  });

  it("preserves the selected memory level in a shared deck", () => {
    const card = { ...toDeckCard(0), selectedMemoryLevel: 4 as const };
    const decoded = decodeDeckShare(encodeDeckShare(createDeck(card)));

    expect(decoded?.cards[0].selectedMemoryLevel).toBe(4);
  });

  it("does not award Faint Memory points for removed or converted memory cards", () => {
    const card = toDeckCard(0);
    const removedDeck = createDeck(card);
    removedDeck.cards = [];
    removedDeck.removedCards.set(card.id, {
      count: 1,
      type: CardType.SHARED,
      isMemoryCard: true,
    });
    const convertedDeck = createDeck(card);
    convertedDeck.cards = [];
    convertedDeck.convertedCards.set(card.id, {
      convertedToId: "season5_frozen_revelation",
      originalType: CardType.SHARED,
      isMemoryCard: true,
    });

    expect(calculateFaintMemory(removedDeck)).toBe(0);
    expect(calculateFaintMemory(convertedDeck)).toBe(0);
  });
});
