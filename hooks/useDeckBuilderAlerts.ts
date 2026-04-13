import { useEffect } from "react";

import { toast } from "sonner";
import type { useTranslations } from "next-intl";

type Translate = ReturnType<typeof useTranslations>;

interface UseDeckBuilderAlertsArgs {
  t: Translate;
  removeLimitReached: boolean;
  copyLimitReached: boolean;
  conversionLimitReached: boolean;
  clearRemoveLimitAlert: () => void;
  clearCopyLimitAlert: () => void;
  clearConversionLimitAlert: () => void;
}

export function useDeckBuilderAlerts({
  t,
  removeLimitReached,
  copyLimitReached,
  conversionLimitReached,
  clearRemoveLimitAlert,
  clearCopyLimitAlert,
  clearConversionLimitAlert,
}: UseDeckBuilderAlertsArgs) {
  useEffect(() => {
    if (!removeLimitReached) return;
    toast.warning(t("deck.removeLimitTitle", { defaultValue: "排除上限に達しました" }), {
      description: t("deck.removeLimitMessage", { defaultValue: "排除は5回までです。これ以上排除できません。" }),
      duration: 4000,
      position: "top-center",
    });
    clearRemoveLimitAlert();
  }, [removeLimitReached, clearRemoveLimitAlert, t]);

  useEffect(() => {
    if (!copyLimitReached) return;
    toast.warning(t("deck.copyLimitTitle", { defaultValue: "コピー上限に達しました" }), {
      description: t("deck.copyLimitMessage", { defaultValue: "コピーは4回までです。これ以上コピーできません。" }),
      duration: 4000,
      position: "top-center",
    });
    clearCopyLimitAlert();
  }, [copyLimitReached, clearCopyLimitAlert, t]);

  useEffect(() => {
    if (!conversionLimitReached) return;
    toast.warning(t("deck.conversionLimitTitle", { defaultValue: "変換上限に達しました" }), {
      description: t("deck.conversionLimitMessage", { defaultValue: "変換は5回までです。これ以上変換できません。" }),
      duration: 4000,
      position: "top-center",
    });
    clearConversionLimitAlert();
  }, [conversionLimitReached, clearConversionLimitAlert, t]);
}
