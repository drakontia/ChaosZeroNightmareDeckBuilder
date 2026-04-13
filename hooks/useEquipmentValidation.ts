import { useCallback } from "react";

import type { useTranslations } from "next-intl";
import { toast } from "sonner";

import type { Deck } from "@/types";

type Translate = ReturnType<typeof useTranslations>;
type EquipmentKey = "weapon" | "armor" | "pendant";

const EQUIPMENT_KEYS: EquipmentKey[] = ["weapon", "armor", "pendant"];

export function useEquipmentValidation(deck: Deck | null, t: Translate) {
  return useCallback(() => {
    if (!deck) return true;
    for (const type of EQUIPMENT_KEYS) {
      const slot = deck.equipment[type];
      if (!slot?.item || !slot.godHammerEquipmentId || slot.refinement) {
        continue;
      }
      toast.warning(t("equipment.godHammerWithoutRefinement.title", { defaultValue: "精錬が選択されていません" }), {
        description: t("equipment.godHammerWithoutRefinement.message", {
          defaultValue: "神のハンマーが有効な装備に精錬が選択されていません。精錬を有効にすることを推奨します。",
        }),
        duration: 5000,
        position: "top-center",
      });
      return false;
    }
    return true;
  }, [deck, t]);
}
