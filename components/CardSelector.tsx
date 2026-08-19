"use client";
import { useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { CznCard, CardType, Character, RemovedCardEntry, ConvertedCardEntry, DeckCard } from "@/types";
import { getCharacterHiramekiCards, getAddableCards, getCardById } from "@/lib/card";
import { getCardImageFolder } from "@/lib/card-image-paths";
import { Card, CardContent } from "./ui/card";
import { CardFrame } from "./CardFrame";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const cardGridClass = "grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-6 gap-4";
type SeasonNumber = 1 | 2 | 3 | 4;

interface CardSelectorProps {
  character: Character | null;
  onAddCard: (card: CznCard) => void;
  onRestoreCard: (card: DeckCard) => void;
  removedCards?: Map<string, number | RemovedCardEntry>;
  convertedCards?: Map<string, string | ConvertedCardEntry>;
  presentHiramekiIds?: Set<string>;
  searchQuery?: string;
}

export function CardSelector({ character, onAddCard, onRestoreCard, removedCards, convertedCards, presentHiramekiIds, searchQuery }: CardSelectorProps) {
  const t = useTranslations();
  const isPersonaCard = (card: CznCard) => card.id.startsWith("persona_");
  const getCardNameInfo = (card: CznCard, level: number = 0) => {
    const variationName = card.hiramekiVariations[level]?.name;
    const levelKey = `cards.${card.id}.name.${level}`;
    if (variationName) {
      return {
        name: t(levelKey, { defaultValue: variationName }),
        nameId: levelKey,
        nameFallback: variationName,
      };
    }
    const baseKey = `cards.${card.id}.name`;
    return {
      name: t(baseKey, { defaultValue: card.name }),
      nameId: baseKey,
      nameFallback: card.name,
    };
  };
  const characterHiramekiCards = useMemo(
    () => (character ? getCharacterHiramekiCards(character) : []),
    [character]
  );
  const addableCards = useMemo(() => getAddableCards(character?.job), [character?.job]);

  // ヒラメキカードの表示制御：デッキに存在・削除済み・変換済みは非表示
  const hiddenHiramekiIds = useMemo(() => {
    const ids = new Set<string>();
    if (presentHiramekiIds) {
      for (const id of presentHiramekiIds.values()) ids.add(id);
    }
    if (removedCards) {
      for (const id of removedCards.keys()) ids.add(id);
    }
    if (convertedCards) {
      for (const id of convertedCards.keys()) ids.add(id);
    }
    return ids;
  }, [presentHiramekiIds, removedCards, convertedCards]);

  const query = (searchQuery || '').toLowerCase().trim();
  const matchesQuery = useCallback((card: CznCard) => {
    if (!query) return true;
    const name = getCardNameInfo(card).name.toLowerCase();
    const baseDesc = t(`cards.${card.id}.descriptions.0`, { defaultValue: card.hiramekiVariations[0]?.description || '' }).toLowerCase();
    const category = t(`category.${card.category}`).toLowerCase();
    return name.includes(query) || baseDesc.includes(query) || category.includes(query);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, t]);

  const visibleCharacterHiramekiCards = useMemo(
    () => characterHiramekiCards.filter(card => !hiddenHiramekiIds.has(card.id)).filter(matchesQuery),
    [characterHiramekiCards, hiddenHiramekiIds, matchesQuery]
  );

  const filteredSharedCards = useMemo(
    () => addableCards
      .filter(c => c.type === CardType.SHARED)
      .filter((card) => !(isPersonaCard(card) && hiddenHiramekiIds.has(card.id)))
      .filter(matchesQuery),
    [addableCards, hiddenHiramekiIds, matchesQuery]
  );
  const filteredMonsterCards = useMemo(
    () => addableCards
      .filter(c => c.type === CardType.MONSTER)
      .filter((card) => !(isPersonaCard(card) && hiddenHiramekiIds.has(card.id)))
      .filter(matchesQuery),
    [addableCards, hiddenHiramekiIds, matchesQuery]
  );
  const filteredForbiddenCards = useMemo(
    () => addableCards
      .filter(c => c.type === CardType.FORBIDDEN)
      .filter((card) => !(isPersonaCard(card) && hiddenHiramekiIds.has(card.id)))
      .filter(matchesQuery),
    [addableCards, hiddenHiramekiIds, matchesQuery]
  );

  const getForbiddenSeason = useCallback((card: CznCard): SeasonNumber => {
    if (card.id.startsWith("persona_")) return 3;

    const folder = getCardImageFolder(card.id, card.type);
    if (folder === "season4") return 4;
    if (folder === "season3") return 3;
    if (folder === "season2") return 2;
    return 1;
  }, []);

  const forbiddenCardsBySeason = useMemo<Record<SeasonNumber, CznCard[]>>(() => {
    const grouped: Record<SeasonNumber, CznCard[]> = { 1: [], 2: [], 3: [], 4: [] };
    filteredForbiddenCards.forEach((card) => {
      grouped[getForbiddenSeason(card)].push(card);
    });
    return grouped;
  }, [filteredForbiddenCards, getForbiddenSeason]);

  // 共通のカードタイル描画関数
  const renderCardTile = (
    card: CznCard,
    options: {
      keyPrefix?: string;
      onClick?: () => void;
      className?: string;
      title?: string;
    } = {}
  ) => {
    const {
      keyPrefix = '',
      onClick,
      className = 'cursor-pointer',
      title
    } = options;
    const baseVariation = card.hiramekiVariations[0];
    const rawStatuses = (baseVariation.statuses && baseVariation.statuses.length > 0)
      ? baseVariation.statuses
      : card.statuses;
    const key = keyPrefix ? `${keyPrefix}-${card.id}` : card.id;
    const { name: translatedName, nameId, nameFallback } = getCardNameInfo(card);
    const cardTitle = title || translatedName;
    const statuses = rawStatuses?.map(s => t(`status.${s}`));
    const description = t(`cards.${card.id}.descriptions.0`, { defaultValue: baseVariation.description })

    return (
      <button
        key={key}
        type="button"
        className={className}
        onClick={onClick}
        title={cardTitle}
      >
        <Card className="cursor-pointer">
          <CardFrame
            imgUrl={card.imgUrl}
            alt={translatedName}
            cost={baseVariation.cost}
            nameId={nameId}
            nameFallback={nameFallback}
            category={t(`category.${card.category}`)}
            categoryId={card.category}
            descriptionId={`cards.${card.id}.descriptions.0`}
            descriptionFallback={baseVariation.description}
            statuses={statuses}
            grade={card.grade}
          />
        </Card>
      </button>
    );
  };

  const renderCardButton = (card: CznCard) => {
    return renderCardTile(card, {
      onClick: () => onAddCard(card),
    });
  };

  const createRestoredCard = (card: CznCard, entry?: RemovedCardEntry | ConvertedCardEntry): DeckCard => ({
    ...card,
    deckId: `${card.id}_${Date.now()}_${Math.random()}`,
    selectedHiramekiLevel: entry?.selectedHiramekiLevel ?? 0,
    godHiramekiType: entry?.godHiramekiType ?? null,
    godHiramekiEffectId: entry?.godHiramekiEffectId ?? null,
    selectedHiddenHiramekiId: entry?.selectedHiddenHiramekiId ?? null,
    selectedSeasonLevel: entry?.selectedSeasonLevel,
    personaEngravings: entry?.personaEngravings ?? [],
    isCopied: entry?.isCopied,
    copiedFromCardId: entry?.copiedFromCardId,
  });

  const renderRemovedTile = (card: CznCard, entry?: RemovedCardEntry) => {
    const translatedName = getCardNameInfo(card).name;
    return renderCardTile(card, {
      keyPrefix: 'removed',
      onClick: () => onRestoreCard(createRestoredCard(card, entry)),
      title: `${translatedName}${t('card.restoreTooltipSuffix', { defaultValue: 'をデッキに戻す' })}`,
    });
  };

  const renderConvertedTile = (card: CznCard, entry?: ConvertedCardEntry) => {
    const translatedName = getCardNameInfo(card).name;
    return renderCardTile(card, {
      keyPrefix: 'converted',
      onClick: () => onRestoreCard(createRestoredCard(card, entry)),
      title: translatedName,
    });
  };

  // Accordionアイテムを生成する共通関数
  const renderAccordionSection = (filteredCards: CznCard[], label: string, value: string) => {
    if (filteredCards.length === 0) return null;

    return (
      <AccordionItem value={value}>
        <AccordionTrigger className="text-lg font-semibold">
          {label}
        </AccordionTrigger>
        <AccordionContent>
          <div className={cardGridClass}>
            {filteredCards.map(card => renderCardButton(card))}
          </div>
        </AccordionContent>
      </AccordionItem>
    );
  };

  return (
    <Card>
      <CardContent className="p-4 lg:p-6 space-y-6">
        {!character && characterHiramekiCards.length === 0 && (
          <div className="text-sm text-muted-foreground text-center p-4">
            {t("character.select")}
          </div>
        )}
        
        {/* Removed Cards */}
        {removedCards && removedCards.size > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t('card.removedCardsSection', { defaultValue: '削除したカード' })}</h3>
            <div className={cardGridClass}>
              {Array.from(removedCards.entries()).map(([id, entry]) => {
                const card = getCardById(id);
                if (!card) return null;
                if (!matchesQuery(card)) return null;
                return renderRemovedTile(card, typeof entry === "number" ? undefined : entry);
              })}
            </div>
          </div>
        )}

        {/* Converted Cards: show ORIGINAL card, click to restore */}
        {convertedCards && convertedCards.size > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t('card.convertedCardsSection', { defaultValue: '変換したカード' })}</h3>
            <div className={cardGridClass}>
              {Array.from(convertedCards.entries()).map(([originalId, entry]) => {
                const originalCard = getCardById(originalId);
                if (!originalCard) return null;
                if (!matchesQuery(originalCard)) return null;
                return renderConvertedTile(originalCard, typeof entry === "string" ? undefined : entry);
              })}
            </div>
          </div>
        )}

        {/* Character Hirameki Cards */}
        {visibleCharacterHiramekiCards.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">{t('card.hiramekiCards', { defaultValue: 'ヒラメキカード' })}</h3>
            <div className={cardGridClass}>
              {visibleCharacterHiramekiCards.map(card => renderCardButton(card))}
            </div>
          </div>
        )}

        {/* Accordion for Shared, Monster, and Forbidden Cards */}
        <Accordion type="multiple" className="w-full">
          {renderAccordionSection(forbiddenCardsBySeason[4], `${t("card.forbiddenCards")} 4`, 'season-4')}
          {renderAccordionSection(forbiddenCardsBySeason[3], `${t("card.forbiddenCards")} 3`, 'season-3')}
          {renderAccordionSection(forbiddenCardsBySeason[2], `${t("card.forbiddenCards")} 2`, 'season-2')}
          {renderAccordionSection(forbiddenCardsBySeason[1], `${t("card.forbiddenCards")} 1`, 'season-1')}
          {renderAccordionSection(filteredSharedCards, t("card.sharedCards"), 'shared')}
          {renderAccordionSection(filteredMonsterCards, t("card.monsterCards"), 'monster')}
        </Accordion>
      </CardContent>
    </Card>
  );
}
