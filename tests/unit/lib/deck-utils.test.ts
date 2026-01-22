import { describe, it, expect, beforeEach } from 'vitest';
import { getCardInfo } from '../../../lib/deck-utils';
import { CardType, CardCategory, CardStatus, GodType, DeckCard, HiramekiVariation } from '@/types';

describe('getCardInfo', () => {
  let baseCard: DeckCard;

  beforeEach(() => {
    const variation: HiramekiVariation = {
      level: 0,
      cost: 5,
      description: 'Base description',
      statuses: [CardStatus.INITIATION]
    };

    const variation1: HiramekiVariation = {
      level: 1,
      cost: 6,
      description: 'Hirameki level 1',
      egoVariations: {
        3: {
          description: 'Ego level 3 variant',
          cost: 7
        }
      },
      potentialVariation: {
        description: 'Potential variant',
        cost: 8
      }
    };

    baseCard = {
      deckId: 'test-1',
      id: 'card-1',
      name: 'Test Card',
      type: CardType.SHARED,
      category: CardCategory.ATTACK,
      statuses: [],
      selectedHiramekiLevel: 0,
      godHiramekiType: null,
      godHiramekiEffectId: null,
      selectedHiddenHiramekiId: null,
      isBasicCard: false,
      hiramekiVariations: [variation, variation1]
    };
  });

  it('should return base card info', () => {
    const info = getCardInfo(baseCard);
    expect(info.cost).toBe(5);
    expect(info.description).toBe('Base description');
    expect(info.statuses).toContain(CardStatus.INITIATION);
  });

  it('should return hirameki level 1 info', () => {
    baseCard.selectedHiramekiLevel = 1;
    const info = getCardInfo(baseCard);
    expect(info.cost).toBe(6);
    expect(info.description).toBe('Hirameki level 1');
  });

  it('should apply ego level variation', () => {
    baseCard.selectedHiramekiLevel = 1;
    const info = getCardInfo(baseCard, 3);
    expect(info.cost).toBe(7);
    expect(info.description).toBe('Ego level 3 variant');
  });

  it('should apply potential variation', () => {
    baseCard.selectedHiramekiLevel = 1;
    const info = getCardInfo(baseCard, 0, true);
    expect(info.cost).toBe(8);
    expect(info.description).toBe('Potential variant');
  });

  it('should apply god hirameki modifier', () => {
    baseCard.selectedHiramekiLevel = 1;
    baseCard.godHiramekiType = GodType.KILKEN;
    baseCard.godHiramekiEffectId = 'godhirameki_3'; // Cost -1 effect
    const info = getCardInfo(baseCard);
    expect(info.cost).toBe(5); // 6 + (-1) cost modifier
    expect(info.description).toContain('Hirameki level 1');
    expect(info.description).toContain('このカードのコスト1減少');
  });

  it('should handle missing hirameki variations gracefully', () => {
    baseCard.selectedHiramekiLevel = 99; // Out of range
    const info = getCardInfo(baseCard);
    expect(info.cost).toBe(5);
    expect(info.description).toBe('Base description');
  });

  it('should not apply god hirameki to basic cards', () => {
    baseCard.isBasicCard = true;
    baseCard.selectedHiramekiLevel = 1;
    baseCard.godHiramekiType = GodType.KILKEN;
    baseCard.godHiramekiEffectId = 'godhirameki_3';
    const info = getCardInfo(baseCard);
    // Should not apply god hirameki effect
    expect(info.description).not.toContain('このカードのコスト1減少');
  });

  it('should not allow negative cost from god hirameki modifier', () => {
    // Create a card with cost 0
    const variation: HiramekiVariation = {
      level: 0,
      cost: 0,
      description: 'Zero cost card'
    };
    baseCard.hiramekiVariations = [variation];
    baseCard.selectedHiramekiLevel = 0;
    baseCard.godHiramekiType = GodType.KILKEN;
    baseCard.godHiramekiEffectId = 'godhirameki_3'; // Cost -1 effect
    
    const info = getCardInfo(baseCard);
    expect(info.cost).toBe(0); // Should be 0, not -1
  });

  it('should not allow negative cost from hidden hirameki modifier', () => {
    // Create a card with cost 0
    const variation: HiramekiVariation = {
      level: 0,
      cost: 0,
      description: 'Zero cost card'
    };
    baseCard.hiramekiVariations = [variation];
    baseCard.selectedHiramekiLevel = 0;
    baseCard.selectedHiddenHiramekiId = 'hidden_hirameki_cost_minus_1'; // Assuming a cost -1 hidden hirameki
    
    const info = getCardInfo(baseCard);
    expect(info.cost).toBe(0); // Should be 0, not -1
  });

  it('should not allow negative cost from multiple modifiers', () => {
    // Create a card with cost 1
    const variation: HiramekiVariation = {
      level: 0,
      cost: 1,
      description: 'Low cost card'
    };
    baseCard.hiramekiVariations = [variation];
    baseCard.selectedHiramekiLevel = 0;
    // Apply both god hirameki (-1) and hidden hirameki (-1)
    baseCard.godHiramekiType = GodType.KILKEN;
    baseCard.godHiramekiEffectId = 'godhirameki_3'; // Cost -1
    baseCard.selectedHiddenHiramekiId = 'hidden_hirameki_cost_minus_1'; // Cost -1
    
    const info = getCardInfo(baseCard);
    expect(info.cost).toBe(0); // Should be 0, not -1 (1 + (-1) + (-1))
  });
});
