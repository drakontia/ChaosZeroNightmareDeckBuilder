import { describe, expect, it } from "vite-plus/test";

import { getCardById } from "@/lib/card";
import { FORBIDDEN_CARDS } from "@/lib/cards/forbidden-cards";
import { CardCategory, CardStatus, CardType, JobType } from "@/types";

type ExpectedCard = {
  id: string;
  name: string;
  category: CardCategory;
  cost: number | "X" | "unusable";
  allowedJobs: JobType[] | "all";
  statuses: CardStatus[];
};

const ISSUE_132_SHARED_CARDS: ExpectedCard[] = [
  {
    id: "marauders_charge",
    name: "強奪者の進撃",
    category: CardCategory.ATTACK,
    cost: 1,
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    statuses: [],
  },
  {
    id: "barrier_utilization",
    name: "防壁活用",
    category: CardCategory.SKILL,
    cost: 1,
    allowedJobs: [JobType.STRIKER, JobType.VANGUARD],
    statuses: [],
  },
  {
    id: "horde_eradication",
    name: "群集掃討",
    category: CardCategory.ATTACK,
    cost: 2,
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    statuses: [],
  },
  {
    id: "essence_tracking",
    name: "エッセンス追跡",
    category: CardCategory.SKILL,
    cost: 1,
    allowedJobs: [JobType.RANGER, JobType.HUNTER],
    statuses: [],
  },
  {
    id: "refracted_insight",
    name: "屈折した洞察",
    category: CardCategory.ATTACK,
    cost: 1,
    allowedJobs: [JobType.CONTROLLER, JobType.PSIONIC],
    statuses: [],
  },
  {
    id: "inner_corruption",
    name: "侵食された内面",
    category: CardCategory.UPGRADE,
    cost: 1,
    allowedJobs: [JobType.CONTROLLER, JobType.PSIONIC],
    statuses: [CardStatus.LEAD],
  },
  {
    id: "hand_enthralled_by_light",
    name: "光に魅せられた手",
    category: CardCategory.SKILL,
    cost: 1,
    allowedJobs: "all",
    statuses: [CardStatus.EXHAUST],
  },
  {
    id: "instinct_resonance",
    name: "本能の共鳴",
    category: CardCategory.UPGRADE,
    cost: 2,
    allowedJobs: "all",
    statuses: [CardStatus.INITIATION],
  },
  {
    id: "jury_rigged_powder_keg",
    name: "間に合わせの火薬樽",
    category: CardCategory.ATTACK,
    cost: 1,
    allowedJobs: "all",
    statuses: [CardStatus.EXHAUST],
  },
  {
    id: "simulacrums_echo",
    name: "模倣体のこだま",
    category: CardCategory.SKILL,
    cost: 1,
    allowedJobs: "all",
    statuses: [],
  },
];

describe("issue #132 forbidden card placement", () => {
  it.each(ISSUE_132_SHARED_CARDS)(
    "$id exists as forbidden card with expected metadata",
    (expectedCard) => {
      const card = getCardById(expectedCard.id);

      expect(card).toBeDefined();
      expect(card?.type).toBe(CardType.FORBIDDEN);
      expect(card?.name).toBe(expectedCard.name);
      expect(card?.category).toBe(expectedCard.category);
      expect(card?.statuses).toEqual(expectedCard.statuses);
      expect(card?.allowedJobs).toEqual(expectedCard.allowedJobs);
      expect(card?.hiramekiVariations).toHaveLength(1);
      expect(card?.hiramekiVariations[0].level).toBe(0);
      expect(card?.hiramekiVariations[0].cost).toBe(expectedCard.cost);
      expect(FORBIDDEN_CARDS.some((candidate) => candidate.id === expectedCard.id)).toBe(true);
    },
  );
});
