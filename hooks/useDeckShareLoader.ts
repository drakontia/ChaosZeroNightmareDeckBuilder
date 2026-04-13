import { useEffect, useRef } from "react";

import type { useTranslations } from "next-intl";

import { decodeDeckShare } from "@/lib/deck-share";
import type { Deck } from "@/types";

type Translate = ReturnType<typeof useTranslations>;

export function useDeckShareLoader(
  shareId: string | undefined,
  setDeck: (deck: Deck) => void,
  setShareError: (message: string | null) => void,
  t: Translate
) {
  const lastLoadedShareId = useRef<string | null>(null);

  useEffect(() => {
    if (!shareId || lastLoadedShareId.current === shareId) return;
    const decoded = decodeDeckShare(shareId);
    if (decoded) {
      setDeck(decoded);
      setShareError(null);
    } else {
      setShareError(t("deck.shareInvalid", { defaultValue: "共有リンクが無効です。" }));
    }
    lastLoadedShareId.current = shareId;
  }, [shareId, setDeck, setShareError, t]);
}
