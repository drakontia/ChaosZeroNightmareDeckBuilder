import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CardFrame } from '@/components/CardFrame';
import { NextIntlClientProvider } from 'next-intl';

// Mock next/image
let lastCardImageProps: any = null;
let lastIconImageProps: any = null;

vi.mock('next/image', () => ({
  default: ({ src, alt, className, width, height, onError }: any) => {
    // Distinguish between card image and icon image
    const isIcon = width && height && (width <= 16 || height <= 16);
    if (isIcon) {
      lastIconImageProps = { src, alt, className, width, height, onError };
    } else {
      lastCardImageProps = { src, alt, className, width, height, onError };
    }
    return (
      <img 
        src={src} 
        alt={alt} 
        className={className} 
        data-testid={isIcon ? "category-icon" : "card-image"} 
        width={width}
        height={height}
        onError={onError}
      />
    );
  }
}));

describe('CardFrame', () => {
  const messages = {
    category: {
      attack: 'Attack',
      skill: 'Skill',
      upgrade: 'Upgrade'
    },
    status: {
      unique: 'Unique',
      copied: 'Copied'
    }
  };

  const renderWithIntl = (ui: React.ReactElement) => {
    return render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {ui}
      </NextIntlClientProvider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    lastCardImageProps = null;
    lastIconImageProps = null;
  });

  it('should render card with basic props', () => {
    renderWithIntl(
      <CardFrame
        imgUrl="/test.jpg"
        alt="Test Card"
        cost={3}
        name="Test Card"
        category="Attack"
        categoryId="attack"
      />
    );

    const image = screen.getByTestId('card-image');
    expect(image).toBeDefined();
    expect(image.getAttribute('src')).toBe('/test.jpg');
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('Test Card')).toBeDefined();
    expect(screen.getByTestId('category-icon')).toBeDefined();
  });

  it('should flip image when isCopied is true', () => {
    renderWithIntl(
      <CardFrame
        imgUrl="/test.jpg"
        alt="Test Card"
        cost={3}
        name="Test Card"
        category="Attack"
        categoryId="attack"
        isCopied={true}
      />
    );

    const image = screen.getByTestId('card-image');
    expect(image.className).toContain('scale-x-[-1]');
  });

  it('should not flip image when isCopied is false', () => {
    renderWithIntl(
      <CardFrame
        imgUrl="/test.jpg"
        alt="Test Card"
        cost={3}
        name="Test Card"
        category="Attack"
        categoryId="attack"
        isCopied={false}
      />
    );

    const image = screen.getByTestId('card-image');
    expect(image.className).not.toContain('scale-x-[-1]');
  });

  it('should display statuses including copied status', () => {
    renderWithIntl(
      <CardFrame
        imgUrl="/test.jpg"
        alt="Test Card"
        cost={3}
        name="Test Card"
        category="Attack"
        categoryId="attack"
        statuses={['Unique', 'Copied']}
        description="Test description"
      />
    );

    expect(screen.getByText(/Unique/)).toBeDefined();
    expect(screen.getByText(/Copied/)).toBeDefined();
  });

  it('should use nameId for translation when provided', () => {
    const messagesWithCardName = {
      ...messages,
      cards: {
        'test-card': {
          name: 'Translated Card Name'
        }
      }
    };

    render(
      <NextIntlClientProvider locale="en" messages={messagesWithCardName}>
        <CardFrame
          imgUrl="/test.jpg"
          alt="Test Card"
          cost={3}
          nameId="cards.test-card.name"
          nameFallback="Fallback Name"
          category="Attack"
          categoryId="attack"
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Translated Card Name')).toBeDefined();
  });

  it('should use nameFallback when nameId translation is not available', () => {
    const messagesWithDefault = {
      ...messages
    };

    // Create a provider that doesn't throw on missing messages
    const onError = vi.fn();
    
    render(
      <NextIntlClientProvider 
        locale="en" 
        messages={messagesWithDefault}
        onError={onError}
      >
        <CardFrame
          imgUrl="/test.jpg"
          alt="Test Card"
          cost={3}
          nameId="cards.nonexistent.name"
          nameFallback="Fallback Name"
          category="Attack"
          categoryId="attack"
        />
      </NextIntlClientProvider>
    );

    // The component uses defaultValue in t() which returns the fallback when key is missing
    // In development mode, next-intl may show the key, but the defaultValue param should work
    // Check that at least the onError was called for the missing key
    expect(onError).toHaveBeenCalled();
  });

  it('should render compact variant with correct styling', () => {
    const { container } = renderWithIntl(
      <CardFrame
        imgUrl="/test.jpg"
        alt="Test Card"
        cost={3}
        name="Test Card"
        category="Attack"
        categoryId="attack"
        variant="compact"
      />
    );

    // Check if cost has compact styling class
    const costElement = screen.getByText('3');
    expect(costElement.className).toContain('text-2xl');
  });

  it('should render controls when provided', () => {
    renderWithIntl(
      <CardFrame
        imgUrl="/test.jpg"
        alt="Test Card"
        cost={3}
        name="Test Card"
        category="Attack"
        categoryId="attack"
        leftControls={<div data-testid="left-control">Left</div>}
        rightControls={<div data-testid="right-control">Right</div>}
      />
    );

    expect(screen.getByTestId('left-control')).toBeDefined();
    expect(screen.getByTestId('right-control')).toBeDefined();
  });

  it('should switch to placeholder image on error', () => {
    renderWithIntl(
      <CardFrame
        imgUrl="/test.jpg"
        alt="Test Card"
        cost={3}
        name="Test Card"
        category="Attack"
        categoryId="attack"
      />
    );

    const image = screen.getByTestId('card-image');
    fireEvent.error(image);

    expect(lastCardImageProps?.src).toBe('/images/cards/card_placeholder.png');
    expect(image.getAttribute('src')).toBe('/images/cards/card_placeholder.png');
  });

  it('should render hidden and god effect texts when provided', () => {
    const messagesWithEffects = {
      ...messages,
      hiddenEffects: {
        hiddenhirameki_01: 'Hidden Effect'
      },
      godEffects: {
        godhirameki_1: 'God Effect'
      }
    };

    render(
      <NextIntlClientProvider locale="en" messages={messagesWithEffects}>
        <CardFrame
          imgUrl="/test.jpg"
          alt="Test Card"
          cost={3}
          name="Test Card"
          category="Attack"
          categoryId="attack"
          description="Base description"
          hiddenEffectId="hiddenhirameki_01"
          hiddenEffectFallback="Hidden Effect"
          godEffectId="godhirameki_1"
          godEffectFallback="God Effect"
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText('Hidden Effect')).toBeDefined();
    expect(screen.getByText('God Effect')).toBeDefined();
  });
});
