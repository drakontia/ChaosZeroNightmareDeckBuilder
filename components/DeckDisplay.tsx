"use client";
import { useTranslations } from 'next-intl';
import { CardFrame } from './CardFrame';
import { HiramekiControls } from './HiramekiControls';
import { CardActionsMenu } from './CardActionsMenu';

import { DeckCard, GodType, CznCard, JobType, CardStatus } from "@/types";
import { Card } from "./ui/card";
import { getCardInfo, sortDeckCards } from "@/lib/deck-utils";
import { GOD_HIRAMEKI_EFFECTS } from "@/lib/god-hirameki";
import { HIDDEN_HIRAMEKI_EFFECTS } from "@/lib/hidden-hirameki";

interface DeckDisplayProps {
  cards: DeckCard[];
  egoLevel: number;
  hasPotential: boolean;
  allowedJob?: JobType;
  onRemoveCard: (deckId: string) => void;
  onUndoCard: (deckId: string) => void;
  onCopyCard: (deckId: string) => void;
  onConvertCard: (deckId: string, targetCard: CznCard, options?: { asExclusion?: boolean }) => void;
  onUpdateHirameki: (deckId: string, hiramekiLevel: number) => void;
  onSetGodHirameki: (deckId: string, godType: GodType | null) => void;
  onSetGodHiramekiEffect: (deckId: string, effectId: string | null) => void;
  onSetHiddenHirameki: (deckId: string, hiddenHiramekiId: string | null) => void;
}

export function DeckDisplay({ cards, egoLevel, hasPotential, allowedJob, onRemoveCard, onUndoCard, onCopyCard, onConvertCard, onUpdateHirameki, onSetGodHirameki, onSetGodHiramekiEffect, onSetHiddenHirameki }: DeckDisplayProps) {
  const t = useTranslations();

  // Sort cards to maintain consistent order: Character (Starting -> Hirameki) -> Shared -> Monster -> Forbidden
  const sortedCards = sortDeckCards(cards);

  // name translation will be performed in CardFrame using ID

  if (cards.length === 0) {
    return (
      <Card className="border-dashed border-2 p-10 text-center text-muted-foreground">
        {t('deck.selectCharacterHint')}
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {sortedCards.map((card) => {
        const cardInfo = getCardInfo(card, egoLevel, hasPotential);
        const hasNoHirameki = card.hiramekiVariations.length === 1;
        const nameId = `cards.${card.id}.name`;
        const nameFallback = card.name;
        let godEffectId: string | undefined;
        let godEffectFallback: string | undefined;
        if (card.godHiramekiType && card.godHiramekiEffectId) {
          const effect = GOD_HIRAMEKI_EFFECTS.find(e => e.id === card.godHiramekiEffectId);
          if (effect) {
            godEffectId = effect.id;
            godEffectFallback = effect.additionalEffect;
          }
        }
        let hiddenEffectId: string | undefined;
        let hiddenEffectFallback: string | undefined;
        if (card.selectedHiddenHiramekiId) {
          const effect = HIDDEN_HIRAMEKI_EFFECTS.find(e => e.id === card.selectedHiddenHiramekiId);
          if (effect) {
            hiddenEffectId = effect.id;
            hiddenEffectFallback = effect.additionalEffect;
          }
        }
        const displayStatuses = [...(cardInfo.statuses ?? [])];
        if (card.isCopied) {
          displayStatuses.push(CardStatus.COPIED);
        }
        const leftControls = !hasNoHirameki ? (
          <HiramekiControls
            card={card}
            egoLevel={egoLevel}
            hasPotential={hasPotential}
            onUpdateHirameki={onUpdateHirameki}
            onSetGodHirameki={onSetGodHirameki}
            onSetGodHiramekiEffect={onSetGodHiramekiEffect}
            onSetHiddenHirameki={onSetHiddenHirameki}
          />
        ) : undefined;
        return (
          <Card key={card.deckId}>
            <CardFrame
              imgUrl={card.imgUrl}
              alt={nameFallback}
              cost={cardInfo.cost}
              nameId={nameId}
              nameFallback={nameFallback}
              category={t(`category.${cardInfo.category ?? card.category}`)}
              categoryId={cardInfo.category ?? card.category}
              descriptionId={`cards.${card.id}.descriptions.${card.selectedHiramekiLevel}`}
              descriptionFallback={cardInfo.description}
              godEffectId={godEffectId}
              godEffectFallback={godEffectFallback}
              hiddenEffectId={hiddenEffectId}
              hiddenEffectFallback={hiddenEffectFallback}
              statuses={displayStatuses.map(s => t(`status.${s}`))}
              isCopied={card.isCopied}
              leftControls={leftControls}
              rightControls={
                <CardActionsMenu
                  card={card}
                  allowedJob={allowedJob}
                  onRemoveCard={onRemoveCard}
                  onCopyCard={onCopyCard}
                  onConvertCard={onConvertCard}
                  onUndoCard={onUndoCard}
                />
              }
            />
          </Card>
        );
      })}
    </div>
  );
}
