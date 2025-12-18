import { Equipment, EquipmentType } from "@/types";

export const ARMORS: Equipment[] = [
  {
    id: "armor_1",
    name: "equipment.armor.holyArmor.name",
    type: EquipmentType.ARMOR,
    rarity: "equipment.rarity.rare",
    description: "equipment.armor.holyArmor.description",
    imgUrl: "/images/equipment/armors/holy-armor.png"
  },
  {
    id: "armor_2",
    name: "equipment.armor.magicArmor.name",
    type: EquipmentType.ARMOR,
    rarity: "equipment.rarity.rare",
    description: "equipment.armor.magicArmor.description",
    imgUrl: "/images/equipment/armors/magic-armor.png"
  },
  {
    id: "armor_3",
    name: "equipment.armor.leatherArmor.name",
    type: EquipmentType.ARMOR,
    rarity: "equipment.rarity.rare",
    description: "equipment.armor.leatherArmor.description",
    imgUrl: "/images/equipment/armors/leather-armor.png"
  }
];
