import { useState, useCallback } from "react";
import { Character } from "@/types";

interface UseCharacterSelectionProps {
  selectedCharacter: Character | null;
  onSelect: (character: Character) => void;
}

export function useCharacterSelection({ selectedCharacter, onSelect }: UseCharacterSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [egoLevels, setEgoLevels] = useState<Record<string, number>>({});

  const getEgoLevel = useCallback((character: Character) => {
    return egoLevels[character.id] ?? character.egoLevel ?? 0;
  }, [egoLevels]);

  const handleEgoIncrement = useCallback((character: Character, syncSelect = false) => {
    const current = getEgoLevel(character);
    const next = current >= 6 ? 0 : current + 1;
    setEgoLevels((prev) => ({ ...prev, [character.id]: next }));
    if (syncSelect || selectedCharacter?.id === character.id) {
      onSelect({ ...character, egoLevel: next });
    }
  }, [getEgoLevel, selectedCharacter, onSelect]);

  const handleSelect = useCallback((character: Character) => {
    onSelect(character);
    setIsOpen(false);
  }, [onSelect]);

  return {
    isOpen,
    setIsOpen,
    egoLevels,
    getEgoLevel,
    handleEgoIncrement,
    handleSelect,
  };
}
