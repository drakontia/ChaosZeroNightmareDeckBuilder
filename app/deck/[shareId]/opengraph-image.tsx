import { getTranslations } from 'next-intl/server';
import { decodeDeckShare } from '@/lib/deck-share';
import { calculateFaintMemory } from "@/lib/calculateFaintMemory";
import { resolveLocale } from '@/i18n/locale';
import { cookies, headers } from 'next/headers';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/svg+xml';
const MAX_CARD_NAMES = 8;

const escapeSvgText = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

// Next.js 16 OG Image Route - default export関数でparamsを受け取る
export default async function Image({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  try {
    const { shareId } = await params;

    if (!shareId) {
      console.error('[OG Image] No shareId in params');
      return new Response('Invalid request', { status: 400 });
    }
    const deck = decodeDeckShare(shareId);

    if (!deck) {
      console.error('[OG Image] Failed to decode deck share:', shareId);
      return new Response('Deck not found', { status: 404 });
    }

    const cookieStore = await cookies();
    const requestHeaders = await headers();
    const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
    const locale = resolveLocale({
      cookieLocale: localeCookie,
      acceptLanguage: requestHeaders.get('accept-language'),
    });

    const t = await getTranslations({ locale });

    const deckName = deck.name || t('deck.noDeck');
    const characterName = deck.character?.name
      ? t(`character.${deck.character.id}`)
      : t('character.select');
    const cardCount = deck.cards.length;
    const createdDate = new Date(deck.createdAt).toLocaleDateString(locale, {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });

    // Use existing faint memory calculation logic
    const faintMemoryPoints = calculateFaintMemory(deck);

    const labels = {
      title: t('app.title'),
      shareCardUnit: t('deck.shareCardUnit'),
      cardsLabel: t('deck.totalCards'),
      faintMemoryLabel: t('character.faintMemory'),
      createdDateLabel: t('deck.createdDate'),
    };
    const cardNames = deck.cards
      .slice(0, MAX_CARD_NAMES)
      .map((card) => escapeSvgText(card.name))
      .filter((name) => name.length > 0);
    const moreCardsCount = Math.max(deck.cards.length - MAX_CARD_NAMES, 0);
    const cardListMarkup = cardNames
      .map(
        (name, index) => `
        <text x="700" y="${224 + index * 36}" fill="#E5E7EB" font-size="24" font-family="system-ui">${index + 1}. ${name}</text>
      `
      )
      .join('');

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#111827" />
            <stop offset="100%" stop-color="#1f2937" />
          </linearGradient>
          <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#38BDF8" />
            <stop offset="100%" stop-color="#F59E0B" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="#F8FAFC" />
        <rect x="40" y="36" width="1120" height="72" rx="20" fill="#ffffff" />
        <rect x="58" y="52" width="40" height="40" rx="12" fill="#0F172A" />
        <path d="M72 61 L87 84" stroke="#F59E0B" stroke-width="5" stroke-linecap="round" />
        <path d="M69 67 H84 C89 67 93 71 93 76 C93 81 89 85 84 85 H69 Z" fill="#38BDF8" fill-opacity="0.9" />
        <text x="116" y="67" fill="#0F172A" font-size="24" font-family="system-ui" font-weight="700">${escapeSvgText(labels.title)}</text>
        <text x="116" y="93" fill="#64748B" font-size="18" font-family="system-ui">${escapeSvgText(characterName)}</text>
        <rect x="40" y="132" width="1120" height="410" rx="24" fill="url(#bg)" />
        <circle cx="1030" cy="190" r="180" fill="#38BDF8" fill-opacity="0.08" />
        <circle cx="960" cy="410" r="140" fill="#F59E0B" fill-opacity="0.08" />
        <rect x="72" y="182" width="10" height="214" rx="5" fill="url(#accent)" />
        <text x="104" y="214" fill="#93C5FD" font-size="22" font-family="system-ui" font-weight="700">SHARED DECK</text>
        <text x="104" y="270" fill="#ffffff" font-size="52" font-family="system-ui" font-weight="700">${escapeSvgText(deckName)}</text>
        <text x="104" y="320" fill="#CBD5E1" font-size="28" font-family="system-ui">${escapeSvgText(characterName)}</text>
        <text x="104" y="392" fill="#ffffff" font-size="28" font-family="system-ui">${escapeSvgText(`${labels.cardsLabel}: ${cardCount}${labels.shareCardUnit}`)}</text>
        <text x="104" y="436" fill="#ffffff" font-size="28" font-family="system-ui">${escapeSvgText(`${labels.faintMemoryLabel}: ${faintMemoryPoints}pt`)}</text>
        <text x="104" y="480" fill="#CBD5E1" font-size="24" font-family="system-ui">${escapeSvgText(`${labels.createdDateLabel}: ${createdDate}`)}</text>
        <rect x="676" y="176" width="436" height="322" rx="22" fill="rgba(15,23,42,0.58)" stroke="rgba(148,163,184,0.32)" />
        <text x="700" y="214" fill="#F8FAFC" font-size="24" font-family="system-ui" font-weight="700">Deck Cards</text>
        ${cardListMarkup}
        ${moreCardsCount > 0 ? `<text x="700" y="${224 + cardNames.length * 36}" fill="#94A3B8" font-size="20" font-family="system-ui">+${moreCardsCount} more</text>` : ''}
        <rect x="40" y="562" width="1120" height="28" rx="14" fill="#E2E8F0" />
        <rect x="40" y="562" width="${Math.min(1120, Math.max(160, cardCount * 42))}" height="28" rx="14" fill="url(#accent)" />
        <text x="40" y="620" fill="#64748B" font-size="20" font-family="system-ui">${escapeSvgText(labels.title)}</text>
        <text x="1010" y="620" fill="#64748B" font-size="20" font-family="system-ui">${escapeSvgText(createdDate)}</text>
      </svg>
    `;

    return new Response(svg, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('[OG Image] Error generating image:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
