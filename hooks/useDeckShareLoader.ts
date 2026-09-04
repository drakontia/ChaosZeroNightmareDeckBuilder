import { useEffect, useRef } from "react";

import type { useTranslations } from "next-intl";

import { decodeDeckShare } from "@/lib/deck-share";
import type { Deck } from "@/types";

type Translate = ReturnType<typeof useTranslations>;

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

export function useDeckShareLoader(
  shareId: string | undefined,
  setDeck: (deck: Deck) => void,
  setShareError: (message: string | null) => void,
  t: Translate,
) {
  const lastLoadedShareId = useRef<string | null>(null);

  useEffect(() => {
    if (!shareId || lastLoadedShareId.current === shareId) return;
    const decoded = decodeDeckShare(shareId);
    if (decoded) {
      setDeck(decoded);
      setShareError(null);
    } else {
      // If shareId is provided but can't be decoded, initialize an empty deck
      setDeck(createEmptyDeck());
      setShareError(t("deck.shareInvalid", { defaultValue: "共有リンクが無効です。" }));
    }
    lastLoadedShareId.current = shareId;
  }, [shareId, setDeck, setShareError, t]);
}
