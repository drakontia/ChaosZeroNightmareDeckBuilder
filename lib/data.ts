import { Character, Equipment, EquipmentType, Card, CardType, CardCategory, CardStatus, JobType } from "@/types";

// Sample cards with full hirameki variations
export const CARDS: Card[] = [
  // Character starting cards (3 basic + 1 with hirameki)
  {
    id: "char_card_1",
    name: "基本攻撃",
    type: CardType.NORMAL,
    category: CardCategory.ATTACK,
    statuses: [],
    isBasicCard: true,
    isCharacterCard: true,
    hiramekiVariations: [
      { level: 0, cost: 1, description: "敵単体に攻撃" }
    ]
  },
  {
    id: "char_card_2",
    name: "基本防御",
    type: CardType.NORMAL,
    category: CardCategory.ENHANCEMENT,
    statuses: [],
    isBasicCard: true,
    isCharacterCard: true,
    hiramekiVariations: [
      { level: 0, cost: 1, description: "自身の防御力を上げる" }
    ]
  },
  {
    id: "char_card_3",
    name: "基本回復",
    type: CardType.NORMAL,
    category: CardCategory.SKILL,
    statuses: [],
    isBasicCard: true,
    isCharacterCard: true,
    hiramekiVariations: [
      { level: 0, cost: 1, description: "自身のHPを回復" }
    ]
  },
  {
    id: "char_card_4",
    name: "ファイアボール",
    type: CardType.NORMAL,
    category: CardCategory.ATTACK,
    statuses: [],
    isBasicCard: false,
    isCharacterCard: true,
    hiramekiVariations: [
      { level: 0, cost: 3, description: "敵単体に火属性ダメージを与える" },
      { level: 1, cost: 3, description: "敵単体に火属性ダメージを与える（威力小上昇）", status: "火傷" },
      { level: 2, cost: 2, description: "敵単体に火属性ダメージを与える（威力上昇）", status: "火傷" },
      { level: 3, cost: 2, description: "敵単体に大火属性ダメージを与える", status: "火傷・防御低下" },
      { level: 4, cost: 1, description: "敵単体に大火属性ダメージを与える（威力上昇）", status: "火傷・防御低下" },
      { level: 5, cost: 1, description: "敵単体に超大火属性ダメージを与える", status: "火傷・防御低下・継続ダメージ" }
    ]
  },
  // Character hirameki cards
  {
    id: "char_hirameki_1",
    name: "フレイムストライク",
    type: CardType.NORMAL,
    category: CardCategory.ATTACK,
    statuses: [],
    isCharacterCard: true,
    hiramekiVariations: [
      { level: 0, cost: 4, description: "敵単体に強力な火属性ダメージ" },
      { level: 1, cost: 4, description: "敵単体に強力な火属性ダメージ（威力小上昇）", status: "火傷" },
      { level: 2, cost: 3, description: "敵単体に強力な火属性ダメージ（威力上昇）", status: "火傷・防御低下" },
      { level: 3, cost: 3, description: "敵単体に超強力な火属性ダメージ", status: "火傷・防御低下" },
      { level: 4, cost: 2, description: "敵単体に超強力な火属性ダメージ（威力上昇）", status: "火傷・防御低下・スタン" },
      { level: 5, cost: 2, description: "敵単体に極大火属性ダメージ", status: "火傷・防御低下・スタン・継続ダメージ" }
    ]
  },
  {
    id: "char_hirameki_2",
    name: "アイスシールド",
    type: CardType.NORMAL,
    category: CardCategory.ENHANCEMENT,
    statuses: [],
    isCharacterCard: true,
    hiramekiVariations: [
      { level: 0, cost: 2, description: "氷の盾で防御し、攻撃者にダメージ" },
      { level: 1, cost: 2, description: "氷の盾で防御し、攻撃者にダメージ（威力小上昇）" },
      { level: 2, cost: 2, description: "氷の盾で防御し、攻撃者に高ダメージ", status: "凍結" },
      { level: 3, cost: 1, description: "氷の盾で防御し、攻撃者に高ダメージ＋凍結", status: "凍結" },
      { level: 4, cost: 1, description: "氷の盾で完全防御し、攻撃者に大ダメージ＋凍結", status: "凍結・防御低下" },
      { level: 5, cost: 0, description: "氷の盾で完全防御し、攻撃者に超大ダメージ", status: "凍結・防御低下・スタン" }
    ]
  },
  {
    id: "char_hirameki_3",
    name: "ヒール",
    type: CardType.NORMAL,
    category: CardCategory.SKILL,
    statuses: [],
    isCharacterCard: true,
    hiramekiVariations: [
      { level: 0, cost: 2, description: "味方単体のHPを回復する" },
      { level: 1, cost: 2, description: "味方単体のHPを回復する（回復量小上昇）" },
      { level: 2, cost: 2, description: "味方単体のHPを回復する（回復量上昇）", status: "再生" },
      { level: 3, cost: 2, description: "味方全体のHPを回復する" },
      { level: 4, cost: 1, description: "味方全体のHPを大回復する", status: "再生" },
      { level: 5, cost: 1, description: "味方全体のHPを超回復する", status: "再生・防御上昇" }
    ]
  },
  {
    id: "char_hirameki_4",
    name: "防御",
    type: CardType.NORMAL,
    category: CardCategory.ENHANCEMENT,
    statuses: [],
    isCharacterCard: true,
    hiramekiVariations: [
      { level: 0, cost: 1, description: "自身の防御力を上げる" },
      { level: 1, cost: 1, description: "自身の防御力を上げる（効果小上昇）" },
      { level: 2, cost: 1, description: "自身の防御力を大きく上げる", status: "防御上昇" },
      { level: 3, cost: 0, description: "自身の防御力を大きく上げる＋ダメージ無効1回", status: "防御上昇" },
      { level: 4, cost: 0, description: "自身の防御力を超上昇＋ダメージ無効2回", status: "防御上昇・再生" },
      { level: 5, cost: 0, description: "自身を無敵状態にする（1ターン）", status: "無敵・防御上昇・再生" }
    ]
  },
  // Shared cards (3 hirameki levels) - can be added to specific jobs
  {
    id: "shared_card_1",
    name: "全体攻撃",
    type: CardType.SHARED,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: "all",
    hiramekiVariations: [
      { level: 0, cost: 5, description: "敵全体に無属性ダメージを与える" },
      { level: 1, cost: 4, description: "敵全体に無属性ダメージを与える（威力上昇）" },
      { level: 2, cost: 4, description: "敵全体に大無属性ダメージを与える", status: "防御低下" },
      { level: 3, cost: 3, description: "敵全体に超大無属性ダメージを与える", status: "防御低下・スタン" }
    ]
  },
  {
    id: "shared_card_2",
    name: "サンダーストーム",
    type: CardType.SHARED,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: [JobType.STRIKER, JobType.RANGER],
    hiramekiVariations: [
      { level: 0, cost: 6, description: "敵全体に雷属性ダメージ" },
      { level: 1, cost: 5, description: "敵全体に雷属性ダメージ＋麻痺", status: "麻痺" },
      { level: 2, cost: 5, description: "敵全体に大雷属性ダメージ＋麻痺＋スタン", status: "麻痺・スタン" },
      { level: 3, cost: 4, description: "敵全体に超大雷属性ダメージ＋麻痺＋スタン", status: "麻痺・スタン・防御低下" }
    ]
  },
  // Monster cards (3 hirameki levels)
  {
    id: "monster_card_1",
    name: "モンスター召喚",
    type: CardType.MONSTER,
    category: CardCategory.SKILL,
    statuses: [],
    allowedJobs: [JobType.CONTROLLER, JobType.PSIONIC],
    hiramekiVariations: [
      { level: 0, cost: 4, description: "モンスターを召喚して攻撃" },
      { level: 1, cost: 3, description: "強力なモンスターを召喚して攻撃" },
      { level: 2, cost: 3, description: "強力なモンスターを召喚して複数回攻撃" },
      { level: 3, cost: 2, description: "伝説のモンスターを召喚して強力な攻撃", status: "防御低下" }
    ]
  },
  // Forbidden cards (3 hirameki levels)
  {
    id: "forbidden_card_1",
    name: "禁呪",
    type: CardType.FORBIDDEN,
    category: CardCategory.ATTACK,
    statuses: [],
    allowedJobs: "all",
    hiramekiVariations: [
      { level: 0, cost: 7, description: "禁断の魔法で敵に大ダメージ（反動あり）" },
      { level: 1, cost: 6, description: "禁断の魔法で敵に大ダメージ（反動軽減）" },
      { level: 2, cost: 6, description: "禁断の魔法で敵に超大ダメージ（反動軽減）" },
      { level: 3, cost: 5, description: "禁断の魔法で敵に超大ダメージ（反動なし）" }
    ]
  }
];

// Sample characters with their card sets and job types
export const CHARACTERS: Character[] = [
  {
    id: "char_1",
    name: "リリス",
    rarity: "SSR",
    job: JobType.STRIKER,
    startingCards: ["char_card_1", "char_card_2", "char_card_3", "char_card_4"],
    hiramekiCards: ["char_hirameki_1", "char_hirameki_2", "char_hirameki_3", "char_hirameki_4"]
  },
  {
    id: "char_2",
    name: "アリス",
    rarity: "SSR",
    job: JobType.VANGUARD,
    startingCards: ["char_card_1", "char_card_2", "char_card_3", "char_card_4"],
    hiramekiCards: ["char_hirameki_1", "char_hirameki_2", "char_hirameki_3", "char_hirameki_4"]
  },
  {
    id: "char_3",
    name: "ヴィクター",
    rarity: "SR",
    job: JobType.RANGER,
    startingCards: ["char_card_1", "char_card_2", "char_card_3", "char_card_4"],
    hiramekiCards: ["char_hirameki_1", "char_hirameki_2", "char_hirameki_3", "char_hirameki_4"]
  },
  {
    id: "char_4",
    name: "エマ",
    rarity: "SR",
    job: JobType.HUNTER,
    startingCards: ["char_card_1", "char_card_2", "char_card_3", "char_card_4"],
    hiramekiCards: ["char_hirameki_1", "char_hirameki_2", "char_hirameki_3", "char_hirameki_4"]
  },
  {
    id: "char_5",
    name: "カイル",
    rarity: "R",
    job: JobType.CONTROLLER,
    startingCards: ["char_card_1", "char_card_2", "char_card_3", "char_card_4"],
    hiramekiCards: ["char_hirameki_1", "char_hirameki_2", "char_hirameki_3", "char_hirameki_4"]
  }
];

// Sample equipment (unchanged)
export const EQUIPMENT: Equipment[] = [
  // Weapons
  {
    id: "weapon_1",
    name: "聖剣エクスカリバー",
    type: EquipmentType.WEAPON,
    rarity: "SSR",
    description: "伝説の聖剣"
  },
  {
    id: "weapon_2",
    name: "ダークソード",
    type: EquipmentType.WEAPON,
    rarity: "SR",
    description: "闇の力を宿した剣"
  },
  {
    id: "weapon_3",
    name: "鋼の剣",
    type: EquipmentType.WEAPON,
    rarity: "R",
    description: "標準的な剣"
  },
  // Armor
  {
    id: "armor_1",
    name: "神聖なる鎧",
    type: EquipmentType.ARMOR,
    rarity: "SSR",
    description: "神々の加護を受けた鎧"
  },
  {
    id: "armor_2",
    name: "魔法の鎧",
    type: EquipmentType.ARMOR,
    rarity: "SR",
    description: "魔法防御力が高い"
  },
  {
    id: "armor_3",
    name: "革の鎧",
    type: EquipmentType.ARMOR,
    rarity: "R",
    description: "軽量な鎧"
  },
  // Pendants
  {
    id: "pendant_1",
    name: "生命のペンダント",
    type: EquipmentType.PENDANT,
    rarity: "SSR",
    description: "HPを大幅に増加"
  },
  {
    id: "pendant_2",
    name: "魔力のペンダント",
    type: EquipmentType.PENDANT,
    rarity: "SR",
    description: "魔力を増加"
  },
  {
    id: "pendant_3",
    name: "幸運のペンダント",
    type: EquipmentType.PENDANT,
    rarity: "R",
    description: "運を少し上げる"
  }
];

// Helper function to get card by ID
export function getCardById(id: string): Card | undefined {
  return CARDS.find(card => card.id === id);
}

// Helper function to get character's starting cards
export function getCharacterStartingCards(character: Character): Card[] {
  return character.startingCards
    .map(id => getCardById(id))
    .filter((card): card is Card => card !== undefined);
}

// Helper function to get character's hirameki cards
export function getCharacterHiramekiCards(character: Character): Card[] {
  return character.hiramekiCards
    .map(id => getCardById(id))
    .filter((card): card is Card => card !== undefined);
}

// Helper function to get shared/monster/forbidden cards that are allowed for character's job
export function getAddableCards(characterJob?: JobType): Card[] {
  return CARDS.filter(card => {
    if (card.type === CardType.NORMAL) return false; // Skip character cards
    
    if (!characterJob) return true; // Show all if no character selected
    
    // Check if card is allowed for this job
    if (card.allowedJobs === "all") return true;
    if (Array.isArray(card.allowedJobs) && card.allowedJobs.includes(characterJob)) return true;
    
    return false;
  });
}
