import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CardSelector } from "@/components/CardSelector";
import type { Character, CznCard, Deck, DeckCard } from "@/types";
import { CardType } from "@/types";

const toDeckCard = (card: CznCard): DeckCard => ({
  ...card,
  deckId: `${card.id}_${Date.now()}_${Math.random()}`,
  selectedHiramekiLevel: 0,
  godHiramekiType: null,
  godHiramekiEffectId: null,
  selectedHiddenHiramekiId: null,
});

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
  const presentHiramekiIds = new Set(props.deck.cards.filter((card) => card.type === CardType.CHARACTER).map((card) => card.id));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle>{props.title}</CardTitle>
        <Input type="text" value={props.searchQuery} onChange={(event) => props.onSearchQueryChange(event.target.value)} className="w-32 sm:w-64" placeholder={props.searchLabel} />
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
