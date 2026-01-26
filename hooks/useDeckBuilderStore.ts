import { create } from "zustand";
import type { Character, Deck, Equipment, EquipmentType, DeckCard, GodType, CopiedCardEntry, RemovedCardEntry } from "@/types";
import { getCardById, CHARACTERS } from "@/lib/card";

interface DeckBuilderStore {
  deck: Deck | null;
  egoLevels: Record<string, number>;
  removeLimitReached: boolean;
  copyLimitReached: boolean;
  setCharacter: (character: Character) => void;
  setDeck: (deck: Deck) => void;
  setEgoLevel: (characterId: string, level: number) => void;
  setPotential: (hasPotential: boolean) => void;
  addCard: (card: DeckCard) => void;
  removeCard: (deckId: string) => void;
  clearRemoveLimitAlert: () => void;
  restoreCard: (card: DeckCard) => void;
  selectEquipment: (type: EquipmentType, equipment: Equipment | null) => void;
  updateCardHirameki: (deckId: string, level: number) => void;
  setCardGodHirameki: (deckId: string, godType: GodType | null) => void;
  setCardGodHiramekiEffect: (deckId: string, effectId: string | null) => void;
  setCardHiddenHirameki: (deckId: string, hiddenHiramekiId: string | null) => void;
  undoCard: (deckId: string) => void;
  copyCard: (deckId: string) => void;
  clearCopyLimitAlert: () => void;
  convertCard: (deckId: string, targetCardId: string, options?: { asExclusion?: boolean }) => void;
  reset: () => void;
}

export const useDeckBuilderStore = create<DeckBuilderStore>((set) => ({
  deck: null,
  egoLevels: {},
  removeLimitReached: false,
  copyLimitReached: false,
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
          selectedHiddenHiramekiId: null,
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
    
    // createdAt が文字列の場合は Date に正規化
    const normalizedCreatedAt = 
      deck.createdAt instanceof Date
        ? deck.createdAt
        : new Date(deck.createdAt as any);
    
    let newDeck = deck;
    if (charObj || !(deck.createdAt instanceof Date)) {
      newDeck = { 
        ...deck, 
        ...(charObj && { character: charObj }),
        ...(!(deck.createdAt instanceof Date) && { createdAt: normalizedCreatedAt })
      };
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

      const totalRemoved = Array.from(state.deck.removedCards.values()).reduce((sum: number, entry) => {
        if (typeof entry === 'number') return sum + entry;
        return sum + (entry.count ?? 0);
      }, 0);
      if (totalRemoved >= 5) {
        return { removeLimitReached: true };
      }
      
      // Track removal in removedCards map with snapshot of current card state
      const newRemoved = new Map(state.deck.removedCards);
      const existing = newRemoved.get(cardToRemove.id);
      const currentCount = typeof existing === "number" ? existing : (existing?.count ?? 0);
      
      const snapshot: RemovedCardEntry = {
        count: currentCount + 1,
        type: cardToRemove.type,
        grade: cardToRemove.grade,
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
        removeLimitReached: false,
      };
    });
  },
  clearRemoveLimitAlert: () => set({ removeLimitReached: false }),
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
      // Remove from removedCards when restoring
      const newRemoved = new Map(state.deck.removedCards);
      newRemoved.delete(card.id);
      return {
        deck: { ...state.deck, cards: [...newCards, card], convertedCards: newConverted, removedCards: newRemoved },
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
  setCardHiddenHirameki: (deckId, hiddenHiramekiId) => {
    set((state) => {
      if (!state.deck) return {};
      return {
        deck: {
          ...state.deck,
          cards: state.deck.cards.map((card) =>
            card.deckId === deckId ? { ...card, selectedHiddenHiramekiId: hiddenHiramekiId } : card
          ),
        },
      };
    });
  },
  undoCard: (deckId) => {
    set((state) => {
      if (!state.deck) return {};
      const cardToUndo = state.deck.cards.find((c) => c.deckId === deckId);
      if (!cardToUndo) return {};
      
      // Check if this card was converted from another card
      // convertedCards maps originalId -> convertedToId
      // We need to find if current card's ID is a convertedToId
      const newConverted = new Map(state.deck.convertedCards);
      let isConverted = false;
      let originalCardId: string | null = null;
      
      for (const [origId, entry] of newConverted.entries()) {
        const convertedToId = typeof entry === 'string' ? entry : entry?.convertedToId;
        if (convertedToId === cardToUndo.id) {
          isConverted = true;
          originalCardId = origId;
          break;
        }
      }
      
      // If this is a converted card, restore the original card
      if (isConverted && originalCardId) {
        const originalCard = getCardById(originalCardId);
        if (originalCard) {
          const entry = newConverted.get(originalCardId);
          const snapshot = typeof entry === 'string' ? null : entry;
          
          const restoredCard: DeckCard = {
            ...originalCard,
            deckId: `${originalCard.id}_${Date.now()}_${Math.random()}`,
            selectedHiramekiLevel: snapshot?.selectedHiramekiLevel ?? 0,
            godHiramekiType: snapshot?.godHiramekiType ?? null,
            godHiramekiEffectId: snapshot?.godHiramekiEffectId ?? null,
            selectedHiddenHiramekiId: null,
          };
          
          // Replace converted card with original card
          const cardIndex = state.deck.cards.findIndex((c) => c.deckId === deckId);
          const newCards = [...state.deck.cards];
          newCards[cardIndex] = restoredCard;
          
          // Remove from convertedCards
          newConverted.delete(originalCardId);
          
          return {
            deck: {
              ...state.deck,
              cards: newCards,
              convertedCards: newConverted,
            },
          };
        }
      }
      
      // If this is a copied card, just remove it
      if (cardToUndo.isCopied) {
        const newCopied = new Map(state.deck.copiedCards);
        const copiedFromId = cardToUndo.copiedFromCardId || cardToUndo.id;
        const existing = newCopied.get(copiedFromId);
        const currentCount = typeof existing === "number" ? existing : (existing?.count ?? 0);
        
        if (currentCount > 1) {
          const snapshot = typeof existing === 'number' ? null : existing;
          newCopied.set(copiedFromId, {
            count: currentCount - 1,
            type: snapshot?.type ?? cardToUndo.type,
            selectedHiramekiLevel: snapshot?.selectedHiramekiLevel ?? cardToUndo.selectedHiramekiLevel,
            godHiramekiType: snapshot?.godHiramekiType ?? cardToUndo.godHiramekiType,
            godHiramekiEffectId: snapshot?.godHiramekiEffectId ?? cardToUndo.godHiramekiEffectId,
            isBasicCard: snapshot?.isBasicCard ?? cardToUndo.isBasicCard,
          });
        } else {
          newCopied.delete(copiedFromId);
        }
        
        return {
          deck: {
            ...state.deck,
            cards: state.deck.cards.filter((c) => c.deckId !== deckId),
            copiedCards: newCopied,
          },
        };
      }
      
      // Otherwise, just remove the card from the deck (for manually added cards)
      return {
        deck: {
          ...state.deck,
          cards: state.deck.cards.filter((c) => c.deckId !== deckId),
        },
      };
    });
  },
  copyCard: (deckId) => {
    set((state) => {
      if (!state.deck) return {};
      const card = state.deck.cards.find((c) => c.deckId === deckId);
      if (!card) return {};

      const totalCopied = Array.from(state.deck.copiedCards.values()).reduce((sum: number, entry) => {
        if (typeof entry === 'number') return sum + entry;
        return sum + (entry.count ?? 0);
      }, 0);
      if (totalCopied >= 4) {
        return { copyLimitReached: true };
      }

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
        grade: card.grade,
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
        copyLimitReached: false,
      };
    });
  },
  clearCopyLimitAlert: () => set({ copyLimitReached: false }),
  convertCard: (deckId, targetCardId, options) => {
    set((state) => {
      if (!state.deck) return {};
      const asExclusion = options?.asExclusion ?? false;
      const cardToConvert = state.deck.cards.find((c) => c.deckId === deckId);
      if (!cardToConvert) return {};
      const target = getCardById(targetCardId);
      if (!target && !asExclusion) return {};
      const cardIndex = state.deck.cards.findIndex((c) => c.deckId === deckId);
      const newCards = [...state.deck.cards];
      // 排除変換の場合は変換先をデッキに追加しない
      if (!asExclusion && target) {
        const convertedCard = {
          ...target,
          deckId: `${target.id}_${Date.now()}_${Math.random()}`,
          selectedHiramekiLevel: 0,
          godHiramekiType: null,
          godHiramekiEffectId: null,
          selectedHiddenHiramekiId: null,
        };
        newCards[cardIndex] = convertedCard;
      } else {
        newCards.splice(cardIndex, 1);
      }
      // Track conversion with snapshot of original card state
      const newConverted = new Map(state.deck.convertedCards);
      const snapshot = {
        convertedToId: target?.id ?? targetCardId,
        originalType: cardToConvert.type,
        originalGrade: cardToConvert.grade,
        selectedHiramekiLevel: cardToConvert.selectedHiramekiLevel,
        selectedHiddenHiramekiId: cardToConvert.selectedHiddenHiramekiId,
        godHiramekiType: cardToConvert.godHiramekiType,
        godHiramekiEffectId: cardToConvert.godHiramekiEffectId,
        isBasicCard: cardToConvert.isBasicCard,
        excluded: asExclusion,
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
  reset: () => set({ deck: null, egoLevels: {}, removeLimitReached: false, copyLimitReached: false }),
}));
