"use client";

import { useState, useCallback } from "react";
import { Character, Equipment, Card, DeckCard, Deck, EquipmentType, GodType } from "@/types";
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

  const selectEquipment = useCallback((equipment: Equipment) => {
    setDeck(prev => {
      const newEquipment = { ...prev.equipment };
      switch (equipment.type) {
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
    setDeck(prev => ({
      ...prev,
      cards: prev.cards.filter(card => card.deckId !== deckId)
    }));
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
      removedCards: new Map(),
      copiedCards: new Map(),
      convertedCards: new Set()
    });
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
    updateCardHirameki,
    setCardGodHirameki,
    clearDeck,
    setEgoLevel,
    togglePotential
  };
}
