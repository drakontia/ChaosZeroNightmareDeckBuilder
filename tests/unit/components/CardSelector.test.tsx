import { describe, expect, it, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import { CardSelector } from '@/components/CardSelector';
import { getAddableCards, getCharacterHiramekiCards, getCardById } from '@/lib/card';
import { GodType } from '@/types';

vi.mock('@/lib/card', () => ({
  getCharacterHiramekiCards: vi.fn(() => []),
  getAddableCards: vi.fn(() => []),
  getCardById: vi.fn(() => null),
}));

vi.mock('@/components/CardFrame', () => ({
  CardFrame: (props: any) => <div>{props.nameFallback ?? props.name ?? props.alt}</div>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, onClick, title }: any) => (
    <div role="button" tabIndex={0} onClick={onClick} title={title}>
      {children}
    </div>
  ),
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: any) => <div>{children}</div>,
  AccordionItem: ({ children }: any) => <div>{children}</div>,
  AccordionTrigger: ({ children }: any) => <div>{children}</div>,
  AccordionContent: ({ children }: any) => <div>{children}</div>,
}));

const personaCard = {
  id: 'persona_01',
  name: 'Persona',
  type: 'forbidden',
  category: 'attack',
  statuses: [],
  imgUrl: '/persona.png',
  hiramekiVariations: [{ level: 0, cost: 1, description: 'Persona description', statuses: [] }],
};

const sharedCard = {
  id: 'shared_01',
  name: 'Shared Card',
  type: 'shared',
  category: 'attack',
  statuses: [],
  imgUrl: '/shared.png',
  hiramekiVariations: [{ level: 0, cost: 1, description: 'Shared description', statuses: [] }],
};

const monsterCard = {
  id: 'monster_01',
  name: 'Monster Card',
  type: 'monster',
  category: 'skill',
  statuses: [],
  imgUrl: '/monster.png',
  hiramekiVariations: [{ level: 0, cost: 2, description: 'Monster description', statuses: [] }],
};

const forbiddenCard = {
  id: 'forbidden_01',
  name: 'Forbidden Card',
  type: 'forbidden',
  category: 'upgrade',
  statuses: [],
  imgUrl: '/forbidden.png',
  hiramekiVariations: [{ level: 0, cost: 3, description: 'Forbidden description', statuses: [] }],
};

const hiramekiCard = {
  id: 'hirameki_01',
  name: 'Hirameki Card',
  type: 'shared',
  category: 'attack',
  statuses: [],
  imgUrl: '/hirameki.png',
  hiramekiVariations: [{ level: 0, cost: 1, description: 'Hirameki description', statuses: [] }],
};

describe('CardSelector', () => {
  const messages = {
    card: {
      title: 'Cards',
      sharedCards: 'Shared Cards',
      monsterCards: 'Monster Cards',
      forbiddenCards: 'Season Cards',
      hiramekiCards: 'Hirameki Cards',
      removedCardsSection: 'Removed Cards',
      convertedCardsSection: 'Converted Cards',
      restoreTooltipSuffix: ' to restore to deck',
    },
    category: {
      attack: 'Attack',
      skill: 'Skill',
      upgrade: 'Upgrade',
    },
    character: {
      select: 'Select character',
    },
    status: {},
    cards: {
      persona_01: { name: 'Persona', descriptions: { 0: 'Persona description' } },
      shared_01: { name: 'Shared Card', descriptions: { 0: 'Shared description' } },
      monster_01: { name: 'Monster Card', descriptions: { 0: 'Monster description' } },
      forbidden_01: { name: 'Forbidden Card', descriptions: { 0: 'Forbidden description' } },
      hirameki_01: { name: 'Hirameki Card', descriptions: { 0: 'Hirameki description' } },
    },
  };

  beforeEach(() => {
    vi.mocked(getAddableCards).mockReturnValue([]);
    vi.mocked(getCharacterHiramekiCards).mockReturnValue([]);
    vi.mocked(getCardById).mockReturnValue(undefined);
  });

  it('restores removed cards with snapshot state intact', () => {
    vi.mocked(getCardById).mockImplementation((id: string) => {
      if (id === 'persona_01') return personaCard as any;
      return null;
    });

    const onRestoreCard = vi.fn();

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={vi.fn()}
          onRestoreCard={onRestoreCard}
          removedCards={new Map([
            ['persona_01', {
              count: 1,
              selectedHiramekiLevel: 2,
              selectedHiddenHiramekiId: 'hidden_01',
      personaEngravings: [{ id: 'umbra_attack_boost', alignment: 'dark' as const }],
              godHiramekiType: GodType.KILKEN,
              godHiramekiEffectId: 'kilken_01',
              isCopied: true,
              copiedFromCardId: 'persona_00',
            }],
          ])}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getByTitle('Persona to restore to deck'));

    expect(onRestoreCard).toHaveBeenCalledTimes(1);
    expect(onRestoreCard).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'persona_01',
        selectedHiramekiLevel: 2,
        selectedHiddenHiramekiId: 'hidden_01',
        personaEngravings: [{ id: 'umbra_attack_boost', alignment: 'dark' }],
        godHiramekiType: 'kilken',
        godHiramekiEffectId: 'kilken_01',
        isCopied: true,
        copiedFromCardId: 'persona_00',
      })
    );
  });

  it('renders addable SHARED cards in accordion', () => {
    vi.mocked(getAddableCards).mockReturnValue([sharedCard] as any);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Shared Cards')).toBeTruthy();
    expect(screen.getByText('Shared Card')).toBeTruthy();
  });

  it('renders addable MONSTER cards in accordion', () => {
    vi.mocked(getAddableCards).mockReturnValue([monsterCard] as any);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Monster Cards')).toBeTruthy();
    expect(screen.getByText('Monster Card')).toBeTruthy();
  });

  it('renders addable FORBIDDEN cards in accordion', () => {
    vi.mocked(getAddableCards).mockReturnValue([forbiddenCard] as any);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Season Cards')).toBeTruthy();
    expect(screen.getByText('Forbidden Card')).toBeTruthy();
  });

  it('calls onAddCard when an accordion card is clicked', () => {
    vi.mocked(getAddableCards).mockReturnValue([sharedCard] as any);
    const onAddCard = vi.fn();

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={onAddCard}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getByTitle('Shared Card'));
    expect(onAddCard).toHaveBeenCalledWith(sharedCard);
  });

  it('renders character hirameki cards section', () => {
    vi.mocked(getCharacterHiramekiCards).mockReturnValue([hiramekiCard] as any);
    const character = { id: 'char_01', name: 'Character', job: 'warrior' };

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={character as any}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Hirameki Cards')).toBeTruthy();
    expect(screen.getByText('Hirameki Card')).toBeTruthy();
  });

  it('renders convertedCards section with ConvertedCardEntry object', () => {
    vi.mocked(getCardById).mockImplementation((id: string) => {
      if (id === 'shared_01') return sharedCard as any;
      return null;
    });

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map([
            ['shared_01', {
              convertedToId: 'monster_01',
              selectedHiramekiLevel: 1,
              selectedHiddenHiramekiId: null,
              personaEngravings: [],
              godHiramekiType: null,
              godHiramekiEffectId: null,
              isCopied: false,
              copiedFromCardId: undefined,
            }],
          ])}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Converted Cards')).toBeTruthy();
    expect(screen.getByText('Shared Card')).toBeTruthy();
  });

  it('renders convertedCards section with string entry (legacy format)', () => {
    vi.mocked(getCardById).mockImplementation((id: string) => {
      if (id === 'shared_01') return sharedCard as any;
      return null;
    });

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map([['shared_01', 'monster_01']])}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Converted Cards')).toBeTruthy();
    expect(screen.getByText('Shared Card')).toBeTruthy();
  });

  it('filters accordion cards by searchQuery', () => {
    vi.mocked(getAddableCards).mockReturnValue([sharedCard, monsterCard] as any);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery="Shared"
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Shared Cards')).toBeTruthy();
    expect(screen.queryByText('Monster Cards')).toBeNull();
  });

  it('shows select character message when no character and no hirameki cards', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Select character')).toBeTruthy();
  });

  it('hides hirameki card that is already in presentHiramekiIds', () => {
    vi.mocked(getCharacterHiramekiCards).mockReturnValue([hiramekiCard] as any);
    const character = { id: 'char_01', name: 'Character', job: 'warrior' };

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={character as any}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set(['hirameki_01'])}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    expect(screen.queryByText('Hirameki Cards')).toBeNull();
    expect(screen.queryByText('Hirameki Card')).toBeNull();
  });

  it('hides hirameki card whose id is in removedCards keys', () => {
    vi.mocked(getCharacterHiramekiCards).mockReturnValue([hiramekiCard] as any);
    vi.mocked(getCardById).mockReturnValue(undefined);
    const character = { id: 'char_01', name: 'Character', job: 'warrior' };

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={character as any}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map([['hirameki_01', 1]])}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    expect(screen.queryByText('Hirameki Cards')).toBeNull();
    expect(screen.queryByText('Hirameki Card')).toBeNull();
  });

  it('hides hirameki card whose id is in convertedCards keys', () => {
    vi.mocked(getCharacterHiramekiCards).mockReturnValue([hiramekiCard] as any);
    vi.mocked(getCardById).mockReturnValue(undefined);
    const character = { id: 'char_01', name: 'Character', job: 'warrior' };

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={character as any}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map([['hirameki_01', 'other_01']])}
          presentHiramekiIds={new Set()}
          searchQuery=""
        />
      </NextIntlClientProvider>
    );

    expect(screen.queryByText('Hirameki Cards')).toBeNull();
    expect(screen.queryByText('Hirameki Card')).toBeNull();
  });

  it('filters accordion cards by description via searchQuery', () => {
    vi.mocked(getAddableCards).mockReturnValue([sharedCard, monsterCard] as any);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery="Monster description"
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Monster Card')).toBeTruthy();
    expect(screen.queryByText('Shared Card')).toBeNull();
  });

  it('filters accordion cards by category via searchQuery', () => {
    vi.mocked(getAddableCards).mockReturnValue([sharedCard, forbiddenCard] as any);

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={null}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery="Upgrade"
        />
      </NextIntlClientProvider>
    );

    // forbiddenCard has category 'upgrade' → should appear
    expect(screen.getByText('Forbidden Card')).toBeTruthy();
    // sharedCard has category 'attack' → should not appear
    expect(screen.queryByText('Shared Card')).toBeNull();
  });

  it('filters hirameki cards by searchQuery', () => {
    vi.mocked(getCharacterHiramekiCards).mockReturnValue([hiramekiCard, sharedCard] as any);
    const character = { id: 'char_01', name: 'Character', job: 'warrior' };

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <CardSelector
          character={character as any}
          onAddCard={vi.fn()}
          onRestoreCard={vi.fn()}
          removedCards={new Map()}
          convertedCards={new Map()}
          presentHiramekiIds={new Set()}
          searchQuery="Hirameki"
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Hirameki Card')).toBeTruthy();
    expect(screen.queryByText('Shared Card')).toBeNull();
  });
});
