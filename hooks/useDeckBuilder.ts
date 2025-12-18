"use client";

import { useState, useCallback } from "react";
import { Character, Equipment, Card, DeckCard, Deck, EquipmentType, GodType, CardType } from "@/types";
import { getCharacterStartingCards } from "@/lib/data";

export function useDeckBuilder() {
  const [deck, setDeck] = useState<Deck>({
    character: null,
    equipment: {
      weapon: null,
      armor: null,
      pendant: null
    },
    cards: [],
    egoLevel: 0,
    hasPotential: false,
    createdAt: new Date(),
    removedCards: new Map(),
    copiedCards: new Map(),
    convertedCards: new Set()
  });

  const selectCharacter = useCallback((character: Character) => {
    setDeck(prev => {
      // Get starting cards for the character
      const startingCards = getCharacterStartingCards(character);
      const deckCards: DeckCard[] = startingCards.map(card => ({
        ...card,
        deckId: `${card.id}_${Date.now()}_${Math.random()}`,
        selectedHiramekiLevel: 0,
        godHiramekiType: null,
        godHiramekiEffectId: null
      }));

      return {
        ...prev,
        character,
        cards: deckCards
      };
    });
  }, []);

  const selectEquipment = useCallback((equipment: Equipment | null, type?: EquipmentType) => {
    setDeck(prev => {
      const newEquipment = { ...prev.equipment };
      const targetType = equipment?.type ?? type;
      switch (targetType) {
        case EquipmentType.WEAPON:
          newEquipment.weapon = equipment;
          break;
        case EquipmentType.ARMOR:
          newEquipment.armor = equipment;
          break;
        case EquipmentType.PENDANT:
          newEquipment.pendant = equipment;
          break;
      }
      return {
        ...prev,
        equipment: newEquipment
      };
    });
  }, []);

  const addCard = useCallback((card: Card) => {
    setDeck(prev => {
      // Check if hirameki card already exists in deck or has been removed
      if (card.type === CardType.CHARACTER) {
        const alreadyExists = prev.cards.some(c => c.id === card.id);
        const hasBeenRemoved = prev.removedCards.has(card.id);
        if (alreadyExists || hasBeenRemoved) {
          return prev; // Don't add duplicate or removed hirameki card
        }
      }

      const deckCard: DeckCard = {
        ...card,
        deckId: `${card.id}_${Date.now()}_${Math.random()}`,
        selectedHiramekiLevel: 0,
        godHiramekiType: null,
        godHiramekiEffectId: null
      };
      return {
        ...prev,
        cards: [...prev.cards, deckCard]
      };
    });
  }, []);

  const removeCard = useCallback((deckId: string) => {
    setDeck(prev => {
      // Find the card being removed
      const cardToRemove = prev.cards.find(card => card.deckId === deckId);
      if (!cardToRemove) return prev;

      // Update removedCards count
      const newRemovedCards = new Map(prev.removedCards);
      const currentCount = newRemovedCards.get(cardToRemove.id) || 0;
      newRemovedCards.set(cardToRemove.id, currentCount + 1);

      return {
        ...prev,
        cards: prev.cards.filter(card => card.deckId !== deckId),
        removedCards: newRemovedCards
      };
    });
  }, []);

  const restoreCard = useCallback((card: Card) => {
    setDeck(prev => {
      // For character cards, only restore once and remove from removedCards
      if (card.type === CardType.CHARACTER) {
        const newRemovedCards = new Map(prev.removedCards);
        newRemovedCards.delete(card.id);

        const deckCard: DeckCard = {
          ...card,
          deckId: `${card.id}_${Date.now()}_${Math.random()}`,
          selectedHiramekiLevel: 0,
          godHiramekiType: null,
          godHiramekiEffectId: null
        };

        return {
          ...prev,
          cards: [...prev.cards, deckCard],
          removedCards: newRemovedCards
        };
      }

      // For non-character cards, use regular addCard behavior
      const deckCard: DeckCard = {
        ...card,
        deckId: `${card.id}_${Date.now()}_${Math.random()}`,
        selectedHiramekiLevel: 0,
        godHiramekiType: null,
        godHiramekiEffectId: null
      };
      return {
        ...prev,
        cards: [...prev.cards, deckCard]
      };
    });
  }, []);

  const undoCard = useCallback((deckId: string) => {
    setDeck(prev => {
      // Simply remove the card from deck without adding to removedCards
      return {
        ...prev,
        cards: prev.cards.filter(card => card.deckId !== deckId)
      };
    });
  }, []);

  const copyCard = useCallback((deckId: string) => {
    setDeck(prev => {
      const cardToCopy = prev.cards.find(c => c.deckId === deckId);
      if (!cardToCopy || cardToCopy.isBasicCard) {
        return prev; // Can't copy basic cards
      }

      // Create a copy with a new deckId
      const copiedCard: DeckCard = {
        ...cardToCopy,
        deckId: `${cardToCopy.id}_copy_${Date.now()}_${Math.random()}`,
        isCopied: true
      };

      // Track in copiedCards Map
      const newCopiedCards = new Map(prev.copiedCards);
      const currentCount = newCopiedCards.get(cardToCopy.id) || 0;
      newCopiedCards.set(cardToCopy.id, currentCount + 1);

      return {
        ...prev,
        cards: [...prev.cards, copiedCard],
        copiedCards: newCopiedCards
      };
    });
  }, []);

  const convertCard = useCallback((deckId: string) => {
    setDeck(prev => {
      const cardToConvert = prev.cards.find(c => c.deckId === deckId);
      if (!cardToConvert) {
        return prev;
      }

      const newConverted = new Set(prev.convertedCards);
      newConverted.add(cardToConvert.id);

      return {
        ...prev,
        cards: prev.cards.filter(c => c.deckId !== deckId),
        convertedCards: newConverted
      };
    });
  }, []);

  const updateCardHirameki = useCallback((deckId: string, hiramekiLevel: number) => {
    setDeck(prev => ({
      ...prev,
      cards: prev.cards.map(card => 
        card.deckId === deckId 
          ? { ...card, selectedHiramekiLevel: hiramekiLevel }
          : card
      )
    }));
  }, []);

  const setCardGodHirameki = useCallback((deckId: string, godType: GodType | null) => {
    setDeck(prev => ({
      ...prev,
      cards: prev.cards.map(card => 
        card.deckId === deckId 
          ? { ...card, godHiramekiType: godType, godHiramekiEffectId: null }
          : card
      )
    }));
  }, []);

  const clearDeck = useCallback(() => {
    setDeck({
      character: null,
      equipment: {
        weapon: null,
        armor: null,
        pendant: null
      },
      cards: [],
      egoLevel: 0,
      hasPotential: false,
      createdAt: new Date(),
      removedCards: new Map(),
      copiedCards: new Map(),
      convertedCards: new Set()
    });
  }, []);

  const setName = useCallback((name: string) => {
    setDeck(prev => ({
      ...prev,
      name
    }));
  }, []);

  const setEgoLevel = useCallback((level: number) => {
    setDeck(prev => ({
      ...prev,
      egoLevel: Math.max(0, Math.min(6, level))
    }));
  }, []);

  const togglePotential = useCallback(() => {
    setDeck(prev => ({
      ...prev,
      hasPotential: !prev.hasPotential
    }));
  }, []);

  return {
    deck,
    selectCharacter,
    selectEquipment,
    addCard,
    removeCard,
    restoreCard,
    undoCard,
    copyCard,
    convertCard,
    updateCardHirameki,
    setCardGodHirameki,
    clearDeck,
    setName,
    setEgoLevel,
    togglePotential
  };
}
