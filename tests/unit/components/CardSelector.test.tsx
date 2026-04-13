import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import { CardSelector } from '@/components/CardSelector';

vi.mock('@/lib/card', () => ({
  getCharacterHiramekiCards: () => [],
  getAddableCards: () => [],
  getCardById: (id: string) => {
    if (id === 'persona_01') {
      return {
        id: 'persona_01',
        name: 'Persona',
        type: 'forbidden',
        category: 'attack',
        statuses: [],
        imgUrl: '/persona.png',
        hiramekiVariations: [
          {
            level: 0,
            cost: 1,
            description: 'Persona description',
            statuses: [],
          },
        ],
      };
    }
    return null;
  },
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
      persona_01: {
        name: 'Persona',
        descriptions: {
          0: 'Persona description',
        },
      },
    },
  };

  it('restores removed cards with snapshot state intact', () => {
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
              personaEngravings: [{ id: 'umbra_attack_boost', alignment: 'dark' }],
              godHiramekiType: 'kilken',
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
});
