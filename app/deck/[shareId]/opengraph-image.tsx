import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { decodeDeckShare } from '@/lib/deck-share';
import { calculateFaintMemory } from "@/lib/calculateFaintMemory";
import { resolveLocale } from '@/i18n/locale';
import { cookies, headers } from 'next/headers';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

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

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#fafafa',
            padding: '40px',
            fontFamily: 'system-ui',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              fontSize: 18,
              color: '#6b7280',
              gap: '20px',
              marginBottom: '20px',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: 'bold', color: '#111827' }}>{deckName}</span>
            <span>•</span>
            <span>{characterName}</span>
            <span>•</span>
            <span>{`${cardCount}${labels.shareCardUnit}`}</span>
            <span>•</span>
            <span>{faintMemoryPoints}pt</span>
          </div>

          <div
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
              padding: '24px 32px',
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #111827, #1f2937)',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', fontSize: 36, fontWeight: 700 }}>
              {deckName}
            </div>
            <div style={{ display: 'flex', fontSize: 24, color: 'rgba(255,255,255,0.88)' }}>
              {characterName}
            </div>
            <div style={{ display: 'flex', gap: '24px', fontSize: 22 }}>
              <div style={{ display: 'flex' }}>{`${labels.cardsLabel}: ${cardCount}${labels.shareCardUnit}`}</div>
              <div style={{ display: 'flex' }}>{`${labels.faintMemoryLabel}: ${faintMemoryPoints}pt`}</div>
            </div>
          </div>
          {/* Footer */}
          <div
            style={{
              display: 'flex',
              marginTop: '20px',
              fontSize: 16,
              color: '#9ca3af',
              justifyContent: 'space-between',
            }}
          >
            <span>{labels.title}</span>
            <span>{createdDate}</span>
          </div>
        </div>
      ),
      {
        width: size.width,
        height: size.height,
      }
    );
  } catch (error) {
    console.error('[OG Image] Error generating image:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
