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

const MAX_CARD_NAMES = 10;

const renderBrandMark = () => (
  <svg
    width="72"
    height="72"
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="4" y="4" width="64" height="64" rx="18" fill="#0F172A" stroke="#E2E8F0" strokeWidth="4" />
    <path
      d="M21 22H39C45.6274 22 51 27.3726 51 34C51 40.6274 45.6274 46 39 46H21V22Z"
      fill="#F8FAFC"
    />
    <path
      d="M31 30H49C54.5228 30 59 34.4772 59 40C59 45.5228 54.5228 50 49 50H31V30Z"
      fill="#38BDF8"
      fillOpacity="0.9"
    />
    <path
      d="M26 19L49 53"
      stroke="#F59E0B"
      strokeWidth="6"
      strokeLinecap="round"
    />
  </svg>
);

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
      updatedLabel: t('deck.createdDate'),
    };
    const cardNames = deck.cards
      .slice(0, MAX_CARD_NAMES)
      .map((card) => card.name)
      .filter((name): name is string => Boolean(name));

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: '100%',
            height: '100%',
            background: '#0f172a',
            overflow: 'hidden',
            fontFamily: 'system-ui',
            color: '#ffffff',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 30%), radial-gradient(circle at bottom left, rgba(245,158,11,0.14), transparent 28%)',
            }}
          />
          <div
            style={{
              display: 'flex',
              position: 'relative',
              justifyContent: 'space-between',
              width: '100%',
              height: '100%',
              padding: '44px',
              gap: '28px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div style={{ display: 'flex', flexShrink: 0 }}>{renderBrandMark()}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', fontSize: 22, color: 'rgba(255,255,255,0.78)' }}>
                      {labels.title}
                    </div>
                    <div style={{ display: 'flex', fontSize: 28, fontWeight: 700 }}>
                      Chaos Zero Nightmare
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', fontSize: 54, fontWeight: 800, lineHeight: 1.1 }}>
                  {deckName}
                </div>
                <div style={{ display: 'flex', fontSize: 28, color: 'rgba(255,255,255,0.88)' }}>
                  {characterName}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginTop: '28px',
                  padding: '24px 28px',
                  borderRadius: '24px',
                  background: 'rgba(15,23,42,0.74)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <div style={{ display: 'flex', fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.76)' }}>
                  Deck Cards
                </div>
                {cardNames.map((name, index) => (
                  <div
                    key={`${name}-${index}`}
                    style={{
                      display: 'flex',
                      fontSize: 22,
                      lineHeight: 1.2,
                      color: 'rgba(255,255,255,0.94)',
                    }}
                  >
                    {`${index + 1}. ${name}`}
                  </div>
                ))}
                {deck.cards.length > MAX_CARD_NAMES ? (
                  <div style={{ display: 'flex', fontSize: 18, color: 'rgba(255,255,255,0.68)' }}>
                    {`+${deck.cards.length - MAX_CARD_NAMES} more`}
                  </div>
                ) : null}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                justifyContent: 'flex-end',
                width: '340px',
                padding: '24px 28px',
                borderRadius: '24px',
                background: 'rgba(15,23,42,0.7)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: 24 }}>
                <span style={{ color: 'rgba(255,255,255,0.72)' }}>{labels.cardsLabel}</span>
                <span>{`${cardCount}${labels.shareCardUnit}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: 24 }}>
                <span style={{ color: 'rgba(255,255,255,0.72)' }}>{labels.faintMemoryLabel}</span>
                <span>{`${faintMemoryPoints}pt`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '24px', fontSize: 20 }}>
                <span style={{ color: 'rgba(255,255,255,0.72)' }}>{labels.updatedLabel}</span>
                <span>{createdDate}</span>
              </div>
            </div>
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
