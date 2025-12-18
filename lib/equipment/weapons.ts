import { Equipment, EquipmentType } from "@/types";

export const WEAPONS: Equipment[] = [
  {
    id: "weapon_1",
    name: "equipment.weapon.weapon_1.name",
    type: EquipmentType.WEAPON,
    rarity: "equipment.rarity.rare",
    description: "equipment.weapon.weapon_1.description",
    imgUrl: "/images/equipment/weapons/weapon_1.jpg"
  },
  {
    id: "weapon_2",
    name: "equipment.weapon.darkSword.name",
    type: EquipmentType.WEAPON,
    rarity: "equipment.rarity.rare",
    description: "equipment.weapon.darkSword.description",
    imgUrl: "/images/equipment/weapons/dark-sword.png"
  },
  {
    id: "weapon_3",
    name: "equipment.weapon.steelSword.name",
    type: EquipmentType.WEAPON,
    rarity: "equipment.rarity.rare",
    description: "equipment.weapon.steelSword.description",
    imgUrl: "/images/equipment/weapons/steel-sword.png"
  }
];
