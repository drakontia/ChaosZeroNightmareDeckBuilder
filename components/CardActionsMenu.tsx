"use client";
import { useTranslations } from "next-intl";
import { CircleX, Undo2, Copy, ArrowRightLeft, Menu } from "lucide-react";
import { DeckCard, CznCard, JobType, CardStatus } from "@/types";
import { ConversionModal } from "./ConversionModal";
import { Button } from "./ui/button";
import { useCardActionsMenu } from "@/hooks/useCardActionsMenu";

interface CardActionsMenuProps {
  card: DeckCard;
  allowedJob?: JobType;
  onRemoveCard: (deckId: string) => void;
  onCopyCard: (deckId: string) => void;
  onConvertCard: (deckId: string, targetCard: CznCard) => void;
  onUndoCard: (deckId: string) => void;
}

export function CardActionsMenu({
  card,
  allowedJob,
  onRemoveCard,
  onCopyCard,
  onConvertCard,
  onUndoCard
}: CardActionsMenuProps) {
  const t = useTranslations();
  const {
    isOpen,
    setIsOpen,
    isConversionModalOpen,
    setIsConversionModalOpen,
    handleConvertClick,
    handleConversionSelect,
    closeMenu,
  } = useCardActionsMenu({ onConvertCard, deckId: card.deckId });

  const variation = card.hiramekiVariations[card.selectedHiramekiLevel] ?? card.hiramekiVariations[0];
  const effectiveStatuses = (variation?.statuses && variation.statuses.length > 0)
    ? variation.statuses
    : card.statuses;
  const canCopy = !card.isBasicCard && !effectiveStatuses.includes(CardStatus.UNIQUE);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={t("actions.menu", { defaultValue: "メニュー" })}
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full"
        title={t("actions.menu", { defaultValue: "メニュー" })}
      >
        <Menu className="h-5 w-5" />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-1 z-20">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="rounded-full"
            onClick={() => { onRemoveCard(card.deckId); closeMenu(); }}
            aria-label={t("common.delete", { defaultValue: "削除" })}
            title={t("common.delete", { defaultValue: "削除" })}
          >
            <CircleX className="h-5 w-5" />
          </Button>
          {canCopy && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => { onCopyCard(card.deckId); closeMenu(); }}
              aria-label={t("common.copy", { defaultValue: "コピー" })}
              title={t("common.copy", { defaultValue: "コピー" })}
            >
              <Copy className="h-5 w-5" />
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={handleConvertClick}
            aria-label={t("common.convert", { defaultValue: "変換" })}
            title={t("common.convert", { defaultValue: "変換" })}
          >
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
          {!card.isBasicCard && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => { onUndoCard(card.deckId); closeMenu(); }}
              aria-label={t("actions.undo", { defaultValue: "戻す" })}
              title={t("actions.undo", { defaultValue: "戻す" })}
            >
              <Undo2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      )}
      <ConversionModal
        isOpen={isConversionModalOpen}
        onClose={() => setIsConversionModalOpen(false)}
        onSelectCard={handleConversionSelect}
        allowedJob={allowedJob}
      />
    </>
  );
}
