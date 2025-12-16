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

// God Hirameki adds extra effects
export interface GodHirameki {
  additionalEffect: string;
  costModifier?: number; // Optional cost change
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
  // God hirameki information (separate from normal hirameki)
  godHirameki?: GodHirameki;
}

// Deck state
export interface DeckCard extends Card {
  deckId: string; // unique ID for this card in the deck
  selectedHiramekiLevel: number; // 0 = base, 1-5 for variations
  hasGodHirameki: boolean; // Whether god hirameki is applied
}

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
  if (card.hasGodHirameki && card.godHirameki) {
    description = `${description}\n${card.godHirameki.additionalEffect}`;
    if (card.godHirameki.costModifier !== undefined) {
      cost += card.godHirameki.costModifier;
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
    if (card.hasGodHirameki) {
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
