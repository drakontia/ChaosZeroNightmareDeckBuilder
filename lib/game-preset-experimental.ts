import { CHARACTERS, getCardById } from "@/lib/card";
import { Deck, DeckCard, GodType } from "@/types";

type ExperimentalPreset = {
  characterId: string;
  includedCardIds: string[];
  levels?: Record<string, number>;
  hidden?: Record<string, string>;
  gods?: Record<string, { type: GodType; effectId: string }>;
  warnings?: string[];
};

export type ExperimentalPresetResult = {
  deck: Deck | null;
  warnings: string[];
};

const PRESET_MAP: Record<string, ExperimentalPreset> = {
  "v6l88OLiNr_Nzwd5bz8N7Hb2ReyrtB0zomKkYPcWHSevgIys0f1EFVQl": { characterId: "arabella", includedCardIds: ["arabella_starting_1", "arabella_starting_2", "arabella_starting_3", "arabella_starting_4", "arabella_hirameki_1", "arabella_hirameki_2", "arabella_hirameki_3", "arabella_hirameki_4"] },
  "v6l88ObiNr_Nzwd5bz8NLA48YeyrtB0zomKkYPcWHSevgIys0f1EFVQl": { characterId: "hilde", includedCardIds: ["hilde_starting_1", "hilde_starting_2", "hilde_starting_3", "hilde_starting_4", "hilde_hirameki_1", "hilde_hirameki_2", "hilde_hirameki_3", "hilde_hirameki_4"] },
  "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0zomKkYPcWHSevgIys0f1EFVQl": { characterId: "fei", includedCardIds: ["fei_starting_1", "fei_starting_2", "fei_starting_3", "fei_starting_4", "fei_hirameki_1", "fei_hirameki_2", "fei_hirameki_3", "fei_hirameki_4"] },
  "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0z4ihbEkamk6ku54O22fuDT9gB4n-w8Xl-0N8": { characterId: "fei", includedCardIds: ["fei_starting_1", "fei_starting_2", "fei_starting_3"] },
  "v6l80O7yNr_dzwd5bz8d-GD2ReVWc5DRSSxVEkamk6kOQERG68jN9zEnZg": { characterId: "fei", includedCardIds: ["fei_starting_2", "fei_starting_3", "fei_starting_4", "fei_hirameki_1", "fei_hirameki_2", "fei_hirameki_3", "fei_hirameki_4"] },
  "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0zomKkYPcWHSevgIys0X3Q6zEnZg": { characterId: "fei", includedCardIds: ["fei_starting_1", "fei_starting_2", "fei_starting_3", "fei_starting_4", "fei_hirameki_1", "fei_hirameki_2", "fei_hirameki_3"] },
  "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0z4iRbEmZCVx1AgOH_5oPYeFnsTkPraSnIcw": { characterId: "fei", includedCardIds: ["fei_starting_1", "fei_starting_2", "fei_starting_3", "fei_starting_4", "fei_hirameki_1", "fei_hirameki_2", "fei_hirameki_3", "fei_hirameki_4"], levels: { fei_starting_4: 1 } },
  "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0z4iRbEmZCV51EgOH_5oPYeFnsTkPraSnIcw": { characterId: "fei", includedCardIds: ["fei_starting_1", "fei_starting_2", "fei_starting_3", "fei_starting_4", "fei_hirameki_1", "fei_hirameki_2", "fei_hirameki_3", "fei_hirameki_4"], levels: { fei_starting_4: 2 } },
  "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0z4iRbEmZCVx1JgOH_5oPYeFnsTkPraSnIcw": { characterId: "fei", includedCardIds: ["fei_starting_1", "fei_starting_2", "fei_starting_3", "fei_starting_4", "fei_hirameki_1", "fei_hirameki_2", "fei_hirameki_3", "fei_hirameki_4"], levels: { fei_starting_4: 3 } },
  "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0z4iRbEmZCV51NgOH_5oPYeFnsTkPraSnIcw": { characterId: "fei", includedCardIds: ["fei_starting_1", "fei_starting_2", "fei_starting_3", "fei_starting_4", "fei_hirameki_1", "fei_hirameki_2", "fei_hirameki_3", "fei_hirameki_4"], levels: { fei_starting_4: 4 } },
  "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0z4iRbEmZCVx1OgOH_5oPYeFnsTkPraSnIcw": { characterId: "fei", includedCardIds: ["fei_starting_1", "fei_starting_2", "fei_starting_3", "fei_starting_4", "fei_hirameki_1", "fei_hirameki_2", "fei_hirameki_3", "fei_hirameki_4"], levels: { fei_starting_4: 5 } },
  "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0z4iRbEmYwmFF-pWcr8mGyIi5tnJK-fLB3c94": { characterId: "fei", includedCardIds: ["fei_starting_1", "fei_starting_2", "fei_starting_3", "fei_starting_4", "fei_hirameki_1", "fei_hirameki_2", "fei_hirameki_3", "fei_hirameki_4"], hidden: { fei_starting_4: "hiddenhirameki_01" }, warnings: ["隠しヒラメキ効果IDは暫定値です。"] },
  "v6l80O7yNr_Nzwd5bz8d-GD2ReyrtB0zwiRbEmZCVx1AgEEpDGY5zpqpqk9i5CntOFqFwQVIwqanS3gAkqZ9Jw": { characterId: "fei", includedCardIds: ["fei_starting_1", "fei_starting_2", "fei_starting_3", "fei_starting_4", "fei_hirameki_1", "fei_hirameki_2", "fei_hirameki_3", "fei_hirameki_4"], levels: { fei_starting_4: 1 }, gods: { fei_starting_4: { type: GodType.KILKEN, effectId: "godhirameki_1" } }, warnings: ["神ヒラメキの神/効果は暫定値です。"] },
};

const toDeckCard = (cardId: string, index: number, preset: ExperimentalPreset): DeckCard | null => {
  const card = getCardById(cardId);
  if (!card) return null;
  const god = preset.gods?.[cardId];
  return {
    ...card,
    deckId: `game-preset-${index}-${card.id}`,
    selectedHiramekiLevel: preset.levels?.[cardId] ?? 0,
    godHiramekiType: god?.type ?? null,
    godHiramekiEffectId: god?.effectId ?? null,
    selectedHiddenHiramekiId: preset.hidden?.[cardId] ?? null,
  };
};

export function decodeExperimentalGamePreset(rawCode: string): ExperimentalPresetResult {
  const code = rawCode.trim();
  const preset = PRESET_MAP[code];
  if (!preset) {
    return { deck: null, warnings: [] };
  }

  const character = CHARACTERS.find((item) => item.id === preset.characterId) ?? null;
  if (!character) {
    return { deck: null, warnings: [] };
  }

  const cards = preset.includedCardIds
    .map((id, index) => toDeckCard(id, index, preset))
    .filter((item): item is DeckCard => Boolean(item));

  return {
    deck: {
      name: "Imported game preset",
      character,
      equipment: {
        weapon: { item: null, refinement: null, godHammerEquipmentId: null, engravingId: null },
        armor: { item: null, refinement: null, godHammerEquipmentId: null, engravingId: null },
        pendant: { item: null, refinement: null, godHammerEquipmentId: null, engravingId: null },
      },
      cards,
      egoLevel: 0,
      hasPotential: false,
      createdAt: new Date(),
      removedCards: new Map(),
      copiedCards: new Map(),
      convertedCards: new Map(),
    },
    warnings: preset.warnings ?? [],
  };
}
