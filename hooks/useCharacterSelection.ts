import { useState, useCallback, useEffect } from "react";
import { Character } from "@/types";

interface UseCharacterSelectionProps {
  character: Character | null;
  onSelect: (character: Character) => void;
  onEgoLevelChange?: (level: number) => void;
}

export function useCharacterSelection({
  character,
  onSelect,
  onEgoLevelChange,
}: UseCharacterSelectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [egoLevels, setEgoLevels] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!character) {
      return;
    }

    setEgoLevels((prev) => ({
      ...prev,
      [character.id]: character.egoLevel ?? 0,
    }));
  }, [character]);

  const getEgoLevel = useCallback(
    (character: Character) => {
      return egoLevels[character.id] ?? character.egoLevel ?? 0;
    },
    [egoLevels],
  );

  const handleEgoIncrement = useCallback(
    (targetCharacter: Character, syncSelect = false) => {
      const current = getEgoLevel(targetCharacter);
      const next = current >= 6 ? 0 : current + 1;
      setEgoLevels((prev) => ({ ...prev, [targetCharacter.id]: next }));
      if (syncSelect || character?.id === targetCharacter.id) {
        onEgoLevelChange?.(next);
      }
    },
    [character, getEgoLevel, onEgoLevelChange],
  );

  const handleSelect = useCallback(
    (targetCharacter: Character) => {
      onSelect({ ...targetCharacter, egoLevel: getEgoLevel(targetCharacter) });
      setIsOpen(false);
    },
    [getEgoLevel, onSelect],
  );

  return {
    isOpen,
    setIsOpen,
    egoLevels,
    getEgoLevel,
    handleEgoIncrement,
    handleSelect,
  };
}
