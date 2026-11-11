"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import type { DeckCard } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogCloseButton } from "@/components/DialogCloseButton";

interface MemoryLevelControlsProps {
  card: DeckCard;
  onUpdateMemoryLevel: (deckId: string, level: 1 | 2 | 3 | 4) => void;
}

export function MemoryLevelControls({ card, onUpdateMemoryLevel }: MemoryLevelControlsProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const selectedLevel = card.selectedMemoryLevel ?? 1;

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
        <DialogContent className="w-[90vw] max-w-md">
          <DialogHeader>
            <DialogTitle>{t("card.memoryLevel", { defaultValue: "記憶カードレベル" })}</DialogTitle>
            <DialogCloseButton onClick={() => setOpen(false)} />
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2">
            {([1, 2, 3, 4] as const).map((level) => (
              <Button
                key={`${card.deckId}-memory-level-${level}`}
                type="button"
                variant="outline"
                aria-label={`${t("card.level")}.${level}`}
                className={cn(selectedLevel === level && "ring-2 ring-primary")}
                onClick={() => {
                  onUpdateMemoryLevel(card.deckId, level);
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
