import { CznCard } from "@/types";

export const SEASON_4_CARD_IDS = new Set([
  "traitors_execution",
  "mark_of_servitude",
  "kneel_before_me",
  "indiscriminate_slaughter",
  "order_of_dominance",
  "postmortem_analysis",
  "sensory_overload",
  "forbidden_hypothesis",
  "sample_collection",
  "knowledge_addiction",
  "sever_ties",
  "narcissism",
  "its_all_mine",
  "obsession",
  "gilded_nest",
]);

export const isSeason4CardId = (cardId: string): boolean => SEASON_4_CARD_IDS.has(cardId);

export const isSeason4Card = (card: Pick<CznCard, "id">): boolean => isSeason4CardId(card.id);
