import { useEffect } from "react";

import type { Deck } from "@/types";

export function useLoadedDeckSync(sharedDeck: Deck | null, setDeck: (deck: Deck) => void) {
  useEffect(() => {
    if (sharedDeck) {
      setDeck(sharedDeck);
    }
  }, [sharedDeck, setDeck]);
}
