import { Equipment } from "@/types";

// Import and re-export equipment from separate files
import { WEAPONS } from "./equipment/weapons";
import { ARMORS } from "./equipment/armors";
import { PENDANTS } from "./equipment/pendants";

export { WEAPONS, ARMORS, PENDANTS };

// All equipment combined
export const EQUIPMENT: Equipment[] = [...WEAPONS, ...ARMORS, ...PENDANTS];
