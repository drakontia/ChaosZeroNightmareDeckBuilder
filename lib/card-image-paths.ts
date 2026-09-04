import { CardType, type CznCard } from "@/types";
import { SEASON_4_CARD_IDS } from "@/lib/season4";

const LEGACY_CARD_IMAGE_PREFIX = "/images/cards/";

const SEASON_1_CARD_IDS = new Set([
  "forbidden_card_1",
  "forbidden_card_2",
  "forbidden_card_3",
  "forbidden_card_4",
  "forbidden_card_5",
  "forbidden_card_6",
  "forbidden_card_7",
  "forbidden_card_8",
  "forbidden_card_9",
  "forbidden_card_10",
  "forbidden_card_11",
  "forbidden_card_12",
  "forbidden_card_13",
  "forbidden_card_14",
  "forbidden_card_15",
]);

const SEASON_2_CARD_IDS = new Set([
  "spore_harvester",
  "nutrient_absorption",
  "residual_herb",
  "forests_hunger",
  "forgotten_grave",
  "mushroom_ammo",
  "one_with_all",
  "natures_gift",
  "azure_lumen",
  "crimson_lumen",
  "amber_lumen",
  "ebony_lumen",
  "flame_of_eternity",
]);

const SEASON_3_CARD_IDS = new Set([
  "doctrine_of_binding",
  "echoes_of_abundance",
  "persona_of_loss",
  "whispers_of_madness",
  "explosion_of_emotions",
  "resonance_of_truth",
  "inner_awakening",
  "dream_world",
  "the_inverted_messiah",
  "the_other_side_of_nightmares",
  "a_girl_and_her_rotterd_apple",
  "faceless_woman",
]);

type CardImageFolder =
  | "character"
  | "common"
  | "monster"
  | "season1"
  | "season2"
  | "season3"
  | "season4";

export const getCardImageFolder = (cardId: string, cardType: CardType): CardImageFolder => {
  if (cardType === CardType.CHARACTER) {
    return "character";
  }

  if (cardType === CardType.MONSTER) {
    return "monster";
  }

  if (SEASON_1_CARD_IDS.has(cardId)) {
    return "season1";
  }

  if (SEASON_2_CARD_IDS.has(cardId)) {
    return "season2";
  }

  if (SEASON_3_CARD_IDS.has(cardId)) {
    return "season3";
  }

  if (SEASON_4_CARD_IDS.has(cardId)) {
    return "season4";
  }

  return "common";
};

export const getOrganizedCardImagePath = (
  cardId: string,
  cardType: CardType,
  imgUrl?: string,
): string | undefined => {
  if (!imgUrl) {
    return imgUrl;
  }

  if (!imgUrl.startsWith(LEGACY_CARD_IMAGE_PREFIX)) {
    return imgUrl;
  }

  const fileName = imgUrl.slice(LEGACY_CARD_IMAGE_PREFIX.length);
  if (fileName.includes("/")) {
    return imgUrl;
  }

  const folder = getCardImageFolder(cardId, cardType);

  return `${LEGACY_CARD_IMAGE_PREFIX}${folder}/${fileName}`;
};

export const withOrganizedCardImage = <T extends CznCard>(card: T): T => ({
  ...card,
  imgUrl: getOrganizedCardImagePath(card.id, card.type, card.imgUrl),
});
