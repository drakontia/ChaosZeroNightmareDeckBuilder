"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import type { DeckCard } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogCloseButton } from "@/components/DialogCloseButton";

interface SeasonLevelControlsProps {
  card: DeckCard;
  onUpdateSeasonLevel: (deckId: string, level: 1 | 2 | 3) => void;
}

const dialogContentClass = "w-[90vw] max-w-md";

export function SeasonLevelControls({ card, onUpdateSeasonLevel }: SeasonLevelControlsProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const selectedLevel = card.selectedSeasonLevel ?? 1;

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
                  setOpen(false);
                }}
              >
                {t("card.level")}.{level}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
