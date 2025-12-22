import { Character, Equipment, CznCard, CardType, JobType } from "@/types";

// Import data from separate files
export { CHARACTERS } from "./characters";
export { CHARACTER_CARDS } from "./character-cards";
export { OTHER_CARDS } from "./other-cards";
export { EQUIPMENT } from "./equipment";

import { CHARACTER_CARDS } from "./character-cards";
import { OTHER_CARDS } from "./other-cards";

// ============================================================
// 全カード統合 (All Cards Combined)
// ============================================================

export const CARDS: CznCard[] = [...CHARACTER_CARDS, ...OTHER_CARDS];

// ============================================================
// ヘルパー関数 (Helper Functions)
// ============================================================

// Helper function to get card by ID
export function getCardById(id: string): CznCard | undefined {
  return CARDS.find(card => card.id === id);
}

// Helper function to get character's starting cards
export function getCharacterStartingCards(character: Character): CznCard[] {
  return character.startingCards
    .map(id => getCardById(id))
    .filter((card): card is CznCard => card !== undefined);
}

// Helper function to get character's hirameki cards
export function getCharacterHiramekiCards(character: Character): CznCard[] {
  return character.hiramekiCards
    .map(id => getCardById(id))
    .filter((card): card is CznCard => card !== undefined);
}

// Helper function to get shared/monster/forbidden cards that are allowed for character's job
export function getAddableCards(characterJob?: JobType): CznCard[] {
  return CARDS.filter(card => {
    if (card.type === CardType.CHARACTER) return false; // Skip character cards
    
    if (!characterJob) return true; // Show all if no character selected
    
    // Check if card is allowed for this job
    if (card.allowedJobs === "all") return true;
    if (Array.isArray(card.allowedJobs) && card.allowedJobs.includes(characterJob)) return true;
    
    return false;
  });
}
