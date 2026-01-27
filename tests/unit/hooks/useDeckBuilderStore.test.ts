import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useDeckBuilderStore } from '@/hooks/useDeckBuilderStore';
import { CHARACTERS } from '@/lib/characters';
import { CardType, CardCategory, GodType, EquipmentType } from '@/types';

function getTestCard() {
  return {
    deckId: 'test_card_1',
    id: 'shared_01',
    name: 'テストカード',
    type: CardType.SHARED,
    category: CardCategory.ATTACK,
    statuses: [],
    selectedHiramekiLevel: 0,
    godHiramekiType: null,
    godHiramekiEffectId: null,
    selectedHiddenHiramekiId: null,
    isBasicCard: false,
    hiramekiVariations: [{ level: 0, cost: 1, description: 'test' }],
  };
}

describe('useDeckBuilderStore', () => {
  beforeEach(() => {
    // ストアを初期化
    act(() => {
      useDeckBuilderStore.getState().reset();
    });
  });

  it('setDeckでデッキ全体が更新される', () => {
    const deck = {
      name: 'testdeck',
      character: CHARACTERS[0],
      equipment: { weapon: null, armor: null, pendant: null },
      cards: [],
      egoLevel: 1,
      hasPotential: true,
      createdAt: new Date(),
      removedCards: new Map(),
      copiedCards: new Map(),
      convertedCards: new Map(),
    };
    act(() => {
      useDeckBuilderStore.getState().setDeck(deck);
    });
    expect(useDeckBuilderStore.getState().deck?.name).toBe('testdeck');
    expect(useDeckBuilderStore.getState().deck?.character?.id).toBe(CHARACTERS[0].id);
    expect(useDeckBuilderStore.getState().deck?.egoLevel).toBe(1);
    expect(useDeckBuilderStore.getState().deck?.hasPotential).toBe(true);
  });

  it('setCharacterでキャラクターと開始カードが更新される', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[1]);
    });
    const deck = useDeckBuilderStore.getState().deck;
    expect(deck?.character?.id).toBe(CHARACTERS[1].id);
    expect(deck?.cards.length).toBeGreaterThan(0);
  });

  it('addCard/removeCardでcardsが変化する', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
    });
    const initialLength = useDeckBuilderStore.getState().deck?.cards.length || 0;
    expect(initialLength).toBeGreaterThan(0);
    act(() => {
      useDeckBuilderStore.getState().removeCard(card.deckId);
    });
    const afterLength = useDeckBuilderStore.getState().deck?.cards.length || 0;
    expect(afterLength).toBe(initialLength - 1);
  });

  it('selectEquipmentで装備が更新される', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().selectEquipment(EquipmentType.WEAPON, { id: 'weapon_1', name: '武器', type: EquipmentType.WEAPON, rarity: 'R' });
    });
    expect(useDeckBuilderStore.getState().deck?.equipment.weapon?.id).toBe('weapon_1');
  });

  it('resetで初期状態に戻る', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(getTestCard());
      useDeckBuilderStore.getState().reset();
    });
    const deck = useDeckBuilderStore.getState().deck;
    expect(deck).toBeNull();
  });

  it('setEgoLevelでegoLevelsが更新される', () => {
    act(() => {
      useDeckBuilderStore.getState().setEgoLevel('char-1', 3);
    });
    expect(useDeckBuilderStore.getState().egoLevels['char-1']).toBe(3);
  });

  it('setPotentialでhasPotentialが切り替わる', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().setPotential(true);
    });
    expect(useDeckBuilderStore.getState().deck?.hasPotential).toBe(true);
  });

  it('updateCardHiramekiでselectedHiramekiLevelが更新される', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().updateCardHirameki(card.deckId, 2);
    });
    const updated = useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId);
    expect(updated?.selectedHiramekiLevel).toBe(2);
  });

  it('setCardGodHiramekiでgodHiramekiTypeが更新される', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().setCardGodHirameki(card.deckId, GodType.KILKEN);
    });
    const updated = useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId);
    expect(updated?.godHiramekiType).toBe('kilken');
  });

  it('setCardGodHiramekiEffectでgodHiramekiEffectIdが更新される', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().setCardGodHiramekiEffect(card.deckId, 'effect-1');
    });
    const updated = useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId);
    expect(updated?.godHiramekiEffectId).toBe('effect-1');
  });

  it('undoCardでカードが削除される', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().undoCard(card.deckId);
    });
    expect(useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId)).toBeUndefined();
  });

  it('copyCardでカードがコピーされisCopied等が付与される', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);
    });
    const cards = useDeckBuilderStore.getState().deck?.cards.filter(c => c.id === card.id);
    expect(cards?.length).toBe(2);
    const copied = cards?.find(c => c.isCopied);
    expect(copied?.copiedFromCardId).toBe(card.id);
  });

  it('copyCardでカードがcopiedCardsに記録される', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);
    });
    const deck = useDeckBuilderStore.getState().deck!;
    // copiedCardsに記録されている
    expect(deck.copiedCards.has(card.id)).toBe(true);
    const entry = deck.copiedCards.get(card.id);
    expect(entry).toBeDefined();
    // スナップショットの場合、countが1であることを確認
    if (typeof entry === 'object') {
      expect(entry.count).toBe(1);
      expect(entry.type).toBe(card.type);
      expect(entry.selectedHiramekiLevel).toBe(card.selectedHiramekiLevel);
    }
  });

  it('copyCardで同じカードを複数回コピーするとcountが増える', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);
      useDeckBuilderStore.getState().copyCard(card.deckId);
      useDeckBuilderStore.getState().copyCard(card.deckId);
    });
    const deck = useDeckBuilderStore.getState().deck!;
    // copiedCardsに記録されている
    expect(deck.copiedCards.has(card.id)).toBe(true);
    const entry = deck.copiedCards.get(card.id);
    // スナップショットの場合、countが3であることを確認
    if (typeof entry === 'object') {
      expect(entry.count).toBe(3);
    }
  });

  it('copyCardでヒラメキと神ヒラメキを持つカードをコピーするとスナップショットに記録される', () => {
    const card = {
      ...getTestCard(),
      selectedHiramekiLevel: 2,
      godHiramekiType: GodType.KILKEN,
      godHiramekiEffectId: 'godhirameki_1',
    };
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);
    });
    const deck = useDeckBuilderStore.getState().deck!;
    const entry = deck.copiedCards.get(card.id);
    // スナップショットにヒラメキと神ヒラメキ情報が記録されている
    if (typeof entry === 'object') {
      expect(entry.selectedHiramekiLevel).toBe(2);
      expect(entry.godHiramekiType).toBe(GodType.KILKEN);
      expect(entry.godHiramekiEffectId).toBe('godhirameki_1');
    }
  });

  it('convertCardでカードが変換されconvertedCardsに記録される', () => {
    const card = getTestCard();
    // 変換先カードをCHARACTERS[0]のstartingCards[0]で仮定
    const targetId = CHARACTERS[0].startingCards[0];
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().convertCard(card.deckId, targetId);
    });
    const deck = useDeckBuilderStore.getState().deck!;
    // cardsにtargetIdのカードが存在
    expect(deck.cards.some(c => c.id === targetId)).toBe(true);
    // convertedCardsに記録
    expect(deck.convertedCards.has(card.id)).toBe(true);
  });

  it('convertCardで排除として変換すると変換先カードはデッキに入らない', () => {
    const card = getTestCard();
    const targetId = CHARACTERS[0].hiramekiCards[0];
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().convertCard(card.deckId, targetId, { asExclusion: true });
    });

    const deck = useDeckBuilderStore.getState().deck!;
    expect(deck.cards.some(c => c.id === targetId)).toBe(false);
    expect(deck.cards.some(c => c.id === card.id)).toBe(false);

    const entry = deck.convertedCards.get(card.id);
    expect(entry).toBeDefined();
    if (typeof entry === 'object') {
      expect((entry as any).excluded).toBe(true);
    }
  });

  it('restoreCardで変換カードが復元される', () => {
    const card = getTestCard();
    const targetId = CHARACTERS[0].startingCards[0];
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().convertCard(card.deckId, targetId);
      // 変換先カードを除外し、元カードを復元
      useDeckBuilderStore.getState().restoreCard(card);
    });
    const deck = useDeckBuilderStore.getState().deck!;
    // 元カードが復元されている
    expect(deck.cards.some(c => c.id === card.id)).toBe(true);
    // 変換先カードが除外されている
    expect(deck.cards.some(c => c.id === targetId)).toBe(false);
    // convertedCardsからも削除
    expect(deck.convertedCards.has(card.id)).toBe(false);
  });

  it('removeCardでカードがremovedCardsに記録される', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().removeCard(card.deckId);
    });
    const deck = useDeckBuilderStore.getState().deck!;
    // カードがデッキから削除されている
    expect(deck.cards.find(c => c.deckId === card.deckId)).toBeUndefined();
    // removedCardsに記録されている
    expect(deck.removedCards.has(card.id)).toBe(true);
    const entry = deck.removedCards.get(card.id);
    expect(entry).toBeDefined();
    // スナップショットの場合、countが1であることを確認
    if (typeof entry === 'object') {
      expect(entry.count).toBe(1);
      expect(entry.type).toBe(card.type);
      expect(entry.selectedHiramekiLevel).toBe(card.selectedHiramekiLevel);
    }
  });

  it('removeCardで同じカードを複数回削除するとcountが増える', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().addCard({
        ...card,
        deckId: 'test_card_2',
      });
      useDeckBuilderStore.getState().removeCard(card.deckId);
      useDeckBuilderStore.getState().removeCard('test_card_2');
    });
    const deck = useDeckBuilderStore.getState().deck!;
    // removedCardsに記録されている
    expect(deck.removedCards.has(card.id)).toBe(true);
    const entry = deck.removedCards.get(card.id);
    // スナップショットの場合、countが2であることを確認
    if (typeof entry === 'object') {
      expect(entry.count).toBe(2);
    }
  });

  it('undoCardで追加されたカードがデッキから削除される', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().undoCard(card.deckId);
    });
    const deck = useDeckBuilderStore.getState().deck!;
    // カードがデッキから削除されている
    expect(deck.cards.find(c => c.deckId === card.deckId)).toBeUndefined();
    // removedCardsには記録されない（追加したカードを単に削除しただけ）
    expect(deck.removedCards.has(card.id)).toBe(false);
  });

  it('removeCardでヒラメキと神ヒラメキを持つカードを削除するとスナップショットに記録される', () => {
    const card = {
      ...getTestCard(),
      selectedHiramekiLevel: 2,
      godHiramekiType: GodType.KILKEN,
      godHiramekiEffectId: 'godhirameki_1',
    };
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().removeCard(card.deckId);
    });
    const deck = useDeckBuilderStore.getState().deck!;
    const entry = deck.removedCards.get(card.id);
    // スナップショットにヒラメキと神ヒラメキ情報が記録されている
    if (typeof entry === 'object') {
      expect(entry.selectedHiramekiLevel).toBe(2);
      expect(entry.godHiramekiType).toBe(GodType.KILKEN);
      expect(entry.godHiramekiEffectId).toBe('godhirameki_1');
    }
  });

  it('undoCardで変換されたカードが元のカードに戻る', () => {
    const card = {
      ...getTestCard(),
      selectedHiramekiLevel: 2,
      godHiramekiType: GodType.KILKEN,
      godHiramekiEffectId: 'godhirameki_1',
    };
    const targetId = CHARACTERS[0].startingCards[0];

    let convertedCardDeckId: string;
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);

      // 変換前のカード数と変換先カードの数を記録
      const beforeConvert = useDeckBuilderStore.getState().deck!;
      const targetCountBefore = beforeConvert.cards.filter(c => c.id === targetId).length;

      const deckId = card.deckId;
      useDeckBuilderStore.getState().convertCard(deckId, targetId);

      // 変換後のカードを取得（変換で追加されたカードを特定）
      const afterConvert = useDeckBuilderStore.getState().deck!;
      const allTargetCards = afterConvert.cards.filter(c => c.id === targetId);
      // 最後に追加されたカード（変換されたカード）を取得
      const convertedCard = allTargetCards[allTargetCards.length - 1];
      expect(convertedCard).toBeDefined();
      convertedCardDeckId = convertedCard.deckId;

      // 変換によって変換先カードの数が増えている（または置換されている）
      const targetCountAfter = afterConvert.cards.filter(c => c.id === targetId).length;
      expect(targetCountAfter).toBeGreaterThanOrEqual(targetCountBefore);

      // 変換されたカードに対してundoを実行
      useDeckBuilderStore.getState().undoCard(convertedCardDeckId);
    });

    const deck = useDeckBuilderStore.getState().deck!;
    // 元のカードIDが復元されている
    expect(deck.cards.some(c => c.id === card.id)).toBe(true);
    // 変換で追加されたカードは削除されている
    expect(deck.cards.some(c => c.deckId === convertedCardDeckId)).toBe(false);
    // convertedCardsから削除されている
    expect(deck.convertedCards.has(card.id)).toBe(false);

    // 復元されたカードのヒラメキと神ヒラメキが復元されている
    const restoredCard = deck.cards.find(c => c.id === card.id);
    expect(restoredCard?.selectedHiramekiLevel).toBe(2);
    expect(restoredCard?.godHiramekiType).toBe(GodType.KILKEN);
    expect(restoredCard?.godHiramekiEffectId).toBe('godhirameki_1');
  });

  it('undoCardでコピーされたカードが削除されcopiedCardsのカウントが減る', () => {
    const card = getTestCard();

    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);

      // コピーされたカードを取得
      const copiedCard = useDeckBuilderStore.getState().deck?.cards.find(c => c.isCopied);
      expect(copiedCard).toBeDefined();

      // コピーされたカードに対してundoを実行
      useDeckBuilderStore.getState().undoCard(copiedCard!.deckId);
    });

    const deck = useDeckBuilderStore.getState().deck!;
    // コピーされたカードが削除されている
    expect(deck.cards.filter(c => c.id === card.id).length).toBe(1);
    // copiedCardsのカウントが0（削除された）
    expect(deck.copiedCards.has(card.id)).toBe(false);
  });

  it('undoCardで複数回コピーしたカードの1つを削除するとカウントが減る', () => {
    const card = getTestCard();

    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);
      useDeckBuilderStore.getState().copyCard(card.deckId);
      useDeckBuilderStore.getState().copyCard(card.deckId);

      // コピーされたカードの1つを取得
      const copiedCard = useDeckBuilderStore.getState().deck?.cards.find(c => c.isCopied);
      expect(copiedCard).toBeDefined();

      // コピーされたカードに対してundoを実行
      useDeckBuilderStore.getState().undoCard(copiedCard!.deckId);
    });

    const deck = useDeckBuilderStore.getState().deck!;
    // コピーされたカードが1つ削除されている（元1+コピー3から元1+コピー2へ）
    expect(deck.cards.filter(c => c.id === card.id).length).toBe(3);
    // copiedCardsのカウントが2
    const entry = deck.copiedCards.get(card.id);
    if (typeof entry === 'object') {
      expect(entry.count).toBe(2);
    }
  });

  describe('integrated removal+conversion limit (max 5)', () => {
    it('should prevent conversion when removal+conversion count reaches 5', () => {
      const character = CHARACTERS[0];
      const card1 = getTestCard();
      const card2 = { ...getTestCard(), id: 'shared_02', deckId: 'test_card_2' };
      const card3 = { ...getTestCard(), id: 'shared_03', deckId: 'test_card_3' };
      const card4 = { ...getTestCard(), id: 'shared_04', deckId: 'test_card_4' };
      const card5 = { ...getTestCard(), id: 'shared_05', deckId: 'test_card_5' };
      const card6 = { ...getTestCard(), id: 'shared_06', deckId: 'test_card_6' };

      act(() => {
        useDeckBuilderStore.getState().setCharacter(character);
        useDeckBuilderStore.getState().addCard(card1);
        useDeckBuilderStore.getState().addCard(card2);
        useDeckBuilderStore.getState().addCard(card3);
        useDeckBuilderStore.getState().addCard(card4);
        useDeckBuilderStore.getState().addCard(card5);
        useDeckBuilderStore.getState().addCard(card6);
      });

      // Remove 3 cards: totalRemoved = 3
      act(() => {
        useDeckBuilderStore.getState().removeCard(card1.deckId);
      });
      expect(useDeckBuilderStore.getState().deck!.removedCards.size).toBe(1);

      act(() => {
        useDeckBuilderStore.getState().removeCard(card2.deckId);
      });
      expect(useDeckBuilderStore.getState().deck!.removedCards.size).toBe(2);

      act(() => {
        useDeckBuilderStore.getState().removeCard(card3.deckId);
      });
      expect(useDeckBuilderStore.getState().deck!.removedCards.size).toBe(3);

      // Convert 2 cards: totalConversion = 2, total = 3 + 2 = 5
      act(() => {
        useDeckBuilderStore.getState().convertCard(card4.deckId, 'forbidden_card_1');
      });
      expect(useDeckBuilderStore.getState().conversionLimitReached).toBe(false);
      expect(useDeckBuilderStore.getState().deck!.convertedCards.size).toBe(1);

      act(() => {
        useDeckBuilderStore.getState().convertCard(card5.deckId, 'forbidden_card_2');
      });
      expect(useDeckBuilderStore.getState().conversionLimitReached).toBe(false);
      expect(useDeckBuilderStore.getState().deck!.convertedCards.size).toBe(2);

      // Try to convert one more: should be blocked (total = 6)
      act(() => {
        useDeckBuilderStore.getState().convertCard(card6.deckId, 'forbidden_card_3');
      });
      expect(useDeckBuilderStore.getState().conversionLimitReached).toBe(true);
      expect(useDeckBuilderStore.getState().deck!.convertedCards.size).toBe(2); // Should still be 2
    });

    it('should prevent removal when removal+conversion count reaches 5', () => {
      const character = CHARACTERS[0];
      const card1 = getTestCard();
      const card2 = { ...getTestCard(), id: 'shared_02', deckId: 'test_card_2' };
      const card3 = { ...getTestCard(), id: 'shared_03', deckId: 'test_card_3' };
      const card4 = { ...getTestCard(), id: 'shared_04', deckId: 'test_card_4' };
      const card5 = { ...getTestCard(), id: 'shared_05', deckId: 'test_card_5' };
      const card6 = { ...getTestCard(), id: 'shared_06', deckId: 'test_card_6' };

      act(() => {
        useDeckBuilderStore.getState().setCharacter(character);
        useDeckBuilderStore.getState().addCard(card1);
        useDeckBuilderStore.getState().addCard(card2);
        useDeckBuilderStore.getState().addCard(card3);
        useDeckBuilderStore.getState().addCard(card4);
        useDeckBuilderStore.getState().addCard(card5);
        useDeckBuilderStore.getState().addCard(card6);
      });

      // Convert 2 cards: totalConversion = 2
      act(() => {
        useDeckBuilderStore.getState().convertCard(card1.deckId, 'forbidden_card_1');
      });
      expect(useDeckBuilderStore.getState().deck!.convertedCards.size).toBe(1);

      act(() => {
        useDeckBuilderStore.getState().convertCard(card2.deckId, 'forbidden_card_2');
      });
      expect(useDeckBuilderStore.getState().deck!.convertedCards.size).toBe(2);

      // Remove 3 cards: totalRemoved = 3, total = 2 + 3 = 5
      act(() => {
        useDeckBuilderStore.getState().removeCard(card3.deckId);
        useDeckBuilderStore.getState().removeCard(card4.deckId);
        useDeckBuilderStore.getState().removeCard(card5.deckId);
      });
      expect(useDeckBuilderStore.getState().removeLimitReached).toBe(false);
      expect(useDeckBuilderStore.getState().deck!.removedCards.size).toBe(3);

      // Try to remove one more: should be blocked
      act(() => {
        useDeckBuilderStore.getState().removeCard(card6.deckId);
      });
      expect(useDeckBuilderStore.getState().removeLimitReached).toBe(true);

      // Verify card was NOT removed
      const deck = useDeckBuilderStore.getState().deck!;
      expect(deck.removedCards.size).toBe(3); // Still 3, not 4
      expect(deck.cards.find(c => c.deckId === card6.deckId)).toBeDefined(); // Original still in deck
    });

    it('should allow different combinations of removal/conversion up to 5 total', () => {
      const character = CHARACTERS[0];
      const cards = Array.from({ length: 7 }, (_, i) => ({
        ...getTestCard(),
        id: `shared_${String(i + 1).padStart(2, '0')}`,
        deckId: `test_card_${i}`,
      }));

      act(() => {
        useDeckBuilderStore.getState().setCharacter(character);
        cards.forEach(card => useDeckBuilderStore.getState().addCard(card));
      });

      // Remove 1, Convert 1, Remove 1, Convert 1, Remove 1 = total 5
      act(() => {
        useDeckBuilderStore.getState().removeCard(cards[0].deckId);
        useDeckBuilderStore.getState().convertCard(cards[1].deckId, 'forbidden_card_1');
        useDeckBuilderStore.getState().removeCard(cards[2].deckId);
        useDeckBuilderStore.getState().convertCard(cards[3].deckId, 'forbidden_card_2');
        useDeckBuilderStore.getState().removeCard(cards[4].deckId);
      });

      const deck = useDeckBuilderStore.getState().deck!;
      expect(deck.removedCards.size).toBe(3);
      expect(deck.convertedCards.size).toBe(2);
      expect(useDeckBuilderStore.getState().removeLimitReached).toBe(false);
      expect(useDeckBuilderStore.getState().conversionLimitReached).toBe(false);

      // Try one more removal: should fail
      act(() => {
        useDeckBuilderStore.getState().removeCard(cards[5].deckId);
      });
      expect(useDeckBuilderStore.getState().removeLimitReached).toBe(true);
      expect(deck.removedCards.size).toBe(3); // Still 3
    });
  });
});
