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

function getPersonaCard() {
  return {
    ...getTestCard(),
    deckId: 'persona_card_1',
    id: 'persona_01',
    personaEngravings: [] as Array<{ id: string; alignment: 'light' | 'dark' }>,
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
      equipment: {
        weapon: { item: null, refinement: null, godHammerEquipmentId: null },
        armor: { item: null, refinement: null, godHammerEquipmentId: null },
        pendant: { item: null, refinement: null, godHammerEquipmentId: null }
      },
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

  it('setCharacterは既存デッキのcharacterとcardsを更新する', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[1]);
    });

    const deck = useDeckBuilderStore.getState().deck;
    expect(deck?.character?.id).toBe(CHARACTERS[1].id);
    expect(deck?.cards.length).toBeGreaterThan(0);
  });

  it('setCharacterは既存デッキのremove/copy/convert状態をリセットする', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.setState((state) => ({
        deck: state.deck
          ? {
              ...state.deck,
              removedCards: new Map([['shared_01', 1]]),
              copiedCards: new Map([['shared_02', 2]]),
              convertedCards: new Map([['shared_03', 'forbidden_card_1']]),
            }
          : null,
        removeLimitReached: true,
        copyLimitReached: true,
        conversionLimitReached: true,
      }));
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[1]);
    });

    const deck = useDeckBuilderStore.getState().deck!;
    expect(deck.removedCards.size).toBe(0);
    expect(deck.copiedCards.size).toBe(0);
    expect(deck.convertedCards.size).toBe(0);
    expect(useDeckBuilderStore.getState().removeLimitReached).toBe(false);
    expect(useDeckBuilderStore.getState().copyLimitReached).toBe(false);
    expect(useDeckBuilderStore.getState().conversionLimitReached).toBe(false);
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

  it('setDeckでcharacterがidの場合に正規化されcreatedAtがDateになる', () => {
    const deck = {
      name: 'stringdeck',
      character: CHARACTERS[0].id,
      equipment: {
        weapon: { item: null, refinement: null, godHammerEquipmentId: null },
        armor: { item: null, refinement: null, godHammerEquipmentId: null },
        pendant: { item: null, refinement: null, godHammerEquipmentId: null }
      },
      cards: [],
      egoLevel: 0,
      hasPotential: false,
      createdAt: '2024-01-01T00:00:00.000Z',
      removedCards: new Map(),
      copiedCards: new Map(),
      convertedCards: new Map(),
    } as any;

    act(() => {
      useDeckBuilderStore.getState().setDeck(deck);
    });

    const normalized = useDeckBuilderStore.getState().deck;
    expect(normalized?.character?.id).toBe(CHARACTERS[0].id);
    expect(normalized?.createdAt).toBeInstanceOf(Date);
  });

  it('setDeckはdeck.egoLevelをcharacter.egoLevelへ同期する', () => {
    const deck = {
      name: 'ego-sync',
      character: { ...CHARACTERS[0], egoLevel: 0 },
      equipment: {
        weapon: { item: null, refinement: null, godHammerEquipmentId: null },
        armor: { item: null, refinement: null, godHammerEquipmentId: null },
        pendant: { item: null, refinement: null, godHammerEquipmentId: null }
      },
      cards: [],
      egoLevel: 5,
      hasPotential: false,
      createdAt: new Date(),
      removedCards: new Map(),
      copiedCards: new Map(),
      convertedCards: new Map(),
    };

    act(() => {
      useDeckBuilderStore.getState().setDeck(deck);
    });

    expect(useDeckBuilderStore.getState().deck?.character?.egoLevel).toBe(5);
  });

  it('selectEquipmentで装備が更新される', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().selectEquipment(EquipmentType.WEAPON, { id: 'weapon_1', name: '武器', type: EquipmentType.WEAPON, rarity: 'R' });
    });
    expect(useDeckBuilderStore.getState().deck?.equipment.weapon?.item?.id).toBe('weapon_1');
  });

  it('setEquipmentEngravingで装備刻印が更新される', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().selectEquipment(EquipmentType.WEAPON, { id: 'weapon_1', name: '武器', type: EquipmentType.WEAPON, rarity: 'R' });
      useDeckBuilderStore.getState().setEquipmentEngraving(EquipmentType.WEAPON, 'equipment_engraving_lux_01');
    });
    expect(useDeckBuilderStore.getState().deck?.equipment.weapon?.engravingId).toBe('equipment_engraving_lux_01');
  });

  it('selectEquipmentで装備を入れ替えると装備刻印はリセットされる', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().selectEquipment(EquipmentType.WEAPON, { id: 'weapon_1', name: '武器', type: EquipmentType.WEAPON, rarity: 'R' });
      useDeckBuilderStore.getState().setEquipmentEngraving(EquipmentType.WEAPON, 'equipment_engraving_lux_01');
      useDeckBuilderStore.getState().selectEquipment(EquipmentType.WEAPON, { id: 'weapon_2', name: '武器2', type: EquipmentType.WEAPON, rarity: 'R' });
    });
    expect(useDeckBuilderStore.getState().deck?.equipment.weapon?.engravingId).toBeNull();
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

  it('setEgoLevelでegoLevelsと現在デッキのegoLevelが更新される', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().setEgoLevel(CHARACTERS[0].id, 3);
    });
    expect(useDeckBuilderStore.getState().egoLevels[CHARACTERS[0].id]).toBe(3);
    expect(useDeckBuilderStore.getState().deck?.egoLevel).toBe(3);
    expect(useDeckBuilderStore.getState().deck?.character?.egoLevel).toBe(3);
  });

  it('setCharacterは選択したキャラクターのegoLevelをデッキへ反映する', () => {
    act(() => {
      useDeckBuilderStore.getState().setCharacter({ ...CHARACTERS[0], egoLevel: 4 });
    });

    expect(useDeckBuilderStore.getState().deck?.egoLevel).toBe(4);
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

  it('setCardHiddenHiramekiでselectedHiddenHiramekiIdが更新される', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().setCardHiddenHirameki(card.deckId, 'hiddenhirameki_01');
    });
    const updated = useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId);
    expect(updated?.selectedHiddenHiramekiId).toBe('hiddenhirameki_01');
  });

  it('setCardPersonaEngravingsでペルソナカードの刻印が更新される', () => {
    const card = getPersonaCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().setCardPersonaEngravings(card.deckId, [{ id: 'lux_attunement_discount', alignment: 'light' }]);
    });
    const updated = useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId);
    expect(updated?.personaEngravings).toEqual([{ id: 'lux_attunement_discount', alignment: 'light' }]);
  });

  it('setCardPersonaEngravingsで空配列を渡すと刻印が解除される', () => {
    const card = {
      ...getPersonaCard(),
      personaEngravings: [
        { id: 'lux_attunement_discount', alignment: 'light' as const },
        { id: 'umbra_attack_boost', alignment: 'dark' as const },
      ],
    };
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().setCardPersonaEngravings(card.deckId, []);
    });
    const updated = useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId);
    expect(updated?.personaEngravings).toEqual([]);
  });

  it('setCardPersonaEngravingsは最大2つまでに制限される', () => {
    const card = getPersonaCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().setCardPersonaEngravings(card.deckId, [
        { id: 'lux_attunement_discount', alignment: 'light' },
        { id: 'umbra_attack_boost', alignment: 'dark' },
        { id: 'lux_counter_by_count', alignment: 'light' },
      ]);
    });
    const updated = useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId);
    expect(updated?.personaEngravings).toEqual([
      { id: 'lux_attunement_discount', alignment: 'light' },
      { id: 'umbra_attack_boost', alignment: 'dark' },
    ]);
  });

  it('setCardPersonaEngravingsで同じ刻印を2つ設定できる', () => {
    const card = getPersonaCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().setCardPersonaEngravings(card.deckId, [
        { id: 'lux_attunement_discount', alignment: 'light' },
        { id: 'lux_attunement_discount', alignment: 'light' },
      ]);
    });
    const updated = useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId);
    expect(updated?.personaEngravings).toEqual([
      { id: 'lux_attunement_discount', alignment: 'light' },
      { id: 'lux_attunement_discount', alignment: 'light' },
    ]);
  });

  it('setCardPersonaEngravingsは非ペルソナカードには適用されない', () => {
    const card = getTestCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().setCardPersonaEngravings(card.deckId, [{ id: 'lux_attunement_discount', alignment: 'light' }]);
    });
    const updated = useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId);
    expect(updated?.personaEngravings ?? []).toEqual([]);
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

  it('copyCardで隠しヒラメキを持つカードをコピーするとスナップショットに記録される', () => {
    const card = {
      ...getTestCard(),
      selectedHiddenHiramekiId: 'hiddenhirameki_01',
    };

    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);
    });

    const entry = useDeckBuilderStore.getState().deck!.copiedCards.get(card.id);
    if (typeof entry === 'object') {
      expect(entry.selectedHiddenHiramekiId).toBe('hiddenhirameki_01');
    }
  });

  it('copyCardでペルソナ刻印を持つカードをコピーするとコピー先とスナップショットに保持される', () => {
    const card = {
      ...getPersonaCard(),
      personaEngravings: [
        { id: 'lux_attunement_discount', alignment: 'light' as const },
        { id: 'umbra_attack_boost', alignment: 'dark' as const },
      ],
    };
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);
    });

    const deck = useDeckBuilderStore.getState().deck!;
    const copied = deck.cards.find(c => c.isCopied && c.copiedFromCardId === card.id);
    expect(copied?.personaEngravings).toEqual([
      { id: 'lux_attunement_discount', alignment: 'light' },
      { id: 'umbra_attack_boost', alignment: 'dark' },
    ]);

    const entry = deck.copiedCards.get(card.id);
    if (typeof entry === 'object') {
      expect(entry.personaEngravings).toEqual([
        { id: 'lux_attunement_discount', alignment: 'light' },
        { id: 'umbra_attack_boost', alignment: 'dark' },
      ]);
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

  it('convertCardでペルソナ刻印を持つカードを変換するとスナップショットに保持される', () => {
    const card = {
      ...getPersonaCard(),
      personaEngravings: [{ id: 'umbra_attack_boost', alignment: 'dark' as const }],
    };
    const targetId = CHARACTERS[0].startingCards[0];

    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().convertCard(card.deckId, targetId);
    });

    const entry = useDeckBuilderStore.getState().deck!.convertedCards.get(card.id);
    if (typeof entry === 'object') {
      expect(entry.personaEngravings).toEqual([{ id: 'umbra_attack_boost', alignment: 'dark' }]);
    }
  });

  it('undoCardで変換されたカードを元に戻す', () => {
    const card = getTestCard();
    const targetId = CHARACTERS[0].startingCards[0];

    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().convertCard(card.deckId, targetId);
    });

    const deckBefore = useDeckBuilderStore.getState().deck!;
    const convertedCard = deckBefore.cards.find(c => c.id === targetId);
    expect(convertedCard).toBeDefined();

    act(() => {
      useDeckBuilderStore.getState().undoCard(convertedCard!.deckId);
    });

    const deckAfter = useDeckBuilderStore.getState().deck!;
    expect(deckAfter.cards.some(c => c.id === card.id)).toBe(true);
    expect(deckAfter.convertedCards.has(card.id)).toBe(false);
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

  it('restoreCardで同じカードの削除カウントは1つずつ減る', () => {
    const card = {
      ...getPersonaCard(),
      selectedHiddenHiramekiId: 'hiddenhirameki_01',
      personaEngravings: [{ id: 'umbra_attack_boost', alignment: 'dark' }] as Array<{ id: string; alignment: 'light' | 'dark' }>,
    };
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().addCard({
        ...card,
        deckId: 'persona_card_2',
      });
      useDeckBuilderStore.getState().removeCard(card.deckId);
      useDeckBuilderStore.getState().removeCard('persona_card_2');
      useDeckBuilderStore.getState().restoreCard({
        ...card,
        deckId: 'persona_restore_1',
      });
    });

    const entry = useDeckBuilderStore.getState().deck?.removedCards.get(card.id);
    expect(entry).toMatchObject({
      count: 1,
      selectedHiddenHiramekiId: 'hiddenhirameki_01',
      personaEngravings: [{ id: 'umbra_attack_boost', alignment: 'dark' }],
    });
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

  it('undoCardでコピーカードを変換した後に元のコピー状態を復元する', () => {
    const card = getTestCard();

    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);

      const copiedCard = useDeckBuilderStore.getState().deck?.cards.find((candidate) => candidate.isCopied);
      expect(copiedCard).toBeDefined();

      useDeckBuilderStore.getState().convertCard(copiedCard!.deckId, 'forbidden_card_1');

      const convertedCard = useDeckBuilderStore.getState().deck?.cards.find((candidate) => candidate.id === 'forbidden_card_1');
      expect(convertedCard).toBeDefined();

      useDeckBuilderStore.getState().undoCard(convertedCard!.deckId);
    });

    const restoredCopiedCard = useDeckBuilderStore.getState().deck?.cards.find((candidate) => candidate.isCopied);
    expect(restoredCopiedCard?.copiedFromCardId).toBe(card.id);
  });

  it('undoCardで複数回コピーしたカードの隠しヒラメキスナップショットを保持する', () => {
    const card = {
      ...getTestCard(),
      selectedHiddenHiramekiId: 'hiddenhirameki_01',
    };

    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);
      useDeckBuilderStore.getState().copyCard(card.deckId);

      const copiedCard = useDeckBuilderStore.getState().deck?.cards.find((candidate) => candidate.isCopied);
      useDeckBuilderStore.getState().undoCard(copiedCard!.deckId);
    });

    const entry = useDeckBuilderStore.getState().deck!.copiedCards.get(card.id);
    if (typeof entry === 'object') {
      expect(entry.count).toBe(1);
      expect(entry.selectedHiddenHiramekiId).toBe('hiddenhirameki_01');
    }
  });

  it('copyCardでコピー上限を超えるとcopyLimitReachedになる', () => {
    const card = getTestCard();

    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().copyCard(card.deckId);
      useDeckBuilderStore.getState().copyCard(card.deckId);
      useDeckBuilderStore.getState().copyCard(card.deckId);
      useDeckBuilderStore.getState().copyCard(card.deckId);
      useDeckBuilderStore.getState().copyCard(card.deckId);
    });

    expect(useDeckBuilderStore.getState().copyLimitReached).toBe(true);
  });

  it('clearCopyLimitAlertでcopyLimitReachedが解除される', () => {
    useDeckBuilderStore.setState({ copyLimitReached: true });
    act(() => {
      useDeckBuilderStore.getState().clearCopyLimitAlert();
    });
    expect(useDeckBuilderStore.getState().copyLimitReached).toBe(false);
  });

  it('clearRemoveLimitAlertでremoveLimitReachedが解除される', () => {
    useDeckBuilderStore.setState({ removeLimitReached: true });
    act(() => {
      useDeckBuilderStore.getState().clearRemoveLimitAlert();
    });
    expect(useDeckBuilderStore.getState().removeLimitReached).toBe(false);
  });

  it('clearConversionLimitAlertでconversionLimitReachedが解除される', () => {
    useDeckBuilderStore.setState({ conversionLimitReached: true });
    act(() => {
      useDeckBuilderStore.getState().clearConversionLimitAlert();
    });
    expect(useDeckBuilderStore.getState().conversionLimitReached).toBe(false);
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

  describe('normalizePersonaEngravings edge cases', () => {
    it('setDeckでpersonaEngravingsがundefinedのカードを正規化して空配列になる', () => {
      const personaCard = {
        ...getPersonaCard(),
        personaEngravings: undefined as any,
      };
      const deck = {
        name: 'test',
        character: CHARACTERS[0],
        equipment: {
          weapon: null,
          armor: null,
          pendant: null,
        },
        cards: [personaCard],
        egoLevel: 0,
        hasPotential: false,
        createdAt: new Date(),
        removedCards: new Map(),
        copiedCards: new Map(),
        convertedCards: new Map(),
      };
      act(() => {
        useDeckBuilderStore.getState().setDeck(deck as any);
      });
      const card = useDeckBuilderStore.getState().deck?.cards.find(c => c.id === personaCard.id);
      expect(card?.personaEngravings ?? []).toEqual([]);
    });

    it('setCardPersonaEngravingsで無効なアライメントは除外される', () => {
      const card = getPersonaCard();
      act(() => {
        useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
        useDeckBuilderStore.getState().addCard(card);
        useDeckBuilderStore.getState().setCardPersonaEngravings(card.deckId, [
          { id: 'lux_attunement_discount', alignment: 'invalid_alignment' as any },
        ]);
      });
      const updated = useDeckBuilderStore.getState().deck?.cards.find(c => c.deckId === card.deckId);
      expect(updated?.personaEngravings).toEqual([]);
    });

    it('setDeckでremoveCarsにpersonaEngravingsを持つスナップショットが正規化される', () => {
      const personaCard = getPersonaCard();
      const removedEntry = {
        count: 1,
        type: personaCard.type,
        grade: undefined,
        selectedHiramekiLevel: 0,
        selectedHiddenHiramekiId: null,
        personaEngravings: [{ id: 'lux_attunement_discount', alignment: 'light' as const }],
        godHiramekiType: null,
        godHiramekiEffectId: null,
        isBasicCard: false,
        isCopied: false,
        copiedFromCardId: undefined,
      };
      const deck = {
        name: 'test',
        character: CHARACTERS[0],
        equipment: { weapon: null, armor: null, pendant: null },
        cards: [],
        egoLevel: 0,
        hasPotential: false,
        createdAt: new Date(),
        removedCards: new Map([[personaCard.id, removedEntry]]),
        copiedCards: new Map(),
        convertedCards: new Map(),
      };
      act(() => {
        useDeckBuilderStore.getState().setDeck(deck as any);
      });
      const entry = useDeckBuilderStore.getState().deck?.removedCards.get(personaCard.id);
      expect(entry).toBeDefined();
      if (typeof entry === 'object') {
        expect(entry.personaEngravings).toEqual([{ id: 'lux_attunement_discount', alignment: 'light' }]);
      }
    });
  });

  describe('setEquipmentRefinement/GodHammer with empty slot', () => {
    it('setEquipmentRefinementはスロットが空の場合何も変化しない', () => {
      act(() => {
        useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
        // weaponスロットは空のまま
        useDeckBuilderStore.getState().setEquipmentRefinement(EquipmentType.WEAPON, 'refinement_1');
      });
      expect(useDeckBuilderStore.getState().deck?.equipment.weapon).toBeNull();
    });

    it('setEquipmentGodHammerはスロットが空の場合何も変化しない', () => {
      act(() => {
        useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
        useDeckBuilderStore.getState().setEquipmentGodHammer(EquipmentType.WEAPON, 'hammer_1');
      });
      expect(useDeckBuilderStore.getState().deck?.equipment.weapon).toBeNull();
    });

    it('setEquipmentRefinementはスロットがある場合に精錬値が設定される', () => {
      act(() => {
        useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
        useDeckBuilderStore.getState().selectEquipment(EquipmentType.WEAPON, { id: 'weapon_1', name: '武器', type: EquipmentType.WEAPON, rarity: 'R' });
        useDeckBuilderStore.getState().setEquipmentRefinement(EquipmentType.WEAPON, 'refinement_1');
      });
      expect(useDeckBuilderStore.getState().deck?.equipment.weapon?.refinement).toBe('refinement_1');
    });

    it('setEquipmentGodHammerはスロットがある場合に神ハンマー装備IDが設定される', () => {
      act(() => {
        useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
        useDeckBuilderStore.getState().selectEquipment(EquipmentType.WEAPON, { id: 'weapon_1', name: '武器', type: EquipmentType.WEAPON, rarity: 'R' });
        useDeckBuilderStore.getState().setEquipmentGodHammer(EquipmentType.WEAPON, 'god_weapon_1');
      });
      expect(useDeckBuilderStore.getState().deck?.equipment.weapon?.godHammerEquipmentId).toBe('god_weapon_1');
    });
  });

  it('restoreCardで1回だけ削除されたカードを復元するとremovedCardsから削除される', () => {
    const card = getPersonaCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
      useDeckBuilderStore.getState().removeCard(card.deckId);
    });

    const beforeEntry = useDeckBuilderStore.getState().deck?.removedCards.get(card.id);
    expect(beforeEntry).toBeDefined();
    if (typeof beforeEntry === 'object') {
      expect(beforeEntry.count).toBe(1);
    }

    act(() => {
      useDeckBuilderStore.getState().restoreCard({ ...card, deckId: 'persona_restore_new' });
    });

    expect(useDeckBuilderStore.getState().deck?.removedCards.has(card.id)).toBe(false);
  });

  it('restoreCardでnumber型のremovedEntryが2以上の場合デクリメントされる', () => {
    const card = getPersonaCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
    });
    // 旧形式(number)で直接stateを設定
    act(() => {
      useDeckBuilderStore.setState((state) => ({
        deck: {
          ...state.deck!,
          removedCards: new Map([[card.id, 2]]),
        },
      }));
    });
    act(() => {
      useDeckBuilderStore.getState().restoreCard({ ...card, deckId: 'persona_restore_new2' });
    });
    const entry = useDeckBuilderStore.getState().deck?.removedCards.get(card.id);
    expect(entry).toBe(1);
  });

  it('restoreCardでnumber型のremovedEntryが1の場合removedCardsから削除される', () => {
    const card = getPersonaCard();
    act(() => {
      useDeckBuilderStore.getState().setCharacter(CHARACTERS[0]);
      useDeckBuilderStore.getState().addCard(card);
    });
    // 旧形式(number)で直接stateを設定
    act(() => {
      useDeckBuilderStore.setState((state) => ({
        deck: {
          ...state.deck!,
          removedCards: new Map([[card.id, 1]]),
        },
      }));
    });
    act(() => {
      useDeckBuilderStore.getState().restoreCard({ ...card, deckId: 'persona_restore_new3' });
    });
    expect(useDeckBuilderStore.getState().deck?.removedCards.has(card.id)).toBe(false);
  });
});
