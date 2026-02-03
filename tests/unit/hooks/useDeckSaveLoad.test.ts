import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDeckSaveLoad } from '@/hooks/useDeckSaveLoad';
import { CHARACTERS } from '@/lib/characters';
import { Deck } from '@/types';

describe('useDeckSaveLoad', () => {
  let deck: Deck;
  let setName: (name: string) => void;
  let setSharedDeck: (deck: Deck | null) => void;
  let setShareError: (err: string | null) => void;
  let t: (key: string, opts?: { defaultValue?: string }) => string;
  let sharedDeck: Deck | null = null;
  let name: string = '';
  let error: string | null = null;

  beforeEach(() => {
    window.localStorage.clear();
    const promptMock = vi.fn((message: string, defaultValue: string) => defaultValue);
    const alertMock = vi.fn();
    const confirmMock = vi.fn(() => true);
    window.prompt = promptMock as any;
    window.alert = alertMock as any;
    window.confirm = confirmMock as any;
    vi.stubGlobal('prompt', promptMock);
    vi.stubGlobal('alert', alertMock);
    vi.stubGlobal('confirm', confirmMock);
    sharedDeck = null;
    name = '';
    error = null;
    setName = (n) => { name = n; };
    setSharedDeck = (d) => { sharedDeck = d; };
    setShareError = (e) => { error = e; };
    t = (k, o) => o?.defaultValue || k;
    deck = {
      name: 'testdeck',
      character: CHARACTERS.find(c => c.id === 'chizuru')!,
      equipment: { weapon: null, armor: null, pendant: null },
      cards: [],
      egoLevel: 0,
      hasPotential: false,
      createdAt: new Date(),
      removedCards: new Map(),
      copiedCards: new Map(),
      convertedCards: new Map()
    };
  });

  it('保存→読込でcharacterが維持される', () => {
    const { result } = renderHook(() => useDeckSaveLoad({ deck, setName, setSharedDeck, setShareError, t }));
    // 保存
    act(() => {
      result.current.handleSaveDeck();
    });
    // 読込
    act(() => {
      result.current.handleLoadDeck('testdeck');
    });
    expect(sharedDeck).not.toBeNull();
    expect(sharedDeck?.character?.id).toBe('chizuru');
  });

  it('openLoadDialogは不正な保存データを無視する', () => {
    const { result } = renderHook(() => useDeckSaveLoad({ deck, setName, setSharedDeck, setShareError, t }));
    window.localStorage.setItem('cznde:savedDecks', '{invalid-json');

    act(() => {
      result.current.openLoadDialog();
    });

    expect(result.current.savedList).toHaveLength(0);
    expect(result.current.loadOpen).toBe(true);
  });

  it('保存済みがある場合に上書き確認でキャンセルすると保存されない', () => {
    const { result } = renderHook(() => useDeckSaveLoad({ deck, setName, setSharedDeck, setShareError, t }));
    const stored = JSON.stringify({
      [deck.name]: { id: 'existing', savedAt: new Date('2024-01-01T00:00:00Z').toISOString() }
    });
    window.localStorage.setItem('cznde:savedDecks', stored);
    window.confirm = vi.fn(() => false) as any;

    act(() => {
      result.current.handleSaveDeck();
    });

    const after = window.localStorage.getItem('cznde:savedDecks');
    expect(after).toBe(stored);
    expect(window.confirm).toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('保存済みがある場合に上書き確認でOKすると保存される', () => {
    const { result } = renderHook(() => useDeckSaveLoad({ deck, setName, setSharedDeck, setShareError, t }));
    const stored = JSON.stringify({
      [deck.name]: { id: 'existing', savedAt: new Date('2024-01-01T00:00:00Z').toISOString() }
    });
    window.localStorage.setItem('cznde:savedDecks', stored);
    window.confirm = vi.fn(() => true) as any;

    act(() => {
      result.current.handleSaveDeck();
    });

    const after = window.localStorage.getItem('cznde:savedDecks');
    expect(after).not.toBeNull();
    expect(window.confirm).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();
  });

  it('存在しないデッキの読み込みはエラーを通知する', () => {
    const { result } = renderHook(() => useDeckSaveLoad({ deck, setName, setSharedDeck, setShareError, t }));

    act(() => {
      result.current.handleLoadDeck('missing');
    });

    expect(sharedDeck).toBeNull();
    expect(window.alert).toHaveBeenCalled();
  });

  it('削除確認でキャンセルすると保存データは残る', () => {
    const { result } = renderHook(() => useDeckSaveLoad({ deck, setName, setSharedDeck, setShareError, t }));
    const stored = JSON.stringify({
      [deck.name]: { id: 'existing', savedAt: new Date('2024-01-01T00:00:00Z').toISOString() }
    });
    window.localStorage.setItem('cznde:savedDecks', stored);
    window.confirm = vi.fn(() => false) as any;

    act(() => {
      result.current.handleDeleteSaved(deck.name);
    });

    const after = window.localStorage.getItem('cznde:savedDecks');
    expect(after).toBe(stored);
  });

  it('削除確認でOKすると保存データが削除される', () => {
    const { result } = renderHook(() => useDeckSaveLoad({ deck, setName, setSharedDeck, setShareError, t }));
    const stored = JSON.stringify({
      [deck.name]: { id: 'existing', savedAt: new Date('2024-01-01T00:00:00Z').toISOString() }
    });
    window.localStorage.setItem('cznde:savedDecks', stored);
    window.confirm = vi.fn(() => true) as any;

    act(() => {
      result.current.handleDeleteSaved(deck.name);
    });

    const after = window.localStorage.getItem('cznde:savedDecks');
    expect(after).toBe(JSON.stringify({}));
  });
});
