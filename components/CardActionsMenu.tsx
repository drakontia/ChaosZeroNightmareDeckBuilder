"use client";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { CircleX, Undo2, Copy, ArrowRightLeft, Menu } from "lucide-react";
import { DeckCard, CznCard, JobType, CardStatus } from "@/types";
import { Button } from "./ui/button";
import { useCardActionsMenu } from "@/hooks/useCardActionsMenu";

const ConversionModal = dynamic(
  () => import("./ConversionModal").then((m) => ({ default: m.ConversionModal })),
  { ssr: false }
);

interface CardActionsMenuProps {
  card: DeckCard;
  allowedJob?: JobType;
  onRemoveCard: (deckId: string) => void;
  onCopyCard: (deckId: string) => void;
  onConvertCard: (deckId: string, targetCard: CznCard, options?: { asExclusion?: boolean }) => void;
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
  const effectiveStatuses = variation?.statuses ?? card.statuses;
  const isPersonaCard = card.id.startsWith("persona_");
  const canCopy = !card.isBasicCard && !effectiveStatuses.includes(CardStatus.UNIQUE);
  const canRemove = !isPersonaCard;
  const canConvert = !isPersonaCard;

  // 統一されたボタンスタイル定数
  const actionButtonClass = "h-6 xl:h-9 w-6 xl:w-9 rounded-full";
  const actionIconClass = "h-4 xl:h-5 w-4 xl:w-5";

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label={t("actions.menu", { defaultValue: "メニュー" })}
        onClick={() => setIsOpen(!isOpen)}
        className={actionButtonClass}
        title={t("actions.menu", { defaultValue: "メニュー" })}
      >
        <Menu className={actionIconClass} />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-1 z-20">
          {canRemove && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className={actionButtonClass}
              onClick={() => { onRemoveCard(card.deckId); closeMenu(); }}
              aria-label={t("common.delete", { defaultValue: "削除" })}
              title={t("common.delete", { defaultValue: "削除" })}
            >
              <CircleX className={actionIconClass} />
            </Button>
          )}
          {canCopy && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={actionButtonClass}
              onClick={() => { onCopyCard(card.deckId); closeMenu(); }}
              aria-label={t("common.copy", { defaultValue: "コピー" })}
              title={t("common.copy", { defaultValue: "コピー" })}
            >
              <Copy className={actionIconClass} />
            </Button>
          )}
          {canConvert && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={actionButtonClass}
              onClick={handleConvertClick}
              aria-label={t("common.convert", { defaultValue: "変換" })}
              title={t("common.convert", { defaultValue: "変換" })}
            >
              <ArrowRightLeft className={actionIconClass} />
            </Button>
          )}
          {!card.isBasicCard && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className={actionButtonClass}
              onClick={() => { onUndoCard(card.deckId); closeMenu(); }}
              aria-label={t("actions.undo", { defaultValue: "戻す" })}
              title={t("actions.undo", { defaultValue: "戻す" })}
            >
              <Undo2 className={actionIconClass} />
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
