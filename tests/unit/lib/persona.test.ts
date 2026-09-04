import { describe, expect, it } from 'vite-plus/test';

import { getPersonaCardPresentation, getPersonaNameVariant, normalizePersonaCardEngravings } from '@/lib/persona';
import { CardStatus, CardCategory } from '@/types';

describe('getPersonaCardPresentation', () => {
  it('applies a single light engraving to persona cards', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ダメージ250%',
      baseStatuses: [CardStatus.UNIQUE],
      engravings: [{ id: 'lux_haste_discount', alignment: 'light' }],
    });

    expect(result.name).toBe('光のペルソナ');
    expect(result.imgUrl).toBe('/images/cards/season3/lux_persona.png');
    expect(result.cost).toBe(2);
    expect(result.statuses).toEqual([CardStatus.UNIQUE, CardStatus.HASTE]);
    expect(result.description).toContain('ダメージ250%');
    expect(result.description).toContain('迅速付与、コスト1増加。行動カウントが1の対象がいる場合、このカードのコスト2減少');
  });

  it('applies mixed light/dark engravings and derives the boundary persona appearance', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ドロー1',
      baseStatuses: [CardStatus.UNIQUE],
      engravings: [
        { id: 'lux_attunement_discount', alignment: 'light' },
        { id: 'umbra_attack_boost', alignment: 'dark' },
      ],
    });

    expect(result.name).toBe('境界のペルソナ');
    expect(result.imgUrl).toBe('/images/cards/season3/persona_of_boundary.png');
    expect(result.cost).toBe(1);
    expect(result.statuses).toEqual([CardStatus.UNIQUE]);
    expect(result.description).toContain('感応：使用時までコスト1減少');
    expect(result.description).toContain('1ターンの間、自分の攻撃カードのダメージ量30％増加');
  });

  it('keeps the base presentation when no engravings are selected', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: '治癒250%',
      baseStatuses: [CardStatus.UNIQUE],
      engravings: [],
    });

    expect(result).toEqual({
      name: 'ペルソナ',
      imgUrl: '/images/cards/season3/persona.png',
      cost: 1,
      description: '治癒250%',
      statuses: [CardStatus.UNIQUE],
    });
  });

  it('unknown engraving ID を持つ刻印はスキップされる', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ダメージ250%',
      baseStatuses: [CardStatus.UNIQUE],
      engravings: [{ id: 'unknown_engraving_id', alignment: 'light' }],
    });

    expect(result.name).toBe('光のペルソナ');
    expect(result.cost).toBe(1);
    expect(result.description).toBe('ダメージ250%');
  });

  it('uses localized persona names and engraving descriptions when provided', () => {
    const result = getPersonaCardPresentation({
      baseName: 'Persona',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'Damage 250%',
      baseStatuses: [CardStatus.UNIQUE],
      engravings: [{ id: 'lux_haste_discount', alignment: 'light' }],
      localization: {
        getName: (variant) => (variant === 'light' ? 'Light Persona' : 'Persona'),
        getEngravingDescription: () => 'Grant Haste',
      },
    });

    expect(result.name).toBe('Light Persona');
    expect(result.description).toContain('Damage 250%');
    expect(result.description).toContain('Grant Haste');
  });
});

describe('getPersonaNameVariant', () => {
  it('2つのlight刻印でradiantを返す', () => {
    const variant = getPersonaNameVariant([
      { id: 'lux_haste_discount', alignment: 'light' },
      { id: 'lux_attunement_discount', alignment: 'light' },
    ]);
    expect(variant).toBe('radiant');
  });

  it('2つのdark刻印でabyssalを返す', () => {
    const variant = getPersonaNameVariant([
      { id: 'umbra_attack_boost', alignment: 'dark' },
      { id: 'umbra_attack_boost', alignment: 'dark' },
    ]);
    expect(variant).toBe('abyssal');
  });
});

describe('normalizePersonaCardEngravings', () => {
  it('undefinedを渡すと空配列を返す', () => {
    expect(normalizePersonaCardEngravings(undefined)).toEqual([]);
  });

  it('不明なengraving IDは除外される', () => {
    const result = normalizePersonaCardEngravings([
      { id: 'unknown_id_xyz', alignment: 'light' },
    ]);
    expect(result).toEqual([]);
  });

  it('同じ刻印を2つ選択した場合は2件とも保持する', () => {
    const result = normalizePersonaCardEngravings([
      { id: 'lux_attunement_discount', alignment: 'light' },
      { id: 'lux_attunement_discount', alignment: 'light' },
    ]);
    expect(result).toEqual([
      { id: 'lux_attunement_discount', alignment: 'light' },
      { id: 'lux_attunement_discount', alignment: 'light' },
    ]);
  });
});

describe('getPersonaCardPresentation - image selection by category', () => {
  it('uses ATTACK image for ATTACK category persona card', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ダメージ250%',
      baseStatuses: [],
      category: CardCategory.ATTACK,
    });

    expect(result.imgUrl).toBe('/images/cards/season3/persona.png');
  });

  it('uses SKILL image for SKILL category persona card', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ダメージ250%',
      baseStatuses: [],
      category: CardCategory.SKILL,
    });

    expect(result.imgUrl).toBe('/images/cards/season3/persona_skill.png');
  });

  it('uses light ATTACK image for ATTACK with light engraving', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ダメージ250%',
      baseStatuses: [],
      engravings: [{ id: 'lux_haste_discount', alignment: 'light' }],
      category: CardCategory.ATTACK,
    });

    expect(result.imgUrl).toBe('/images/cards/season3/lux_persona.png');
  });

  it('uses light SKILL image for SKILL with light engraving', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ダメージ250%',
      baseStatuses: [],
      engravings: [{ id: 'lux_haste_discount', alignment: 'light' }],
      category: CardCategory.SKILL,
    });

    expect(result.imgUrl).toBe('/images/cards/season3/lux_persona_skill.png');
  });

  it('uses dark SKILL image for SKILL with dark engraving', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ダメージ250%',
      baseStatuses: [],
      engravings: [{ id: 'umbra_attack_boost', alignment: 'dark' }],
      category: CardCategory.SKILL,
    });

    expect(result.imgUrl).toBe('/images/cards/season3/umbra_persona_skill.png');
  });

  it('uses luster ATTACK image for ATTACK with double light engraving', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ダメージ250%',
      baseStatuses: [],
      engravings: [
        { id: 'lux_haste_discount', alignment: 'light' },
        { id: 'lux_attunement_discount', alignment: 'light' },
      ],
      category: CardCategory.ATTACK,
    });

    expect(result.imgUrl).toBe('/images/cards/season3/persona_of_luster.png');
  });

  it('uses luster SKILL image for SKILL with double light engraving', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ダメージ250%',
      baseStatuses: [],
      engravings: [
        { id: 'lux_haste_discount', alignment: 'light' },
        { id: 'lux_attunement_discount', alignment: 'light' },
      ],
      category: CardCategory.SKILL,
    });

    expect(result.imgUrl).toBe('/images/cards/season3/persona_of_luster_skill.png');
  });

  it('uses boundary SKILL image for SKILL with mixed light/dark engravings', () => {
    const result = getPersonaCardPresentation({
      baseName: 'ペルソナ',
      baseImageUrl: '/images/cards/persona.png',
      baseCost: 1,
      baseDescription: 'ダメージ250%',
      baseStatuses: [],
      engravings: [
        { id: 'lux_haste_discount', alignment: 'light' },
        { id: 'umbra_attack_boost', alignment: 'dark' },
      ],
      category: CardCategory.SKILL,
    });

    expect(result.imgUrl).toBe('/images/cards/season3/persona_of_boundary_skill.png');
  });
});
