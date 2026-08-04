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
    };

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#111827" />
            <stop offset="100%" stop-color="#1f2937" />
          </linearGradient>
        </defs>
        <rect width="1200" height="630" fill="#fafafa" />
        <text x="40" y="54" fill="#111827" font-size="28" font-family="system-ui" font-weight="700">${escapeSvgText(deckName)}</text>
        <text x="40" y="96" fill="#6b7280" font-size="22" font-family="system-ui">${escapeSvgText(characterName)}</text>
        <rect x="40" y="132" width="1120" height="410" rx="24" fill="url(#bg)" />
        <text x="80" y="240" fill="#ffffff" font-size="48" font-family="system-ui" font-weight="700">${escapeSvgText(deckName)}</text>
        <text x="80" y="302" fill="rgba(255,255,255,0.88)" font-size="30" font-family="system-ui">${escapeSvgText(characterName)}</text>
        <text x="80" y="380" fill="#ffffff" font-size="28" font-family="system-ui">${escapeSvgText(`${labels.cardsLabel}: ${cardCount}${labels.shareCardUnit}`)}</text>
        <text x="80" y="430" fill="#ffffff" font-size="28" font-family="system-ui">${escapeSvgText(`${labels.faintMemoryLabel}: ${faintMemoryPoints}pt`)}</text>
        <text x="40" y="590" fill="#9ca3af" font-size="20" font-family="system-ui">${escapeSvgText(labels.title)}</text>
        <text x="1030" y="590" fill="#9ca3af" font-size="20" font-family="system-ui">${escapeSvgText(createdDate)}</text>
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
