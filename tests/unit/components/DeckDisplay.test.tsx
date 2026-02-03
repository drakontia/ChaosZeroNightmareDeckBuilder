import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeckDisplay } from '@/components/DeckDisplay';
import { CardType, CardCategory, CardStatus, DeckCard, GodType } from '@/types';
import { NextIntlClientProvider } from 'next-intl';
import { GOD_HIRAMEKI_EFFECTS } from '@/lib/god-hirameki';
import { HIDDEN_HIRAMEKI_EFFECTS } from '@/lib/hidden-hirameki';

// Mock components
let cardFrameProps: any[] = [];

vi.mock('@/components/CardFrame', () => ({
  CardFrame: (props: any) => (
    <div data-testid="card-frame" data-props-count={cardFrameProps.push(props)}>
      <div data-testid="card-name">{props.name}</div>
      {props.isCopied && <div data-testid="is-copied">Flipped</div>}
      {props.statuses && props.statuses.length > 0 && (
        <div data-testid="statuses">{props.statuses.join(', ')}</div>
      )}
      {props.godEffectId && <div data-testid="god-effect">{props.godEffectId}</div>}
      {props.hiddenEffectId && <div data-testid="hidden-effect">{props.hiddenEffectId}</div>}
      {/* Render controls to allow tests to detect them */}
      <div data-testid="left-controls">{props.leftControls}</div>
      <div data-testid="right-controls">{props.rightControls}</div>
    </div>
  )
}));

vi.mock('@/components/HiramekiControls', () => ({
  HiramekiControls: () => <div data-testid="hirameki-controls">Controls</div>
}));

vi.mock('@/components/CardActionsMenu', () => ({
  CardActionsMenu: () => <div data-testid="card-actions">Actions</div>
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div data-testid="card-container">{children}</div>
}));

describe('DeckDisplay - Copied Card Feature', () => {
  const messages = {
    deck: {
      selectCharacterHint: 'Select a character'
    },
    category: {
      attack: 'Attack',
      skill: 'Skill',
      upgrade: 'Upgrade'
    },
    card: {
      hirameki: 'Hirameki',
      godSelect: 'God Select',
      hiddenHirameki: 'Hidden Hirameki'
    },
    status: {
      unique: 'Unique',
      copied: 'Copied',
      exhaust: 'Exhaust'
    },
    cards: {
      'test-card': {
        name: 'Test Card',
        descriptions: {
          0: 'Base description'
        }
      }
    }
  };

  const createMockCard = (overrides?: Partial<DeckCard>): DeckCard => ({
    id: 'test-card',
    deckId: 'deck-1',
    name: 'Test Card',
    type: CardType.SHARED,
    category: CardCategory.ATTACK,
    statuses: [],
    hiramekiVariations: [
      {
        level: 0,
        cost: 2,
        description: 'Base description',
        statuses: []
      }
    ],
    selectedHiramekiLevel: 0,
    godHiramekiType: null,
    godHiramekiEffectId: null,
    selectedHiddenHiramekiId: null,
    isBasicCard: false,
    isCopied: false,
    ...overrides
  });

  const renderWithIntl = (ui: React.ReactElement) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {ui}
      </NextIntlClientProvider>
    );
  };

  const mockHandlers = {
    onRemoveCard: vi.fn(),
    onUndoCard: vi.fn(),
    onCopyCard: vi.fn(),
    onConvertCard: vi.fn(),
    onUpdateHirameki: vi.fn(),
    onSetGodHirameki: vi.fn(),
    onSetGodHiramekiEffect: vi.fn(),
    onSetHiddenHirameki: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    cardFrameProps = [];
  });

  it('should display "copied" status for copied cards', () => {
    const copiedCard = createMockCard({
      deckId: 'deck-copied',
      isCopied: true
    });

    renderWithIntl(
      <DeckDisplay
        cards={[copiedCard]}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    const statuses = screen.getByTestId('statuses');
    expect(statuses.textContent).toContain('Copied');
  });

  it('should render empty state when no cards', () => {
    renderWithIntl(
      <DeckDisplay
        cards={[]}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Select a character')).toBeDefined();
    expect(screen.queryByTestId('card-frame')).toBeNull();
  });

  it('should not display "copied" status for non-copied cards', () => {
    const normalCard = createMockCard({
      deckId: 'deck-normal',
      isCopied: false
    });

    renderWithIntl(
      <DeckDisplay
        cards={[normalCard]}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    const statusElements = screen.queryAllByTestId('statuses');
    if (statusElements.length > 0) {
      statusElements.forEach(element => {
        expect(element.textContent).not.toContain('Copied');
      });
    }
  });

  it('should display "copied" status along with other statuses', () => {
    const copiedCard = createMockCard({
      deckId: 'deck-copied-unique',
      isCopied: true,
      statuses: [CardStatus.UNIQUE, CardStatus.EXHAUST]
    });

    renderWithIntl(
      <DeckDisplay
        cards={[copiedCard]}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    const statuses = screen.getByTestId('statuses');
    expect(statuses.textContent).toContain('Unique');
    expect(statuses.textContent).toContain('Exhaust');
    expect(statuses.textContent).toContain('Copied');
  });

  it('should pass isCopied prop to CardFrame', () => {
    const copiedCard = createMockCard({
      deckId: 'deck-copied',
      isCopied: true
    });

    renderWithIntl(
      <DeckDisplay
        cards={[copiedCard]}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    // CardFrame should indicate the card is flipped
    expect(screen.getByTestId('is-copied')).toBeDefined();
  });

  it('should not pass isCopied as true for non-copied cards', () => {
    const normalCard = createMockCard({
      deckId: 'deck-normal',
      isCopied: false
    });

    renderWithIntl(
      <DeckDisplay
        cards={[normalCard]}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    // CardFrame should not indicate the card is flipped
    expect(screen.queryByTestId('is-copied')).toBeNull();
  });

  it('should display multiple cards with mixed copied status', () => {
    const cards = [
      createMockCard({ deckId: 'deck-1', isCopied: false }),
      createMockCard({ deckId: 'deck-2', isCopied: true }),
      createMockCard({ deckId: 'deck-3', isCopied: false }),
      createMockCard({ deckId: 'deck-4', isCopied: true })
    ];

    renderWithIntl(
      <DeckDisplay
        cards={cards}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    const cardFrames = screen.getAllByTestId('card-frame');
    expect(cardFrames).toHaveLength(4);

    const flippedCards = screen.getAllByTestId('is-copied');
    expect(flippedCards).toHaveLength(2);
  });

  it('shows HiramekiControls for non-character cards with only base variation (SHARED/MONSTER/FORBIDDEN)', () => {
    const shared = createMockCard({ deckId: 'd-shared', type: CardType.SHARED });
    const monster = createMockCard({ deckId: 'd-monster', type: CardType.MONSTER });
    const forbidden = createMockCard({ deckId: 'd-forbidden', type: CardType.FORBIDDEN });

    renderWithIntl(
      <DeckDisplay
        cards={[shared, monster, forbidden]}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    const controls = screen.getAllByTestId('hirameki-controls');
    expect(controls.length).toBe(3);
  });

  it('does NOT show HiramekiControls for character cards with only base variation', () => {
    const charBase: DeckCard = createMockCard({
      deckId: 'd-char-base',
      type: CardType.CHARACTER,
    });

    renderWithIntl(
      <DeckDisplay
        cards={[charBase]}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    expect(screen.queryByTestId('hirameki-controls')).toBeNull();
  });

  it('shows HiramekiControls for character cards that have hirameki variations (>1)', () => {
    const charWithVar: DeckCard = {
      ...createMockCard({ deckId: 'd-char-var' }),
      type: CardType.CHARACTER,
      hiramekiVariations: [
        { level: 0, cost: 2, description: 'Base description', statuses: [] },
        { level: 1, cost: 3, description: 'Lv1 description', statuses: [] },
      ],
    };

    renderWithIntl(
      <DeckDisplay
        cards={[charWithVar]}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    expect(screen.getByTestId('hirameki-controls')).toBeDefined();
  });

  it('should pass hidden/god hirameki effect ids and fallbacks to CardFrame', () => {
    const godEffect = GOD_HIRAMEKI_EFFECTS[0];
    const hiddenEffect = HIDDEN_HIRAMEKI_EFFECTS[0];
    const cardWithEffects = createMockCard({
      deckId: 'deck-effects',
      godHiramekiType: GodType.KILKEN,
      godHiramekiEffectId: godEffect.id,
      selectedHiddenHiramekiId: hiddenEffect.id,
    });

    renderWithIntl(
      <DeckDisplay
        cards={[cardWithEffects]}
        egoLevel={0}
        hasPotential={false}
        {...mockHandlers}
      />
    );

    const lastProps = cardFrameProps[cardFrameProps.length - 1];
    expect(lastProps.godEffectId).toBe(godEffect.id);
    expect(lastProps.godEffectFallback).toBe(godEffect.additionalEffect);
    expect(lastProps.hiddenEffectId).toBe(hiddenEffect.id);
    expect(lastProps.hiddenEffectFallback).toBe(hiddenEffect.additionalEffect);
  });
});
