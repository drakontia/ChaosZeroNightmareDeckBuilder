import { CznCard, CardType, CardCategory, JobType } from "@/types";

/**
 * Monster Cards
 * 
 * Note: Card names and descriptions are displayed using translations from messages/*.json files.
 * - Card name: t(`cards.${card.id}.name`)
 * - Card description: t(`cards.${card.id}.descriptions.${level}`)
 * 
 * The name and description fields below serve as fallback values when translations are not available.
 */
export const MONSTER_CARDS: CznCard[] = [
  {
    id: "monster_card_1",
    name: "モンスター召喚", // Fallback
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    statuses: [],
    allowedJobs: [JobType.CONTROLLER, JobType.PSIONIC],
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 4, description: "モンスターを召喚して攻撃" },
      { level: 1, cost: 3, description: "強力なモンスターを召喚して攻撃" },
      { level: 2, cost: 3, description: "強力なモンスターを召喚して複数回攻撃" },
      { level: 3, cost: 2, description: "伝説のモンスターを召喚して強力な攻撃" }
    ]
  }
];
