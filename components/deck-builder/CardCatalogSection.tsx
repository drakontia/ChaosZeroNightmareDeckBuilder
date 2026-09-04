import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CardSelector } from "@/components/CardSelector";
import type { Character, CznCard, Deck, DeckCard } from "@/types";
import { CardType } from "@/types";
import { isSeason4CardId } from "@/lib/season4";
import { getSeason4BaseStatus, normalizeSeason4SelectedStatuses } from "@/lib/season4";

const toDeckCard = (card: CznCard): DeckCard => {
  const isSeason4 = isSeason4CardId(card.id);
  const baseStatus = getSeason4BaseStatus(card);
  return {
    ...card,
    deckId: `${card.id}_${Date.now()}_${Math.random()}`,
    selectedHiramekiLevel: 0,
    godHiramekiType: null,
    godHiramekiEffectId: null,
    selectedHiddenHiramekiId: null,
    selectedSeasonLevel: isSeason4 ? 1 : undefined,
    selectedSeasonStatuses: isSeason4
      ? normalizeSeason4SelectedStatuses(undefined, baseStatus)
      : undefined,
  };
};

interface CardCatalogSectionProps {
  deck: Deck;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  searchLabel: string;
  title: string;
  onAddCard: (card: DeckCard) => void;
  onRestoreCard: (card: DeckCard) => void;
}

export function CardCatalogSection(props: CardCatalogSectionProps) {
  const presentHiramekiIds = new Set(
    props.deck.cards
      .filter((card) => card.type === CardType.CHARACTER || card.id.startsWith("persona_"))
      .map((card) => card.id),
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle>{props.title}</CardTitle>
        <Input
          type="text"
          value={props.searchQuery}
          onChange={(event) => props.onSearchQueryChange(event.target.value)}
          className="w-32 sm:w-64"
          placeholder={props.searchLabel}
        />
      </CardHeader>
      <CardContent className="p-4 lg:p-6 pt-2">
        <CardSelector
          character={props.deck.character as Character | null}
          onAddCard={(card) => props.onAddCard(toDeckCard(card))}
          onRestoreCard={props.onRestoreCard}
          removedCards={props.deck.removedCards}
          convertedCards={props.deck.convertedCards}
          presentHiramekiIds={presentHiramekiIds}
          searchQuery={props.searchQuery}
        />
      </CardContent>
    </Card>
  );
}
