// Character Job/Class types
export enum JobType {
  STRIKER = "striker",       // ストライカー
  VANGUARD = "vanguard",     // ヴァンガード
  RANGER = "ranger",         // レンジャー
  HUNTER = "hunter",         // ハンター
  CONTROLLER = "controller", // コントローラー
  PSIONIC = "psionic"       // サイオニック
}

// Character types
export interface Character {
  id: string;
  name: string;
  rarity: string; // N, R, SR, SSR
  job: JobType; // Character's job class
  imgUrl?: string;
  startingCards: string[]; // IDs of 4 starting cards
  hiramekiCards: string[]; // IDs of 4 hirameki cards
}

// Equipment types
export enum EquipmentType {
  WEAPON = "weapon",
  ARMOR = "armor",
  PENDANT = "pendant"
}

export interface Equipment {
  id: string;
  name: string;
  type: EquipmentType;
  rarity: string;
  description?: string;
  imgUrl?: string;
}

// Card types with enhanced Hirameki support
export enum CardType {
  NORMAL = "normal",
  SHARED = "shared",      // 共用カード
  MONSTER = "monster",    // モンスターカード
  FORBIDDEN = "forbidden" // 禁忌カード
}

// Card category types
export enum CardCategory {
  ATTACK = "attack",       // 攻撃
  ENHANCEMENT = "enhancement", // 強化
  SKILL = "skill"         // スキル
}

// Card status types (can have multiple)
export enum CardStatus {
  OPENING = "opening",     // 開戦
  EXTINCTION = "extinction", // 消滅
  PRESERVATION = "preservation", // 保存
  RECOVERY = "recovery",   // 回収
  CELESTIAL = "celestial", // 天上
  COORDINATION = "coordination", // 連携
  ULTIMATE = "ultimate",   // 終極
  INITIATIVE = "initiative" // 主導
}

// Hirameki variation for a card
export interface HiramekiVariation {
  level: number; // 0 = base, 1-5 for character cards, 1-3 for other cards
  cost: number;
  description: string;
  status?: string; // Status effects display text
  // Variations based on Ego Manifestation level
  egoVariations?: {
    [egoLevel: number]: {
      description: string;
      cost?: number;
    };
  };
  // Variation when potential is active
  potentialVariation?: {
    description: string;
    cost?: number;
  };
}

// God types for God Hirameki system
export enum GodType {
  KILKEN = "kilken",       // キルケン
  SECLAID = "seclaid",     // セクレド
  DIALOS = "dialos",       // ディアロス
  NIHILUM = "nihilum",     // ニヒルム
  VITOL = "vitol"          // ヴィトル
}

// Single God Hirameki effect option
export interface GodHiramekiEffectOption {
  id: string;              // Unique ID for this effect
  name: string;            // Effect name
  additionalEffect: string; // Description of the effect
  costModifier?: number;   // Optional cost change
}

// God Hirameki definition with multiple effects per god
export interface GodHiramekiDefinition {
  god: GodType;
  name: string;            // Translation key for god name
  effects: GodHiramekiEffectOption[]; // Multiple effect options per god
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  category: CardCategory; // Attack, Enhancement, or Skill
  statuses: CardStatus[]; // Card status effects
  isBasicCard?: boolean; // True for the 3 basic cards that can't have hirameki
  isCharacterCard?: boolean; // True for character's 8 cards (starting + hirameki)
  allowedJobs?: JobType[] | "all"; // For shared/monster/forbidden cards
  imgUrl?: string;
  // Hirameki variations (index 0 is base, 1-5 for character cards, 1-3 for others)
  hiramekiVariations: HiramekiVariation[];
}

// Deck state
export interface DeckCard extends Card {
  deckId: string; // unique ID for this card in the deck
  selectedHiramekiLevel: number; // 0 = base, 1-5 for variations
  godHiramekiType: GodType | null; // Which god's hirameki is applied (null = none)
  godHiramekiEffectId: string | null; // Which specific effect of that god is applied
}

// God Hirameki effect definitions (shared across all cards with multiple effects per god)
export const GOD_HIRAMEKI_EFFECTS: Record<GodType, GodHiramekiDefinition> = {
  [GodType.KILKEN]: {
    god: GodType.KILKEN,
    name: "kilken",
    effects: [
      {
        id: "kilken_1",
        name: "追加ダメージ",
        additionalEffect: "攻撃時、追加ダメージを与える",
        costModifier: -1
      },
      {
        id: "kilken_2",
        name: "クリティカル",
        additionalEffect: "クリティカル率が上昇する",
        costModifier: 0
      },
      {
        id: "kilken_3",
        name: "連続攻撃",
        additionalEffect: "攻撃が2回連続で発動する",
        costModifier: 1
      }
    ]
  },
  [GodType.SECLAID]: {
    god: GodType.SECLAID,
    name: "seclaid",
    effects: [
      {
        id: "seclaid_1",
        name: "防御強化",
        additionalEffect: "防御力を大幅に上昇させる"
      },
      {
        id: "seclaid_2",
        name: "ダメージ軽減",
        additionalEffect: "受けるダメージを50%軽減する"
      },
      {
        id: "seclaid_3",
        name: "バリア",
        additionalEffect: "次の攻撃を完全に無効化する",
        costModifier: 1
      }
    ]
  },
  [GodType.DIALOS]: {
    god: GodType.DIALOS,
    name: "dialos",
    effects: [
      {
        id: "dialos_1",
        name: "全体効果",
        additionalEffect: "全体効果に変化する"
      },
      {
        id: "dialos_2",
        name: "範囲拡大",
        additionalEffect: "効果範囲が2倍になる",
        costModifier: 1
      },
      {
        id: "dialos_3",
        name: "味方強化",
        additionalEffect: "味方全体に効果を付与する",
        costModifier: -1
      }
    ]
  },
  [GodType.NIHILUM]: {
    god: GodType.NIHILUM,
    name: "nihilum",
    effects: [
      {
        id: "nihilum_1",
        name: "効果無効化",
        additionalEffect: "敵の強化効果を無効化する"
      },
      {
        id: "nihilum_2",
        name: "デバフ解除",
        additionalEffect: "味方のデバフを全て解除する",
        costModifier: 0
      },
      {
        id: "nihilum_3",
        name: "沈黙",
        additionalEffect: "敵をスキル使用不可にする",
        costModifier: 1
      }
    ]
  },
  [GodType.VITOL]: {
    god: GodType.VITOL,
    name: "vitol",
    effects: [
      {
        id: "vitol_1",
        name: "HP回復",
        additionalEffect: "HPを回復する"
      },
      {
        id: "vitol_2",
        name: "継続回復",
        additionalEffect: "3ターンの間、継続的にHPを回復する",
        costModifier: 1
      },
      {
        id: "vitol_3",
        name: "蘇生",
        additionalEffect: "倒れた味方を復活させる",
        costModifier: 2
      }
    ]
  }
};

export interface Deck {
  character: Character | null;
  equipment: {
    weapon: Equipment | null;
    armor: Equipment | null;
    pendant: Equipment | null;
  };
  cards: DeckCard[];
  egoLevel: number; // 0-6, Ego Manifestation level
  hasPotential: boolean; // Whether potential is active
  // Tracking for Vague Memory calculation
  removedCards: Map<string, number>; // cardId -> removal count
  copiedCards: Map<string, number>; // cardId -> copy count
  convertedCards: Set<string>; // cardIds that have been converted
}

// Helper function to get card info based on hirameki level and god hirameki
export function getCardInfo(card: DeckCard, egoLevel: number = 0, hasPotential: boolean = false): {
  cost: number;
  description: string;
  status?: string;
} {
  const variation = card.hiramekiVariations[card.selectedHiramekiLevel] || card.hiramekiVariations[0];
  
  let cost = variation.cost;
  let description = variation.description;
  const status = variation.status;

  // Apply ego level variations
  if (variation.egoVariations && variation.egoVariations[egoLevel]) {
    const egoVar = variation.egoVariations[egoLevel];
    description = egoVar.description;
    if (egoVar.cost !== undefined) {
      cost = egoVar.cost;
    }
  }

  // Apply potential variation
  if (hasPotential && variation.potentialVariation) {
    description = variation.potentialVariation.description;
    if (variation.potentialVariation.cost !== undefined) {
      cost = variation.potentialVariation.cost;
    }
  }

  // Apply god hirameki if active
  if (card.godHiramekiType && !card.isBasicCard) {
    const godEffect = GOD_HIRAMEKI_EFFECTS[card.godHiramekiType];
    description = `${description}\n${godEffect.additionalEffect}`;
    if (godEffect.costModifier !== undefined) {
      cost += godEffect.costModifier;
    }
  }

  return { cost, description, status };
}

// Calculate Vague Memory points based on deck edits
export function calculateVagueMemory(deck: Deck): number {
  let points = 0;

  // Points for cards in the deck
  for (const card of deck.cards) {
    // Shared card acquisition: +20pt
    if (card.type === CardType.SHARED) {
      points += 20;
    }
    
    // Monster card acquisition: +80pt
    if (card.type === CardType.MONSTER) {
      points += 80;
    }

    // Forbidden card: +20pt (always saved)
    if (card.type === CardType.FORBIDDEN) {
      points += 20;
    }

    // Hirameki on shared/monster cards: +10pt (character cards are 0pt)
    if ((card.type === CardType.SHARED || card.type === CardType.MONSTER) && card.selectedHiramekiLevel > 0) {
      points += 10;
    }

    // God Hirameki: +20pt (for all cards including character cards)
    // If shared/monster, also add the +10pt from hirameki above
    if (card.godHiramekiType) {
      points += 20;
    }
  }

  // Points for removed cards
  for (const [cardId, count] of deck.removedCards.entries()) {
    // TODO: Need to check if card is character card (starting/hirameki)
    // For now, simplified calculation
    if (count === 1) {
      points += 0; // First removal: 0pt (or +20pt for character cards)
    } else if (count === 2) {
      points += 10;
    } else if (count === 3) {
      points += 30;
    } else if (count === 4) {
      points += 50;
    } else if (count >= 5) {
      points += 70;
    }
  }

  // Points for copied cards
  for (const [cardId, count] of deck.copiedCards.entries()) {
    if (count === 1) {
      points += 0;
    } else if (count === 2) {
      points += 10;
    } else if (count === 3) {
      points += 30;
    } else if (count === 4) {
      points += 50;
    } else if (count >= 5) {
      points += 70;
    }
  }

  // Points for converted cards: +10pt each
  points += deck.convertedCards.size * 10;

  return points;
}
