"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Deck } from "@/types";
import { encodeDeckShare } from "@/lib/deck-share";

export function useShareDeck() {
  const t = useTranslations();
  const [isSharing, setIsSharing] = useState(false);

  const handleShareDeck = useCallback(
    async (deck: Deck) => {
      if (isSharing) return;
      try {
        setIsSharing(true);
        const shareKey = encodeDeckShare(deck);
        const url = `${window.location.origin}/deck/${shareKey}`;

        if (navigator.clipboard?.writeText) {
          try {
            await navigator.clipboard.writeText(url);
            alert(
              t("deck.shareCopied", { defaultValue: "共有URLをコピーしました。" })
            );
          } catch {
            window.prompt(
              t("deck.sharePrompt", { defaultValue: "共有URL" }),
              url
            );
          }
        } else {
          window.prompt(
            t("deck.sharePrompt", { defaultValue: "共有URL" }),
            url
          );
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error("Failed to create deck share URL:", errorMsg, err);
        alert(
          t("deck.shareFailed", {
            defaultValue: "共有URLの生成に失敗しました。",
          })
        );
      } finally {
        setIsSharing(false);
      }
    },
    [isSharing, t]
  );

  return { isSharing, handleShareDeck };
}
