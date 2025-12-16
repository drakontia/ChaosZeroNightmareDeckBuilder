"use client";

import { useTranslations } from 'next-intl';
import { Equipment, EquipmentType } from "@/types";

interface EquipmentSelectorProps {
  equipment: Equipment[];
  selectedEquipment: {
    weapon: Equipment | null;
    armor: Equipment | null;
    pendant: Equipment | null;
  };
  onSelect: (equipment: Equipment) => void;
}

export function EquipmentSelector({ equipment, selectedEquipment, onSelect }: EquipmentSelectorProps) {
  const t = useTranslations();
  
  const getEquipmentByType = (type: EquipmentType) => {
    return equipment.filter(eq => eq.type === type);
  };

  const renderEquipmentSection = (type: EquipmentType, titleKey: string) => {
    const items = getEquipmentByType(type);
    const selected = selectedEquipment[type];

    return (
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{t(titleKey)}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                selected?.id === item.id
                  ? "border-green-500 bg-green-50 dark:bg-green-900"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="font-semibold">{item.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{t(`rarity.${item.rarity}`)}</div>
              {item.description && (
                <div className="text-xs text-gray-500 mt-1">{item.description}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">{t('equipment.title')}</h2>
      {renderEquipmentSection(EquipmentType.WEAPON, "equipment.weapon")}
      {renderEquipmentSection(EquipmentType.ARMOR, "equipment.armor")}
      {renderEquipmentSection(EquipmentType.PENDANT, "equipment.pendant")}
    </div>
  );
}
