import { describe, it, expect, beforeEach } from 'vitest';
import { DeckCard, CardType, CardCategory, Deck, HiramekiVariation } from '@/types';
import { getCardInfo } from '@/lib/deck-utils';
import { calculateFaintMemory } from "@/lib/calculateFaintMemory";
import { HIDDEN_HIRAMEKI_EFFECTS } from '@/lib/hidden-hirameki';

describe('Hidden Hirameki (Unified Structure)', () => {
  let testCard: DeckCard;

  beforeEach(() => {
    testCard = {
      id: 'test_card',
      name: 'Test Card',
      type: CardType.SHARED,
      category: CardCategory.SKILL,
      statuses: [],
      deckId: 'deck_test_1',
      selectedHiramekiLevel: 0,
      godHiramekiType: null,
      godHiramekiEffectId: null,
      selectedHiddenHiramekiId: null,
      hiramekiVariations: [
        {
          level: 0,
          cost: 1,
          description: 'Base description',
        },
        {
          level: 1,
          cost: 2,
          description: 'Hirameki Lv1 description',
        }
      ]
    };
  });

  describe('getCardInfo with unified hidden hirameki', () => {
    it('should return regular hirameki info when selectedHiddenHiramekiId is null', () => {
      testCard.selectedHiramekiLevel = 1;
      testCard.selectedHiddenHiramekiId = null;
      const info = getCardInfo(testCard);
      
      expect(info.cost).toBe(2);
      expect(info.description).toBe('Hirameki Lv1 description');
    });

    it('should return base card info when no hirameki is selected', () => {
      testCard.selectedHiramekiLevel = 0;
      testCard.selectedHiddenHiramekiId = null;
      const info = getCardInfo(testCard);
      
      expect(info.cost).toBe(1);
      expect(info.description).toBe('Base description');
    });

    it('should apply hidden hirameki only with base level (Lv0)', () => {
      // Hidden hirameki can only be applied when selectedHiramekiLevel is 0
      testCard.selectedHiramekiLevel = 0;
      const firstHiddenEffect = HIDDEN_HIRAMEKI_EFFECTS[0];
      testCard.selectedHiddenHiramekiId = firstHiddenEffect.id;
      
      const info = getCardInfo(testCard);
      
      // Should include hidden effect in description
      expect(info.description).toContain(firstHiddenEffect.additionalEffect);
    });

    it('should not apply hidden hirameki when hirameki level is above 0', () => {
      // Hidden hirameki should not be applicable when regular hirameki (Lv1+) is selected
      testCard.selectedHiramekiLevel = 1;
      const firstHiddenEffect = HIDDEN_HIRAMEKI_EFFECTS[0];
      testCard.selectedHiddenHiramekiId = firstHiddenEffect.id;
      const info = getCardInfo(testCard);
      
      // Should return regular hirameki info, ignoring hidden hirameki
      expect(info.cost).toBe(2);
      expect(info.description).toBe('Hirameki Lv1 description');
      expect(info.description).not.toContain(firstHiddenEffect.additionalEffect);
    });

    it('should handle hidden hirameki with cost modifier', () => {
      // This test verifies the structure when hidden hirameki effects are added in the future
      // For now, with empty array, the selectedHiddenHiramekiId should not affect the result
      testCard.selectedHiramekiLevel = 0;
      testCard.selectedHiddenHiramekiId = null;
      const info = getCardInfo(testCard);
      
      expect(info.cost).toBe(1);
      expect(info.description).toBe('Base description');
    });
  });

  describe('calculateFaintMemory with hidden hirameki', () => {
    let baseDeck: Deck;
    let variation: HiramekiVariation;

    beforeEach(() => {
      variation = {
        level: 0,
        cost: 1,
        description: 'Base description',
      };

      baseDeck = {
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
        convertedCards: new Map()
      };
    });

    it('should add 10pt for hidden hirameki on shared card', () => {
      const firstHiddenEffect = HIDDEN_HIRAMEKI_EFFECTS[0];
      baseDeck.cards.push({
        deckId: '1',
        id: 'shared-1',
        name: 'Shared Card',
        type: CardType.SHARED,
        category: CardCategory.ATTACK,
        statuses: [],
        selectedHiramekiLevel: 0,
        selectedHiddenHiramekiId: firstHiddenEffect.id,
        godHiramekiType: null,
        godHiramekiEffectId: null,
        isBasicCard: false,
        hiramekiVariations: [variation]
      });
      expect(calculateFaintMemory(baseDeck)).toBe(30); // 20 (shared) + 10 (hidden hirameki)
    });

    it('should NOT add hirameki points for hidden hirameki on monster card', () => {
      const firstHiddenEffect = HIDDEN_HIRAMEKI_EFFECTS[0];
      baseDeck.cards.push({
        deckId: '1',
        id: 'monster-1',
        name: 'Monster Card',
        type: CardType.MONSTER,
        category: CardCategory.ATTACK,
        statuses: [],
        selectedHiramekiLevel: 0,
        selectedHiddenHiramekiId: firstHiddenEffect.id,
        godHiramekiType: null,
        godHiramekiEffectId: null,
        isBasicCard: false,
        hiramekiVariations: [variation]
      });
      expect(calculateFaintMemory(baseDeck)).toBe(80); // 80 (monster) only, no hidden hirameki points
    });

    it('should not add points for hidden hirameki on character card', () => {
      const firstHiddenEffect = HIDDEN_HIRAMEKI_EFFECTS[0];
      baseDeck.cards.push({
        deckId: '1',
        id: 'char-1',
        name: 'Character Card',
        type: CardType.CHARACTER,
        category: CardCategory.ATTACK,
        statuses: [],
        selectedHiramekiLevel: 0,
        selectedHiddenHiramekiId: firstHiddenEffect.id,
        godHiramekiType: null,
        godHiramekiEffectId: null,
        isBasicCard: false,
        hiramekiVariations: [variation]
      });
      expect(calculateFaintMemory(baseDeck)).toBe(0); // Character cards don't add points
    });

    it('should add 10pt for regular hirameki same as hidden hirameki', () => {
      // Regular hirameki
      baseDeck.cards.push({
        deckId: '1',
        id: 'shared-1',
        name: 'Shared Card 1',
        type: CardType.SHARED,
        category: CardCategory.ATTACK,
        statuses: [],
        selectedHiramekiLevel: 1, // Regular hirameki
        selectedHiddenHiramekiId: null,
        godHiramekiType: null,
        godHiramekiEffectId: null,
        isBasicCard: false,
        hiramekiVariations: [variation, { level: 1, cost: 2, description: 'Lv1' }]
      });

      // Hidden hirameki
      const firstHiddenEffect = HIDDEN_HIRAMEKI_EFFECTS[0];
      baseDeck.cards.push({
        deckId: '2',
        id: 'shared-2',
        name: 'Shared Card 2',
        type: CardType.SHARED,
        category: CardCategory.ATTACK,
        statuses: [],
        selectedHiramekiLevel: 0,
        selectedHiddenHiramekiId: firstHiddenEffect.id,
        godHiramekiType: null,
        godHiramekiEffectId: null,
        isBasicCard: false,
        hiramekiVariations: [variation]
      });

      // Both should add same hirameki points
      expect(calculateFaintMemory(baseDeck)).toBe(60); // 20+10 (regular) + 20+10 (hidden)
    });
  });
});
