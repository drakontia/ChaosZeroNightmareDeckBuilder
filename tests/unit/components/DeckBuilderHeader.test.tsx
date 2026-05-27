import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DeckBuilderHeader } from '@/components/deck-builder/DeckBuilderHeader';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock('@/components/LanguageSwitcher', () => ({
  LanguageSwitcher: () => <div data-testid="language-switcher" />,
}));

describe('DeckBuilderHeader', () => {
  const defaultProps = {
    locale: 'ja',
    title: 'デッキビルダー',
    description: 'テスト説明',
    challengeCheckerLabel: '挑戦課題チェッカー',
  };

  it('タイトルが表示される', () => {
    render(<DeckBuilderHeader {...defaultProps} />);
    expect(screen.getByText('デッキビルダー')).toBeTruthy();
  });

  it('説明が表示される', () => {
    render(<DeckBuilderHeader {...defaultProps} />);
    expect(screen.getByText('テスト説明')).toBeTruthy();
  });

  it('挑戦課題チェッカーへのリンクが表示される', () => {
    render(<DeckBuilderHeader {...defaultProps} />);
    expect(screen.getByText('挑戦課題チェッカー')).toBeTruthy();
  });

  it('挑戦課題チェッカーのリンク先が正しい', () => {
    render(<DeckBuilderHeader {...defaultProps} />);
    const link = screen.getByRole('link', { name: '挑戦課題チェッカー' });
    expect(link.getAttribute('href')).toBe('https://czn-challenge-checker.drakontia.com/');
  });

  it('挑戦課題チェッカーのリンクが新規タブで開く', () => {
    render(<DeckBuilderHeader {...defaultProps} />);
    const link = screen.getByRole('link', { name: '挑戦課題チェッカー' });
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('Sponsorボタンの左に挑戦課題チェッカーリンクがある', () => {
    render(<DeckBuilderHeader {...defaultProps} />);
    const link = screen.getByRole('link', { name: '挑戦課題チェッカー' });
    const sponsor = document.querySelector('iframe[title="Sponsor drakontia"]');
    expect(link).toBeTruthy();
    expect(sponsor).toBeTruthy();
    if (link && sponsor) {
      const position = link.compareDocumentPosition(sponsor);
      // DOCUMENT_POSITION_FOLLOWING (4) = sponsorはリンクの後
      expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
  });
});
