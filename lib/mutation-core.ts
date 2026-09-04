import { MutationCoreEffect, MutationCoreEffectCategory } from "@/types";

/**
 * Comprehensive list of all mutation core effects
 * Based on season4/mutation-core.md specifications
 */
export const MUTATION_CORE_EFFECTS: MutationCoreEffect[] = [
  // Basic Stats Enhancement (8 effects: 4 attack + 4 defense)
  {
    id: "attack_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.BASIC_STATS,
    description: "攻撃力 8% 増加",
  },
  {
    id: "attack_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.BASIC_STATS,
    description: "攻撃力 10% 増加",
  },
  {
    id: "attack_boost_lv3",
    level: 3,
    category: MutationCoreEffectCategory.BASIC_STATS,
    description: "攻撃力 12% 増加",
  },
  {
    id: "attack_boost_lv4",
    level: 4,
    category: MutationCoreEffectCategory.BASIC_STATS,
    description: "攻撃力 14% 増加",
  },
  {
    id: "defense_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.BASIC_STATS,
    description: "防御力 8% 増加",
  },
  {
    id: "defense_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.BASIC_STATS,
    description: "防御力 10% 増加",
  },
  {
    id: "defense_boost_lv3",
    level: 3,
    category: MutationCoreEffectCategory.BASIC_STATS,
    description: "防御力 12% 増加",
  },
  {
    id: "defense_boost_lv4",
    level: 4,
    category: MutationCoreEffectCategory.BASIC_STATS,
    description: "防御力 14% 増加",
  },

  // Card Damage Quantity Enhancement (6 effects: Lv.1-6)
  {
    id: "card_damage_lv1",
    level: 1,
    category: MutationCoreEffectCategory.CARD_DAMAGE,
    description: "自分のカードダメージ量 8% 増加",
  },
  {
    id: "card_damage_lv2",
    level: 2,
    category: MutationCoreEffectCategory.CARD_DAMAGE,
    description: "自分のカードダメージ量 9% 増加",
  },
  {
    id: "card_damage_lv3",
    level: 3,
    category: MutationCoreEffectCategory.CARD_DAMAGE,
    description: "自分のカードダメージ量 10% 増加",
  },
  {
    id: "card_damage_lv4",
    level: 4,
    category: MutationCoreEffectCategory.CARD_DAMAGE,
    description: "自分のカードダメージ量 11% 増加",
  },
  {
    id: "card_damage_lv5",
    level: 5,
    category: MutationCoreEffectCategory.CARD_DAMAGE,
    description: "自分のカードダメージ量 12% 増加",
  },
  {
    id: "card_damage_lv6",
    level: 6,
    category: MutationCoreEffectCategory.CARD_DAMAGE,
    description: "自分のカードダメージ量 13% 増加",
  },

  // Card Shield Acquisition Enhancement (6 effects: Lv.1-6)
  {
    id: "shield_acquisition_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SHIELD,
    description: "自分のカードシールド獲得量 8% 増加",
  },
  {
    id: "shield_acquisition_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SHIELD,
    description: "自分のカードシールド獲得量 9% 増加",
  },
  {
    id: "shield_acquisition_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SHIELD,
    description: "自分のカードシールド獲得量 10% 増加",
  },
  {
    id: "shield_acquisition_lv4",
    level: 4,
    category: MutationCoreEffectCategory.SHIELD,
    description: "自分のカードシールド獲得量 11% 増加",
  },
  {
    id: "shield_acquisition_lv5",
    level: 5,
    category: MutationCoreEffectCategory.SHIELD,
    description: "自分のカードシールド獲得量 12% 増加",
  },
  {
    id: "shield_acquisition_lv6",
    level: 6,
    category: MutationCoreEffectCategory.SHIELD,
    description: "自分のカードシールド獲得量 13% 増加",
  },

  // Card Heal Quantity Enhancement (6 effects: Lv.1-6)
  {
    id: "heal_quantity_lv1",
    level: 1,
    category: MutationCoreEffectCategory.HEAL,
    description: "自分のカード治癒量 8% 増加",
  },
  {
    id: "heal_quantity_lv2",
    level: 2,
    category: MutationCoreEffectCategory.HEAL,
    description: "自分のカード治癒量 9% 増加",
  },
  {
    id: "heal_quantity_lv3",
    level: 3,
    category: MutationCoreEffectCategory.HEAL,
    description: "自分のカード治癒量 10% 増加",
  },
  {
    id: "heal_quantity_lv4",
    level: 4,
    category: MutationCoreEffectCategory.HEAL,
    description: "自分のカード治癒量 11% 増加",
  },
  {
    id: "heal_quantity_lv5",
    level: 5,
    category: MutationCoreEffectCategory.HEAL,
    description: "自分のカード治癒量 12% 増加",
  },
  {
    id: "heal_quantity_lv6",
    level: 6,
    category: MutationCoreEffectCategory.HEAL,
    description: "自分のカード治癒量 13% 増加",
  },

  // Special Effects (Multiple)
  // Exhaust: Damage Boost
  {
    id: "exhaust_damage_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "能力で自分のカード消滅時、1ターンの間、自分の攻撃カードダメージ量 +12%（各ターン3回）",
  },
  {
    id: "exhaust_damage_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "能力で自分のカード消滅時、1ターンの間、自分の攻撃カードダメージ量 +15%（各ターン3回）",
  },
  {
    id: "exhaust_damage_boost_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "能力で自分のカード消滅時、1ターンの間、自分の攻撃カードダメージ量 +18%（各ターン3回）",
  },
  {
    id: "exhaust_damage_boost_lv4",
    level: 4,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "能力で自分のカード消滅時、1ターンの間、自分の攻撃カードダメージ量 +21%（各ターン3回）",
  },

  // Extra Attack: Morale
  {
    id: "extra_attack_morale_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "追加攻撃時、1ターンの間、士気1（各ターン2回）",
  },
  {
    id: "extra_attack_morale_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "追加攻撃時、1ターンの間、士気1（各ターン3回）",
  },

  // Direct Use: Fixed Damage
  {
    id: "direct_use_fixed_damage_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "カードを直接使用時、ランダムな敵に固定ダメージ 120%（各ターン1回）",
  },
  {
    id: "direct_use_fixed_damage_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "カードを直接使用時、ランダムな敵に固定ダメージ 180%（各ターン1回）",
  },
  {
    id: "direct_use_fixed_damage_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "カードを直接使用時、ランダムな敵に固定ダメージ 240%（各ターン1回）",
  },

  // Haste Card Damage Boost
  {
    id: "haste_damage_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の迅速カードダメージ量 +30%",
  },
  {
    id: "haste_damage_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の迅速カードダメージ量 +37%",
  },
  {
    id: "haste_damage_boost_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の迅速カードダメージ量 +45%",
  },
  {
    id: "haste_damage_boost_lv4",
    level: 4,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の迅速カードダメージ量 +52%",
  },
  {
    id: "haste_damage_boost_lv5",
    level: 5,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の迅速カードダメージ量 +60%",
  },

  // Exhaust Card Damage Boost
  {
    id: "exhaust_card_damage_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の消滅カードダメージ量 15% 増加",
  },
  {
    id: "exhaust_card_damage_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の消滅カードダメージ量 20% 増加",
  },
  {
    id: "exhaust_card_damage_boost_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の消滅カードダメージ量 25% 増加",
  },
  {
    id: "exhaust_card_damage_boost_lv4",
    level: 4,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の消滅カードダメージ量 30% 増加",
  },

  // Generated Card Damage Boost
  {
    id: "generated_card_damage_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の生成カードダメージ量 15% 増加",
  },
  {
    id: "generated_card_damage_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の生成カードダメージ量 18% 増加",
  },
  {
    id: "generated_card_damage_boost_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の生成カードダメージ量 21% 増加",
  },
  {
    id: "generated_card_damage_boost_lv4",
    level: 4,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の生成カードダメージ量 24% 増加",
  },
  {
    id: "generated_card_damage_boost_lv5",
    level: 5,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の生成カードダメージ量 27% 増加",
  },
  {
    id: "generated_card_damage_boost_lv6",
    level: 6,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分の生成カードダメージ量 30% 増加",
  },

  // Discard: Extra Attack
  {
    id: "discard_extra_attack_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "1ターンの間、能力で自分のカードを3枚破棄時、ランダムな敵に追加攻撃 150%（各ターン1回）",
  },
  {
    id: "discard_extra_attack_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "1ターンの間、能力で自分のカードを3枚破棄時、ランダムな敵に追加攻撃 225%（各ターン1回）",
  },
  {
    id: "discard_extra_attack_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "1ターンの間、能力で自分のカードを3枚破棄時、ランダムな敵に追加攻撃 300%（各ターン1回）",
  },

  // Exhaust: Fixed Damage
  {
    id: "exhaust_fixed_damage_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分のカードを5枚消滅時、ランダムな敵に固定ダメージ 150%（各ターン1回）",
  },
  {
    id: "exhaust_fixed_damage_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分のカードを5枚消滅時、ランダムな敵に固定ダメージ 225%（各ターン1回）",
  },
  {
    id: "exhaust_fixed_damage_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "自分のカードを5枚消滅時、ランダムな敵に固定ダメージ 300%（各ターン1回）",
  },

  // Retain: Damage Boost
  {
    id: "retain_damage_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "自分のカードが保存された場合、次に発動する自分の攻撃カードダメージ量 10% 増加（最大3重複）",
  },
  {
    id: "retain_damage_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "自分のカードが保存された場合、次に発動する自分の攻撃カードダメージ量 12% 増加（最大3重複）",
  },
  {
    id: "retain_damage_boost_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "自分のカードが保存された場合、次に発動する自分の攻撃カードダメージ量 15% 増加（最大3重複）",
  },
  {
    id: "retain_damage_boost_lv4",
    level: 4,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "自分のカードが保存された場合、次に発動する自分の攻撃カードダメージ量 18% 増加（最大3重複）",
  },
  {
    id: "retain_damage_boost_lv5",
    level: 5,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "自分のカードが保存された場合、次に発動する自分の攻撃カードダメージ量 20% 増加（最大3重複）",
  },

  // AP5: Card Enhancement
  {
    id: "ap5_enhancement_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "1ターンの間、APを5以上使用時、1ターンの間、自分のダメージ量/シールド獲得量/治癒量 +30%（各ターン1回）",
  },
  {
    id: "ap5_enhancement_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "1ターンの間、APを5以上使用時、1ターンの間、自分のダメージ量/シールド獲得量/治癒量 +40%（各ターン1回）",
  },
  {
    id: "ap5_enhancement_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "1ターンの間、APを5以上使用時、1ターンの間、自分のダメージ量/シールド獲得量/治癒量 +50%（各ターン1回）",
  },
  {
    id: "ap5_enhancement_lv4",
    level: 4,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "1ターンの間、APを5以上使用時、1ターンの間、自分のダメージ量/シールド獲得量/治癒量 +60%（各ターン1回）",
  },

  // Direct Use: Celestial Activation
  {
    id: "direct_use_celestial_activation",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "コスト1のカードを直接使用時、50% の確率で手札のランダムな天上カードを1枚発動",
  },

  // Deck30: Attack Card Damage Boost
  {
    id: "deck30_attack_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "戦闘開始時、デッキ枚数が30枚以上の場合、自分の攻撃カードダメージ量 15% 増加",
  },
  {
    id: "deck30_attack_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "戦闘開始時、デッキ枚数が30枚以上の場合、自分の攻撃カードダメージ量 19% 増加",
  },
  {
    id: "deck30_attack_boost_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "戦闘開始時、デッキ枚数が30枚以上の場合、自分の攻撃カードダメージ量 23% 増加",
  },
  {
    id: "deck30_attack_boost_lv4",
    level: 4,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "戦闘開始時、デッキ枚数が30枚以上の場合、自分の攻撃カードダメージ量 27% 増加",
  },
  {
    id: "deck30_attack_boost_lv5",
    level: 5,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "戦闘開始時、デッキ枚数が30枚以上の場合、自分の攻撃カードダメージ量 30% 増加",
  },

  // Draw: Damage Boost
  {
    id: "draw_damage_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "能力で自分のカードドロー時、1ターンの間、発動時まで自分の攻撃カードダメージ量 15% 増加（各ターン1回）",
  },
  {
    id: "draw_damage_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "能力で自分のカードドロー時、1ターンの間、発動時まで自分の攻撃カードダメージ量 23% 増加（各ターン1回）",
  },
  {
    id: "draw_damage_boost_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "能力で自分のカードドロー時、1ターンの間、発動時まで自分の攻撃カードダメージ量 30% 増加（各ターン1回）",
  },

  // Fragile: Critical Rate Boost
  {
    id: "fragile_critical_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "脆弱状態の敵に自分の攻撃カード使用時、会心率 +8%",
  },
  {
    id: "fragile_critical_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "脆弱状態の敵に自分の攻撃カード使用時、会心率 +15%",
  },

  // Shield: Fixed Shield Acquisition
  {
    id: "shield_fixed_acquisition_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "能力でシールド獲得時、固定シールド 75%（各ターン1回）",
  },
  {
    id: "shield_fixed_acquisition_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "能力でシールド獲得時、固定シールド 100%（各ターン1回）",
  },
  {
    id: "shield_fixed_acquisition_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "能力でシールド獲得時、固定シールド 125%（各ターン1回）",
  },

  // Hand: Damage Boost
  {
    id: "hand_damage_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "ターン開始時、手札のカード数だけ、次に発動する自分の攻撃カードのダメージ量 5% 増加",
  },
  {
    id: "hand_damage_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description:
      "ターン開始時、手札のカード数だけ、次に発動する自分の攻撃カードのダメージ量 8% 増加",
  },

  // Destruction: Damage Boost
  {
    id: "destruction_damage_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "大破された対象への自分の攻撃カードのダメージ量 20% 増加",
  },
  {
    id: "destruction_damage_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "大破された対象への自分の攻撃カードのダメージ量 30% 増加",
  },
  {
    id: "destruction_damage_boost_lv3",
    level: 3,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "大破された対象への自分の攻撃カードのダメージ量 40% 増加",
  },

  // Shuffle: Damage Boost
  {
    id: "shuffle_damage_boost_lv1",
    level: 1,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "シャッフル時、1ターンの間、自分のダメージ量 15% 増加（各ターン1回）",
  },
  {
    id: "shuffle_damage_boost_lv2",
    level: 2,
    category: MutationCoreEffectCategory.SPECIAL,
    description: "シャッフル時、1ターンの間、自分のダメージ量 23% 増加（各ターン1回）",
  },
];

/**
 * Get a mutation core effect by its ID
 */
export function getMutationCoreEffectById(id: string): MutationCoreEffect | undefined {
  return MUTATION_CORE_EFFECTS.find((effect) => effect.id === id);
}

/**
 * Get mutation core effects filtered by category, sorted by level
 */
export function getMutationCoreEffectsByCategory(
  category: MutationCoreEffectCategory,
): MutationCoreEffect[] {
  return MUTATION_CORE_EFFECTS.filter((effect) => effect.category === category).sort(
    (a, b) => a.level - b.level,
  );
}

/**
 * Get mutation core effects filtered by level
 */
export function getMutationCoreEffectsByLevel(level: 1 | 2 | 3 | 4 | 5 | 6): MutationCoreEffect[] {
  return MUTATION_CORE_EFFECTS.filter((effect) => effect.level === level);
}
