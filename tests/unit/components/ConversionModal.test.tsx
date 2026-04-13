import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it, vi } from 'vitest';

import { ConversionModal } from '@/components/ConversionModal';
import { CardCategory, CardType } from '@/types';

vi.mock('@/lib/card', () => ({
  getAddableCards: () => [
    {
      id: 'shared_test',
      name: 'Shared Test',
      type: CardType.SHARED,
      category: CardCategory.ATTACK,
      statuses: [],
      hiramekiVariations: [
        {
          level: 0,
          cost: 1,
          description: 'Shared description',
          statuses: [],
        },
      ],
    },
  ],
}));

vi.mock('@/components/CardFrame', () => ({
  CardFrame: (props: { nameFallback?: string; alt?: string }) => (
    <div>{props.nameFallback ?? props.alt}</div>
  ),
}));

vi.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  AccordionContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('ConversionModal', () => {
  const messages = {
    common: {
      convert: '変換',
    },
    card: {
      sharedCards: 'Shared Cards',
      forbiddenCards: 'Season Cards',
    },
    category: {
      attack: 'Attack',
      skill: 'Skill',
      upgrade: 'Upgrade',
    },
    status: {},
    cards: {
      shared_test: {
        name: 'Shared Test',
        descriptions: {
          0: 'Shared description',
        },
      },
      __exclusion__: {
        name: 'Exclude',
        descriptions: {
          0: 'Exclude description',
        },
      },
    },
  };

  it('renders selectable cards as buttons', () => {
    render(
      <NextIntlClientProvider locale="ja" messages={messages}>
        <ConversionModal
          isOpen
          onClose={vi.fn()}
          onSelectCard={vi.fn()}
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByRole('button', { name: 'Shared Test' })).toBeDefined();
  });

  it('selects a card when the tile button is clicked', () => {
    const onSelectCard = vi.fn();
    const onClose = vi.fn();

    render(
      <NextIntlClientProvider locale="ja" messages={messages}>
        <ConversionModal
          isOpen
          onClose={onClose}
          onSelectCard={onSelectCard}
        />
      </NextIntlClientProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Shared Test' }));

    expect(onSelectCard).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'shared_test',
      })
    );
    expect(onClose).toHaveBeenCalled();
  });
});
