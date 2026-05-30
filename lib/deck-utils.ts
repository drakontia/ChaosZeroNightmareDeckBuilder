import { CardType, DeckCard, CardStatus, CardCategory } from "@/types";
import { GOD_HIRAMEKI_EFFECTS } from "@/lib/god-hirameki";
import { HIDDEN_HIRAMEKI_EFFECTS } from "@/lib/hidden-hirameki";
import { getCardById } from "@/lib/card";
import { getPersonaCardPresentation, PersonaPresentationLocalization } from "@/lib/persona";

export interface CardInfoLocalization {
  persona?: PersonaPresentationLocalization;
  translateGodEffect?: (effectId: string, fallback: string) => string;
  translateHiddenEffect?: (effectId: string, fallback: string) => string;
}

// Helper function to get card info based on hirameki level and god hirameki
export function getCardInfo(
  card: DeckCard,
  egoLevel: number = 0,
  hasPotential: boolean = false,
  convertedCards?: Map<string, string>,
  localization?: CardInfoLocalization
): {
  name: string;
  imgUrl?: string;
  cost: number | "X" | "unusable";
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
  let statuses = variation.statuses !== undefined
    ? variation.statuses
    : (baseCard.statuses && baseCard.statuses.length > 0 ? baseCard.statuses : undefined);

  // Apply ego level variations
  if (variation.egoVariations && variation.egoVariations[egoLevel]) {
    const egoVar = variation.egoVariations[egoLevel];
    description = egoVar.description;
    if (egoVar.cost !== undefined) {
      cost = egoVar.cost;
    }
    if (egoVar.statuses !== undefined) {
      statuses = egoVar.statuses;
    }
  }

  // Apply potential variation
  if (hasPotential && variation.potentialVariation) {
    description = variation.potentialVariation.description;
    if (variation.potentialVariation.cost !== undefined) {
      cost = variation.potentialVariation.cost;
    }
  }

  // Apply hidden hirameki if present and at base level (Lv0 only)
  if (card.selectedHiddenHiramekiId && card.selectedHiramekiLevel === 0) {
    const hiddenEffect = HIDDEN_HIRAMEKI_EFFECTS.find(e => e.id === card.selectedHiddenHiramekiId);
    if (hiddenEffect) {
      const hiddenEffectDescription =
        localization?.translateHiddenEffect?.(hiddenEffect.id, hiddenEffect.additionalEffect) ??
        hiddenEffect.additionalEffect;
      description = `${description}\n${hiddenEffectDescription}`;
      if (hiddenEffect.costModifier !== undefined && typeof cost === 'number') {
        cost = cost + hiddenEffect.costModifier;
      }
    }
  }

  // Apply god hirameki if active and an effect is selected
  if (card.godHiramekiType && card.godHiramekiEffectId && !card.isBasicCard) {
    const effect = GOD_HIRAMEKI_EFFECTS.find(e => e.id === card.godHiramekiEffectId);
    if (effect) {
      const godEffectDescription =
        localization?.translateGodEffect?.(effect.id, effect.additionalEffect) ?? effect.additionalEffect;
      description = `${description}\n${godEffectDescription}`;
      if (effect.costModifier !== undefined && typeof cost === "number") {
        cost += effect.costModifier;
      }
    }
  }

  // Ensure cost is never negative
  if (typeof cost === "number" && cost < 0) {
    cost = 0;
  }

  if (card.id.startsWith("persona_")) {
    const personaPresentation = getPersonaCardPresentation({
      baseName: name,
      baseImageUrl: baseCard.imgUrl ?? card.imgUrl ?? "",
      baseCost: cost,
      baseDescription: description,
      baseStatuses: statuses ?? [],
      engravings: card.personaEngravings ?? [],
      category,
      localization: localization?.persona,
    });

    return {
      name: personaPresentation.name,
      imgUrl: personaPresentation.imgUrl,
      cost: personaPresentation.cost,
      description: personaPresentation.description,
      category,
      statuses: personaPresentation.statuses,
    };
  }

  return { name, imgUrl: baseCard.imgUrl ?? card.imgUrl, cost, description, category, statuses };
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
