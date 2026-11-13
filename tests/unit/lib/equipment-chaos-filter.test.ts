import { describe, expect, it } from "vite-plus/test";

import {
  EQUIPMENT_OBTAINABLE_CHAOS_IDS,
  filterEquipmentByChaosLocation,
} from "@/lib/equipment-chaos";
import { EQUIPMENT } from "@/lib/equipment";
import { Equipment, EquipmentObtainableChaosId, EquipmentType } from "@/types";

const mockEquipment: Equipment[] = [
  {
    id: "common_drop",
    name: "mock.common_drop",
    type: EquipmentType.WEAPON,
    rarity: "equipment.rarity.rare",
    obtainableChaosIds: [EquipmentObtainableChaosId.ALL],
  },
  {
    id: "swamp_only",
    name: "mock.swamp_only",
    type: EquipmentType.WEAPON,
    rarity: "equipment.rarity.rare",
    obtainableChaosIds: [EquipmentObtainableChaosId.SWAMP_OF_JUDGMENT],
  },
  {
    id: "mist_only",
    name: "mock.mist_only",
    type: EquipmentType.ARMOR,
    rarity: "equipment.rarity.rare",
    obtainableChaosIds: [EquipmentObtainableChaosId.CITY_OF_MIST],
  },
];

describe("filterEquipmentByChaosLocation", () => {
  it("returns all equipment when filter is null", () => {
    const result = filterEquipmentByChaosLocation(mockEquipment, null);
    expect(result.map((item) => item.id)).toEqual(["common_drop", "swamp_only", "mist_only"]);
  });

  it("includes both common and specific drops when chaos is selected", () => {
    const result = filterEquipmentByChaosLocation(
      mockEquipment,
      EquipmentObtainableChaosId.SWAMP_OF_JUDGMENT,
    );
    expect(result.map((item) => item.id)).toEqual(["common_drop", "swamp_only"]);
  });

  it("filters out non-matching specific drops", () => {
    const result = filterEquipmentByChaosLocation(
      mockEquipment,
      EquipmentObtainableChaosId.THE_BLUE_POT,
    );
    expect(result.map((item) => item.id)).toEqual(["common_drop"]);
  });

  it("exposes Heavenly Barrier and filters its equipment", () => {
    expect(EQUIPMENT_OBTAINABLE_CHAOS_IDS).toContain(EquipmentObtainableChaosId.HEAVENLY_BARRIER);

    const result = filterEquipmentByChaosLocation(
      EQUIPMENT,
      EquipmentObtainableChaosId.HEAVENLY_BARRIER,
    );
    expect(
      result.filter((item) =>
        item.obtainableChaosIds.includes(EquipmentObtainableChaosId.HEAVENLY_BARRIER),
      ),
    ).toHaveLength(16);
  });
});
