import { fireEvent, render, screen } from "@testing-library/react";
import type { ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

import { EquipmentSelector } from "@/components/EquipmentSelector";
import { Equipment, EquipmentObtainableChaosId, EquipmentType } from "@/types";

vi.mock("next/image", () => ({
  default: ({ fill: _fill, ...props }: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    <img {...props} alt={props.alt ?? ""} />
  ),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string, values?: Record<string, string>) => {
    if (values?.type) return key.replace("{type}", values.type);
    return key;
  },
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const equipment: Equipment[] = [
  {
    id: "weapon_common",
    name: "weapon_common_name",
    type: EquipmentType.WEAPON,
    rarity: "equipment.rarity.rare",
    obtainableChaosIds: [EquipmentObtainableChaosId.ALL],
  },
  {
    id: "weapon_swamp",
    name: "weapon_swamp_name",
    type: EquipmentType.WEAPON,
    rarity: "equipment.rarity.rare",
    obtainableChaosIds: [EquipmentObtainableChaosId.SWAMP_OF_JUDGMENT],
  },
  {
    id: "weapon_mist",
    name: "weapon_mist_name",
    type: EquipmentType.WEAPON,
    rarity: "equipment.rarity.rare",
    obtainableChaosIds: [EquipmentObtainableChaosId.CITY_OF_MIST],
  },
  {
    id: "armor_swamp",
    name: "armor_swamp_name",
    type: EquipmentType.ARMOR,
    rarity: "equipment.rarity.rare",
    obtainableChaosIds: [EquipmentObtainableChaosId.SWAMP_OF_JUDGMENT],
  },
  {
    id: "armor_mist",
    name: "armor_mist_name",
    type: EquipmentType.ARMOR,
    rarity: "equipment.rarity.rare",
    obtainableChaosIds: [EquipmentObtainableChaosId.CITY_OF_MIST],
  },
];

const selectedEquipment = {
  weapon: { item: null, refinement: null, godHammerEquipmentId: null, engravingId: null },
  armor: { item: null, refinement: null, godHammerEquipmentId: null, engravingId: null },
  pendant: { item: null, refinement: null, godHammerEquipmentId: null, engravingId: null },
};

describe("EquipmentSelector chaos filter", () => {
  it("filters modal options by selected chaos and keeps common drops", () => {
    render(
      <EquipmentSelector
        equipment={equipment}
        selectedEquipment={selectedEquipment}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /equipment\.weapon\.title/ }));
    fireEvent.change(screen.getByRole("combobox", { name: "equipment.obtainableChaos.filterLabel" }), {
      target: { value: EquipmentObtainableChaosId.SWAMP_OF_JUDGMENT },
    });

    expect(screen.getByRole("button", { name: /weapon_common_name/ })).toBeTruthy();
    expect(screen.getByRole("button", { name: /weapon_swamp_name/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /weapon_mist_name/ })).toBeNull();
  });

  it("shares selected chaos filter across equipment types", () => {
    render(
      <EquipmentSelector
        equipment={equipment}
        selectedEquipment={selectedEquipment}
        onSelect={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /equipment\.weapon\.title/ }));
    fireEvent.change(screen.getByRole("combobox", { name: "equipment.obtainableChaos.filterLabel" }), {
      target: { value: EquipmentObtainableChaosId.SWAMP_OF_JUDGMENT },
    });
    fireEvent.click(screen.getByRole("button", { name: "common.remove" }));

    fireEvent.click(screen.getByRole("button", { name: /equipment\.armor\.title/ }));

    expect(screen.getByRole("button", { name: /armor_swamp_name/ })).toBeTruthy();
    expect(screen.queryByRole("button", { name: /armor_mist_name/ })).toBeNull();
  });
});
