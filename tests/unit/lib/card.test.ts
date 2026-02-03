import { describe, it, expect } from 'vitest';
import { getAddableCards, getCardById, getCharacterHiramekiCards, getCharacterStartingCards, CARDS } from '@/lib/card';
import { CHARACTERS } from '@/lib/characters';
import { CardType, JobType } from '@/types';

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
});
