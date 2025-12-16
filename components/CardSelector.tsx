"use client";
import { useTranslations } from 'next-intl';

import { Card, CardType, Character } from "@/types";
import { getCharacterHiramekiCards, getAddableCards } from "@/lib/data";

interface CardSelectorProps {
  character: Character | null;
  onAddCard: (card: Card) => void;
}

export function CardSelector({ character, onAddCard }: CardSelectorProps) {
  const t = useTranslations();
  const characterHiramekiCards = character ? getCharacterHiramekiCards(character) : [];
  const addableCards = getAddableCards(character?.job);

  const getCardTypeLabel = (type: CardType) => {
    switch (type) {
      case CardType.SHARED:
        return t("card.sharedCards");
      case CardType.MONSTER:
        return t("card.monsterCards");
      case CardType.FORBIDDEN:
        return t("card.forbiddenCards");
      default:
        return t("card.title");
    }
  };

  const getCardTypeColor = (type: CardType) => {
    switch (type) {
      case CardType.SHARED:
        return "border-purple-300 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900";
      case CardType.MONSTER:
        return "border-red-300 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-900";
      case CardType.FORBIDDEN:
        return "border-gray-700 hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800";
      default:
        return "border-blue-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900";
    }
  };

  const renderCardButton = (card: Card) => {
    const baseVariation = card.hiramekiVariations[0];
    return (
      <button
        key={card.id}
        onClick={() => onAddCard(card)}
        className={`p-3 rounded-lg border-2 text-left transition-all ${getCardTypeColor(card.type)}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="font-semibold text-sm">{card.name}</div>
          <div className="text-xs font-bold bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded ml-2 flex-shrink-0">
            {baseVariation.cost}
          </div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
          {baseVariation.description}
        </div>
      </button>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">カードを追加</h2>

      {/* Character Hirameki Cards */}
      {characterHiramekiCards.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">ヒラメキカード</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {characterHiramekiCards.map(card => renderCardButton(card))}
          </div>
        </div>
      )}

      {/* Shared Cards */}
      {addableCards.filter(c => c.type === CardType.SHARED).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{getCardTypeLabel(CardType.SHARED)}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addableCards.filter(c => c.type === CardType.SHARED).map(card => renderCardButton(card))}
          </div>
        </div>
      )}

      {/* Monster Cards */}
      {addableCards.filter(c => c.type === CardType.MONSTER).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">{getCardTypeLabel(CardType.MONSTER)}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addableCards.filter(c => c.type === CardType.MONSTER).map(card => renderCardButton(card))}
          </div>
        </div>
      )}

      {/* Forbidden Cards */}
      {addableCards.filter(c => c.type === CardType.FORBIDDEN).length > 0 && (
        <div className="mb-6 last:mb-0">
          <h3 className="text-lg font-semibold mb-3">{getCardTypeLabel(CardType.FORBIDDEN)}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addableCards.filter(c => c.type === CardType.FORBIDDEN).map(card => renderCardButton(card))}
          </div>
        </div>
      )}

      {!character && characterHiramekiCards.length === 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center p-4">
          t("character.select")
        </div>
      )}
    </div>
  );
}
