"use client";

import { useTranslations, useLocale } from 'next-intl';
import { useDeckBuilder } from "@/hooks/useDeckBuilder";
import { CharacterSelector } from "./CharacterSelector";
import { EquipmentSelector } from "./EquipmentSelector";
import { CardSelector } from "./CardSelector";
import { DeckDisplay } from "./DeckDisplay";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CHARACTERS, EQUIPMENT } from "@/lib/data";
import { getCardInfo, calculateVagueMemory } from "@/types";

export function DeckBuilder() {
  const t = useTranslations();
  const locale = useLocale();
  
  const {
    deck,
    selectCharacter,
    selectEquipment,
    addCard,
    removeCard,
    updateCardHirameki,
    setCardGodHirameki,
    clearDeck,
    setEgoLevel,
    togglePotential
  } = useDeckBuilder();

  const totalCost = deck.cards.reduce((sum, card) => {
    const info = getCardInfo(card, deck.egoLevel, deck.hasPotential);
    return sum + info.cost;
  }, 0);

  const vagueMemoryPoints = calculateVagueMemory(deck);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {t('app.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('app.description')}
              </p>
            </div>
            <LanguageSwitcher currentLocale={locale} />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left side - Character, Points, Equipment */}
          <div className="lg:col-span-4 space-y-6">
            {/* Character Selection */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <CharacterSelector
                characters={CHARACTERS}
                selectedCharacter={deck.character}
                onSelect={selectCharacter}
              />
              
              {/* Character Info Section */}
              {deck.character && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {t('character.job')}: <span className="font-semibold">{t(`job.${deck.character.job}`)}</span>
                  </div>
                  
                  {/* Vague Memory Points */}
                  <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
                    <div className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                      {t('character.vagueMemory')}
                    </div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {vagueMemoryPoints} pt
                    </div>
                  </div>

                  {/* Ego Level Control */}
                  <div className="mt-3">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {t('character.egoManifest')}: {t('card.level')} {deck.egoLevel}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      value={deck.egoLevel}
                      onChange={(e) => setEgoLevel(Number(e.target.value))}
                      className="w-full mt-1"
                    />
                  </div>

                  {/* Potential Toggle */}
                  <div className="mt-3">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={deck.hasPotential}
                        onChange={togglePotential}
                        className="mr-2"
                      />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {t('character.potential')}
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Points/Stats Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">{t('deck.title')}</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-semibold">{t('deck.totalCards')}</span>
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {deck.cards.length}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <span className="font-semibold">{t('deck.totalCost')}</span>
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {totalCost}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={clearDeck}
                  className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all"
                >
                  {t('deck.clear')}
                </button>
              </div>
            </div>

            {/* Equipment Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <EquipmentSelector
                equipment={EQUIPMENT}
                selectedEquipment={deck.equipment}
                onSelect={selectEquipment}
              />
            </div>
          </div>

          {/* Right side - Cards in 4-column grid */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{t('card.title')}</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {deck.cards.length} / 40
                </div>
              </div>
              
              <DeckDisplay
                cards={deck.cards}
                egoLevel={deck.egoLevel}
                hasPotential={deck.hasPotential}
                onRemoveCard={removeCard}
                onUpdateHirameki={updateCardHirameki}
                onSetGodHirameki={setCardGodHirameki}
              />

              {/* Card Selection for adding cards */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <CardSelector
                  character={deck.character}
                  onAddCard={addCard}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
