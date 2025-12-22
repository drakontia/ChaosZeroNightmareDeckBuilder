import { CznCard, CardType, CardCategory } from "@/types";

/**
 * Forbidden Cards
 * 
 * Note: Card names and descriptions are displayed using translations from messages/*.json files.
 * - Card name: t(`cards.${card.id}.name`)
 * - Card description: t(`cards.${card.id}.descriptions.${level}`)
 * 
 * The name and description fields below serve as fallback values when translations are not available.
 */
export const FORBIDDEN_CARDS: CznCard[] = [
  {
    id: "forbidden_card_1",
    name: "禁呪", // Fallback
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: "all",
    hiramekiVariations: [ // Fallback descriptions
      { level: 0, cost: 7, description: "禁断の魔法で敵に大ダメージ（反動あり）" },
      { level: 1, cost: 6, description: "禁断の魔法で敵に大ダメージ（反動軽減）" },
      { level: 2, cost: 6, description: "禁断の魔法で敵に超大ダメージ（反動軽減）" },
      { level: 3, cost: 5, description: "禁断の魔法で敵に超大ダメージ（反動なし）" }
    ]
  }
];
