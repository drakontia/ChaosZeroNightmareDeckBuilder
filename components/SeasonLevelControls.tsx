"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import type { DeckCard, Season4DesireStatus } from "@/types";
import { SEASON4_DESIRE_STATUS_OPTIONS, getSeason4BaseStatus, normalizeSeason4SelectedStatuses } from "@/lib/season4";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogCloseButton } from "@/components/DialogCloseButton";

interface SeasonLevelControlsProps {
  card: DeckCard;
  onUpdateSeasonLevel: (deckId: string, level: 1 | 2 | 3) => void;
  onUpdateSeasonStatuses: (deckId: string, statuses: Season4DesireStatus[]) => void;
}

const dialogContentClass = "w-[90vw] max-w-md";

export function SeasonLevelControls({ card, onUpdateSeasonLevel, onUpdateSeasonStatuses }: SeasonLevelControlsProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const selectedLevel = card.selectedSeasonLevel ?? 1;
  const selectedStatuses = normalizeSeason4SelectedStatuses(card.selectedSeasonStatuses, getSeason4BaseStatus(card));

  const updateStatusAt = (slotIndex: number, status: Season4DesireStatus) => {
    const next = [...selectedStatuses] as Season4DesireStatus[];
    next[slotIndex] = status;
    onUpdateSeasonStatuses(card.deckId, next);
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        className="h-6 xl:h-9 px-2 rounded-full text-xs xl:text-sm"
        onClick={() => setOpen(true)}
      >
        {t("card.level")}.{selectedLevel}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={dialogContentClass}>
          <DialogHeader>
            <DialogTitle>{t("card.level")}</DialogTitle>
            <DialogCloseButton onClick={() => setOpen(false)} />
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((level) => (
              <Button
                key={`${card.deckId}-season-level-${level}`}
                type="button"
                variant="outline"
                className={cn(selectedLevel === level && "ring-2 ring-primary")}
                onClick={() => {
                  onUpdateSeasonLevel(card.deckId, level as 1 | 2 | 3);
                }}
              >
                {t("card.level")}.{level}
              </Button>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">{t("card.seasonStatus", { defaultValue: "ステータス" })}</p>
            {Array.from({ length: selectedLevel }, (_, index) => index + 1).map((level) => {
              const slotIndex = level - 1;
              const selectedStatus = selectedStatuses[slotIndex];
              return (
                <div key={`${card.deckId}-status-slot-${level}`} className="grid grid-cols-[3.5rem_1fr] items-center gap-2">
                  <span className="text-sm">{t("card.level")}.{level}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {SEASON4_DESIRE_STATUS_OPTIONS.map((status) => {
                      const label = t(`status.${status}`);
                      return (
                        <Button
                          key={`${card.deckId}-status-${level}-${status}`}
                          type="button"
                          variant="outline"
                          size="sm"
                          aria-label={`${t("card.level")}.${selectedLevel} スロット${slotIndex + 1} ${label}`}
                          className={cn(selectedStatus === status && "ring-2 ring-primary")}
                          onClick={() => updateStatusAt(slotIndex, status)}
                        >
                          {label}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
