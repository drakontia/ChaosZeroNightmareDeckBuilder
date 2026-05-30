import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@/lib/hidden-hirameki', () => ({
  HIDDEN_HIRAMEKI_EFFECTS: [
    { id: 'hidden_hirameki_cost_minus_1', additionalEffect: 'cost -1', costModifier: -1 }
  ]
}));

import { getCardInfo, sortDeckCards } from '@/lib/deck-utils';
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
      name: 'Variant Name',
      description: 'Hirameki level 1',
      egoVariations: {
        3: {
          description: 'Ego level 3 variant',
          cost: 7,
          statuses: [CardStatus.RETAIN]
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
    expect(info.name).toBe('Test Card');
    expect(info.cost).toBe(5);
    expect(info.description).toBe('Base description');
    expect(info.statuses).toContain(CardStatus.INITIATION);
  });

  it('should return hirameki level 1 info', () => {
    baseCard.selectedHiramekiLevel = 1;
    const info = getCardInfo(baseCard);
    expect(info.name).toBe('Variant Name');
    expect(info.cost).toBe(6);
    expect(info.description).toBe('Hirameki level 1');
  });

  it('should apply ego level variation', () => {
    baseCard.selectedHiramekiLevel = 1;
    const info = getCardInfo(baseCard, 3);
    expect(info.cost).toBe(7);
    expect(info.description).toBe('Ego level 3 variant');
  });

  it('should apply ego level statuses', () => {
    baseCard.selectedHiramekiLevel = 1;
    const info = getCardInfo(baseCard, 3);
    expect(info.statuses).toEqual([CardStatus.RETAIN]);
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

  it('should apply hidden hirameki cost modifier when defined', () => {
    const variation: HiramekiVariation = {
      level: 0,
      cost: 5,
      description: 'Base description'
    };
    baseCard.hiramekiVariations = [variation];
    baseCard.selectedHiramekiLevel = 0;
    baseCard.selectedHiddenHiramekiId = 'hidden_hirameki_cost_minus_1';

    const info = getCardInfo(baseCard);
    expect(info.cost).toBe(4);
  });

  it('should derive persona presentation from persona engravings', () => {
    const personaCard: DeckCard = {
      ...baseCard,
      id: 'persona_01',
      name: 'ペルソナ',
      imgUrl: '/images/cards/persona.png',
      selectedHiramekiLevel: 0,
      personaEngravings: [
        { id: 'lux_haste_discount', alignment: 'light' },
        { id: 'umbra_attack_boost', alignment: 'dark' },
      ],
      hiramekiVariations: [{ level: 0, cost: 1, description: 'ダメージ250%', statuses: [CardStatus.UNIQUE] }],
    };

    const info = getCardInfo(personaCard);
    expect(info.name).toBe('境界のペルソナ');
    expect(info.imgUrl).toBe('/images/cards/persona_of_boundary.png');
    expect(info.cost).toBe(2);
    expect(info.statuses).toContain(CardStatus.UNIQUE);
    expect(info.statuses).toContain(CardStatus.HASTE);
    expect(info.description).toContain('1ターンの間、自分の攻撃カードのダメージ量30％増加');
  });

  it('should preserve base persona presentation without persona engravings', () => {
    const personaCard: DeckCard = {
      ...baseCard,
      id: 'persona_02',
      name: 'ペルソナ',
      imgUrl: '/images/cards/persona.png',
      selectedHiramekiLevel: 0,
      personaEngravings: [],
      hiramekiVariations: [{ level: 0, cost: 1, description: '治癒250%', statuses: [CardStatus.UNIQUE] }],
    };

    const info = getCardInfo(personaCard);
    expect(info.name).toBe('ペルソナ');
    expect(info.imgUrl).toBe('/images/cards/persona.png');
    expect(info.cost).toBe(1);
    expect(info.statuses).toEqual([CardStatus.UNIQUE]);
  });

  it('should apply persona localization callbacks', () => {
    const personaCard: DeckCard = {
      ...baseCard,
      id: 'persona_03',
      name: 'Persona',
      imgUrl: '/images/cards/persona.png',
      selectedHiramekiLevel: 0,
      personaEngravings: [{ id: 'lux_attunement_discount', alignment: 'light' }],
      hiramekiVariations: [{ level: 0, cost: 1, description: 'Discard up to 2', statuses: [CardStatus.UNIQUE] }],
    };

    const info = getCardInfo(personaCard, 0, false, undefined, {
      persona: {
        getName: (variant) => (variant === 'light' ? 'Light Persona' : 'Persona'),
        getEngravingDescription: () => 'Attunement: cost -1 until used',
      },
    });

    expect(info.name).toBe('Light Persona');
    expect(info.description).toContain('Discard up to 2');
    expect(info.description).toContain('Attunement: cost -1 until used');
  });

  it('should override base card statuses with empty array in hirameki variation', () => {
    // Card has default status
    baseCard.statuses = [CardStatus.UNIQUE];
    
    // Hirameki level 1 explicitly sets empty statuses
    const variation1: HiramekiVariation = {
      level: 1,
      cost: 6,
      description: 'Hirameki level 1',
      statuses: [] // Explicitly override to no statuses
    };
    baseCard.hiramekiVariations[1] = variation1;
    baseCard.selectedHiramekiLevel = 1;
    
    const info = getCardInfo(baseCard);
    expect(info.statuses).toEqual([]); // Should be empty, not fallback to UNIQUE
  });

  it('should override base card statuses with empty array in ego variation', () => {
    // Card has default status
    baseCard.statuses = [CardStatus.UNIQUE];
    
    // Hirameki level 1 with ego variation that has empty statuses
    const variation1: HiramekiVariation = {
      level: 1,
      cost: 6,
      description: 'Hirameki level 1',
      statuses: [CardStatus.RETAIN],
      egoVariations: {
        3: {
          description: 'Ego level 3 variant',
          statuses: [] // Explicitly override to no statuses at ego level 3
        }
      }
    };
    baseCard.hiramekiVariations[1] = variation1;
    baseCard.selectedHiramekiLevel = 1;
    
    const info = getCardInfo(baseCard, 3);
    expect(info.statuses).toEqual([]); // Should be empty, not fallback to RETAIN or UNIQUE
  });

  it('should fallback to base card statuses when hirameki variation has no statuses property', () => {
    // Card has default status
    baseCard.statuses = [CardStatus.UNIQUE];
    
    // Hirameki level 1 without statuses property (undefined)
    const variation1: HiramekiVariation = {
      level: 1,
      cost: 6,
      description: 'Hirameki level 1'
      // No statuses property
    };
    baseCard.hiramekiVariations[1] = variation1;
    baseCard.selectedHiramekiLevel = 1;
     
    const info = getCardInfo(baseCard);
    expect(info.statuses).toEqual([CardStatus.UNIQUE]); // Should fallback to base card
  });

  it('should return undefined statuses when no statuses are defined anywhere', () => {
    // Card has no statuses
    baseCard.statuses = undefined;
     
    // Hirameki level 1 without statuses property
    const variation1: HiramekiVariation = {
      level: 1,
      cost: 6,
      description: 'Hirameki level 1'
      // No statuses property
    };
    baseCard.hiramekiVariations[1] = variation1;
    baseCard.selectedHiramekiLevel = 1;
     
    const info = getCardInfo(baseCard);
    expect(info.statuses).toBeUndefined(); // Should be undefined
  });

  it('should preserve empty array in hirameki variation even with ego variation without statuses', () => {
    // Hirameki level 1 explicitly sets empty statuses
    const variation1: HiramekiVariation = {
      level: 1,
      cost: 6,
      description: 'Hirameki level 1',
      statuses: [], // Explicitly empty
      egoVariations: {
        2: {
          description: 'Ego level 2 variant'
          // No statuses - should NOT override the empty array from parent
        }
      }
    };
    baseCard.hiramekiVariations[1] = variation1;
    baseCard.selectedHiramekiLevel = 1;
     
    // Without ego level - should use empty array from hirameki
    let info = getCardInfo(baseCard, 0);
    expect(info.statuses).toEqual([]);
     
    // With ego level that has no statuses - should keep empty array from parent
    info = getCardInfo(baseCard, 2);
    expect(info.statuses).toEqual([]); // Should still be empty, not replaced
  });
});

describe('sortDeckCards', () => {
  it('should place starting character cards before hirameki character cards', () => {
    const starting: DeckCard = {
      deckId: 'start-1',
      id: 'char-start',
      name: 'Start',
      type: CardType.CHARACTER,
      category: CardCategory.ATTACK,
      statuses: [],
      selectedHiramekiLevel: 0,
      godHiramekiType: null,
      godHiramekiEffectId: null,
      selectedHiddenHiramekiId: null,
      isBasicCard: false,
      isStartingCard: true,
      hiramekiVariations: [{ level: 0, cost: 1, description: 'Base' }]
    };
    const hirameki: DeckCard = {
      ...starting,
      deckId: 'hira-1',
      id: 'char-hira',
      isStartingCard: false,
    };

    const result = sortDeckCards([hirameki, starting]);
    expect(result[0].id).toBe('char-start');
  });
});
