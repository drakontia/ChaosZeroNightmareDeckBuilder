import { CardType, DeckCard, CardStatus, CardCategory } from "@/types";
import { GOD_HIRAMEKI_EFFECTS } from "@/lib/god-hirameki";
import { HIDDEN_HIRAMEKI_EFFECTS } from "@/lib/hidden-hirameki";
import { getCardById } from "@/lib/card";

// Helper function to get card info based on hirameki level and god hirameki
export function getCardInfo(
  card: DeckCard,
  egoLevel: number = 0,
  hasPotential: boolean = false,
  convertedCards?: Map<string, string>
): {
  name: string;
  cost: number | "X";
  description: string;
  category: CardCategory;
  statuses?: CardStatus[]; // Return raw status array for translation
} {
  // If this card has been converted, use the target card's variations for info
  const convertedId = convertedCards?.get(card.id);
  const baseCard = convertedId ? (getCardById(convertedId) ?? card) : card;

  // Regular hirameki handling (with hidden hirameki as additional effect)
  const variation = baseCard.hiramekiVariations[card.selectedHiramekiLevel] || baseCard.hiramekiVariations[0];
  
  const name = variation.name ?? baseCard.name;
  let cost = variation.cost;
  let description = variation.description;
  const category = variation.category ?? baseCard.category;
  const statuses = (variation.statuses && variation.statuses.length > 0)
    ? variation.statuses
    : (baseCard.statuses && baseCard.statuses.length > 0 ? baseCard.statuses : undefined);

  // Apply hidden hirameki if present and at base level (Lv0 only)
  if (card.selectedHiddenHiramekiId && card.selectedHiramekiLevel === 0) {
    const hiddenEffect = HIDDEN_HIRAMEKI_EFFECTS.find(e => e.id === card.selectedHiddenHiramekiId);
    if (hiddenEffect) {
      // Append hidden effect to description
      description = `${description}\n${hiddenEffect.additionalEffect}`;
      // Apply cost modifier if present
      if (hiddenEffect.costModifier !== undefined && typeof cost === 'number') {
        cost = cost + hiddenEffect.costModifier;
      }
    }
  }

  // Apply ego level variations
  if (variation.egoVariations && variation.egoVariations[egoLevel]) {
    const egoVar = variation.egoVariations[egoLevel];
    description = egoVar.description;
    if (egoVar.cost !== undefined) {
      cost = egoVar.cost;
    }
  }

  // Apply potential variation
  if (hasPotential && variation.potentialVariation) {
    description = variation.potentialVariation.description;
    if (variation.potentialVariation.cost !== undefined) {
      cost = variation.potentialVariation.cost;
    }
  }

  // Apply god hirameki if active and an effect is selected
  if (card.godHiramekiType && card.godHiramekiEffectId && !card.isBasicCard) {
    const effect = GOD_HIRAMEKI_EFFECTS.find(e => e.id === card.godHiramekiEffectId);
    if (effect) {
      description = `${description}\n${effect.additionalEffect}`;
      if (effect.costModifier !== undefined && typeof cost === "number") {
        cost += effect.costModifier;
      }
    }
  }

  // Ensure cost is never negative
  if (typeof cost === "number" && cost < 0) {
    cost = 0;
  }

  return { name, cost, description, category, statuses };
}

// Sort cards by type: Character (Starting -> Hirameki) -> Shared -> Monster -> Forbidden
export function sortDeckCards(cards: DeckCard[]): DeckCard[] {
  const typeOrder: Record<CardType, number> = {
    [CardType.CHARACTER]: 1,
    [CardType.SHARED]: 2,
    [CardType.MONSTER]: 3,
    [CardType.FORBIDDEN]: 4
  };

  return [...cards].sort((a, b) => {
    // First sort by card type
    const typeComparison = typeOrder[a.type] - typeOrder[b.type];
    if (typeComparison !== 0) {
      return typeComparison;
    }

    // For character cards, sort by starting card vs hirameki card
    if (a.type === CardType.CHARACTER && b.type === CardType.CHARACTER) {
      // Starting cards come before hirameki cards
      const aIsStarting = a.isStartingCard ?? false;
      const bIsStarting = b.isStartingCard ?? false;
      
      if (aIsStarting && !bIsStarting) return -1;
      if (!aIsStarting && bIsStarting) return 1;
    }

    // Within same type and subtype, maintain stable order by id
    return a.id.localeCompare(b.id);
  });
}