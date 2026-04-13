import { describe, expect, it } from 'vitest';

import { getPersonaCardPresentation } from '@/lib/persona';
import { CardStatus } from '@/types';

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
    expect(result.imgUrl).toBe('/images/cards/lux_persona.png');
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
    expect(result.imgUrl).toBe('/images/cards/persona_of_border.png');
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
      imgUrl: '/images/cards/persona.png',
      cost: 1,
      description: '治癒250%',
      statuses: [CardStatus.UNIQUE],
    });
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
