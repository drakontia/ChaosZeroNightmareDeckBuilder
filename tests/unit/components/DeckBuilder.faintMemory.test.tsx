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
import { render, act, screen } from '@testing-library/react';
import { useState } from 'react';
import { Deck, JobType } from '@/types';

const {
  mockCalculateFaintMemory,
  mockRouterPush,
  mockShareDeckHandler,
  mockExportDeckImageHandler,
  mockSetLoadOpen,
  mockHandleSaveDeck,
  mockOpenLoadDialog,
  mockHandleLoadDeck,
  mockHandleDeleteSaved,
  mockValidateEquipment,
} = vi.hoisted(() => ({
  mockCalculateFaintMemory: vi.fn(),
  mockRouterPush: vi.fn(),
  mockShareDeckHandler: vi.fn(),
  mockExportDeckImageHandler: vi.fn(),
  mockSetLoadOpen: vi.fn(),
  mockHandleSaveDeck: vi.fn(),
  mockOpenLoadDialog: vi.fn(),
  mockHandleLoadDeck: vi.fn(),
  mockHandleDeleteSaved: vi.fn(),
  mockValidateEquipment: vi.fn(),
}));

// ------------------------------------------------------------------
// 最小限のモックデッキ
// ------------------------------------------------------------------
function createMockDeck(): Deck {
  return {
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
    selectedMutationCoreId: null,
  };
}

const mockDeck = createMockDeck();

const mockStore: { deck: Deck | null; [key: string]: unknown } = {
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
  useRouter: () => ({ push: mockRouterPush }),
}));

vi.mock('@/hooks/useShareDeck', () => ({
  useShareDeck: () => ({ isSharing: false, handleShareDeck: mockShareDeckHandler }),
}));

vi.mock('@/hooks/useExportDeckImage', () => ({
  useExportDeckImage: () => ({ isExporting: false, handleExportDeckImage: mockExportDeckImageHandler }),
}));

vi.mock('@/hooks/useDeckSaveLoad', () => ({
  useDeckSaveLoad: () => ({
    savedList: [],
    loadOpen: false,
    setLoadOpen: mockSetLoadOpen,
    handleSaveDeck: mockHandleSaveDeck,
    openLoadDialog: mockOpenLoadDialog,
    handleLoadDeck: mockHandleLoadDeck,
    handleDeleteSaved: mockHandleDeleteSaved,
  }),
}));

vi.mock('@/hooks/useDeckBuilderAlerts', () => ({ useDeckBuilderAlerts: vi.fn() }));
vi.mock('@/hooks/useDeckBuilderInitialization', () => ({ useDeckBuilderInitialization: vi.fn() }));
vi.mock('@/hooks/useDeckShareLoader', () => ({ useDeckShareLoader: vi.fn() }));
vi.mock('@/hooks/useEquipmentValidation', () => ({
  useEquipmentValidation: () => mockValidateEquipment,
}));
vi.mock('@/hooks/useLoadedDeckSync', () => ({ useLoadedDeckSync: vi.fn() }));

vi.mock('@/lib/card', () => ({
  CHARACTERS: [],
  EQUIPMENT: {},
}));

vi.mock('@/lib/calculateFaintMemory', () => ({
  calculateFaintMemory: mockCalculateFaintMemory,
}));

let latestDeckWorkspaceProps: Record<string, unknown> | null = null;
vi.mock('@/components/deck-builder', () => ({
  CardCatalogSection: () => <div data-testid="card-catalog" />,
  DeckBuilderHeader: () => <div data-testid="deck-builder-header" />,
  DeckWorkspace: (props: { faintMemoryPoints: number }) => {
    latestDeckWorkspaceProps = props as unknown as Record<string, unknown>;
    return <div data-testid="deck-workspace">{props.faintMemoryPoints}</div>;
  },
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
    mockStore.deck = createMockDeck();
    mockCalculateFaintMemory.mockReturnValue(123);
    mockValidateEquipment.mockReturnValue(true);
    latestDeckWorkspaceProps = null;
  });

  it('デッキが変わらない再レンダーでは calculateFaintMemory を1回しか呼ばない', async () => {
    const { DeckBuilder } = await import('@/components/DeckBuilder');

    let forceRerender!: () => void;

    function Wrapper() {
      const [, setTick] = useState(0);
      forceRerender = () => setTick((t) => t + 1);
      return <DeckBuilder />;
    }

    render(<Wrapper />);

    expect(mockCalculateFaintMemory).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('deck-workspace').textContent).toBe('123');

    act(() => {
      forceRerender();
    });

    // useMemo により再計算は抑制され、依然 1 回のみであること
    // (useMemo なしの場合は 2 回になるためこのアサーションが FAIL する)
    expect(mockCalculateFaintMemory).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('deck-workspace').textContent).toBe('123');
  });

  it('デッキが変わった再レンダーでは calculateFaintMemory を再計算する', async () => {
    mockCalculateFaintMemory.mockReturnValueOnce(123).mockReturnValueOnce(456);

    const { DeckBuilder } = await import('@/components/DeckBuilder');

    let forceRerender!: () => void;

    function Wrapper() {
      const [, setTick] = useState(0);
      forceRerender = () => setTick((t) => t + 1);
      return <DeckBuilder />;
    }

    render(<Wrapper />);

    expect(screen.getByTestId('deck-workspace').textContent).toBe('123');

    act(() => {
      mockStore.deck = { ...createMockDeck(), name: 'updated-deck' };
      forceRerender();
    });

    expect(mockCalculateFaintMemory).toHaveBeenCalledTimes(2);
    expect(screen.getByTestId('deck-workspace').textContent).toBe('456');
  });

  it('主要コールバックが正しくストア/ハンドラーに接続される', async () => {
    mockStore.deck = {
      ...createMockDeck(),
      character: { id: 'char-1', name: 'Char', rarity: '★4', job: JobType.STRIKER, startingCards: [], hiramekiCards: [] },
    };

    const { DeckBuilder } = await import('@/components/DeckBuilder');
    render(<DeckBuilder />);

    expect(latestDeckWorkspaceProps).not.toBeNull();

    const props = latestDeckWorkspaceProps as {
      onDeckNameChange: (value: string) => void;
      onSave: () => void;
      onLoad: () => void;
      onShare: () => void;
      onExport: () => void;
      onClear: () => void;
      onEgoLevelChange: (level: number) => void;
      onTogglePotential: () => void;
      onEquipmentSelect: (equipment: unknown, type?: 'weapon' | 'armor' | 'pendant') => void;
      onRemoveCard: (deckId: string) => void;
      onCopyCard: (deckId: string) => void;
      onConvertCard: (deckId: string, targetCard: { id: string }, options?: { asExclusion?: boolean }) => void;
    };

    act(() => {
      props.onDeckNameChange('new-name');
      props.onSave();
      props.onLoad();
      props.onShare();
      props.onExport();
      props.onClear();
      props.onEgoLevelChange(3);
      props.onTogglePotential();
      props.onEquipmentSelect({ id: 'eq-1' }, 'weapon');
      props.onEquipmentSelect({ id: 'eq-1' });
      props.onRemoveCard('deck-card-1');
      props.onCopyCard('deck-card-1');
      props.onConvertCard('deck-card-1', { id: 'target-card' }, { asExclusion: true });
    });

    expect(mockStore.setDeck).toHaveBeenCalled();
    expect(mockHandleSaveDeck).toHaveBeenCalledTimes(1);
    expect(mockOpenLoadDialog).toHaveBeenCalledTimes(1);
    expect(mockShareDeckHandler).toHaveBeenCalledTimes(1);
    expect(mockExportDeckImageHandler).toHaveBeenCalledTimes(1);
    expect(mockStore.reset).toHaveBeenCalledTimes(1);
    expect(mockRouterPush).toHaveBeenCalledWith('/');
    expect(mockStore.setEgoLevel).toHaveBeenCalledWith('char-1', 3);
    expect(mockStore.setPotential).toHaveBeenCalledWith(true);
    expect(mockStore.selectEquipment).toHaveBeenCalledWith('weapon', { id: 'eq-1' });
    expect(mockStore.selectEquipment).toHaveBeenCalledTimes(1);
    expect(mockStore.removeCard).toHaveBeenCalledWith('deck-card-1');
    expect(mockStore.copyCard).toHaveBeenCalledWith('deck-card-1');
    expect(mockStore.convertCard).toHaveBeenCalledWith('deck-card-1', 'target-card', { asExclusion: true });
  });

  it('デッキ未読込時は Loading を表示する', async () => {
    mockStore.deck = null;
    const { DeckBuilder } = await import('@/components/DeckBuilder');
    render(<DeckBuilder />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });
});
