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
      useDeckBuilderStore.getState().selectEquipment(EquipmentType.WEAPON, { id: 'weapon_1', name: '武器', type: 'weapon', rarity: 'R' });
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

  it('undoCardでカードがremovedCardsに記録される', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().undoCard(card.deckId);
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
    }
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
});
