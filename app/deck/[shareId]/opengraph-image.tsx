import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';
import { decodeDeckShare } from '@/lib/deck-share';
import { getCardInfo } from '@/lib/deck-utils';
import { calculateFaintMemory } from "@/lib/calculateFaintMemory";
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
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
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'ja';

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
      character: t('character.title'),
      totalCards: t('deck.totalCards'),
      faintMemory: t('character.faintMemory'),
    };

    // Get ego level and potential from deck
    const egoLevel = deck.egoLevel ?? 0;
    const hasPotential = deck.hasPotential ?? false;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://czn-deck-editor.drakontia.com';

    // Get translated card info with correct costs
    const cardsWithTranslation = deck.cards.slice(0, 12).map((card) => {
      const cardInfo = getCardInfo(card, egoLevel, hasPotential);
      const translatedName = card.name;
      const categoryKey = `category.${card.category.toLowerCase()}`;
      const translatedCategory = t(categoryKey);

      // Convert relative path to absolute URL
      const imgUrl = card.imgUrl
        ? (card.imgUrl.startsWith('http')
          ? card.imgUrl
          : `${baseUrl}${card.imgUrl}`)
        : null;

      const description = cardInfo.description || '';
      const statuses = cardInfo.statuses || [];

      return {
        id: card.id,
        cost: cardInfo.cost,
        translatedName,
        translatedCategory,
        type: card.type,
        imgUrl,
        description,
        statuses,
      };
    });

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
            <span>{cardCount}枚</span>
            <span>•</span>
            <span>{faintMemoryPoints}pt</span>
          </div>

          {/* Card Grid */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              flex: 1,
            }}
          >
            {cardsWithTranslation.map((card, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '165px',
                  height: '248px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {/* Card Image Background */}
                {card.imgUrl && (
                  <img
                    src={card.imgUrl}
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                {/* Gradient Overlay */}
                <div
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.6))',
                  }}
                />
                {/* Card Info Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    padding: '12px',
                    justifyContent: 'space-between',
                  }}
                >
                  {/* Top: Cost + Name */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          fontSize: '32px',
                          fontWeight: 'bold',
                          color: '#ffffff',
                          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                        }}
                      >
                        {card.cost}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#ffffff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {card.translatedName}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.9)',
                            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                          }}
                        >
                          {card.translatedCategory}
                        </div>
                      </div>
                    </div>
                    {/* Statuses */}
                    {card.statuses.length > 0 && (
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px',
                        }}
                      >
                        {card.statuses.map((status: string, idx: number) => (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              fontSize: '9px',
                              padding: '2px 6px',
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              borderRadius: '4px',
                              color: '#ffffff',
                              textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                            }}
                          >
                            {status}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Bottom: Description */}
                  {card.description && (
                    <div
                      style={{
                        display: 'flex',
                        fontSize: '10px',
                        lineHeight: 1.4,
                        color: '#ffffff',
                        textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                        padding: '8px',
                        borderRadius: '4px',
                        maxHeight: '80px',
                        overflow: 'hidden',
                      }}
                    >
                      {card.description.length > 100
                        ? card.description.substring(0, 100) + '...'
                        : card.description}
                    </div>
                  )}
                </div>
              </div>
            ))}
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
