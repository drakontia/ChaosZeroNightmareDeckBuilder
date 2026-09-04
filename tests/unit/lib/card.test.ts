import { describe, it, expect } from 'vitest';
import { getAddableCards, getCardById, getCharacterHiramekiCards, getCharacterStartingCards, CARDS } from '@/lib/card';
import { CHARACTERS } from '@/lib/characters';
import { FORBIDDEN_CARDS } from '@/lib/cards/forbidden-cards';
import { CardStatus, CardType, JobType } from '@/types';

describe('card helpers', () => {
  it('getCardById returns a card when it exists', () => {
    const card = getCardById('shared_01');
    expect(card).toBeDefined();
  });

  it('getCharacterStartingCards resolves valid cards', () => {
    const character = CHARACTERS[0];
    const cards = getCharacterStartingCards(character);
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.every(card => card.type === CardType.CHARACTER)).toBe(true);
  });

  it('getCharacterHiramekiCards resolves valid cards', () => {
    const character = CHARACTERS[0];
    const cards = getCharacterHiramekiCards(character);
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.every(card => card.type === CardType.CHARACTER)).toBe(true);
  });

  it('getAddableCards returns all non-character cards when no job is selected', () => {
    const allNonCharacter = CARDS.filter(card => card.type !== CardType.CHARACTER);
    const result = getAddableCards();
    expect(result.length).toBe(allNonCharacter.length);
    expect(result.every(card => card.type !== CardType.CHARACTER)).toBe(true);
  });

  it('getAddableCards respects allowedJobs filtering', () => {
    const allAllowed = CARDS.find(card => card.type !== CardType.CHARACTER && card.allowedJobs === 'all');
    const restricted = CARDS.find(card =>
      card.type !== CardType.CHARACTER &&
      Array.isArray(card.allowedJobs) &&
      !card.allowedJobs.includes(JobType.PSIONIC)
    );

    const result = getAddableCards(JobType.PSIONIC);

    if (allAllowed) {
      expect(result.some(card => card.id === allAllowed.id)).toBe(true);
    }
    if (restricted) {
      expect(result.some(card => card.id === restricted.id)).toBe(false);
    }
  });

  it('includes persona season cards in the global card registry', () => {
    const personaCard = getCardById('persona_01');
    expect(personaCard).toBeDefined();
    expect(personaCard?.type).toBe(CardType.FORBIDDEN);
  });

  it('filters persona cards by allowed jobs', () => {
    const rangerCards = getAddableCards(JobType.RANGER);
    const vanguardCards = getAddableCards(JobType.VANGUARD);

    expect(rangerCards.some(card => card.id === 'persona_07')).toBe(true);
    expect(rangerCards.some(card => card.id === 'persona_08')).toBe(false);
    expect(vanguardCards.some(card => card.id === 'persona_08')).toBe(true);
  });

  it('returns organized image paths for representative card groups', () => {
    expect(getCardById('fei_starting_1')?.imgUrl).toBe('/images/cards/character/fei_starting_1.png');
    expect(getCardById('shared_01')?.imgUrl).toBe('/images/cards/common/shared_01.png');
    expect(getCardById('monster_01')?.imgUrl).toBe('/images/cards/monster/monster_01.png');
    expect(getCardById('forbidden_card_1')?.imgUrl).toBe('/images/cards/season1/forbidden_card_1.png');
    expect(getCardById('spore_harvester')?.imgUrl).toBe('/images/cards/season2/spore_harvester.png');
    expect(getCardById('persona_01')?.imgUrl).toBe('/images/cards/season3/persona.png');
  });

  it('includes all season4 desire cards in the global card registry', () => {
    const season4Ids = [
      'traitors_execution',
      'mark_of_servitude',
      'kneel_before_me',
      'indiscriminate_slaughter',
      'order_of_dominance',
      'postmortem_analysis',
      'sensory_overload',
      'forbidden_hypothesis',
      'sample_collection',
      'knowledge_addiction',
      'sever_ties',
      'narcissism',
      'its_all_mine',
      'obsession',
      'gilded_nest',
      'cutting_loose',
      'driven_hunt',
      'feralization',
      'final_struggle',
      'harrowing_reign',
    ];

    for (const id of season4Ids) {
      const card = getCardById(id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.FORBIDDEN);
    }
  });

  it('defines survival status and 3 season levels for new season4 desire cards', () => {
    const season4NewIds = [
      'cutting_loose',
      'driven_hunt',
      'feralization',
      'final_struggle',
      'harrowing_reign',
    ];

    for (const id of season4NewIds) {
      const card = FORBIDDEN_CARDS.find((candidate) => candidate.id === id);
      expect(card).toBeDefined();
      expect(card?.statuses).toContain(CardStatus.SURVIVAL);
      expect(card?.seasonLevelVariations?.map((level) => level.level)).toEqual([1, 2, 3]);
    }
  });

  it('defines season4 card image paths directly under /images/cards/season4/', () => {
    const season4Ids = [
      'traitors_execution',
      'mark_of_servitude',
      'kneel_before_me',
      'indiscriminate_slaughter',
      'order_of_dominance',
      'postmortem_analysis',
      'sensory_overload',
      'forbidden_hypothesis',
      'sample_collection',
      'knowledge_addiction',
      'sever_ties',
      'narcissism',
      'its_all_mine',
      'obsession',
      'gilded_nest',
      'cutting_loose',
      'driven_hunt',
      'feralization',
      'final_struggle',
      'harrowing_reign',
    ];

    for (const id of season4Ids) {
      const card = FORBIDDEN_CARDS.find((candidate) => candidate.id === id);
      expect(card?.imgUrl).toBe(`/images/cards/season4/${id}.png`);
    }
  });

  it('getCardById performs efficiently with Map-based lookup', () => {
    // Performance test: 1000 lookups should complete quickly
    const startTime = performance.now();
    for (let i = 0; i < 1000; i++) {
      getCardById('shared_01');
      getCardById('fei_starting_1');
      getCardById('monster_01');
    }
    const duration = performance.now() - startTime;
    
    // Should complete within reasonable time (Map-based should be <50ms for 3000 lookups)
    expect(duration).toBeLessThan(100);
  });
});
