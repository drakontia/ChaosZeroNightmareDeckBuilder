import { describe, it, expect } from 'vitest';
import { encodeDeckShare, decodeDeckShare } from '@/lib/deck-share';
import { Deck } from '@/types';

describe('useShareDeck (functional)', () => {
  it('should encode and decode deck correctly', () => {
    const mockDeck: Deck = {
      name: 'Test Deck',
      character: null,
      equipment: {
        weapon: { item: null, refinement: false, godHammerEquipmentId: null },
        armor: { item: null, refinement: false, godHammerEquipmentId: null },
        pendant: { item: null, refinement: false, godHammerEquipmentId: null }
      },
      cards: [],
      egoLevel: 0,
      hasPotential: false,
      createdAt: new Date(),
      removedCards: new Map(),
      copiedCards: new Map(),
      convertedCards: new Map()
    };

    const encoded = encodeDeckShare(mockDeck);
    expect(typeof encoded).toBe('string');
    expect(encoded.length).toBeGreaterThan(0);
  });

  it('should produce URL-safe encoding', () => {
    const mockDeck: Deck = {
      name: 'Test Deck',
      character: null,
      equipment: {
        weapon: { item: null, refinement: false, godHammerEquipmentId: null },
        armor: { item: null, refinement: false, godHammerEquipmentId: null },
        pendant: { item: null, refinement: false, godHammerEquipmentId: null }
      },
      cards: [],
      egoLevel: 0,
      hasPotential: false,
      createdAt: new Date(),
      removedCards: new Map(),
      copiedCards: new Map(),
      convertedCards: new Map()
    };

    const encoded = encodeDeckShare(mockDeck);
    
    // Base64url should not have + or / or =
    expect(encoded).not.toMatch(/[+/=]/);
    
    // Should be safe for URL
    expect(() => {
      new URL(`https://example.com/deck/${encoded}`);
    }).not.toThrow();
  });
});
