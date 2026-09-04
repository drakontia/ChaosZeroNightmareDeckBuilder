import { CardStatus, CznCard, Season4DesireStatus } from "@/types";

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
  "cutting_loose",
  "driven_hunt",
  "feralization",
  "final_struggle",
  "harrowing_reign",
  "marauders_charge",
  "barrier_utilization",
  "horde_eradication",
  "essence_tracking",
  "refracted_insight",
  "inner_corruption",
  "hand_enthralled_by_light",
  "instinct_resonance",
  "jury_rigged_powder_keg",
  "simulacrums_echo",
]);

export const isSeason4CardId = (cardId: string): boolean => SEASON_4_CARD_IDS.has(cardId);

export const isSeason4Card = (card: Pick<CznCard, "id">): boolean => isSeason4CardId(card.id);

export const SEASON4_DESIRE_STATUS_OPTIONS: Season4DesireStatus[] = [
  CardStatus.CONTROL,
  CardStatus.INQUIRY,
  CardStatus.CLAIM,
  CardStatus.SURVIVAL,
];

const isSeason4DesireStatus = (status: CardStatus): status is Season4DesireStatus =>
  SEASON4_DESIRE_STATUS_OPTIONS.includes(status as Season4DesireStatus);

export const getSeason4BaseStatus = (card: Pick<CznCard, "statuses">): Season4DesireStatus => {
  const first = card.statuses?.[0];
  if (first && isSeason4DesireStatus(first)) {
    return first;
  }
  return CardStatus.CONTROL;
};

export const normalizeSeason4SelectedStatuses = (
  statuses: readonly CardStatus[] | undefined,
  fallback: Season4DesireStatus,
): [Season4DesireStatus, Season4DesireStatus, Season4DesireStatus] => {
  const filtered = (statuses ?? []).filter(isSeason4DesireStatus);
  const first = filtered[0] ?? fallback;
  const second = filtered[1] ?? first;
  const third = filtered[2] ?? second;
  return [first, second, third];
};
