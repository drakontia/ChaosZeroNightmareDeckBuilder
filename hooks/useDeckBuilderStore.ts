import { create } from "zustand";
import type { Character, Deck, Equipment, EquipmentType, DeckCard, GodType, CopiedCardEntry, RemovedCardEntry, PersonaEngraving, PersonaEngravingAlignment, Season4DesireStatus } from "@/types";
import { getCardById, CHARACTERS } from "@/lib/card";
import { normalizeEquipmentEngravingId } from "@/lib/equipment-engraving";
import { normalizePersonaCardEngravings, VALID_PERSONA_ENGRAVING_ALIGNMENTS } from "@/lib/persona";
import { getSeason4BaseStatus, isSeason4Card, normalizeSeason4SelectedStatuses } from "@/lib/season4";

const PERSONA_CARD_ID_PREFIX = "persona_";

const isPersonaCard = (card: Pick<DeckCard, "id">): boolean => card.id.startsWith(PERSONA_CARD_ID_PREFIX);

const normalizePersonaEngravings = (
  engravings: readonly PersonaEngraving[] | undefined,
  character?: Character | null
): PersonaEngraving[] => {
  if (!engravings) {
    return [];
  }

  const normalized: PersonaEngraving[] = [];
  for (const candidate of engravings) {
    if (!candidate || typeof candidate.id !== "string" || !candidate.id.trim()) {
      continue;
    }
    if (!VALID_PERSONA_ENGRAVING_ALIGNMENTS.has(candidate.alignment)) {
      continue;
    }
    normalized.push({
      id: candidate.id,
      alignment: candidate.alignment,
    });
  }

  return normalizePersonaCardEngravings(normalized, character?.job);
};

const normalizeSeason4CardState = (
  card: Pick<DeckCard, "id" | "statuses" | "selectedSeasonLevel" | "selectedSeasonStatuses">
): { selectedSeasonLevel?: 1 | 2 | 3; selectedSeasonStatuses?: [Season4DesireStatus, Season4DesireStatus, Season4DesireStatus] } => {
  if (!isSeason4Card(card)) {
    return { selectedSeasonLevel: undefined, selectedSeasonStatuses: undefined };
  }
  const fallback = getSeason4BaseStatus(card);
  return {
    selectedSeasonLevel: card.selectedSeasonLevel ?? 1,
    selectedSeasonStatuses: normalizeSeason4SelectedStatuses(card.selectedSeasonStatuses, fallback),
  };
};

interface DeckBuilderStore {
  deck: Deck | null;
  egoLevels: Record<string, number>;
  removeLimitReached: boolean;
  copyLimitReached: boolean;
  conversionLimitReached: boolean;
  setCharacter: (character: Character) => void;
  setDeck: (deck: Deck) => void;
  setEgoLevel: (characterId: string, level: number) => void;
  setPotential: (hasPotential: boolean) => void;
  addCard: (card: DeckCard) => void;
  removeCard: (deckId: string) => void;
  clearRemoveLimitAlert: () => void;
  restoreCard: (card: DeckCard) => void;
  selectEquipment: (type: EquipmentType, equipment: Equipment | null) => void;
  setEquipmentRefinement: (type: EquipmentType, value: string | null) => void;
  setEquipmentGodHammer: (type: EquipmentType, equipmentId: string | null) => void;
  setEquipmentEngraving: (type: EquipmentType, engravingId: string | null) => void;
  updateCardHirameki: (deckId: string, level: number) => void;
  setCardGodHirameki: (deckId: string, godType: GodType | null) => void;
  setCardGodHiramekiEffect: (deckId: string, effectId: string | null) => void;
  setCardHiddenHirameki: (deckId: string, hiddenHiramekiId: string | null) => void;
  updateCardSeasonLevel: (deckId: string, level: 1 | 2 | 3) => void;
  updateCardSeasonStatuses: (deckId: string, statuses: Season4DesireStatus[]) => void;
  setCardPersonaEngravings: (deckId: string, engravings: PersonaEngraving[]) => void;
  undoCard: (deckId: string) => void;
  copyCard: (deckId: string) => void;
  clearCopyLimitAlert: () => void;
  convertCard: (deckId: string, targetCardId: string, options?: { asExclusion?: boolean }) => void;
  clearConversionLimitAlert: () => void;
  reset: () => void;
}

export const useDeckBuilderStore = create<DeckBuilderStore>((set) => ({
  deck: null,
  egoLevels: {},
  removeLimitReached: false,
  copyLimitReached: false,
  conversionLimitReached: false,
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
          ...normalizeSeason4CardState({
            ...base,
            id: base.id,
            selectedSeasonLevel: 1,
            selectedSeasonStatuses: undefined,
          }),
          personaEngravings: [],
        }];
      }) ?? []) as DeckCard[];
      if (!state.deck) {
        // デッキが未初期化なら新規作成
        return {
          deck: {
            name: '',
            character,
            equipment: {
              weapon: null,
              armor: null,
              pendant: null,
             },
             cards: startingCards,
             egoLevel: character.egoLevel ?? 0,
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
          deck: {
            ...state.deck,
            character,
            cards: startingCards,
            egoLevel: character.egoLevel ?? 0,
            removedCards: new Map(),
            copiedCards: new Map(),
            convertedCards: new Map(),
        },
        removeLimitReached: false,
        copyLimitReached: false,
        conversionLimitReached: false,
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
        : new Date(deck.createdAt as unknown as string);
    
    // equipment の正規化。古い形式 (Equipment | null) から新しい形式 (EquipmentSlot | null) へ
      const normalizedEquipment = {
        weapon: !deck.equipment.weapon
          ? null
          : ('item' in deck.equipment.weapon
            ? { ...deck.equipment.weapon, engravingId: normalizeEquipmentEngravingId(deck.equipment.weapon.engravingId) }
            : { item: deck.equipment.weapon as unknown as Equipment, refinement: null, godHammerEquipmentId: null, engravingId: null }),
        armor: !deck.equipment.armor
          ? null
          : ('item' in deck.equipment.armor
            ? { ...deck.equipment.armor, engravingId: normalizeEquipmentEngravingId(deck.equipment.armor.engravingId) }
            : { item: deck.equipment.armor as unknown as Equipment, refinement: null, godHammerEquipmentId: null, engravingId: null }),
        pendant: !deck.equipment.pendant
          ? null
          : ('item' in deck.equipment.pendant
            ? { ...deck.equipment.pendant, engravingId: normalizeEquipmentEngravingId(deck.equipment.pendant.engravingId) }
            : { item: deck.equipment.pendant as unknown as Equipment, refinement: null, godHammerEquipmentId: null, engravingId: null }),
      };
    
      const characterSource = (charObj ?? (typeof deck.character === "string" ? null : deck.character)) ?? null;
      const normalizedCharacter = characterSource
        ? {
            ...characterSource,
            egoLevel: deck.egoLevel ?? characterSource.egoLevel ?? 0,
          }
        : null;
      const normalizedCards = deck.cards.map((card) => ({
        ...card,
        ...normalizeSeason4CardState(card),
        personaEngravings: normalizePersonaEngravings(card.personaEngravings, normalizedCharacter),
      }));
      const normalizedRemovedCards = new Map(
        Array.from(deck.removedCards.entries()).map(([id, entry]) => [
          id,
          typeof entry === "number"
            ? entry
            : {
                ...entry,
                  selectedSeasonStatuses: entry.selectedSeasonStatuses,
                  personaEngravings: normalizePersonaEngravings(entry.personaEngravings, normalizedCharacter),
                },
        ])
      );
      const normalizedCopiedCards = new Map(
        Array.from(deck.copiedCards.entries()).map(([id, entry]) => [
          id,
          typeof entry === "number"
            ? entry
            : {
                ...entry,
                  selectedSeasonStatuses: entry.selectedSeasonStatuses,
                  personaEngravings: normalizePersonaEngravings(entry.personaEngravings, normalizedCharacter),
                },
        ])
      );
      const normalizedConvertedCards = new Map(
        Array.from(deck.convertedCards.entries()).map(([id, entry]) => [
          id,
          typeof entry === "string"
            ? entry
            : {
                ...entry,
                  selectedSeasonStatuses: entry.selectedSeasonStatuses,
                  personaEngravings: normalizePersonaEngravings(entry.personaEngravings, normalizedCharacter),
                },
        ])
      );

      let newDeck = deck;
      newDeck = {
        ...deck,
        character: normalizedCharacter,
        equipment: normalizedEquipment,
        cards: normalizedCards,
        removedCards: normalizedRemovedCards,
        copiedCards: normalizedCopiedCards,
        convertedCards: normalizedConvertedCards,
        createdAt: normalizedCreatedAt,
      };
      set({ deck: newDeck });
  },
  setEgoLevel: (characterId, level) =>
    set((state) => ({
      egoLevels: { ...state.egoLevels, [characterId]: level },
      deck:
        state.deck?.character?.id === characterId
          ? {
              ...state.deck,
              egoLevel: level,
              character: {
                ...state.deck.character,
                egoLevel: level,
              },
            }
          : state.deck,
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
      if (isPersonaCard(card) && state.deck.cards.some(existing => isPersonaCard(existing))) {
        return {};
      }
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
      if (isPersonaCard(cardToRemove)) return {};

      // Check integrated removal+conversion limit (max 5 total)
      const removedCount = Array.from(state.deck.removedCards.values()).reduce((sum: number, entry) => {
        if (typeof entry === 'number') return sum + entry;
        return sum + (entry.count ?? 0);
      }, 0);
      const convertedCount = Array.from(state.deck.convertedCards.values()).length;
      const totalRemovalAndConversion = removedCount + convertedCount;
      
      if (totalRemovalAndConversion >= 5) {
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
          selectedHiddenHiramekiId: cardToRemove.selectedHiddenHiramekiId,
          selectedSeasonLevel: cardToRemove.selectedSeasonLevel,
          selectedSeasonStatuses: cardToRemove.selectedSeasonStatuses,
          personaEngravings: normalizePersonaEngravings(cardToRemove.personaEngravings, state.deck.character),
          godHiramekiType: cardToRemove.godHiramekiType,
          godHiramekiEffectId: cardToRemove.godHiramekiEffectId,
          isBasicCard: cardToRemove.isBasicCard,
          isCopied: cardToRemove.isCopied,
          copiedFromCardId: cardToRemove.copiedFromCardId,
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
      const normalizedCard: DeckCard = {
        ...card,
        ...normalizeSeason4CardState(card),
        personaEngravings: normalizePersonaEngravings(card.personaEngravings, state.deck.character),
      };
      // 変換済みカード（変換先）がデッキに存在する場合は除外
      let newCards = state.deck.cards;
      let newConverted = new Map(state.deck.convertedCards);
      if (newConverted.has(normalizedCard.id)) {
        // 変換先idを取得
        const entry = newConverted.get(normalizedCard.id);
        const convertedToId = typeof entry === 'string' ? entry : entry?.convertedToId;
        if (convertedToId) {
          newCards = newCards.filter(c => c.id !== convertedToId);
        }
        newConverted.delete(normalizedCard.id);
      }
      // 既に同じdeckIdのカードが存在しない場合のみ追加
      if (newCards.some(c => c.deckId === normalizedCard.deckId)) return {};
      // Remove from removedCards when restoring
      const newRemoved = new Map(state.deck.removedCards);
      const removedEntry = newRemoved.get(normalizedCard.id);
      if (typeof removedEntry === "number") {
        if (removedEntry > 1) {
          newRemoved.set(normalizedCard.id, removedEntry - 1);
        } else {
          newRemoved.delete(normalizedCard.id);
        }
      } else if (removedEntry) {
        if (removedEntry.count > 1) {
          newRemoved.set(normalizedCard.id, {
            ...removedEntry,
            count: removedEntry.count - 1,
          });
        } else {
          newRemoved.delete(normalizedCard.id);
        }
      }
      return {
        deck: { ...state.deck, cards: [...newCards, normalizedCard], convertedCards: newConverted, removedCards: newRemoved },
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
            [type]: equipment ? {
              item: equipment,
              refinement: null,
              godHammerEquipmentId: null,
              engravingId: null,
            } : null,
          },
        },
      };
    });
  },
  setEquipmentRefinement: (type, value) => {
    set((state) => {
      if (!state.deck) return {};
      const slot = state.deck.equipment[type];
      if (!slot) return {};
      return {
        deck: {
          ...state.deck,
          equipment: {
            ...state.deck.equipment,
            [type]: {
              ...slot,
              refinement: value, // value can be refinement ID string or null
            },
          },
        },
      };
    });
  },
  setEquipmentGodHammer: (type, equipmentId) => {
    set((state) => {
      if (!state.deck) return {};
      const slot = state.deck.equipment[type];
      if (!slot) return {};
      return {
        deck: {
          ...state.deck,
          equipment: {
            ...state.deck.equipment,
            [type]: {
              ...slot,
              godHammerEquipmentId: equipmentId,
            },
          },
        },
      };
    });
  },
  setEquipmentEngraving: (type, engravingId) => {
    set((state) => {
      if (!state.deck) return {};
      const slot = state.deck.equipment[type];
      if (!slot) return {};
      return {
        deck: {
          ...state.deck,
          equipment: {
            ...state.deck.equipment,
            [type]: {
              ...slot,
              engravingId: normalizeEquipmentEngravingId(engravingId),
            },
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
            card.deckId === deckId && !isPersonaCard(card) && !isSeason4Card(card) ? { ...card, selectedHiramekiLevel: level } : card
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
            card.deckId === deckId && !isPersonaCard(card) && !isSeason4Card(card) ? { ...card, godHiramekiType: godType } : card
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
            card.deckId === deckId && !isPersonaCard(card) && !isSeason4Card(card) ? { ...card, godHiramekiEffectId: effectId } : card
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
            card.deckId === deckId && !isPersonaCard(card) && !isSeason4Card(card) ? { ...card, selectedHiddenHiramekiId: hiddenHiramekiId } : card
          ),
        },
      };
    });
  },
  updateCardSeasonLevel: (deckId, level) => {
    set((state) => {
      if (!state.deck) return {};
      return {
        deck: {
          ...state.deck,
          cards: state.deck.cards.map((card) => {
            if (card.deckId !== deckId || !isSeason4Card(card)) {
              return card;
            }
            const normalized = normalizeSeason4CardState({
              ...card,
              selectedSeasonLevel: level,
            });
            return {
              ...card,
              ...normalized,
            };
          }),
        },
      };
    });
  },
  updateCardSeasonStatuses: (deckId, statuses) => {
    set((state) => {
      if (!state.deck) return {};
      return {
        deck: {
          ...state.deck,
          cards: state.deck.cards.map((card) => {
            if (card.deckId !== deckId || !isSeason4Card(card)) {
              return card;
            }
            const fallback = getSeason4BaseStatus(card);
            return {
              ...card,
              selectedSeasonStatuses: normalizeSeason4SelectedStatuses(statuses, fallback),
            };
          }),
        },
      };
    });
  },
  setCardPersonaEngravings: (deckId, engravings) => {
    set((state) => {
      if (!state.deck) return {};
      const deckCharacter = state.deck.character;
      return {
        deck: {
          ...state.deck,
          cards: state.deck.cards.map((card) => {
            if (card.deckId !== deckId || !isPersonaCard(card)) {
              return card;
            }
            return {
              ...card,
              personaEngravings: normalizePersonaEngravings(engravings, deckCharacter),
            };
          }),
        },
      };
    });
  },
  undoCard: (deckId) => {
    set((state) => {
      if (!state.deck) return {};
      const deckCharacter = state.deck.character;
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
              selectedHiddenHiramekiId: snapshot?.selectedHiddenHiramekiId ?? null,
              selectedSeasonLevel: snapshot?.selectedSeasonLevel,
              selectedSeasonStatuses: snapshot?.selectedSeasonStatuses,
              ...normalizeSeason4CardState({
                ...originalCard,
                selectedSeasonLevel: snapshot?.selectedSeasonLevel,
                selectedSeasonStatuses: snapshot?.selectedSeasonStatuses,
              }),
              personaEngravings: normalizePersonaEngravings(snapshot?.personaEngravings, deckCharacter),
              isCopied: snapshot?.isCopied,
              copiedFromCardId: snapshot?.copiedFromCardId,
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
            selectedHiddenHiramekiId: snapshot?.selectedHiddenHiramekiId ?? cardToUndo.selectedHiddenHiramekiId,
            personaEngravings: normalizePersonaEngravings(snapshot?.personaEngravings ?? cardToUndo.personaEngravings, deckCharacter),
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
      const deckCharacter = state.deck.character;
      const card = state.deck.cards.find((c) => c.deckId === deckId);
      if (!card) return {};
      if (isSeason4Card(card)) return {};

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
        selectedHiddenHiramekiId: card.selectedHiddenHiramekiId,
        selectedSeasonLevel: card.selectedSeasonLevel,
        selectedSeasonStatuses: card.selectedSeasonStatuses,
        personaEngravings: normalizePersonaEngravings(card.personaEngravings, deckCharacter),
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
      const deckCharacter = state.deck.character;
      const asExclusion = options?.asExclusion ?? false;
      const cardToConvert = state.deck.cards.find((c) => c.deckId === deckId);
      if (!cardToConvert) return {};
      if (isPersonaCard(cardToConvert)) return {};
      const target = getCardById(targetCardId);
      if (!target && !asExclusion) return {};

      // Check integrated removal+conversion limit (max 5 total)
      const removedCount = Array.from(state.deck.removedCards.values()).reduce((sum: number, entry) => {
        if (typeof entry === 'number') return sum + entry;
        return sum + (entry.count ?? 0);
      }, 0);
      const convertedCount = Array.from(state.deck.convertedCards.values()).length;
      const totalRemovalAndConversion = removedCount + convertedCount;
      
      if (totalRemovalAndConversion >= 5) {
        return { conversionLimitReached: true };
      }
      const cardIndex = state.deck.cards.findIndex((c) => c.deckId === deckId);
      const newCards = [...state.deck.cards];
      // 排除変換の場合は変換先をデッキに追加しない
      if (!asExclusion && target) {
        const convertedCard: DeckCard = {
          ...target,
          deckId: `${target.id}_${Date.now()}_${Math.random()}`,
          selectedHiramekiLevel: 0,
          godHiramekiType: null,
          godHiramekiEffectId: null,
          selectedHiddenHiramekiId: null,
          ...normalizeSeason4CardState({
            ...target,
            id: target.id,
            selectedSeasonLevel: 1,
            selectedSeasonStatuses: undefined,
          }),
          personaEngravings: [],
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
        selectedSeasonLevel: cardToConvert.selectedSeasonLevel,
        selectedSeasonStatuses: cardToConvert.selectedSeasonStatuses,
        personaEngravings: normalizePersonaEngravings(cardToConvert.personaEngravings, deckCharacter),
        godHiramekiType: cardToConvert.godHiramekiType,
        godHiramekiEffectId: cardToConvert.godHiramekiEffectId,
        isBasicCard: cardToConvert.isBasicCard,
        isCopied: cardToConvert.isCopied,
        copiedFromCardId: cardToConvert.copiedFromCardId,
        excluded: asExclusion,
      };
      newConverted.set(cardToConvert.id, snapshot);
      return {
        deck: {
          ...state.deck,
          cards: newCards,
          convertedCards: newConverted,
        },
        conversionLimitReached: false,
      };
    });
  },
  clearConversionLimitAlert: () => set({ conversionLimitReached: false }),
  reset: () => set({ deck: null, egoLevels: {}, removeLimitReached: false, copyLimitReached: false, conversionLimitReached: false }),
}));
