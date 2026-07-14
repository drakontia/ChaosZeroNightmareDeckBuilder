import { describe, expect, it } from 'vitest';

import { getOrganizedCardImagePath } from '@/lib/card-image-paths';
import { CardType } from '@/types';

describe('getOrganizedCardImagePath', () => {
  it('maps character card images into the character folder', () => {
    expect(
      getOrganizedCardImagePath('fei_starting_1', CardType.CHARACTER, '/images/cards/fei_starting_1.png')
    ).toBe('/images/cards/character/fei_starting_1.png');
  });

  it('maps shared and persona cards into the common folder', () => {
    expect(
      getOrganizedCardImagePath('shared_01', CardType.SHARED, '/images/cards/shared_01.png')
    ).toBe('/images/cards/common/shared_01.png');

    expect(
      getOrganizedCardImagePath('persona_01', CardType.FORBIDDEN, '/images/cards/persona.png')
    ).toBe('/images/cards/common/persona.png');
  });

  it('maps monster cards into the monster folder', () => {
    expect(
      getOrganizedCardImagePath('monster_01', CardType.MONSTER, '/images/cards/monster_01.png')
    ).toBe('/images/cards/monster/monster_01.png');
  });

  it('maps season cards into their explicit season folders', () => {
    expect(
      getOrganizedCardImagePath('spore_harvester', CardType.FORBIDDEN, '/images/cards/spore_harvester.png')
    ).toBe('/images/cards/season2/spore_harvester.png');

    expect(
      getOrganizedCardImagePath('doctrine_of_binding', CardType.FORBIDDEN, '/images/cards/doctrine_of_binding.png')
    ).toBe('/images/cards/season3/doctrine_of_binding.png');

    expect(
      getOrganizedCardImagePath('traitors_execution', CardType.FORBIDDEN, '/images/cards/traitors_execution.png')
    ).toBe('/images/cards/season4/traitors_execution.png');
  });

  it('leaves non-card public assets untouched', () => {
    expect(
      getOrganizedCardImagePath('card_placeholder', CardType.SHARED, '/images/other/card_placeholder.png')
    ).toBe('/images/other/card_placeholder.png');
  });

  it('returns undefined when a card has no image path', () => {
    expect(getOrganizedCardImagePath('shared_01', CardType.SHARED, undefined)).toBeUndefined();
  });
});
