import { useEffect } from "react";

import type { Deck } from "@/types";

const createEmptyDeck = (): Deck => ({
  name: "",
  character: null,
  equipment: {
    weapon: { item: null, refinement: null, godHammerEquipmentId: null, engravingId: null },
    armor: { item: null, refinement: null, godHammerEquipmentId: null, engravingId: null },
    pendant: { item: null, refinement: null, godHammerEquipmentId: null, engravingId: null },
  },
  cards: [],
  egoLevel: 0,
  hasPotential: false,
  createdAt: new Date(),
  removedCards: new Map(),
  copiedCards: new Map(),
  convertedCards: new Map(),
  selectedMutationCoreId: null,
});

export function useDeckBuilderInitialization(
  deck: Deck | null,
  setDeck: (deck: Deck) => void,
  options?: { skipInitialization?: boolean }
) {
  useEffect(() => {
    if (!deck && !options?.skipInitialization) {
      setDeck(createEmptyDeck());
    }
  }, [deck, setDeck, options?.skipInitialization]);
}
