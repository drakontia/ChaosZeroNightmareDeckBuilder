/**
 * DeckBuilder の faintMemoryPoints メモ化テスト
 *
 * calculateFaintMemory が useMemo でラップされることで、
 * デッキ変更を伴わない再レンダーでは再計算が抑制されることを検証する。
 *
 * Red: useMemo なしでは 2 回呼ばれるため FAIL
 * Green: useMemo を追加すると 1 回のみ → PASS
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { useState } from 'react';
import * as calculateFaintMemoryModule from '@/lib/calculateFaintMemory';
import { Deck } from '@/types';

// ------------------------------------------------------------------
// 最小限のモックデッキ
// ------------------------------------------------------------------
const mockDeck: Deck = {
  character: null,
  equipment: {
    weapon: { item: null, refinement: null, godHammerEquipmentId: null },
    armor: { item: null, refinement: null, godHammerEquipmentId: null },
    pendant: { item: null, refinement: null, godHammerEquipmentId: null },
  },
  cards: [],
  egoLevel: 0,
  hasPotential: false,
  createdAt: new Date(),
  removedCards: new Map(),
  copiedCards: new Map(),
  convertedCards: new Map(),
};

const mockStore = {
  deck: mockDeck,
  setDeck: vi.fn(),
  setCharacter: vi.fn(),
  setEgoLevel: vi.fn(),
  setPotential: vi.fn(),
  addCard: vi.fn(),
  removeCard: vi.fn(),
  restoreCard: vi.fn(),
  selectEquipment: vi.fn(),
  setEquipmentRefinement: vi.fn(),
  setEquipmentGodHammer: vi.fn(),
  setEquipmentEngraving: vi.fn(),
  updateCardHirameki: vi.fn(),
  setCardGodHirameki: vi.fn(),
  setCardGodHiramekiEffect: vi.fn(),
  setCardHiddenHirameki: vi.fn(),
  setCardPersonaEngravings: vi.fn(),
  reset: vi.fn(),
  undoCard: vi.fn(),
  copyCard: vi.fn(),
  convertCard: vi.fn(),
  removeLimitReached: false,
  copyLimitReached: false,
  conversionLimitReached: false,
  clearRemoveLimitAlert: vi.fn(),
  clearCopyLimitAlert: vi.fn(),
  clearConversionLimitAlert: vi.fn(),
};

// ------------------------------------------------------------------
// モック定義（vi.mock はホイストされるため最上位に記述）
// ------------------------------------------------------------------
vi.mock('@/hooks/useDeckBuilderStore', () => ({
  useDeckBuilderStore: (selector: (s: typeof mockStore) => unknown) => selector(mockStore),
}));

vi.mock('zustand/react/shallow', () => ({
  useShallow: (selector: unknown) => selector,
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'ja',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('@/hooks/useShareDeck', () => ({
  useShareDeck: () => ({ isSharing: false, handleShareDeck: vi.fn() }),
}));

vi.mock('@/hooks/useExportDeckImage', () => ({
  useExportDeckImage: () => ({ isExporting: false, handleExportDeckImage: vi.fn() }),
}));

vi.mock('@/hooks/useDeckSaveLoad', () => ({
  useDeckSaveLoad: () => ({
    savedList: [],
    loadOpen: false,
    setLoadOpen: vi.fn(),
    handleSaveDeck: vi.fn(),
    openLoadDialog: vi.fn(),
    handleLoadDeck: vi.fn(),
    handleDeleteSaved: vi.fn(),
  }),
}));

vi.mock('@/hooks/useDeckBuilderAlerts', () => ({ useDeckBuilderAlerts: vi.fn() }));
vi.mock('@/hooks/useDeckBuilderInitialization', () => ({ useDeckBuilderInitialization: vi.fn() }));
vi.mock('@/hooks/useDeckShareLoader', () => ({ useDeckShareLoader: vi.fn() }));
vi.mock('@/hooks/useEquipmentValidation', () => ({
  useEquipmentValidation: () => () => true,
}));
vi.mock('@/hooks/useLoadedDeckSync', () => ({ useLoadedDeckSync: vi.fn() }));

vi.mock('@/lib/card', () => ({
  CHARACTERS: [],
  EQUIPMENT: {},
}));

vi.mock('@/components/deck-builder', () => ({
  CardCatalogSection: () => <div data-testid="card-catalog" />,
  DeckBuilderHeader: () => <div data-testid="deck-builder-header" />,
  DeckWorkspace: () => <div data-testid="deck-workspace" />,
  LoadDeckDialog: () => <div data-testid="load-deck-dialog" />,
}));

vi.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="footer" />,
}));

// ------------------------------------------------------------------
// テスト本体
// ------------------------------------------------------------------
describe('DeckBuilder - faintMemoryPoints のメモ化', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('デッキが変わらない再レンダーでは calculateFaintMemory を1回しか呼ばない', async () => {
    const spy = vi.spyOn(calculateFaintMemoryModule, 'calculateFaintMemory');

    const { DeckBuilder } = await import('@/components/DeckBuilder');

    let forceRerender!: () => void;

    function Wrapper() {
      const [, setTick] = useState(0);
      forceRerender = () => setTick((t) => t + 1);
      return <DeckBuilder />;
    }

    render(<Wrapper />);

    // 初回レンダー: 1 回呼ばれるはず
    expect(spy).toHaveBeenCalledTimes(1);

    // デッキを変えずに親コンポーネントから強制再レンダー
    act(() => {
      forceRerender();
    });

    // useMemo により再計算は抑制され、依然 1 回のみであること
    // (useMemo なしの場合は 2 回になるためこのアサーションが FAIL する)
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
