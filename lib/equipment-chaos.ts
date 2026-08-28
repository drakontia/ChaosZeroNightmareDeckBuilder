import { Equipment, EquipmentObtainableChaosId } from "@/types";

export const EQUIPMENT_OBTAINABLE_CHAOS_IDS: EquipmentObtainableChaosId[] = [
  EquipmentObtainableChaosId.ALL,
  EquipmentObtainableChaosId.THE_BLUE_POT,
  EquipmentObtainableChaosId.TWIN_STARS_SHADOW,
  EquipmentObtainableChaosId.CITY_OF_MIST,
  EquipmentObtainableChaosId.SWAMP_OF_JUDGMENT,
  EquipmentObtainableChaosId.THE_FORETOLD_RUIN,
  EquipmentObtainableChaosId.LABORATORY_0,
  EquipmentObtainableChaosId.BURNING_LIFE,
  EquipmentObtainableChaosId.THEATER_OF_ILLUSIONS,
  EquipmentObtainableChaosId.THE_KALEIDOSCOPE_HATCHERY,
];

export const filterEquipmentByChaosLocation = (
  equipment: Equipment[],
  selectedChaosId: EquipmentObtainableChaosId | null
) => {
  if (!selectedChaosId) return equipment;
  return equipment.filter((item) =>
    item.obtainableChaosIds.includes(EquipmentObtainableChaosId.ALL) ||
    item.obtainableChaosIds.includes(selectedChaosId)
  );
};
