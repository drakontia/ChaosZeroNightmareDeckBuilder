import { CardType, type CznCard } from "@/types";

const LEGACY_CARD_IMAGE_PREFIX = "/images/cards/";

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

type CardImageFolder = "character" | "common" | "monster" | "season1" | "season2" | "season3" | "season4";

export const getCardImageFolder = (cardId: string, cardType: CardType): CardImageFolder => {
  if (cardType === CardType.CHARACTER) {
    return "character";
  }

  if (cardType === CardType.MONSTER) {
    return "monster";
  }

  if (SEASON_2_CARD_IDS.has(cardId)) {
    return "season2";
  }

  if (SEASON_3_CARD_IDS.has(cardId)) {
    return "season3";
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
  const folder = getCardImageFolder(cardId, cardType);

  return `${LEGACY_CARD_IMAGE_PREFIX}${folder}/${fileName}`;
};

export const withOrganizedCardImage = <T extends CznCard>(card: T): T => ({
  ...card,
  imgUrl: getOrganizedCardImagePath(card.id, card.type, card.imgUrl),
});
