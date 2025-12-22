import { CznCard } from "@/types";

// Import and re-export cards from separate files
import { SHARED_CARDS } from "./cards/shared-cards";
import { MONSTER_CARDS } from "./cards/monster-cards";
import { FORBIDDEN_CARDS } from "./cards/forbidden-cards";

export { SHARED_CARDS, MONSTER_CARDS, FORBIDDEN_CARDS };

// All other cards combined
export const OTHER_CARDS: CznCard[] = [...SHARED_CARDS, ...MONSTER_CARDS, ...FORBIDDEN_CARDS];
