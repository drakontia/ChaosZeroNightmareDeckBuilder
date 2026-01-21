import { describe, it, expect } from 'vitest';
import { calculateFaintMemory } from '@/lib/deck-utils';
import { CardType, Deck } from '@/types';

describe('calculateFaintMemory (排除変換)', () => {
  it('変換先が排除の場合、変換先カードはポイントに影響しない', () => {
    const deck: Deck = {
      name: 'test',
      character: null,
      equipment: { weapon: null, armor: null, pendant: null },
      cards: [],
      egoLevel: 0,
      hasPotential: false,
      createdAt: new Date(),
      removedCards: new Map(),
      copiedCards: new Map(),
      convertedCards: new Map([
        [
          'shared_01',
          {
            convertedToId: 'shared_99',
            originalType: CardType.SHARED,
            selectedHiramekiLevel: 1,
            excluded: true,
          },
        ],
      ]),
    };

    // 変換ポイント: 0pt（排除のため）、元カード種別: 20pt（SHARED）、元カードヒラメキ: 10pt（Lv1）
    // 合計: 0 + 20 + 10 = 30pt
    expect(calculateFaintMemory(deck)).toBe(30);
  });
});
