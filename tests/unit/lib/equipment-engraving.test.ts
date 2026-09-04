import { describe, expect, it } from "vite-plus/test";

import { EQUIPMENT_ENGRAVING_EFFECTS } from "@/lib/equipment-engraving";

describe("equipment-engraving", () => {
  it("defines all equipment engravings", () => {
    expect(EQUIPMENT_ENGRAVING_EFFECTS).toHaveLength(23);
  });

  it("keeps engraving ids unique and aligned counts intact", () => {
    const ids = EQUIPMENT_ENGRAVING_EFFECTS.map((effect) => effect.id);
    const lightEffects = EQUIPMENT_ENGRAVING_EFFECTS.filter(
      (effect) => effect.alignment === "light",
    );
    const darkEffects = EQUIPMENT_ENGRAVING_EFFECTS.filter((effect) => effect.alignment === "dark");

    expect(new Set(ids).size).toBe(ids.length);
    expect(lightEffects).toHaveLength(9);
    expect(darkEffects).toHaveLength(14);
  });
});
