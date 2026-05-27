import { describe, it, expect } from 'vitest';
import { CardStatus, CardCategory, CardType, JobType, ElementType } from '@/types';
import { CHARACTERS } from '@/lib/characters';
import { CHARACTER_CARDS } from '@/lib/character-cards';

describe('Adelheid character', () => {
  it('CardStatus has BLESSING defined', () => {
    expect(CardStatus.BLESSING).toBe('blessing');
  });

  it('adelheid exists in CHARACTERS', () => {
    const char = CHARACTERS.find(c => c.id === 'adelheid');
    expect(char).toBeDefined();
    expect(char?.job).toBe(JobType.VANGUARD);
    expect(char?.element).toBe(ElementType.VOID);
    expect(char?.rarity).toBe('★5');
  });

  it('adelheid has 4 starting cards and 4 hirameki cards', () => {
    const char = CHARACTERS.find(c => c.id === 'adelheid');
    expect(char?.startingCards).toHaveLength(4);
    expect(char?.hiramekiCards).toHaveLength(4);
  });

  describe('starting cards', () => {
    const startingIds = [
      'adelheid_starting_1',
      'adelheid_starting_2',
      'adelheid_starting_3',
      'adelheid_starting_4',
    ];

    it.each(startingIds)('%s exists in CHARACTER_CARDS', (id) => {
      const card = CHARACTER_CARDS.find(c => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
      expect(card?.isStartingCard).toBe(true);
    });

    it('adelheid_starting_1 is basic ATTACK card', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_starting_1');
      expect(card?.category).toBe(CardCategory.ATTACK);
      expect(card?.isBasicCard).toBe(true);
    });

    it('adelheid_starting_2 is basic SKILL card', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_starting_2');
      expect(card?.category).toBe(CardCategory.SKILL);
      expect(card?.isBasicCard).toBe(true);
    });

    it('adelheid_starting_3 is basic SKILL card', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_starting_3');
      expect(card?.category).toBe(CardCategory.SKILL);
      expect(card?.isBasicCard).toBe(true);
    });

    it('adelheid_starting_4 (むかしむかし) is non-basic SKILL with EXHAUST2', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_starting_4');
      expect(card?.category).toBe(CardCategory.SKILL);
      expect(card?.isBasicCard).toBe(false);
      expect(card?.statuses).toContain(CardStatus.EXHAUST2);
    });

    it('むかしむかし Lv5 has UPGRADE category and UNIQUE status', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_starting_4');
      const lv5 = card?.hiramekiVariations.find(v => v.level === 5);
      expect(lv5).toBeDefined();
      expect(lv5?.category).toBe(CardCategory.UPGRADE);
      expect(lv5?.statuses).toContain(CardStatus.UNIQUE);
    });

    it('むかしむかし Lv2 has INITIATION status', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_starting_4');
      const lv2 = card?.hiramekiVariations.find(v => v.level === 2);
      expect(lv2?.statuses).toContain(CardStatus.INITIATION);
      expect(lv2?.statuses).toContain(CardStatus.EXHAUST2);
    });

    it('むかしむかし Lv4 has RETAIN status', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_starting_4');
      const lv4 = card?.hiramekiVariations.find(v => v.level === 4);
      expect(lv4?.cost).toBe('X');
      expect(lv4?.statuses).toContain(CardStatus.RETAIN);
    });
  });

  describe('hirameki cards', () => {
    const hiramekiIds = [
      'adelheid_hirameki_1',
      'adelheid_hirameki_2',
      'adelheid_hirameki_3',
      'adelheid_hirameki_4',
    ];

    it.each(hiramekiIds)('%s exists in CHARACTER_CARDS', (id) => {
      const card = CHARACTER_CARDS.find(c => c.id === id);
      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.CHARACTER);
    });

    it('私たちを守って (hirameki_1) is SKILL with BLESSING status', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_hirameki_1');
      expect(card?.category).toBe(CardCategory.SKILL);
      expect(card?.statuses).toContain(CardStatus.BLESSING);
    });

    it('私たちを守って Lv5 does NOT have BLESSING status', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_hirameki_1');
      const lv5 = card?.hiramekiVariations.find(v => v.level === 5);
      expect(lv5).toBeDefined();
      expect(lv5?.statuses).toBeDefined();
      expect(lv5?.statuses).not.toContain(CardStatus.BLESSING);
    });

    it('童話の中のお友だち (hirameki_2) is UPGRADE with UNIQUE status', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_hirameki_2');
      expect(card?.category).toBe(CardCategory.UPGRADE);
      expect(card?.statuses).toContain(CardStatus.UNIQUE);
    });

    it('物語の真実 (hirameki_3) is ATTACK with HASTE status', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_hirameki_3');
      expect(card?.category).toBe(CardCategory.ATTACK);
      expect(card?.statuses).toContain(CardStatus.HASTE);
    });

    it('物語の真実 Lv4 has QUIETUS status and cost 2', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_hirameki_3');
      const lv4 = card?.hiramekiVariations.find(v => v.level === 4);
      expect(lv4?.statuses).toContain(CardStatus.QUIETUS);
      expect(lv4?.cost).toBe(2);
    });

    it('秘密の庭園 (hirameki_4) is UPGRADE with UNIQUE status and only Lv0', () => {
      const card = CHARACTER_CARDS.find(c => c.id === 'adelheid_hirameki_4');
      expect(card?.category).toBe(CardCategory.UPGRADE);
      expect(card?.statuses).toContain(CardStatus.UNIQUE);
      expect(card?.hiramekiVariations).toHaveLength(1);
      expect(card?.hiramekiVariations[0].level).toBe(0);
    });
  });
});
