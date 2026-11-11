import { CznCard } from "@/types";

// Import and re-export cards from separate files
import { SHARED_CARDS } from "./cards/shared-cards";
import { MONSTER_CARDS } from "./cards/monster-cards";
import { FORBIDDEN_CARDS } from "./cards/forbidden-cards";
import { SEASON5_SHARED_CARDS, SEASON5_MEMORY_CARDS } from "./cards/season5-cards";

export { SHARED_CARDS, MONSTER_CARDS, FORBIDDEN_CARDS, SEASON5_SHARED_CARDS, SEASON5_MEMORY_CARDS };

// All other cards combined
export const OTHER_CARDS: CznCard[] = [
  ...SHARED_CARDS,
  ...SEASON5_SHARED_CARDS,
  ...SEASON5_MEMORY_CARDS,
  ...MONSTER_CARDS,
  ...FORBIDDEN_CARDS,
];
