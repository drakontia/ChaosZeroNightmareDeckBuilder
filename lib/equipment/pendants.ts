import { Equipment, EquipmentType } from "@/types";

export const PENDANTS: Equipment[] = [
  {
    id: "pendant_1",
    name: "equipment.pendant.lifePendant.name",
    type: EquipmentType.PENDANT,
    rarity: "equipment.rarity.rare",
    description: "equipment.pendant.lifePendant.description",
    imgUrl: "/images/equipment/pendants/life-pendant.png"
  },
  {
    id: "pendant_2",
    name: "equipment.pendant.magicPendant.name",
    type: EquipmentType.PENDANT,
    rarity: "equipment.rarity.rare",
    description: "equipment.pendant.magicPendant.description",
    imgUrl: "/images/equipment/pendants/magic-pendant.png"
  },
  {
    id: "pendant_3",
    name: "equipment.pendant.luckyPendant.name",
    type: EquipmentType.PENDANT,
    rarity: "equipment.rarity.rare",
    description: "equipment.pendant.luckyPendant.description",
    imgUrl: "/images/equipment/pendants/lucky-pendant.png"
  }
];
