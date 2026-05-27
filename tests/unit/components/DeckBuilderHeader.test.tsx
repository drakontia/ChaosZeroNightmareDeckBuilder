import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeckBuilderHeader } from '@/components/deck-builder/DeckBuilderHeader';

vi.mock('next/link', () => ({
  default: ({ href, children, target, rel, 'data-testid': dataTestId, 'aria-label': ariaLabel }: any) => (
    <a href={href} target={target} rel={rel} data-testid={dataTestId} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, className }: any) => (
    <img src={src} alt={alt} width={width} height={height} className={className} />
  ),
}));

vi.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));

describe('DeckBuilderHeader', () => {
  const defaultProps = {
    locale: 'ja',
    title: 'テストタイトル',
    description: 'テスト説明',
  };

  it('タイトルと説明が表示される', () => {
    render(<DeckBuilderHeader {...defaultProps} />);
    expect(screen.getByText('テストタイトル')).toBeDefined();
    expect(screen.getByText('テスト説明')).toBeDefined();
  });

  it('Xアイコンリンクが存在する', () => {
    render(<DeckBuilderHeader {...defaultProps} />);
    const xLink = screen.getByTestId('x-icon-link');
    expect(xLink).toBeDefined();
    expect(xLink.getAttribute('href')).toBe('https://x.com/MhdenOfRamuh');
  });

  it('Xアイコンリンクが新しいタブで開く', () => {
    render(<DeckBuilderHeader {...defaultProps} />);
    const xLink = screen.getByTestId('x-icon-link');
    expect(xLink.getAttribute('target')).toBe('_blank');
    expect(xLink.getAttribute('rel')).toContain('noopener');
  });

  it('Xアイコン画像が表示される', () => {
    render(<DeckBuilderHeader {...defaultProps} />);
    const xImage = screen.getByAltText('X (Twitter)');
    expect(xImage).toBeDefined();
    expect(xImage.getAttribute('src')).toContain('x-logo');
  });
});
