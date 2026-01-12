import { create } from "zustand";
import type { Character, Deck, Equipment, EquipmentType, DeckCard, GodType, CopiedCardEntry, RemovedCardEntry } from "@/types";
import { getCardById, CHARACTERS } from "@/lib/data";

interface DeckBuilderStore {
  deck: Deck | null;
  egoLevels: Record<string, number>;
  setCharacter: (character: Character) => void;
  setDeck: (deck: Deck) => void;
  setEgoLevel: (characterId: string, level: number) => void;
  setPotential: (hasPotential: boolean) => void;
  addCard: (card: DeckCard) => void;
  removeCard: (deckId: string) => void;
  restoreCard: (card: DeckCard) => void;
  selectEquipment: (type: EquipmentType, equipment: Equipment | null) => void;
  updateCardHirameki: (deckId: string, level: number) => void;
  setCardGodHirameki: (deckId: string, godType: GodType | null) => void;
  setCardGodHiramekiEffect: (deckId: string, effectId: string | null) => void;
  undoCard: (deckId: string) => void;
  copyCard: (deckId: string) => void;
  convertCard: (deckId: string, targetCardId: string) => void;
  reset: () => void;
}

export const useDeckBuilderStore = create<DeckBuilderStore>((set) => ({
  deck: null,
  egoLevels: {},
  setCharacter: (character) => {
    set((state) => {
      const startingCards: DeckCard[] = (character.startingCards?.flatMap(id => {
        const base = getCardById(id);
        if (!base) return [];
        return [{
          ...base,
          deckId: `${id}_${Date.now()}_${Math.random()}`,
          selectedHiramekiLevel: 0,
          godHiramekiType: null,
          godHiramekiEffectId: null,
        }];
      }) ?? []) as DeckCard[];
      if (!state.deck) {
        // デッキが未初期化なら新規作成
        return {
          deck: {
            name: '',
            character,
            equipment: { weapon: null, armor: null, pendant: null },
            cards: startingCards,
            egoLevel: 0,
            hasPotential: false,
            createdAt: new Date(),
            removedCards: new Map(),
            copiedCards: new Map(),
            convertedCards: new Map(),
          },
        };
      }
      // 既存デッキがあればcharacterとcardsを更新
      return {
        deck: { ...state.deck, character, cards: startingCards },
      };
    });
  },
  setDeck: (deck) => {
    // characterがidの場合はCHARACTERSからオブジェクト化
    let charObj = null;
    if (deck.character) {
      if (typeof deck.character === 'string') {
        const charId = deck.character as string;
        charObj = CHARACTERS.find((c: Character) => c.id === charId) ?? null;
      } else {
        charObj = deck.character;
      }
    }
    let newDeck = deck;
    if (charObj) {
      newDeck = { ...deck, character: charObj };
    }
    set({ deck: newDeck });
  },
  setEgoLevel: (characterId, level) =>
    set((state) => ({
      egoLevels: { ...state.egoLevels, [characterId]: level },
    })),
  setPotential: (hasPotential) => {
    set((state) => {
      if (!state.deck) return {};
      return {
        deck: { ...state.deck, hasPotential },
      };
    });
  },
  addCard: (card) => {
    set((state) => {
      if (!state.deck) return {};
      return {
        deck: { ...state.deck, cards: [...state.deck.cards, card] },
      };
    });
  },
  removeCard: (deckId) => {
    set((state) => {
      if (!state.deck) return {};
      const cardToRemove = state.deck.cards.find((c) => c.deckId === deckId);
      if (!cardToRemove) return {};
      
      // Track removal in removedCards map with snapshot of current card state
      const newRemoved = new Map(state.deck.removedCards);
      const existing = newRemoved.get(cardToRemove.id);
      const currentCount = typeof existing === "number" ? existing : (existing?.count ?? 0);
      
      const snapshot: RemovedCardEntry = {
        count: currentCount + 1,
        type: cardToRemove.type,
        selectedHiramekiLevel: cardToRemove.selectedHiramekiLevel,
        godHiramekiType: cardToRemove.godHiramekiType,
        godHiramekiEffectId: cardToRemove.godHiramekiEffectId,
        isBasicCard: cardToRemove.isBasicCard,
      };
      newRemoved.set(cardToRemove.id, snapshot);
      
      return {
        deck: { 
          ...state.deck, 
          cards: state.deck.cards.filter(c => c.deckId !== deckId),
          removedCards: newRemoved,
        },
      };
    });
  },
  restoreCard: (card) => {
    set((state) => {
      if (!state.deck) return {};
      // 変換済みカード（変換先）がデッキに存在する場合は除外
      let newCards = state.deck.cards;
      let newConverted = new Map(state.deck.convertedCards);
      if (newConverted.has(card.id)) {
        // 変換先idを取得
        const entry = newConverted.get(card.id);
        const convertedToId = typeof entry === 'string' ? entry : entry?.convertedToId;
        if (convertedToId) {
          newCards = newCards.filter(c => c.id !== convertedToId);
        }
        newConverted.delete(card.id);
      }
      // 既に同じdeckIdのカードが存在しない場合のみ追加
      if (newCards.some(c => c.deckId === card.deckId)) return {};
      return {
        deck: { ...state.deck, cards: [...newCards, card], convertedCards: newConverted },
      };
    });
  },
  selectEquipment: (type, equipment) => {
    set((state) => {
      if (!state.deck) return {};
      return {
        deck: {
          ...state.deck,
          equipment: {
            ...state.deck.equipment,
            [type]: equipment,
          },
        },
      };
    });
  },
  updateCardHirameki: (deckId, level) => {
    set((state) => {
      if (!state.deck) return {};
      return {
        deck: {
          ...state.deck,
          cards: state.deck.cards.map((card) =>
            card.deckId === deckId ? { ...card, selectedHiramekiLevel: level } : card
          ),
        },
      };
    });
  },
  setCardGodHirameki: (deckId, godType) => {
    set((state) => {
      if (!state.deck) return {};
      return {
        deck: {
          ...state.deck,
          cards: state.deck.cards.map((card) =>
            card.deckId === deckId ? { ...card, godHiramekiType: godType } : card
          ),
        },
      };
    });
  },
  setCardGodHiramekiEffect: (deckId, effectId) => {
    set((state) => {
      if (!state.deck) return {};
      return {
        deck: {
          ...state.deck,
          cards: state.deck.cards.map((card) =>
            card.deckId === deckId ? { ...card, godHiramekiEffectId: effectId } : card
          ),
        },
      };
    });
  },
  undoCard: (deckId) => {
    set((state) => {
      if (!state.deck) return {};
      const cardToRemove = state.deck.cards.find((c) => c.deckId === deckId);
      if (!cardToRemove) return {};
      
      // Track removal in removedCards map with snapshot of current card state
      const newRemoved = new Map(state.deck.removedCards);
      const existing = newRemoved.get(cardToRemove.id);
      const currentCount = typeof existing === "number" ? existing : (existing?.count ?? 0);
      
      const snapshot: RemovedCardEntry = {
        count: currentCount + 1,
        type: cardToRemove.type,
        selectedHiramekiLevel: cardToRemove.selectedHiramekiLevel,
        godHiramekiType: cardToRemove.godHiramekiType,
        godHiramekiEffectId: cardToRemove.godHiramekiEffectId,
        isBasicCard: cardToRemove.isBasicCard,
      };
      newRemoved.set(cardToRemove.id, snapshot);
      
      return {
        deck: {
          ...state.deck,
          cards: state.deck.cards.filter((c) => c.deckId !== deckId),
          removedCards: newRemoved,
        },
      };
    });
  },
  copyCard: (deckId) => {
    set((state) => {
      if (!state.deck) return {};
      const card = state.deck.cards.find((c) => c.deckId === deckId);
      if (!card) return {};
      const copy: DeckCard = {
        ...card,
        deckId: `${card.id}_${Date.now()}_${Math.random()}`,
        isCopied: true,
        copiedFromCardId: card.id,
      };
      // Track copy in copiedCards map with snapshot of current card state
      const newCopied = new Map(state.deck.copiedCards);
      const existing = newCopied.get(card.id);
      const currentCount = typeof existing === "number" ? existing : (existing?.count ?? 0);
      
      const snapshot: CopiedCardEntry = {
        count: currentCount + 1,
        type: card.type,
        selectedHiramekiLevel: card.selectedHiramekiLevel,
        godHiramekiType: card.godHiramekiType,
        godHiramekiEffectId: card.godHiramekiEffectId,
        isBasicCard: card.isBasicCard,
      };
      newCopied.set(card.id, snapshot);
      return {
        deck: {
          ...state.deck,
          cards: [...state.deck.cards, copy],
          copiedCards: newCopied,
        },
      };
    });
  },
  convertCard: (deckId, targetCardId) => {
    set((state) => {
      if (!state.deck) return {};
      const cardToConvert = state.deck.cards.find((c) => c.deckId === deckId);
      if (!cardToConvert) return {};
      const target = getCardById(targetCardId);
      if (!target) return {};
      const convertedCard = {
        ...target,
        deckId: `${target.id}_${Date.now()}_${Math.random()}`,
        selectedHiramekiLevel: 0,
        godHiramekiType: null,
        godHiramekiEffectId: null,
      };
      const cardIndex = state.deck.cards.findIndex((c) => c.deckId === deckId);
      const newCards = [...state.deck.cards];
      newCards[cardIndex] = convertedCard;
      // Track conversion with snapshot of original card state
      const newConverted = new Map(state.deck.convertedCards);
      const snapshot = {
        convertedToId: target.id,
        originalType: cardToConvert.type,
        selectedHiramekiLevel: cardToConvert.selectedHiramekiLevel,
        godHiramekiType: cardToConvert.godHiramekiType,
        godHiramekiEffectId: cardToConvert.godHiramekiEffectId,
        isBasicCard: cardToConvert.isBasicCard,
      };
      newConverted.set(cardToConvert.id, snapshot);
      return {
        deck: {
          ...state.deck,
          cards: newCards,
          convertedCards: newConverted,
        },
      };
    });
  },
  reset: () => set({ deck: null, egoLevels: {} }),
}));
