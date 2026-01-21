import { useState, useCallback } from "react";
import { CznCard } from "@/types";

interface UseCardActionsMenuProps {
  onConvertCard: (deckId: string, targetCard: CznCard, options?: { asExclusion?: boolean }) => void;
  deckId: string;
}

export function useCardActionsMenu({ onConvertCard, deckId }: UseCardActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);

  const handleConvertClick = useCallback(() => {
    setIsOpen(false);
    setIsConversionModalOpen(true);
  }, []);

  const handleConversionSelect = useCallback((targetCard: CznCard) => {
    const asExcl = targetCard.id === "__exclusion__";
    onConvertCard(deckId, targetCard, { asExclusion: asExcl });
    setIsConversionModalOpen(false);
  }, [onConvertCard, deckId]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    setIsOpen,
    isConversionModalOpen,
    setIsConversionModalOpen,
    handleConvertClick,
    handleConversionSelect,
    closeMenu,
  };
}
