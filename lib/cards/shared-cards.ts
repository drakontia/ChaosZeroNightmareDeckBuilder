import { CznCard, CardType, CardCategory, JobType } from "@/types";

/**
 * Shared Cards
 * 
 * Note: Card names and descriptions are displayed using translations from messages/*.json files.
 * - Card name: t(`cards.${card.id}.name`)
 * - Card description: t(`cards.${card.id}.descriptions.${level}`)
 * 
 * The name and description fields below serve as fallback values when translations are not available.
 */
export const SHARED_CARDS: CznCard[] = [
  {
    id: "shared_card_1",
    name: "全体攻撃", // Fallback
    type: CardType.SHARED,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: "all",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 5, description: "敵全体に無属性ダメージを与える" },
      { level: 1, cost: 4, description: "敵全体に無属性ダメージを与える（威力上昇）" },
      { level: 2, cost: 4, description: "敵全体に大無属性ダメージを与える" },
      { level: 3, cost: 3, description: "敵全体に超大無属性ダメージを与える" }
    ]
  },
  {
    id: "shared_card_2",
    name: "サンダーストーム", // Fallback
    type: CardType.SHARED,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: [JobType.STRIKER, JobType.RANGER],
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 6, description: "敵全体に雷属性ダメージ" },
      { level: 1, cost: 5, description: "敵全体に雷属性ダメージ＋麻痺" },
      { level: 2, cost: 5, description: "敵全体に大雷属性ダメージ＋麻痺＋スタン" },
      { level: 3, cost: 4, description: "敵全体に超大雷属性ダメージ＋麻痺＋スタン" }
    ]
  }
];
