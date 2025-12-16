"use client";

import { useTranslations } from 'next-intl';
import { Character } from "@/types";

interface CharacterSelectorProps {
  characters: Character[];
  selectedCharacter: Character | null;
  onSelect: (character: Character) => void;
}

export function CharacterSelector({ characters, selectedCharacter, onSelect }: CharacterSelectorProps) {
  const t = useTranslations();
  
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">{t('character.select')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {characters.map((character) => (
          <button
            key={character.id}
            onClick={() => onSelect(character)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedCharacter?.id === character.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-semibold">{character.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t(`rarity.${character.rarity}`)}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
