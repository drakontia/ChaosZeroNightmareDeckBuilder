import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, it, expect } from "vite-plus/test";
import { EquipmentType } from "@/types";
import { WEAPONS } from "@/lib/equipment/weapons";
import { ARMORS } from "@/lib/equipment/armors";
import { PENDANTS } from "@/lib/equipment/pendants";
import { EQUIPMENT } from "@/lib/equipment";
import { EquipmentObtainableChaosId } from "@/types";
import enEquipment from "@/messages/en/equipment.json";
import jaEquipment from "@/messages/ja/equipment.json";
import koEquipment from "@/messages/ko/equipment.json";
import zhEquipment from "@/messages/zh/equipment.json";

const VALID_RARITIES = [
  "equipment.rarity.rare",
  "equipment.rarity.legendary",
  "equipment.rarity.mythical",
];

type EquipmentLocale = {
  equipment: {
    weapon: Record<string, string | { name: string; description: string }>;
    armor: Record<string, string | { name: string; description: string }>;
    pendant: Record<string, string | { name: string; description: string }>;
    obtainableChaos: { options: Record<string, string> };
  };
};

describe("equipment data integrity", () => {
  const validChaosIds = new Set(Object.values(EquipmentObtainableChaosId));

  describe("Season 5 equipment", () => {
    const expectedEquipment = [
      ["triskelion_of_judgment", EquipmentType.WEAPON, "equipment.rarity.rare"],
      ["core_disassembler", EquipmentType.WEAPON, "equipment.rarity.rare"],
      ["phantom_dagger", EquipmentType.WEAPON, "equipment.rarity.rare"],
      ["white_coat", EquipmentType.ARMOR, "equipment.rarity.rare"],
      ["condensed_fuel", EquipmentType.ARMOR, "equipment.rarity.rare"],
      ["shield_of_repentance", EquipmentType.ARMOR, "equipment.rarity.rare"],
      ["pendant_of_balance", EquipmentType.PENDANT, "equipment.rarity.rare"],
      ["enforcement_contract", EquipmentType.PENDANT, "equipment.rarity.rare"],
      ["needle_of_the_severed_overseer", EquipmentType.WEAPON, "equipment.rarity.legendary"],
      ["runic_hammer", EquipmentType.WEAPON, "equipment.rarity.legendary"],
      ["fragment_of_condensed_radiance", EquipmentType.WEAPON, "equipment.rarity.legendary"],
      ["imitated_hand", EquipmentType.ARMOR, "equipment.rarity.legendary"],
      ["crown_of_corruption", EquipmentType.ARMOR, "equipment.rarity.legendary"],
      ["split_design_core", EquipmentType.PENDANT, "equipment.rarity.legendary"],
      ["overloaded_power_engine", EquipmentType.PENDANT, "equipment.rarity.legendary"],
      ["the_final_command", EquipmentType.PENDANT, "equipment.rarity.mythical"],
    ] as const;

    it("registers every listed item with its ordered Heavenly Barrier image", () => {
      const equipmentById = new Map(EQUIPMENT.map((item) => [item.id, item]));
      const equipmentDirectories = {
        [EquipmentType.WEAPON]: "weapons",
        [EquipmentType.ARMOR]: "armors",
        [EquipmentType.PENDANT]: "pendants",
      };

      expect(
        EQUIPMENT.filter((item) => expectedEquipment.some(([id]) => id === item.id)),
      ).toHaveLength(expectedEquipment.length);

      expectedEquipment.forEach(([id, type, rarity]) => {
        const equipment = equipmentById.get(id);
        const imagePath = `/images/equipment/${equipmentDirectories[type]}/${id}.png`;

        expect(equipment).toMatchObject({
          type,
          rarity,
          obtainableChaosIds: ["heavenly_barrier"],
          imgUrl: imagePath,
        });
        expect(
          existsSync(
            join(
              process.cwd(),
              "public",
              "images",
              "equipment",
              equipmentDirectories[type],
              `${id}.png`,
            ),
          ),
        ).toBe(true);
      });
    });

    it("defines names and descriptions in every locale", () => {
      const locales: EquipmentLocale[] = [jaEquipment, enEquipment, zhEquipment, koEquipment];

      locales.forEach((locale) => {
        expect(locale.equipment.obtainableChaos.options.heavenly_barrier).toBeTruthy();

        expectedEquipment.forEach(([id, type]) => {
          expect(locale.equipment[type][id]).toMatchObject({
            name: expect.any(String),
            description: expect.any(String),
          });
        });
      });
    });
  });

  describe("WEAPONS", () => {
    it("all weapon IDs are unique", () => {
      const ids = WEAPONS.map((w) => w.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all weapons have type WEAPON", () => {
      WEAPONS.forEach((w) => {
        expect(w.type).toBe(EquipmentType.WEAPON);
      });
    });

    it("all weapons use valid rarity i18n keys", () => {
      WEAPONS.forEach((w) => {
        expect(VALID_RARITIES).toContain(w.rarity);
      });
    });

    it("all weapons follow the i18n name key pattern", () => {
      WEAPONS.forEach((w) => {
        expect(w.name).toBe(`equipment.weapon.${w.id}.name`);
      });
    });

    it("all weapons follow the i18n description key pattern when present", () => {
      WEAPONS.forEach((w) => {
        if (w.description !== undefined) {
          expect(w.description).toBe(`equipment.weapon.${w.id}.description`);
        }
      });
    });

    it("all weapons follow the imgUrl path pattern when present", () => {
      WEAPONS.forEach((w) => {
        if (w.imgUrl !== undefined) {
          expect(w.imgUrl).toBe(`/images/equipment/weapons/${w.id}.png`);
        }
      });
    });

    it("all weapons define valid obtainable chaos IDs", () => {
      WEAPONS.forEach((w) => {
        expect(w.obtainableChaosIds.length).toBeGreaterThan(0);
        w.obtainableChaosIds.forEach((chaosId) => {
          expect(validChaosIds.has(chaosId)).toBe(true);
        });
      });
    });
  });

  describe("ARMORS", () => {
    it("all armor IDs are unique", () => {
      const ids = ARMORS.map((a) => a.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all armors have type ARMOR", () => {
      ARMORS.forEach((a) => {
        expect(a.type).toBe(EquipmentType.ARMOR);
      });
    });

    it("all armors use valid rarity i18n keys", () => {
      ARMORS.forEach((a) => {
        expect(VALID_RARITIES).toContain(a.rarity);
      });
    });

    it("all armors follow the i18n name key pattern", () => {
      ARMORS.forEach((a) => {
        expect(a.name).toBe(`equipment.armor.${a.id}.name`);
      });
    });

    it("all armors follow the i18n description key pattern when present", () => {
      ARMORS.forEach((a) => {
        if (a.description !== undefined) {
          expect(a.description).toBe(`equipment.armor.${a.id}.description`);
        }
      });
    });

    it("all armors follow the imgUrl path pattern when present", () => {
      ARMORS.forEach((a) => {
        if (a.imgUrl !== undefined) {
          expect(a.imgUrl).toBe(`/images/equipment/armors/${a.id}.png`);
        }
      });
    });

    it("all armors define valid obtainable chaos IDs", () => {
      ARMORS.forEach((a) => {
        expect(a.obtainableChaosIds.length).toBeGreaterThan(0);
        a.obtainableChaosIds.forEach((chaosId) => {
          expect(validChaosIds.has(chaosId)).toBe(true);
        });
      });
    });
  });

  describe("PENDANTS", () => {
    it("all pendant IDs are unique", () => {
      const ids = PENDANTS.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("all pendants have type PENDANT", () => {
      PENDANTS.forEach((p) => {
        expect(p.type).toBe(EquipmentType.PENDANT);
      });
    });

    it("all pendants use valid rarity i18n keys", () => {
      PENDANTS.forEach((p) => {
        expect(VALID_RARITIES).toContain(p.rarity);
      });
    });

    it("all pendants follow the i18n name key pattern", () => {
      PENDANTS.forEach((p) => {
        expect(p.name).toBe(`equipment.pendant.${p.id}.name`);
      });
    });

    it("all pendants follow the i18n description key pattern when present", () => {
      PENDANTS.forEach((p) => {
        if (p.description !== undefined) {
          expect(p.description).toBe(`equipment.pendant.${p.id}.description`);
        }
      });
    });

    it("all pendants follow the imgUrl path pattern when present", () => {
      PENDANTS.forEach((p) => {
        if (p.imgUrl !== undefined) {
          expect(p.imgUrl).toBe(`/images/equipment/pendants/${p.id}.png`);
        }
      });
    });

    it("all pendants define valid obtainable chaos IDs", () => {
      PENDANTS.forEach((p) => {
        expect(p.obtainableChaosIds.length).toBeGreaterThan(0);
        p.obtainableChaosIds.forEach((chaosId) => {
          expect(validChaosIds.has(chaosId)).toBe(true);
        });
      });
    });
  });

  describe("EQUIPMENT (combined)", () => {
    it("has no duplicate IDs across all equipment types", () => {
      const ids = EQUIPMENT.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it("total count equals sum of individual arrays", () => {
      expect(EQUIPMENT).toHaveLength(WEAPONS.length + ARMORS.length + PENDANTS.length);
    });
  });
});
