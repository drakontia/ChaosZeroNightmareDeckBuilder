"use client";
import { useTranslations } from 'next-intl';

import { CardFrame } from './CardFrame';
import { HiramekiControls } from './HiramekiControls';
import { CardActionsMenu } from './CardActionsMenu';
import { SeasonLevelControls } from "./SeasonLevelControls";

import { DeckCard, GodType, CznCard, JobType, CardStatus, CardType, PersonaEngraving, Season4DesireStatus } from "@/types";
import { Card } from "./ui/card";
import { getCardInfo, sortDeckCards } from "@/lib/deck-utils";
import { GOD_HIRAMEKI_EFFECTS } from "@/lib/god-hirameki";
import { HIDDEN_HIRAMEKI_EFFECTS } from "@/lib/hidden-hirameki";
import { isSeason4Card } from "@/lib/season4";

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
  onSetPersonaEngravings: (deckId: string, engravings: PersonaEngraving[]) => void;
  onUpdateSeasonLevel: (deckId: string, level: 1 | 2 | 3) => void;
  onUpdateSeasonStatuses: (deckId: string, statuses: Season4DesireStatus[]) => void;
}

export function DeckDisplay({ cards, egoLevel, hasPotential, allowedJob, onRemoveCard, onUndoCard, onCopyCard, onConvertCard, onUpdateHirameki, onSetGodHirameki, onSetGodHiramekiEffect, onSetHiddenHirameki, onSetPersonaEngravings, onUpdateSeasonLevel, onUpdateSeasonStatuses }: DeckDisplayProps) {
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
        const localizedCard = card.id.startsWith("persona_")
          ? {
              ...card,
              name: t(`cards.${card.id}.name`, { defaultValue: card.name }),
              hiramekiVariations: card.hiramekiVariations.map((variation) => ({
                ...variation,
                name: variation.name
                  ? t(`cards.${card.id}.name.${variation.level}`, { defaultValue: variation.name })
                  : variation.name,
                description: t(`cards.${card.id}.descriptions.${variation.level}`, { defaultValue: variation.description }),
              })),
            }
          : card;
        const cardInfo = getCardInfo(localizedCard, egoLevel, hasPotential, undefined, {
          persona: {
            getName: (variant) => t(`cards.personaMeta.names.${variant}`),
            getEngravingDescription: (definition) => t(`cards.personaMeta.engravings.${definition.descriptionKey}`),
          },
          translateGodEffect: (effectId, fallback) => t(`godEffects.${effectId}`, { defaultValue: fallback }),
          translateHiddenEffect: (effectId, fallback) => t(`hiddenEffects.${effectId}`, { defaultValue: fallback }),
        });
        const isSeason4 = isSeason4Card(card);
        const supportsHiramekiControls =
          !isSeason4 &&
          card.hiramekiVariations.length > 0 &&
          (card.type !== CardType.CHARACTER || card.hiramekiVariations.length > 1);
        const hasPersonaEngravings = card.id.startsWith('persona_') && (card.personaEngravings?.length ?? 0) > 0;
        const variationName = card.hiramekiVariations[card.selectedHiramekiLevel]?.name;
        const nameId = hasPersonaEngravings
          ? undefined
          : variationName
          ? `cards.${card.id}.name.${card.selectedHiramekiLevel}`
          : `cards.${card.id}.name`;
        const nameFallback = variationName ?? cardInfo.name;
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
        const leftControls = isSeason4 ? (
            <SeasonLevelControls card={card} onUpdateSeasonLevel={onUpdateSeasonLevel} onUpdateSeasonStatuses={onUpdateSeasonStatuses} />
          ) : supportsHiramekiControls ? (
            <HiramekiControls
              card={card}
              egoLevel={egoLevel}
              hasPotential={hasPotential}
              allowedJob={allowedJob}
              onUpdateHirameki={onUpdateHirameki}
              onSetGodHirameki={onSetGodHirameki}
              onSetGodHiramekiEffect={onSetGodHiramekiEffect}
              onSetHiddenHirameki={onSetHiddenHirameki}
              onSetPersonaEngravings={onSetPersonaEngravings}
            />
          ) : undefined;
        return (
          <Card key={card.deckId}>
            <CardFrame
              imgUrl={cardInfo.imgUrl ?? card.imgUrl}
              alt={nameFallback}
              cost={cardInfo.cost}
              name={hasPersonaEngravings ? nameFallback : undefined}
              nameId={nameId}
              nameFallback={nameFallback}
              category={t(`category.${cardInfo.category ?? card.category}`)}
              categoryId={cardInfo.category ?? card.category}
              description={hasPersonaEngravings || isSeason4 ? cardInfo.description : undefined}
              descriptionId={hasPersonaEngravings || isSeason4 ? undefined : `cards.${card.id}.descriptions.${card.selectedHiramekiLevel}`}
              descriptionFallback={cardInfo.description}
               godEffectId={hasPersonaEngravings ? undefined : godEffectId}
               godEffectFallback={hasPersonaEngravings ? undefined : godEffectFallback}
               hiddenEffectId={hasPersonaEngravings ? undefined : hiddenEffectId}
               hiddenEffectFallback={hasPersonaEngravings ? undefined : hiddenEffectFallback}
               statuses={displayStatuses.map(s => t(`status.${s}`))}
               isCopied={card.isCopied}
               grade={card.grade}
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
