import { describe, it, expect, beforeEach, vi } from 'vitest';
import { encodeDeckShare, decodeDeckShare } from '@/lib/deck-share';
import { Deck, CardType, CardCategory, GodType, EquipmentType } from '@/types';

describe('deck-share', () => {
  let mockDeck: Deck;

  beforeEach(() => {
    mockDeck = {
      name: 'Test Deck',
      character: {
        id: 'chizuru',
        name: 'character.chizuru',
        job: 'PSIONIC' as any,
        element: 'VOID' as any,
        startingCards: ['char_card_1', 'char_card_2', 'char_card_3', 'char_card_4'],
        hiramekiCards: ['char_hirameki_1', 'char_hirameki_2', 'char_hirameki_3', 'char_hirameki_4'],
        imgUrl: ''
      } as any,
      equipment: {
        weapon: { id: 'obsidian_sword', name: 'equipment.weapon.obsidian_sword.name', type: EquipmentType.WEAPON, rarity: 'equipment.rarity.rare' },
        armor: null,
        pendant: null
      },
      cards: [
        {
          deckId: 'deck-1',
          id: 'shared_01',
          name: '全体攻撃',
          type: CardType.SHARED,
          category: CardCategory.ATTACK,
          statuses: [],
          selectedHiramekiLevel: 0,
          godHiramekiType: null,
          godHiramekiEffectId: null,
          selectedHiddenHiramekiId: null,
          isBasicCard: false,
          isCopied: true,
          copiedFromCardId: 'shared_01',
          hiramekiVariations: [
            { level: 0, cost: 5, description: '敵全体に無属性ダメージを与える' }
          ]
        }
      ],
      egoLevel: 2,
      hasPotential: true,
      createdAt: new Date('2024-01-01T12:00:00Z'),
      removedCards: new Map([['removed-1', 2]]),
      copiedCards: new Map([['shared_01', 1]]),
      convertedCards: new Map([['original-1', 'converted-1']])
    };
  });

  describe('encodeDeckShare', () => {
    it('should encode deck to base64url string', () => {
      const encoded = encodeDeckShare(mockDeck);

      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);
      // Base64url should not have + or / or =
      expect(encoded).not.toMatch(/[+/=]/);
    });

    it('should include essential deck data', () => {
      const encoded = encodeDeckShare(mockDeck);
      // The encoded string should be decodable
      expect(() => decodeDeckShare(encoded)).not.toThrow();
    });

    it('should encode deck names with special characters', () => {
      const specialDeck = {
        ...mockDeck,
        name: 'デッキ with !@#$% characters'
      };

      const encoded = encodeDeckShare(specialDeck);
      expect(encoded).not.toMatch(/[+/=]/);
    });

    it('should handle empty deck', () => {
      const emptyDeck: Deck = {
        name: '',
        character: null,
        equipment: { weapon: null, armor: null, pendant: null },
        cards: [],
        egoLevel: 0,
        hasPotential: false,
        createdAt: new Date(),
        removedCards: new Map(),
        copiedCards: new Map(),
        convertedCards: new Map()
      };

      const encoded = encodeDeckShare(emptyDeck);
      expect(typeof encoded).toBe('string');
    });
  });

  describe('decodeDeckShare', () => {
    it('should decode valid encoded string back to deck', () => {
      const encoded = encodeDeckShare(mockDeck);
      const decoded = decodeDeckShare(encoded);

      expect(decoded).not.toBeNull();
      expect(decoded!.name).toBe('Test Deck');
      expect(decoded!.character?.id).toBe('chizuru');
      expect(decoded!.egoLevel).toBe(2);
      expect(decoded!.hasPotential).toBe(true);
    });

    it('should preserve card data', () => {
      const encoded = encodeDeckShare(mockDeck);
      const decoded = decodeDeckShare(encoded);

      expect(decoded!.cards).toHaveLength(1);
      expect(decoded!.cards[0].id).toBe('shared_01');
      expect(decoded!.cards[0].copiedFromCardId).toBe('shared_01');
    });

    it('should preserve equipment data', () => {
      const encoded = encodeDeckShare(mockDeck);
      const decoded = decodeDeckShare(encoded);

      expect(decoded!.equipment.weapon?.id).toBe('obsidian_sword');
      expect(decoded!.equipment.armor).toBeNull();
    });

    it('should preserve maps data', () => {
      const encoded = encodeDeckShare(mockDeck);
      const decoded = decodeDeckShare(encoded);

      expect(decoded!.removedCards.get('removed-1')).toBe(2);
      expect(decoded!.copiedCards.get('shared_01')).toBe(1);
      expect(decoded!.convertedCards.get('original-1')).toBe('converted-1');
    });

    it('should return null for invalid encoded string', () => {
      const decoded = decodeDeckShare('invalid');
      expect(decoded).toBeNull();
    });

    it('should return null for malformed base64', () => {
      const decoded = decodeDeckShare('!!!invalid!!!');
      expect(decoded).toBeNull();
    });

    it('should handle createdAt as ISO string', () => {
      const encoded = encodeDeckShare(mockDeck);
      const decoded = decodeDeckShare(encoded);

      expect(decoded!.createdAt).toBeInstanceOf(Date);
      expect(decoded!.createdAt.toISOString()).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should return null for unsupported version', () => {
      const payload = { v: 2, k: [] };
      const encoded = Buffer.from(JSON.stringify(payload), 'utf-8')
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      const decoded = decodeDeckShare(encoded);
      expect(decoded).toBeNull();
    });
  });

  describe('encoding/decoding round trip', () => {
    it('should maintain data integrity through encode-decode cycle', () => {
      const encoded = encodeDeckShare(mockDeck);
      const decoded = decodeDeckShare(encoded)!;

      expect(decoded.name).toBe(mockDeck.name);
      expect(decoded.character?.id).toBe(mockDeck.character?.id);
      expect(decoded.egoLevel).toBe(mockDeck.egoLevel);
      expect(decoded.hasPotential).toBe(mockDeck.hasPotential);
      expect(decoded.cards.length).toBe(mockDeck.cards.length);
    });

    it('should handle deck with multiple cards', () => {
      mockDeck.cards = [
        ...mockDeck.cards,
        {
          deckId: 'deck-2',
          id: 'monster_01',
          name: 'モンスター召喚',
          type: CardType.MONSTER,
          category: CardCategory.SKILL,
          statuses: [],
          selectedHiramekiLevel: 0,
          godHiramekiType: 'kilken' as GodType,
          godHiramekiEffectId: 'kilken_01',
          selectedHiddenHiramekiId: null,
          isBasicCard: false,
          hiramekiVariations: [
            { level: 0, cost: 4, description: 'モンスターを召喚して攻撃' }
          ]
        }
      ];

      const encoded = encodeDeckShare(mockDeck);
      const decoded = decodeDeckShare(encoded);

      expect(decoded!.cards).toHaveLength(2);
      expect(decoded!.cards[1].selectedHiramekiLevel).toBe(0);
      expect(decoded!.cards[1].godHiramekiType).toBe('kilken' as GodType);
      expect(decoded!.cards[1].godHiramekiEffectId).toBe('kilken_01');
    });

    it('should handle high ego levels', () => {
      mockDeck.egoLevel = 6;

      const encoded = encodeDeckShare(mockDeck);
      const decoded = decodeDeckShare(encoded);

      expect(decoded!.egoLevel).toBe(6);
    });
  });

  describe('URL encoding safety', () => {
    it('should produce URL-safe characters', () => {
      const encoded = encodeDeckShare(mockDeck);
      
      // Test that it's safe for URL
      const testUrl = `https://example.com/deck/${encoded}`;
      expect(() => new URL(testUrl)).not.toThrow();
    });

    it('should produce reasonably short encoded strings', () => {
      const encoded = encodeDeckShare(mockDeck);
      // Encoded string should be reasonably short (less than 1000 chars for typical decks)
      expect(encoded.length).toBeLessThan(1000);
    });
  });

  describe('encoding fallbacks', () => {
    it('should fall back to TextEncoder path when Buffer.from fails', () => {
      const originalBuffer = global.Buffer;
      const originalBufferFrom = global.Buffer?.from;
      const originalBtoa = (global as any).btoa;

      const safeBtoa = (data: string) => originalBufferFrom!(data, 'binary').toString('base64');
      (global as any).btoa = originalBtoa ?? safeBtoa;
      if (global.Buffer) {
        global.Buffer.from = (() => { throw new Error('force'); }) as any;
      }

      const encoded = encodeDeckShare(mockDeck);
      expect(typeof encoded).toBe('string');

      if (originalBuffer && originalBufferFrom) {
        global.Buffer = originalBuffer;
        global.Buffer.from = originalBufferFrom;
      }
      (global as any).btoa = originalBtoa;
    });

    it('should fall back to atob/TextDecoder path when Buffer.from fails', () => {
      const encoded = encodeDeckShare(mockDeck);
      const originalBuffer = global.Buffer;
      const originalBufferFrom = global.Buffer?.from;
      const originalAtob = (global as any).atob;

      const safeAtob = (data: string) => originalBufferFrom!(data, 'base64').toString('binary');
      (global as any).atob = originalAtob ?? safeAtob;
      if (global.Buffer) {
        global.Buffer.from = (() => { throw new Error('force'); }) as any;
      }

      const decoded = decodeDeckShare(encoded);
      expect(decoded).not.toBeNull();

      if (originalBuffer && originalBufferFrom) {
        global.Buffer = originalBuffer;
        global.Buffer.from = originalBufferFrom;
      }
      (global as any).atob = originalAtob;
    });

    it('should use fallback deckId when crypto.randomUUID is unavailable', () => {
      vi.stubGlobal('crypto', undefined as any);

      const encoded = encodeDeckShare(mockDeck);
      const decoded = decodeDeckShare(encoded)!;
      expect(decoded.cards[0].deckId.startsWith(`${decoded.cards[0].id}_`)).toBe(true);

      vi.unstubAllGlobals();
    });

    it('should handle non-Date createdAt values safely', () => {
      const deckWithInvalidDate = {
        ...mockDeck,
        createdAt: 12345 as any,
      };
      const encoded = encodeDeckShare(deckWithInvalidDate);
      const decoded = decodeDeckShare(encoded);
      expect(decoded?.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('snapshot attributes', () => {
    it('should preserve RemovedCardEntry/CopiedCardEntry/ConvertedCardEntry snapshot attributes', () => {
      const deck: Deck = {
        name: 'snaptest',
        character: {
          id: 'chizuru',
          name: 'character.chizuru',
          job: 'PSIONIC' as any,
          element: 'VOID' as any,
          startingCards: [],
          hiramekiCards: [],
          imgUrl: ''
        } as any,
        equipment: { weapon: null, armor: null, pendant: null },
        cards: [],
        egoLevel: 0,
        hasPotential: false,
        createdAt: new Date(),
        removedCards: new Map([
          ['c1', { count: 2, type: CardType.SHARED, selectedHiramekiLevel: 1, godHiramekiType: GodType.KILKEN }]
        ]),
        copiedCards: new Map([
          ['c2', { count: 1, type: CardType.MONSTER, selectedHiramekiLevel: 2, godHiramekiType: GodType.SECLAID }]
        ]),
        convertedCards: new Map([
          ['c3', { convertedToId: 'c4', originalType: CardType.FORBIDDEN, selectedHiramekiLevel: 3, godHiramekiType: GodType.DIALOS, excluded: true }]
        ])
      };
      const encoded = encodeDeckShare(deck);
      const decoded = decodeDeckShare(encoded)!;
      // RemovedCardEntry
      const removed = decoded.removedCards.get('c1');
      expect(typeof removed).toBe('object');
      expect((removed as any).type).toBe(CardType.SHARED);
      expect((removed as any).selectedHiramekiLevel).toBe(1);
      expect((removed as any).godHiramekiType).toBe(GodType.KILKEN);
      // CopiedCardEntry
      const copied = decoded.copiedCards.get('c2');
      expect(typeof copied).toBe('object');
      expect((copied as any).type).toBe(CardType.MONSTER);
      expect((copied as any).selectedHiramekiLevel).toBe(2);
      expect((copied as any).godHiramekiType).toBe(GodType.SECLAID);
      // ConvertedCardEntry
      const converted = decoded.convertedCards.get('c3');
      expect(typeof converted).toBe('object');
      expect((converted as any).convertedToId).toBe('c4');
      expect((converted as any).originalType).toBe(CardType.FORBIDDEN);
      expect((converted as any).selectedHiramekiLevel).toBe(3);
      expect((converted as any).godHiramekiType).toBe(GodType.DIALOS);
      expect((converted as any).excluded).toBe(true);
    });
  });
});
